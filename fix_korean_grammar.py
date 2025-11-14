#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IEP 목표와 수업절차의 어색한 한국어 표현 개선
"""

import json
import re

def fix_korean_grammar(text):
    """어색한 한국어 표현을 자연스럽게 수정"""
    if not text:
        return text

    # 1. "안 열릴 때 상황에서" → "안 열리는 상황에서"
    text = re.sub(r'안 열릴 때 상황에서', '안 열리는 상황에서', text)
    text = re.sub(r'(\w+)일 때 상황에서', r'\1인 상황에서', text)

    # 2. "들었을 때 상황에서" → "들었을 때" (중복 제거)
    text = re.sub(r'들었을 때 상황에서', '들었을 때', text)
    text = re.sub(r'느끼거나 정해진 화장실 시간에 \'화장실 가세요\'라는 안내를 들었을 때 상황에서',
                  '느끼거나 \'화장실 가세요\'라는 안내를 들었을 때', text)

    # 3. "표현한다를 순서대로 수행한다" → "표현한다" (중복 동사 제거)
    text = re.sub(r'표현한다를 순서대로 수행한다', '표현한다', text)
    text = re.sub(r'(\w+한다)를 순서대로 수행한다', r'\1', text)
    text = re.sub(r'(\w+한다)의 첫 단계에 협조적으로 반응한다', r'\1 행동의 첫 단계에 협조적으로 반응한다', text)

    # 4. "닦는다 행동의" → "닦는" (행동 불필요)
    text = re.sub(r'닦는다 행동의', '닦는', text)
    text = re.sub(r'(\w+한다) 행동의 전체 순서', r'\1 전체 순서', text)
    text = re.sub(r'(\w+한다) 행동을 순서대로', r'\1를 순서대로', text)
    text = re.sub(r'(\w+한다) 행동의 대부분', r'\1 대부분', text)
    text = re.sub(r'(\w+한다) 행동을', r'\1를', text)

    # 5. 목표 문장의 "상황에서 학생은 ... 와 함께 ... 한다 행동의" 패턴 정리
    # "손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는다 행동의"
    # → "손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는"
    text = re.sub(r'물기를 닦는다 행동', '물기를 닦는', text)

    # 6. "세면대로 이동하여 비누로 손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는다의"
    # → "세면대로 이동하여 비누로 손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는"
    text = re.sub(r'닦는다의 첫 단계', '닦는 첫 단계', text)
    text = re.sub(r'씻는다의 첫 단계', '씻는 첫 단계', text)
    text = re.sub(r'(\w+한다)의 전체 순서', r'\1 전체 순서', text)
    text = re.sub(r'(\w+한다)를 순서대로 수행하며', r'\1 순서대로 수행하며', text)

    # 7. 장기 목표의 패턴 수정
    # "교사의 신체적 유도와 함께 ... 한다의 첫 단계" → "교사의 신체적 유도와 함께 ... 하는 첫 단계"
    text = re.sub(r'신체적 유도와 함께 (.+?)한다의 첫 단계', r'신체적 유도와 함께 \1하는 첫 단계', text)
    text = re.sub(r'신체적 촉구를 받아 (.+?)한다의 전체 순서', r'신체적 촉구를 받아 \1하는 전체 순서', text)

    # 8. "촉구를 듣고 ... 한다 행동을" → "촉구를 듣고 ... 하는 행동을"
    text = re.sub(r'촉구를 듣고 (.+?)한다 행동을', r'촉구를 듣고 \1하는 행동을', text)
    text = re.sub(r'촉구를 듣고 (.+?)한다를 순서대로', r'촉구를 듣고 \1를 순서대로', text)

    # 9. "독립적으로 수행하며, 1-2개 단계에서만 ... 한다 행동의" 패턴
    text = re.sub(r'언어적 안내\("다음은\?"\)를 필요로 한다 행동의', '언어적 안내("다음은?")를 필요로 하는', text)

    # 10. "촉구 없이 ... 한다 행동의 전체" → "촉구 없이 ... 하는 전체"
    text = re.sub(r'촉구 없이 (.+?)한다 행동의 전체', r'촉구 없이 \1하는 전체', text)

    # 11. 프롬프트 → 촉구 (이미 완료되었지만 혹시 모를 잔여분)
    text = re.sub(r'프롬프트', '촉구', text)

    return text

# Load iep_library.json
with open('data/iep_library.json', 'r', encoding='utf-8') as f:
    iep_library = json.load(f)

# Fix Korean grammar in all fields
updated_count = 0
for entry in iep_library['lifeskills']:
    # Fix goal
    old_goal = entry.get('goal', '')
    new_goal = fix_korean_grammar(old_goal)
    if old_goal != new_goal:
        entry['goal'] = new_goal
        updated_count += 1

    # Fix procedure
    old_procedure = entry.get('procedure', '')
    new_procedure = fix_korean_grammar(old_procedure)
    if old_procedure != new_procedure:
        entry['procedure'] = new_procedure
        updated_count += 1

    # Fix reinforcement
    old_reinforcement = entry.get('reinforcement', '')
    new_reinforcement = fix_korean_grammar(old_reinforcement)
    if old_reinforcement != new_reinforcement:
        entry['reinforcement'] = new_reinforcement
        updated_count += 1

# Save updated iep_library.json
with open('data/iep_library.json', 'w', encoding='utf-8') as f:
    json.dump(iep_library, f, ensure_ascii=False, indent=2)

print(f"✅ iep_library.json 한국어 문법 개선 완료!")
print(f"   수정된 필드 수: {updated_count}")

# Now fix lifeskills.json
with open('data/lifeskills.json', 'r', encoding='utf-8') as f:
    lifeskills_data = json.load(f)

updated_lifeskills = 0
for domain in lifeskills_data['domains']:
    for item in domain['items']:
        # Fix iep_goal
        old_goal = item.get('iep_goal', '')
        new_goal = fix_korean_grammar(old_goal)
        if old_goal != new_goal:
            item['iep_goal'] = new_goal
            updated_lifeskills += 1

        # Fix procedure
        old_procedure = item.get('procedure', '')
        new_procedure = fix_korean_grammar(old_procedure)
        if old_procedure != new_procedure:
            item['procedure'] = new_procedure
            updated_lifeskills += 1

        # Fix sd
        old_sd = item.get('sd', '')
        new_sd = fix_korean_grammar(old_sd)
        if old_sd != new_sd:
            item['sd'] = new_sd
            updated_lifeskills += 1

# Save updated lifeskills.json
with open('data/lifeskills.json', 'w', encoding='utf-8') as f:
    json.dump(lifeskills_data, f, ensure_ascii=False, indent=2)

print(f"✅ lifeskills.json 한국어 문법 개선 완료!")
print(f"   수정된 필드 수: {updated_lifeskills}")
