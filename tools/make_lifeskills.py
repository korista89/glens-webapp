import os
import sys
import json
import re
from copy import deepcopy

SRC = "data/EFGLS skills.txt"
OUT = "data/lifeskills.json"

if not os.path.exists(SRC):
    sys.exit(f"❌ not found: {SRC}")

domain_pat = re.compile(r'^📊\s*영역\s*(\d+)\s*:\s*(.+?)\s*\((\d+)문항\)\s*$')
item_pat = re.compile(r'^\s*문항\s*(\d+)\s*[:\-]\s*(.+?)\s*$')

def parse_json_block(lines):
    """Custom lightweight parser for the pseudo-JSON blocks in EFGLS skills.txt."""
    root = {}
    stack = [root]
    for raw in lines:
        line = raw.strip()
        if not line or line in {"json{", "{", ",{"}:
            continue
        if line in {"}", "},", "},]"}:
            if len(stack) > 1:
                stack.pop()
            continue
        if line.endswith("{"):
            key_part = line.split(":", 1)[0].strip().strip('"')
            obj = {}
            stack[-1][key_part] = obj
            stack.append(obj)
            continue
        # key-value
        if ":" not in line:
            continue
        key, rest = line.split(":", 1)
        key = key.strip().strip('"')
        rest = rest.strip().rstrip(",")
        if not rest:
            stack[-1][key] = ""
            continue
        if rest.startswith("[") and rest.endswith("]"):
            body = rest[1:-1].strip()
            items = []
            if body:
                items = [token.strip().strip('"') for token in body.split(",")]
            stack[-1][key] = [token for token in items if token]
            continue
        if rest.startswith('"') and rest.endswith('"'):
            stack[-1][key] = rest[1:-1]
            continue
        try:
            stack[-1][key] = int(rest)
        except ValueError:
            stack[-1][key] = rest
    return root

domains = []
current_domain = None
current_item = None

with open(SRC, "r", encoding="utf-8") as f:
    iterator = iter(f)
    for raw in iterator:
        line = raw.strip()
        if not line:
            continue

        dm = domain_pat.match(line)
        if dm:
            current_domain = {
                "index": int(dm.group(1)),
                "name": dm.group(2).strip(),
                "expected_count": int(dm.group(3)),
                "items": []
            }
            domains.append(current_domain)
            current_item = None
            continue

        im = item_pat.match(line)
        if im:
            number = int(im.group(1))
            title = im.group(2).strip()
            current_item = {
                "number": number,
                "title": title
            }
            if not current_domain:
                raise ValueError(f"문항 {number}을 위한 영역을 찾을 수 없습니다.")
            current_domain["items"].append(current_item)
            continue

        if line.startswith("json{"):
            if not current_item:
                raise ValueError("json 블록 이전에 문항 정의가 필요합니다.")
            depth = line.count("{") - line.count("}")
            block_lines = [line]
            while depth > 0:
                nxt = next(iterator)
                block_lines.append(nxt.strip())
                depth += nxt.count("{") - nxt.count("}")
            parsed = parse_json_block(block_lines)
            current_item.update({
                "json_id": parsed.get("id"),
                "domain": parsed.get("domain") or (current_domain["name"] if current_domain else ""),
                "name": parsed.get("name") or current_item.get("title"),
                "sd": parsed.get("sd", ""),
                "behavior": parsed.get("behavior", ""),
                "criteria": parsed.get("criteria", {}),
                "keywords": parsed.get("keywords", [])
            })
            continue

        if line.startswith("IEP 목표 예시"):
            if not current_item:
                continue
            iep = line.split(":", 1)[1].strip()
            current_item["iep_goal"] = iep.strip('"')
            continue

# 구조 정리 및 검증
flat_items = []
for domain in domains:
    items_in_domain = domain.get("items", [])
    if domain.get("expected_count") and len(items_in_domain) != domain["expected_count"]:
        print(f"⚠️  영역 {domain['index']}({domain['name']}) 문항 수 불일치: "
              f"expected {domain['expected_count']} vs actual {len(items_in_domain)}", file=sys.stderr)
    items_in_domain.sort(key=lambda x: x["number"])
    for item in items_in_domain:
        serialized = {
            "id": f"item_{item['number']}",
            "number": item["number"],
            "title": item.get("name") or item.get("title"),
            "domain": item.get("domain") or domain["name"],
            "domain_index": domain["index"],
            "sd": item.get("sd", ""),
            "behavior": item.get("behavior", ""),
            "criteria": item.get("criteria", {}),
            "keywords": item.get("keywords", []),
            "iep_goal": item.get("iep_goal", ""),
            "subscale": domain["name"]
        }
        flat_items.append(serialized)

output = {
    "domains": [
        {
            "index": domain["index"],
            "name": domain["name"],
            "expected_count": domain.get("expected_count"),
            "items": [
                {
                    "id": f"item_{item['number']}",
                    "number": item["number"],
                    "title": item.get("name") or item.get("title"),
                    "sd": item.get("sd", ""),
                    "behavior": item.get("behavior", ""),
                    "criteria": deepcopy(item.get("criteria", {})),
                    "keywords": list(item.get("keywords", [])),
                    "iep_goal": item.get("iep_goal", "")
                }
                for item in sorted(domain.get("items", []), key=lambda x: x["number"])
            ]
        }
        for domain in sorted(domains, key=lambda d: d["index"])
    ],
    "items": sorted(flat_items, key=lambda x: x["number"])
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ wrote {OUT}  (domains={len(output['domains'])}, items={len(output['items'])})")
