#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LifeSkills 225개 목표 문장을 전문적으로 수정하는 스크립트
10년차 특수교육/ABA 전문가 수준의 수정
"""

import json
import re

def refine_goal_text(goal_text, level_key):
    """
    목표 문장을 수정하는 함수

    Args:
        goal_text: 원본 목표 문장
        level_key: L1, L2, L3, L4, L5

    Returns:
        수정된 목표 문장
    """
    original = goal_text

    # 공통 수정사항
    # 1. "안내를 들었을 때" → "말을 들었을 때"
    goal_text = goal_text.replace("'라는 안내를 들었을 때", "'라는 말을 들었을 때")
    goal_text = goal_text.replace("안내를 들었을 때", "말을 들었을 때")

    # 2. "상황에서 학생은" → "학생은"
    goal_text = re.sub(r'\s+(상황|때)\s*에서\s+학생은', r' \1 학생은', goal_text)

    # 3. 불필요한 중복 표현 제거
    goal_text = re.sub(r'\s+행동의?\s*', ' ', goal_text)

    # 레벨별 수정
    if level_key == 'L1':
        # "교사의 신체적 유도와 함께 ~ 첫 단계에 협조적으로 반응한다"
        # → "교사의 신체적 촉구를 받아 ~ 과정에 협조한다"

        # "신체적 유도와 함께" → "신체적 촉구를 받아"
        goal_text = goal_text.replace("교사의 신체적 유도와 함께", "교사의 신체적 촉구를 받아")

        # "첫 단계에 협조적으로 반응한다" → "과정에 협조한다"
        goal_text = re.sub(
            r'(?:의\s*)?첫\s*단계에\s*협조적으로\s*반응한다\.?$',
            '과정에 협조한다.',
            goal_text
        )

        # "함께 ~한다" → "~하는 과정에 협조한다"
        if '과정에 협조한다' not in goal_text:
            goal_text = re.sub(
                r'함께\s+(.+?)한다\.?$',
                r'함께 \1하는 과정에 협조한다.',
                goal_text
            )

    elif level_key == 'L2':
        # "교사의 신체적 촉구를 받아 ~ 전체 순서를 완수한다"
        # → "교사의 제스처 촉구를 받아 ~한다"

        # "전체 순서를 완수한다" → 제거
        goal_text = re.sub(
            r'(?:을|를|의|에|다)\s*전체\s*순서를\s*완수한다\.?$',
            r'한다.',
            goal_text
        )

        # "신체적 촉구" → "제스처 촉구" (L2는 제스처 수준)
        goal_text = goal_text.replace("교사의 신체적 촉구를 받아", "교사의 제스처 촉구를 받아")

    elif level_key == 'L3':
        # "교사의 언어적 촉구를 듣고" → "교사의 언어적 촉구를 받아"
        goal_text = goal_text.replace("교사의 언어적 촉구를 듣고", "교사의 언어적 촉구를 받아")
        goal_text = goal_text.replace("교사의 언어 촉구를 듣고", "교사의 언어적 촉구를 받아")

        # 불필요한 "행동" 제거
        goal_text = re.sub(r'\s+행동을?\s+', ' ', goal_text)

    elif level_key == 'L4':
        # "대부분 독립적으로 수행하며, 1-2회 언어 안내만 필요로 한다"
        # → "시각 자료를 참고하여 ~한다"

        goal_text = re.sub(
            r'(.+?)를?\s*대부분\s*독립적으로\s*수행하며,?\s*\d+-?\d*회?\s*언어\s*안내만?\s*필요로\s*한다\.?$',
            r'\1를 시각 자료를 참고하여 수행한다.',
            goal_text
        )

        # 더 일반적인 패턴
        if '시각 자료를 참고하여' not in goal_text:
            goal_text = re.sub(
                r'(.+?)를?\s*대부분\s*독립적으로\s*(.+?)\.?$',
                r'\1를 시각 자료를 참고하여 \2.',
                goal_text
            )

    elif level_key == 'L5':
        # "촉구 없이 ~를 독립적이고 자발적으로 수행한다"
        # → "독립적이고 자발적으로 ~한다"

        goal_text = re.sub(
            r'촉구\s*없이\s+',
            '',
            goal_text
        )

        goal_text = re.sub(
            r'(.+?)를?\s*독립적이고\s*자발적으로\s*수행한다\.?$',
            r'독립적이고 자발적으로 \1한다.',
            goal_text
        )

        # "~를 수행한다" → "~한다"
        goal_text = re.sub(r'를?\s*수행한다', '한다', goal_text)

    # 마침표 확인
    if not goal_text.endswith('.'):
        goal_text += '.'

    # 연속 공백 제거
    goal_text = re.sub(r'\s+', ' ', goal_text)

    return goal_text.strip()

def main():
    print("=" * 80)
    print("LifeSkills 225개 목표 문장 전문 수정 시작")
    print("=" * 80)

    # 백업 생성
    with open('data/iep_library_with_similarities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open('data/iep_library_with_similarities.json.backup_before_refine', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("✅ 백업 생성: data/iep_library_with_similarities.json.backup_before_refine")

    lifeskills = data.get('lifeskills', [])

    # 수정 전후 비교 샘플
    samples = []
    updated_count = 0

    for item in lifeskills:
        code = item.get('code', '')
        old_goal = item.get('goal', '')

        # 코드에서 레벨 추출 (예: L-자립생활-1-01 → 01)
        level_match = re.search(r'-(\d+)$', code)
        if not level_match:
            continue

        level_num = level_match.group(1)
        level_key = f'L{level_num}'

        # 목표 수정
        new_goal = refine_goal_text(old_goal, level_key)

        if old_goal != new_goal:
            item['goal'] = new_goal
            updated_count += 1

            # 처음 10개 샘플 수집
            if len(samples) < 10:
                samples.append({
                    'code': code,
                    'level': level_key,
                    'old': old_goal,
                    'new': new_goal
                })

    # 샘플 출력
    print("\n" + "=" * 80)
    print("수정 샘플 (처음 10개)")
    print("=" * 80)
    for i, sample in enumerate(samples, 1):
        print(f"\n{i}. [{sample['code']}] ({sample['level']})")
        print(f"   이전: {sample['old'][:100]}...")
        print(f"   변경: {sample['new'][:100]}...")

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
