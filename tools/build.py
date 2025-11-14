# -*- coding: utf-8 -*-
"""
G-LENS mapping builder (Sentence-Transformer 기반)
- embeddings.db(data/*.txt에서 생성; tools/embed.py 출력)를 읽어
  LifeSkills(=EFGLS 원본) ↔ PBIS/교육과정/VB-MAPP/EFL를 임계값 이상만 매칭한다.
- 출력:
  1) data/mapping_index.json     ← 프론트(app.js)에서 사용
  2) reports/mapping-log.json    ← 상세 로그(유사도·키워드 근거)
  3) reports/mapping-report.html ← 사람용 요약 HTML

고정 규칙:
- 도메인 순서: PBIS → 교육과정 → VB-MAPP → EFL
- 도메인별 정렬: 유사도 내림차순
- 각 문항 최대 8개
- 임계값은 CLI 인자 --threshold 로 제어 (기본 0.5)
  예) python tools/build.py --threshold 0.7
"""

import json, os, re, argparse
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR   = "data"
REPORT_DIR = "reports"
ORDER      = ["PBIS", "교육과정", "VB-MAPP", "EFL"]
MAX_ITEMS  = 8
LIFESKILLS_JSON = os.path.join(DATA_DIR, "lifeskills.json")

def infer_domain(filename: str) -> str:
    f = filename.lower()
    if "expected_behavior" in f or "expected behavior" in f:
        return "PBIS"
    if "curriculum_standards" in f or "curriculum-standards" in f:
        return "교육과정"
    if "vb_mapp" in f or "vb-mapp" in f:
        return "VB-MAPP"
    if "efl_skills" in f or "efl skills" in f:
        return "EFL"
    if any(k in f for k in ["life_skills", "lifeskills", "efgls", "efgls skills", "efgls_skills"]):
        return "LifeSkills"
    return "UNKNOWN"

_token_re = re.compile(r"[가-힣A-Za-z0-9]+")

def tokens(s: str):
    return [t for t in _token_re.findall(s.lower()) if t]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--threshold", type=float, default=0.5, help="유사도 임계값 (기본 0.5)")
    args = ap.parse_args()
    THRESHOLD = float(args.threshold)

    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(REPORT_DIR, exist_ok=True)

    # 1) LifeSkills 메타 로드
    lifeskill_map = {}
    if os.path.exists(LIFESKILLS_JSON):
        with open(LIFESKILLS_JSON, "r", encoding="utf-8") as f:
            life_payload = json.load(f)
        lifeskill_map = {item["id"]: item for item in life_payload.get("items", [])}

    # 2) 임베딩 로드
    with open(os.path.join(DATA_DIR, "embeddings.db"), "r", encoding="utf-8") as f:
        db = json.load(f)

    # 3) 베이스/후보 분리
    base_items, other_items = [], []
    for row in db:
        dom = infer_domain(row["file"])
        entry = {
            "file": row["file"],
            "id": row["id"],
            "text": row["text"],
            "vec": np.asarray(row["vec"], dtype=float),
            "domain": dom
        }
        if dom == "LifeSkills":
            base_items.append(entry)
        elif dom in ORDER:
            other_items.append(entry)

    if not base_items:
        print("⚠️  LifeSkills(=EFGLS) 항목을 찾지 못했습니다. 파일명을 확인하세요 (efgls / life_skills 포함).")
        return
    if not other_items:
        print("⚠️  후보 도메인(PBIS/교육과정/VB-MAPP/EFL)이 비어 있습니다.")
        return

    base_mat  = np.vstack([x["vec"] for x in base_items])
    other_mat = np.vstack([x["vec"] for x in other_items])
    sim_mat   = cosine_similarity(base_mat, other_mat)

    mapping_index = []
    log_entries   = []
    bases_with_related = 0

    for i, b in enumerate(base_items):
        life_meta = lifeskill_map.get(b["id"], {})
        life_title = life_meta.get("title") or b["text"]
        life_domain = life_meta.get("domain") or life_meta.get("subscale") or ""
        life_summary = life_meta.get("iep_goal") or ""

        sims = sim_mat[i]
        candidates = []
        for j, score in enumerate(sims):
            if score >= THRESHOLD:
                o = other_items[j]
                base_tok = tokens(b["text"])
                other_tok = tokens(o["text"])
                inter, seen = [], set()
                for t in base_tok:
                    if t in other_tok and t not in seen:
                        seen.add(t)
                        inter.append(t)
                        if len(inter) >= 6: break
                candidates.append({
                    "domain": o["domain"],
                    "text": o["text"],
                    "similarity": round(float(score), 3),
                    "matched_terms": inter
                })

        # 도메인 순서 고정 + 각 도메인 내 유사도 정렬
        ordered = []
        for dom in ORDER:
            group = [c for c in candidates if c["domain"] == dom]
            group.sort(key=lambda x: x["similarity"], reverse=True)
            ordered.extend(group)

        topk = ordered[:MAX_ITEMS]
        if topk:
            bases_with_related += 1

        mapping_index.append({
            "life_id": b["id"],
            "life_text": life_title,
            "life_domain": life_domain,
            "life_summary": life_summary,
            "related": topk
        })
        log_entries.append({
            "life_id": b["id"],
            "life_text": life_title,
            "related_count": len(topk),
            "related": topk
        })

    with open(os.path.join(DATA_DIR, "mapping_index.json"), "w", encoding="utf-8") as f:
        json.dump(mapping_index, f, ensure_ascii=False, indent=2)
    with open(os.path.join(REPORT_DIR, "mapping-log.json"), "w", encoding="utf-8") as f:
        json.dump(log_entries, f, ensure_ascii=False, indent=2)

    # 간단 HTML 요약
    html = [
        "<html><head><meta charset='utf-8'><title>G-LENS Mapping Report</title>",
        "<style>body{font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif;padding:18px}",
        "h2{margin:16px 0 6px} .card{border:1px solid #e5e7eb;border-radius:12px;padding:10px;margin:8px 0}",
        "ul{margin:6px 0 0 18px}</style></head><body>",
        f"<h1>🔗 G-LENS Mapping Report</h1><p>threshold={THRESHOLD}, max={MAX_ITEMS}, order={', '.join(ORDER)}</p>"
    ]
    for e in log_entries[:300]:
        html.append("<div class='card'>")
        html.append(f"<h2>LifeSkills</h2><div>{e['life_text']}</div><ul>")
        for r in e["related"]:
            mt = ", ".join(r["matched_terms"])
            html.append(f"<li><b>[{r['domain']}]</b> ({r['similarity']}) {r['text']}<br><small>matched: {mt}</small></li>")
        html.append("</ul></div>")
    html.append("</body></html>")
    with open(os.path.join(REPORT_DIR, "mapping-report.html"), "w", encoding="utf-8") as f:
        f.write("\n".join(html))

    print(f"✅ mapping_index.json created (bases={len(base_items)}, bases_with_related={bases_with_related}, threshold={THRESHOLD}, semantic mode)")
    print(f"   → {DATA_DIR}/mapping_index.json")
    print(f"   → {REPORT_DIR}/mapping-log.json")
    print(f"   → {REPORT_DIR}/mapping-report.html")

if __name__ == "__main__":
    main()
