#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LifeSkills 225개 목표 문장을 전문적으로 수정하는 스크립트 v3
사용자 제공 예시 패턴을 정확히 반영 - 최종 정교화 버전
"""

import json
import re

def refine_goal_final(goal_text, level_num):
    """
    레벨별로 목표 문장을 최종 수정

    핵심 패턴:
    - L02: "~한다 첫 단계에 협조적으로 반응한다" → "~한다"
    - L02: "~한다 전체 순서를 완수한다" → "~한다"
    - L03: "~한다를 순서대로 수행한다" → "~한다"
    - L04: "~한다를 수행한다" → "~한다"
    - L05: "~한다를 수행한다" → "~한다"
    """

    if level_num == '02':
        # L02: "~다 첫 단계에 협조적으로 반응한다" → "~다."
        goal_text = re.sub(
            r'(다)\s+첫\s*단계에\s*협조적으로\s*반응한다\.?$',
            r'\1.',
            goal_text
        )

        # L02: "~다 전체 순서를 완수한다" → "~다."
        goal_text = re.sub(
            r'(다)\s+전체\s*순서를\s*완수한다\.?$',
            r'\1.',
            goal_text
        )

    elif level_num == '03':
        # L03: "~다를 순서대로 수행한다" → "~다."
        goal_text = re.sub(
            r'(다)를\s+순서대로\s*수행한다\.?$',
            r'\1.',
            goal_text
        )

    elif level_num == '04':
        # L04: "~다를 수행한다" → "~다."
        goal_text = re.sub(
            r'(다)를\s+수행한다\.?$',
            r'\1.',
            goal_text
        )

    elif level_num == '05':
        # L05: "~다를 수행한다" → "~다."
        goal_text = re.sub(
            r'(다)를\s+수행한다\.?$',
            r'\1.',
            goal_text
        )

    # 마침표 확인
    if not goal_text.endswith('.'):
        goal_text += '.'

    # 연속 공백 제거
    goal_text = re.sub(r'\s+', ' ', goal_text).strip()

    return goal_text

def main():
    print("=" * 80)
    print("LifeSkills 225개 목표 문장 최종 정교화 v3")
    print("=" * 80)

    # 데이터 로드
    with open('data/iep_library_with_similarities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    lifeskills = data.get('lifeskills', [])

    print(f"\n총 {len(lifeskills)}개 목표 로드")

    # 수정 전후 비교
    samples = []
    updated_count = 0

    for item in lifeskills:
        code = item.get('code', '')
        old_goal = item.get('goal', '')

        # 코드에서 레벨 추출 (마지막 2자리)
        level_num = code.split('-')[-1]

        # 목표 수정
        new_goal = refine_goal_final(old_goal, level_num)

        if old_goal != new_goal:
            item['goal'] = new_goal
            updated_count += 1

            # 각 레벨별로 처음 2개씩 샘플 수집
            level_samples = [s for s in samples if s['level'] == level_num]
            if len(level_samples) < 2:
                samples.append({
                    'code': code,
                    'level': level_num,
                    'old': old_goal,
                    'new': new_goal
                })

    # 레벨별로 정렬해서 샘플 출력
    samples.sort(key=lambda x: x['level'])

    print("\n" + "=" * 80)
    print("수정 샘플 (각 레벨별 최대 2개씩)")
    print("=" * 80)

    for sample in samples:
        print(f"\n[{sample['code']}] (L{sample['level']})")
        print(f"이전: {sample['old'][:120]}...")
        print(f"변경: {sample['new'][:120]}...")

    # 저장
    with open('data/iep_library_with_similarities.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 80)
    print("수정 완료!")
    print("=" * 80)
    print(f"총 LifeSkills 목표: {len(lifeskills)}개")
    print(f"수정된 목표: {updated_count}개")
    print(f"변경 없음: {len(lifeskills) - updated_count}개")

if __name__ == "__main__":
    main()
