#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
목표 라이브러리 정리 스크립트
1. 중복 데이터 삭제 (유사도 98% 이상)
2. 불필요한 목표 삭제 (영역명만 있는 항목들)
"""

import json
import re
from difflib import SequenceMatcher

def calculate_similarity(text1, text2):
    """두 텍스트의 유사도 계산 (0-1)"""
    return SequenceMatcher(None, text1, text2).ratio()

def is_header_only(text):
    """
    영역명만 있는 헤더성 항목인지 판단
    예: "🏫 장소 1: 모든 장소", "Domain 3: Answers", "15. Writing (쓰기)"
    """
    if not text or len(text.strip()) < 3:
        return True

    # PBIS 장소 헤더 패턴
    if re.match(r'^🏫\s*장소\s*\d+\s*:\s*.+$', text):
        return True

    # EFL Domain 헤더 패턴 (도메인명만 있고 구체적 목표가 없는 경우)
    if re.match(r'^Domain\s+\d+\s*:\s*.+$', text) and len(text) < 100:
        return True

    # VB-MAPP 영역명만 있는 경우
    if re.match(r'^\d+\.\s+\w+\s*\([가-힣]+\)\s*$', text):
        return True

    # 코드가 없고 짧은 텍스트 (헤더일 가능성)
    if not re.search(r'\[.+?\]', text) and len(text) < 50:
        return True

    return False

def clean_library_data():
    """라이브러리 데이터 정리"""
    print("=" * 80)
    print("목표 라이브러리 정리 시작")
    print("=" * 80)

    # Load data
    with open('data/iep_library.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    related = data.get('related', [])
    print(f"\n📊 초기 데이터: {len(related)}개 항목")

    # 1. 불필요한 목표 삭제 (영역명만 있는 항목들)
    print("\n" + "=" * 80)
    print("1단계: 불필요한 목표 삭제 (영역명만 있는 항목들)")
    print("=" * 80)

    removed_headers = []
    filtered = []

    for entry in related:
        text = entry.get('text', '')
        if is_header_only(text):
            removed_headers.append(entry)
            print(f"🗑️  삭제: [{entry.get('curriculum')}] {text[:80]}...")
        else:
            filtered.append(entry)

    print(f"\n✅ 불필요한 항목 {len(removed_headers)}개 삭제")
    print(f"   남은 항목: {len(filtered)}개")

    # 2. 중복 데이터 삭제 (유사도 98% 이상)
    print("\n" + "=" * 80)
    print("2단계: 중복 데이터 삭제 (유사도 98% 이상)")
    print("=" * 80)

    # 커리큘럼별로 그룹화하여 중복 검사
    by_curriculum = {}
    for entry in filtered:
        curr = entry.get('curriculum', 'Unknown')
        if curr not in by_curriculum:
            by_curriculum[curr] = []
        by_curriculum[curr].append(entry)

    deduplicated = []
    duplicate_count = 0

    for curr_name, entries in by_curriculum.items():
        print(f"\n📂 {curr_name}: {len(entries)}개 항목 검사 중...")

        curr_unique = []
        seen_texts = []

        for entry in entries:
            text = entry.get('text', '')
            is_duplicate = False

            # 기존 텍스트들과 비교
            for seen_text in seen_texts:
                similarity = calculate_similarity(text, seen_text)
                if similarity >= 0.98:
                    is_duplicate = True
                    duplicate_count += 1
                    print(f"   🔁 중복 발견 (유사도 {similarity:.2%}): {text[:60]}...")
                    break

            if not is_duplicate:
                curr_unique.append(entry)
                seen_texts.append(text)

        deduplicated.extend(curr_unique)
        if len(curr_unique) < len(entries):
            print(f"   ✅ {len(entries) - len(curr_unique)}개 중복 제거 → {len(curr_unique)}개 남음")

    print(f"\n✅ 총 {duplicate_count}개 중복 항목 삭제")
    print(f"   최종 항목: {len(deduplicated)}개")

    # Save cleaned data
    data['related'] = deduplicated

    with open('data/iep_library.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 80)
    print("정리 완료!")
    print("=" * 80)
    print(f"초기: {len(related)}개")
    print(f"헤더 제거: -{len(removed_headers)}개")
    print(f"중복 제거: -{duplicate_count}개")
    print(f"최종: {len(deduplicated)}개")
    print(f"총 {len(related) - len(deduplicated)}개 항목 삭제 ({(len(related) - len(deduplicated)) / len(related) * 100:.1f}% 감소)")

if __name__ == "__main__":
    clean_library_data()
