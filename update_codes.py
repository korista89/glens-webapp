#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
코드명의 영역명을 새로운 영역명으로 변경
"""

import json
import re

# 영역명 매핑
domain_mapping = {
    "개인관리건강": "자립생활",
    "자기조절집행기능": "자기조절",
    "의사소통언어": "의사소통",
    "사회적상호작용놀이": "상호작용",
    "학습참여교실기술": "학습참여",
    "기초운동도구필기전기술": "학습기초",
    "기능적학업": "학업기술",
    "일상생활학교루틴": "일상생활",
    "지역사회진로직업": "진로직업"
}

def update_code(code):
    """코드의 영역명 부분을 새로운 영역명으로 변경"""
    if not code.startswith("L-"):
        return code

    for old_domain, new_domain in domain_mapping.items():
        if old_domain in code:
            return code.replace(old_domain, new_domain)

    return code

# Load iep_library.json
with open('data/iep_library.json', 'r', encoding='utf-8') as f:
    iep_library = json.load(f)

# Update codes in lifeskills
updated_count = 0
for entry in iep_library['lifeskills']:
    old_code = entry['code']
    new_code = update_code(old_code)
    if old_code != new_code:
        entry['code'] = new_code
        updated_count += 1

# Save updated iep_library.json
with open('data/iep_library.json', 'w', encoding='utf-8') as f:
    json.dump(iep_library, f, ensure_ascii=False, indent=2)

print(f"✅ iep_library.json 코드 업데이트 완료!")
print(f"   변경된 코드 수: {updated_count}")
