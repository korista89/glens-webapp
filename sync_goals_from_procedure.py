#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
수업절차에서 장기 목표를 추출하여 goal 필드에 동기화
"""

import json
import re

def extract_long_term_goal(procedure):
    """수업절차에서 장기 목표 추출"""
    if not procedure:
        return ""

    # "**장기 목표(Long-term Goal)**:" 또는 "**장기 목표**:" 다음 문장 추출
    match = re.search(r'\*\*장기 목표(?:\(Long-term Goal\))?\*\*:?\s*\n(.+?)(?=\n\n|$)', procedure)
    if match and match.group(1):
        return match.group(1).strip()
    return ""

# Load iep_library.json
with open('data/iep_library.json', 'r', encoding='utf-8') as f:
    iep_library = json.load(f)

# Update goals from procedure
updated_count = 0
for entry in iep_library['lifeskills']:
    procedure = entry.get('procedure', '')

    # Extract long-term goal from procedure
    extracted_goal = extract_long_term_goal(procedure)

    if extracted_goal:
        old_goal = entry.get('goal', '')
        if old_goal != extracted_goal:
            entry['goal'] = extracted_goal
            updated_count += 1
            print(f"Updated [{entry.get('code', 'N/A')}]: {extracted_goal[:60]}...")

# Save updated iep_library.json
with open('data/iep_library.json', 'w', encoding='utf-8') as f:
    json.dump(iep_library, f, ensure_ascii=False, indent=2)

print(f"\n✅ iep_library.json의 goal 필드를 수업절차의 장기 목표로 동기화 완료!")
print(f"   업데이트된 항목 수: {updated_count}")
