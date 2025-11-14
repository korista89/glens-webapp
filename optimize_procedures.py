#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
수업절차를 IEP 목표에 최적화하고 프롬프트 → 촉구로 용어 통일
"""

import json

def optimize_procedure(item_title, sd, behavior, iep_goal):
    """수업 절차를 IEP 목표에 최적화하여 생성"""
    return (
        f"1. 준비: {item_title} 지도를 위한 시각자료(예: 순서도, 체크리스트), 실물 자료, 강화물(칭찬, 토큰 등), 데이터 기록지를 준비합니다.\n\n"
        f"2. 변별자극 제시: \"{sd}\" 상황에서 학생에게 명확한 언어 안내를 제공하고, 필요시 시각적 단서(그림카드, 순서도)를 함께 제시합니다.\n\n"
        f"3. 촉구 절차:\n"
        f"   - 독립 시도: 학생이 스스로 행동을 시작하도록 5-10초 대기합니다.\n"
        f"   - 언어 촉구: \"다음은?\" 또는 구체적 지시(\"비누를 눌러보세요\")를 제공합니다.\n"
        f"   - 제스처 촉구: 언어와 함께 손가락으로 가리키거나 시범을 보입니다.\n"
        f"   - 신체 촉구: 손을 가볍게 접촉하여 동작을 유도하거나, 필요시 손-위-손 지원을 제공합니다.\n"
        f"   - 촉구는 최소-최대 접근법을 사용하며, 성공 시 즉시 촉구 수준을 낮춥니다.\n\n"
        f"4. 기대 반응: 학생은 \"{behavior}\" 행동을 순서대로 완료합니다.\n\n"
        f"5. 오반응/무반응 시 대처:\n"
        f"   - 학생이 10초 이상 반응하지 않거나 오반응 시, 즉시 다음 단계의 촉구를 제공합니다.\n"
        f"   - 오류 수정: 오반응이 발생한 단계부터 교사가 시범을 보이고, 학생이 즉시 모방하도록 합니다.\n"
        f"   - 3회 이상 실패 시 과제를 단순화하거나 세션을 종료하고 재계획합니다.\n\n"
        f"6. 강화 제공:\n"
        f"   - 성공 시: 즉시 구체적 칭찬(\"잘했어요! 혼자서 비누로 손을 씻었네요!\")과 함께 사전에 선정한 강화물(토큰, 스티커, 선호 활동)을 제공합니다.\n"
        f"   - 부분 성공 시: 노력에 대한 긍정적 피드백을 제공합니다.\n\n"
        f"7. 데이터 기록: 각 시도마다 독립 수행 여부, 사용된 촉구 유형과 횟수, 학생 반응, 특이사항을 기록합니다.\n\n"
        f"8. 숙달 기준: 5회 시도 중 4회 이상(80%) 독립 수행을 연속 3회기 달성 시 목표를 숙달한 것으로 판단하고, 유지 및 일반화 단계로 전환합니다.\n\n"
        f"9. 일반화 전략: 다른 교사, 다른 시간대, 다른 장소에서도 동일한 기술을 수행하도록 계획적으로 기회를 제공합니다."
    )

# Load lifeskills.json
with open('data/lifeskills.json', 'r', encoding='utf-8') as f:
    lifeskills_data = json.load(f)

# Update procedures for all items
updated_count = 0
for domain in lifeskills_data['domains']:
    for item in domain['items']:
        title = item.get('title', '')
        sd = item.get('sd', '')
        behavior = item.get('behavior', '')
        iep_goal = item.get('iep_goal', '')

        # Generate optimized procedure
        item['procedure'] = optimize_procedure(title, sd, behavior, iep_goal)
        updated_count += 1

# Save updated lifeskills.json
with open('data/lifeskills.json', 'w', encoding='utf-8') as f:
    json.dump(lifeskills_data, f, ensure_ascii=False, indent=2)

print(f"✅ lifeskills.json 수업절차 최적화 완료!")
print(f"   업데이트된 항목 수: {updated_count}")

# Now update iep_library.json
with open('data/iep_library.json', 'r', encoding='utf-8') as f:
    iep_library = json.load(f)

# Create item map
item_map = {}
for domain in lifeskills_data['domains']:
    for item in domain['items']:
        item_map[item['id']] = item['procedure']

# Update procedures in iep_library
updated_iep = 0
for entry in iep_library['lifeskills']:
    item_id = entry.get('itemId', '')
    if item_id in item_map:
        entry['procedure'] = item_map[item_id]
        updated_iep += 1

# Save updated iep_library.json
with open('data/iep_library.json', 'w', encoding='utf-8') as f:
    json.dump(iep_library, f, ensure_ascii=False, indent=2)

print(f"✅ iep_library.json 수업절차 최적화 완료!")
print(f"   업데이트된 항목 수: {updated_iep}")
