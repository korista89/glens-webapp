#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IEP 라이브러리의 LifeSkills L2 수준 목표를 수정하는 스크립트
'전체 순서를 완수한다' → '첫 단계에 협조적으로 반응한다'
"""

import json
import re

def update_l2_goal(goal):
    """
    L2 목표 문장 수정
    - 기존 패턴: "...교사의 신체적 촉구를 받아 [행동]의 전체 순서를 완수한다."
    - 변경 패턴: "...교사의 신체적 유도와 함께 [행동] 첫 단계에 협조적으로 반응한다."
    """
    # "교사의 신체적 촉구를 받아" → "교사의 신체적 유도와 함께"
    goal = goal.replace("교사의 신체적 촉구를 받아", "교사의 신체적 유도와 함께")

    # "의 전체 순서를 완수한다." → " 첫 단계에 협조적으로 반응한다."
    goal = re.sub(r'(을|를|에|다|며|고)\s*의\s*전체\s*순서를\s*완수한다\.?$',
                  r'\1 첫 단계에 협조적으로 반응한다.', goal)

    return goal

def main():
    print("=" * 80)
    print("IEP 라이브러리 LifeSkills L2 목표 업데이트 시작")
    print("=" * 80)

    # 백업 생성
    with open('data/iep_library.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 백업 저장
    with open('data/iep_library.json.backup_before_l2', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ 백업 생성: data/iep_library.json.backup_before_l2")

    lifeskills = data.get('lifeskills', [])
    updated_count = 0

    # L2 항목만 업데이트 (코드가 -02로 끝나는 항목)
    for item in lifeskills:
        code = item.get('code', '')
        if code.endswith('-02'):
            old_goal = item.get('goal', '')
            new_goal = update_l2_goal(old_goal)

            if old_goal != new_goal:
                item['goal'] = new_goal
                updated_count += 1

                # 처음 3개만 출력
                if updated_count <= 3:
                    print(f"\n✏️ {code}")
                    print(f"  이전: {old_goal[:80]}...")
                    print(f"  변경: {new_goal[:80]}...")

    # 저장
    with open('data/iep_library.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 80)
    print("업데이트 완료!")
    print("=" * 80)
    print(f"총 LifeSkills 항목: {len(lifeskills)}개")
    print(f"L2 항목 업데이트: {updated_count}개")

    # 샘플 확인
    print("\n" + "=" * 80)
    print("업데이트 결과 샘플 (L2 항목)")
    print("=" * 80)
    l2_items = [item for item in lifeskills if item.get('code', '').endswith('-02')]
    for i, item in enumerate(l2_items[:3]):
        print(f"\n{i+1}. [{item.get('code', '')}]")
        print(f"   {item.get('goal', '')}")

if __name__ == "__main__":
    main()
