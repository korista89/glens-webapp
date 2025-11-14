# -*- coding: utf-8 -*-
"""
Sentence-Transformer 기반 임베딩 생성기 (한국어 포함 다국어 지원)
- 입력: data/*.txt (각 줄을 하나의 항목으로 처리)
- 출력: data/embeddings.db (JSON; 각 항목에 file/id/text/vec 포함)
모델: paraphrase-multilingual-MiniLM-L12-v2 (경량/빠름/의미 유사도 강함)
"""

import os, json, argparse
from tqdm import tqdm
from sentence_transformers import SentenceTransformer

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
LIFESKILLS_JSON = os.path.join("data", "lifeskills.json")

def read_lines(path):
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, start=1):
            line = line.strip()
            if line:
                yield i, line

def load_lifeskills_entries():
    if not os.path.exists(LIFESKILLS_JSON):
        return []
    with open(LIFESKILLS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    items = data.get("items", [])
    entries = []
    for item in items:
        item_id = item.get("id") or f"item_{item.get('number', '')}"
        title = item.get("title") or item.get("name") or ""
        domain = item.get("domain") or item.get("subscale") or ""
        sd = item.get("sd") or ""
        behavior = item.get("behavior") or ""
        iep_goal = item.get("iep_goal") or ""
        criteria = item.get("criteria") or {}
        keywords = item.get("keywords") or []
        criteria_text = " ".join(f"{k}:{v}" for k, v in sorted(criteria.items()))
        keyword_text = ", ".join(keywords)
        parts = [
            title,
            f"영역: {domain}" if domain else "",
            f"SD: {sd}" if sd else "",
            f"행동: {behavior}" if behavior else "",
            f"기준: {criteria_text}" if criteria_text else "",
            f"키워드: {keyword_text}" if keyword_text else "",
            f"IEP: {iep_goal}" if iep_goal else ""
        ]
        embed_text = " | ".join(part for part in parts if part)
        entries.append({
            "file": "lifeskills.json",
            "id": item_id,
            "title": title,
            "text": embed_text
        })
    return entries

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inputs", nargs="+", help="data/*.txt 등")
    ap.add_argument("--out", required=True, help="출력 파일 경로 (e.g., data/embeddings.db)")
    args = ap.parse_args()

    print(f"📦 Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)  # CPU/GPU 자동 선택

    all_rows = []
    lifeskills_entries = load_lifeskills_entries()
    lifeskills_added = False
    if lifeskills_entries:
        print(f"📝 Encoding: lifeskills.json ({len(lifeskills_entries)} items)")
        texts = [entry["text"] for entry in lifeskills_entries]
        meta = [{"file": entry["file"], "id": entry["id"], "text": entry["title"] or entry["text"]} for entry in lifeskills_entries]
        vecs = model.encode(texts, batch_size=64, normalize_embeddings=True, show_progress_bar=True)
        for m, v in zip(meta, vecs):
            all_rows.append({
                "file": m["file"],
                "id": m["id"],
                "text": m["text"],
                "vec": list(map(float, v))
            })
        lifeskills_added = True

    for inpath in args.inputs:
        if not os.path.exists(inpath):
            # glob이 쉘에서 확장되지 않은 경우 무시 (예: data/*.txt가 그대로 문자열일 때)
            if "*" in inpath or "?" in inpath:
                continue
            else:
                raise FileNotFoundError(inpath)

        fname = os.path.basename(inpath)
        lower = fname.lower()
        if lifeskills_added and ("efgls" in lower or "life" in lower):
            # lifeskills.json 기반으로 이미 임베딩했으므로 원본 텍스트 라인은 건너뜀
            continue
        texts = []
        meta  = []
        for idx, text in read_lines(inpath):
            texts.append(text)
            meta.append({"file": fname, "id": f"{fname}_{idx}", "text": text})

        if not texts:
            continue

        print(f"📝 Encoding: {fname} ({len(texts)} lines)")
        vecs = model.encode(texts, batch_size=64, normalize_embeddings=True, show_progress_bar=True)

        for m, v in zip(meta, vecs):
            all_rows.append({
                "file": m["file"],
                "id": m["id"],
                "text": m["text"],
                "vec": list(map(float, v))  # numpy → list
            })

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(all_rows, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(all_rows)} lines embedded → {args.out}")

if __name__ == "__main__":
    main()
