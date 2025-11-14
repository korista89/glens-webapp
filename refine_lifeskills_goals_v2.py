#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LifeSkills 225개 목표 문장을 전문적으로 수정하는 스크립트 v2
사용자 제공 예시 패턴을 정확히 반영
"""

import json
import re

def refine_goal_by_level(goal_text, level_num):
    """
    레벨별로 목표 문장을 수정

    사용자 제공 패턴:
    L01: "신체적 유도와 함께 ~ 첫 단계에 협조적으로 반응한다" → "신체적 촉구를 받아 ~ 과정에 협조한다"
    L02: "신체적 유도와 함께 ~ 전체 순서를 완수한다" → "제스처 촉구를 받아 ~한다"
    L03: "언어적 촉구를 듣고" → "언어적 촉구를 받아"
    L04: "~를 대부분 독립적으로 수행하며, 1-2회 언어 안내만 필요로 한다" → "시각 자료를 참고하여 ~한다"
    L05: "촉구 없이 ~를 독립적이고 자발적으로 수행한다" → "독립적이고 자발적으로 ~한다"
    """

    # 공통 수정: "안내를 들었을 때" → "말을 들었을 때"
    goal_text = goal_text.replace("'라는 안내를 들었을 때", "'라는 말을 들었을 때")
    goal_text = goal_text.replace("안내를 들었을 때", "말을 들었을 때")

    # 공통 수정: "상황에서 학생은" → "학생은"
    goal_text = goal_text.replace(" 상황에서 학생은", " 학생은")
    goal_text = goal_text.replace(" 때 상황에서 학생은", " 때 학생은")

    if level_num == '01':
        # L01 수정
        # 1. "신체적 유도와 함께" → "신체적 촉구를 받아"
        goal_text = goal_text.replace("교사의 신체적 유도와 함께", "교사의 신체적 촉구를 받아")

        # 2. 끝부분 수정
        # 패턴 A: "~는 첫 단계에 협조적으로 반응한다"
        goal_text = re.sub(
            r'(.+?)(는|을|를)\s*첫\s*단계에\s*협조적으로\s*반응한다\.?$',
            r'\1\2 과정에 협조한다.',
            goal_text
        )
        # 패턴 B: "~다 행동의 첫 단계에 협조적으로 반응한다"
        goal_text = re.sub(
            r'(.+?한다)\s*행동의?\s*첫\s*단계에\s*협조적으로\s*반응한다\.?$',
            r'\1하는 과정에 협조한다.',
            goal_text
        )

    elif level_num == '02':
        # L02 수정
        # 1. "신체적 유도와 함께" → "제스처 촉구를 받아"
        goal_text = goal_text.replace("교사의 신체적 유도와 함께", "교사의 제스처 촉구를 받아")
        goal_text = goal_text.replace("교사의 신체적 촉구를 받아", "교사의 제스처 촉구를 받아")

        # 2. 끝부분 수정
        # 패턴 A: "~다 첫 단계에 협조적으로 반응한다"
        goal_text = re.sub(
            r'(.+?한다)\s*첫\s*단계에\s*협조적으로\s*반응한다\.?$',
            r'\1.',
            goal_text
        )
        # 패턴 B: "~다 전체 순서를 완수한다"
        goal_text = re.sub(
            r'(.+?한다)\s*전체\s*순서를\s*완수한다\.?$',
            r'\1.',
            goal_text
        )
        # 패턴 C: "~한다 행동의 전체 순서를 완수한다"
        goal_text = re.sub(
            r'(.+?한다)\s*행동의?\s*전체\s*순서를\s*완수한다\.?$',
            r'\1.',
            goal_text
        )

    elif level_num == '03':
        # L03 수정
        # "언어적 촉구를 듣고" → "언어적 촉구를 받아"
        goal_text = goal_text.replace("교사의 언어적 촉구를 듣고", "교사의 언어적 촉구를 받아")
        goal_text = goal_text.replace("교사의 언어 촉구를 듣고", "교사의 언어적 촉구를 받아")

        # 불필요한 "를 순서대로 수행한다" 간소화 (이미 행동 포함되어 있으면)
        # 단, 이것은 옵션이므로 보수적으로 처리

    elif level_num == '04':
        # L04 수정
        # "~를 대부분 독립적으로 수행하며, 1-2회 언어 안내만 필요로 한다" → "시각 자료를 참고하여 ~한다"

        goal_text = re.sub(
            r'(.+?를)\s*대부분\s*독립적으로\s*수행하며,?\s*\d+-?\d*회?\s*언어\s*안내만?\s*필요로\s*한다\.?$',
            r'시각 자료를 참고하여 \1 수행한다.',
            goal_text
        )

        # "한다를 대부분..." 패턴도 처리
        goal_text = re.sub(
            r'(.+?한다)를\s*대부분\s*독립적으로\s*수행하며,?\s*\d+-?\d*회?\s*언어\s*안내만?\s*필요로\s*한다\.?$',
            r'시각 자료를 참고하여 \1.',
            goal_text
        )

    elif level_num == '05':
        # L05 수정
        # "촉구 없이 ~를 독립적이고 자발적으로 수행한다" → "독립적이고 자발적으로 ~한다"

        goal_text = goal_text.replace("촉구 없이 ", "")

        # "~를 독립적이고 자발적으로 수행한다" → "독립적이고 자발적으로 ~한다"
        goal_text = re.sub(
            r'(.+?를)\s*독립적이고\s*자발적으로\s*수행한다\.?$',
            r'독립적이고 자발적으로 \1 수행한다.',
            goal_text
        )

        # "한다를 독립적이고..." 패턴도 처리
        goal_text = re.sub(
            r'(.+?한다)를\s*독립적이고\s*자발적으로\s*수행한다\.?$',
            r'독립적이고 자발적으로 \1.',
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
    print("LifeSkills 225개 목표 문장 전문 수정 v2")
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
        new_goal = refine_goal_by_level(old_goal, level_num)

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
    print("수정 샘플 (각 레벨별 2개씩)")
    print("=" * 80)

    for sample in samples:
        print(f"\n[{sample['code']}] (L{sample['level']})")
        print(f"이전: {sample['old']}")
        print(f"변경: {sample['new']}")

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
