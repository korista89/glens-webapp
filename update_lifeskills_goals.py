#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LifeSkills IEP 목표를 L2 수준으로 수정하는 스크립트
'시각적 단서를 보고 언어적 촉구' → '교사의 신체적 유도와 함께 ... 첫 단계에 협조적으로 반응한다'
"""

import json
import re

def update_iep_goal_to_l2(item):
    """
    IEP 목표를 L2 수준으로 변경
    - 기존: "학생은 시각적 단서를 보고 언어적 촉구를 받아 [behavior]다."
    - 변경: "학생은 교사의 신체적 유도와 함께 [behavior] 첫 단계에 협조적으로 반응한다."
    """
    sd = item.get('sd', '')
    behavior = item.get('behavior', '')

    # 새로운 IEP 목표 생성
    new_goal = f"{sd}, 학생은 교사의 신체적 유도와 함께 {behavior} 첫 단계에 협조적으로 반응한다."

    return new_goal

def main():
    print("=" * 80)
    print("LifeSkills IEP 목표 업데이트 시작")
    print("=" * 80)

    # 파일 로드
    with open('data/lifeskills.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_items = 0
    updated_items = 0

    # 각 도메인의 항목 업데이트
    for domain in data.get('domains', []):
        domain_name = domain.get('name', '')
        items = domain.get('items', [])

        print(f"\n📂 {domain_name}: {len(items)}개 항목")

        for item in items:
            total_items += 1
            old_goal = item.get('iep_goal', '')

            # 새 목표 생성
            new_goal = update_iep_goal_to_l2(item)

            if old_goal != new_goal:
                item['iep_goal'] = new_goal
                updated_items += 1

                # 샘플 출력 (처음 3개만)
                if updated_items <= 3:
                    print(f"\n  ✏️ {item.get('title', '')}")
                    print(f"     이전: {old_goal[:80]}...")
                    print(f"     변경: {new_goal[:80]}...")

    # 저장
    with open('data/lifeskills.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 80)
    print("업데이트 완료!")
    print("=" * 80)
    print(f"총 항목: {total_items}개")
    print(f"업데이트됨: {updated_items}개")
    print(f"변경 없음: {total_items - updated_items}개")

if __name__ == "__main__":
    main()
