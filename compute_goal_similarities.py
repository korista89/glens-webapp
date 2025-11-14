#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
목표 라이브러리의 모든 목표 문장 간 유사도를 계산하여
Excel에 관련 목표 문장을 추가하는 스크립트
"""

import json
import re
from collections import Counter
import math

def tokenize_korean(text):
    """한글 텍스트를 간단하게 토큰화 (공백, 조사 제거)"""
    # 특수문자 제거 및 공백으로 분리
    tokens = re.findall(r'[가-힣A-Za-z0-9]+', text)
    return [t.lower() for t in tokens if len(t) > 1]

def compute_cosine_similarity(text1, text2):
    """두 텍스트 간의 코사인 유사도 계산"""
    tokens1 = tokenize_korean(text1)
    tokens2 = tokenize_korean(text2)

    if not tokens1 or not tokens2:
        return 0.0

    # TF 벡터 생성
    counter1 = Counter(tokens1)
    counter2 = Counter(tokens2)

    # 공통 단어
    common_terms = set(counter1.keys()) & set(counter2.keys())

    if not common_terms:
        return 0.0

    # 코사인 유사도 계산
    dot_product = sum(counter1[term] * counter2[term] for term in common_terms)
    magnitude1 = math.sqrt(sum(count ** 2 for count in counter1.values()))
    magnitude2 = math.sqrt(sum(count ** 2 for count in counter2.values()))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)

def find_related_goals(current_goal, all_goals, threshold=0.3, max_results=10, min_results=3):
    """현재 목표와 유사한 다른 목표들을 찾기 (동일 커리큘럼 제외)

    Args:
        current_goal: 현재 목표
        all_goals: 전체 목표 리스트
        threshold: 유사도 임계값
        max_results: 최대 결과 개수
        min_results: 최소 결과 개수 (임계값 이하라도 가장 유사한 목표 반환)
    """
    similarities = []
    current_curriculum = current_goal.get('curriculum', '')

    for goal in all_goals:
        # 동일한 코드 제외
        if goal['code'] == current_goal['code']:
            continue

        # 동일한 커리큘럼 제외 (다른 커리큘럼의 목표만 추천)
        if goal.get('curriculum', '') == current_curriculum:
            continue

        # 목표 문장 유사도 계산
        sim = compute_cosine_similarity(current_goal['text'], goal['text'])

        similarities.append({
            'code': goal['code'],
            'curriculum': goal['curriculum'],
            'area': goal['area'],
            'text': goal['text'],
            'similarity': round(sim, 4)
        })

    # 유사도 순으로 정렬
    similarities.sort(key=lambda x: x['similarity'], reverse=True)

    # 임계값 이상인 항목 필터링
    above_threshold = [s for s in similarities if s['similarity'] >= threshold]

    # 임계값 이상이 충분하면 그것 사용, 아니면 최소 개수만큼 반환
    if len(above_threshold) >= min_results:
        return above_threshold[:max_results]
    else:
        # 임계값 이하라도 최소 개수만큼은 반환 (유사도 0인 것 제외)
        return [s for s in similarities[:max(min_results, len(above_threshold))] if s['similarity'] > 0][:max_results]

def main():
    print("=" * 80)
    print("목표 라이브러리 간 유사도 계산 시작")
    print("=" * 80)

    # IEP 라이브러리 로드
    with open('data/iep_library.json', 'r', encoding='utf-8') as f:
        iep_data = json.load(f)

    # 모든 목표 수집 (related만 사용)
    all_goals = []

    for entry in iep_data.get('related', []):
        all_goals.append({
            'curriculum': entry.get('curriculum', ''),
            'area': entry.get('area', ''),
            'code': entry.get('code', ''),
            'text': entry.get('text', ''),
            'procedure': entry.get('originalData', {}).get('procedure', ''),
            'reinforcement': entry.get('originalData', {}).get('reinforcement', '')
        })

    print(f"\n총 목표 개수: {len(all_goals)}개")

    # 각 목표에 대해 관련 목표 계산
    print("\n관련 목표 계산 중...")
    threshold = 0.3   # 임계값
    max_related = 10  # 최대 관련 목표 개수
    min_related = 3   # 최소 관련 목표 개수 (임계값 이하라도 보장)

    for idx, goal in enumerate(all_goals):
        related_goals = find_related_goals(goal, all_goals, threshold, max_related, min_related)
        goal['related_goals'] = related_goals

        if (idx + 1) % 100 == 0:
            print(f"  진행 중: {idx + 1}/{len(all_goals)} ({(idx + 1) / len(all_goals) * 100:.1f}%)")

    print(f"\n✅ 완료: {len(all_goals)}개 목표에 대한 관련 목표 계산 완료")

    # 결과를 JSON 파일로 저장
    output_data = {
        'lifeskills': iep_data.get('lifeskills', []),
        'related': all_goals
    }

    with open('data/iep_library_with_similarities.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("\n✅ 파일 저장: data/iep_library_with_similarities.json")

    # 통계 출력
    total_related = sum(len(goal.get('related_goals', [])) for goal in all_goals)
    avg_related = total_related / len(all_goals) if all_goals else 0

    print("\n" + "=" * 80)
    print("통계")
    print("=" * 80)
    print(f"평균 관련 목표 개수: {avg_related:.2f}개")
    print(f"총 관련 연결: {total_related}개")

    # 샘플 출력 (처음 3개)
    print("\n" + "=" * 80)
    print("샘플 (처음 3개 목표)")
    print("=" * 80)

    for i, goal in enumerate(all_goals[:3]):
        print(f"\n{i+1}. [{goal['code']}] {goal['text'][:60]}...")
        print(f"   관련 목표 {len(goal.get('related_goals', []))}개:")
        for rel in goal.get('related_goals', [])[:3]:
            print(f"     - [{rel['code']}] ({rel['similarity']:.2f}) {rel['text'][:50]}...")

if __name__ == "__main__":
    main()
