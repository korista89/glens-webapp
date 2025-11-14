#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TF-IDF 기반 코사인 유사도로 목표 간 관련도 계산
기존 단순 TF 방식보다 의미적으로 더 정확한 유사도 제공
"""

import json
import re
from collections import Counter
import math

def tokenize_korean(text):
    """한글 텍스트를 토큰화"""
    tokens = re.findall(r'[가-힣A-Za-z0-9]+', text)
    # 1글자 토큰과 조사 제거
    stopwords = {'을', '를', '이', '가', '은', '는', '에', '의', '와', '과', '로', '으로', '도', '만'}
    return [t.lower() for t in tokens if len(t) > 1 and t not in stopwords]

def compute_idf(all_documents):
    """IDF(Inverse Document Frequency) 계산

    IDF = log(전체 문서 수 / 해당 단어가 포함된 문서 수)
    """
    doc_count = len(all_documents)
    term_doc_count = Counter()

    for doc in all_documents:
        unique_terms = set(doc)
        for term in unique_terms:
            term_doc_count[term] += 1

    idf = {}
    for term, count in term_doc_count.items():
        idf[term] = math.log(doc_count / count)

    return idf

def compute_tfidf_vector(tokens, idf):
    """TF-IDF 벡터 계산

    TF-IDF = TF(단어 빈도) × IDF
    """
    tf = Counter(tokens)
    tfidf = {}

    for term, freq in tf.items():
        tfidf[term] = freq * idf.get(term, 0)

    return tfidf

def cosine_similarity_tfidf(vec1, vec2):
    """TF-IDF 벡터 간 코사인 유사도 계산"""
    # 공통 단어
    common_terms = set(vec1.keys()) & set(vec2.keys())

    if not common_terms:
        return 0.0

    # 내적
    dot_product = sum(vec1[term] * vec2[term] for term in common_terms)

    # 크기
    magnitude1 = math.sqrt(sum(val ** 2 for val in vec1.values()))
    magnitude2 = math.sqrt(sum(val ** 2 for val in vec2.values()))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)

def find_related_goals(current_goal, all_goals, goal_tfidf_vectors, threshold=0.1, max_results=10, min_results=3):
    """TF-IDF 기반으로 관련 목표 찾기"""
    current_curriculum = current_goal.get('curriculum', '')
    current_vec = goal_tfidf_vectors[current_goal['code']]

    similarities = []

    for goal in all_goals:
        # 동일한 코드 제외
        if goal['code'] == current_goal['code']:
            continue

        # 동일한 커리큘럼 제외
        if goal.get('curriculum', '') == current_curriculum:
            continue

        # TF-IDF 유사도 계산
        goal_vec = goal_tfidf_vectors[goal['code']]
        sim = cosine_similarity_tfidf(current_vec, goal_vec)

        similarities.append({
            'code': goal['code'],
            'curriculum': goal['curriculum'],
            'area': goal['area'],
            'text': goal['text'],
            'similarity': round(sim, 4)
        })

    # 유사도 순으로 정렬
    similarities.sort(key=lambda x: x['similarity'], reverse=True)

    # 임계값 이상인 항목
    above_threshold = [s for s in similarities if s['similarity'] >= threshold]

    # 임계값 이상이 충분하면 사용, 아니면 최소 개수 보장
    if len(above_threshold) >= min_results:
        return above_threshold[:max_results]
    else:
        return [s for s in similarities[:max(min_results, len(above_threshold))] if s['similarity'] > 0][:max_results]

def main():
    print("=" * 80)
    print("TF-IDF 기반 목표 라이브러리 유사도 계산")
    print("=" * 80)

    # 데이터 로드
    with open('data/iep_library_with_similarities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 모든 목표 수집 (related 배열에서)
    all_goals = []
    for entry in data.get('related', []):
        all_goals.append({
            'curriculum': entry.get('curriculum', ''),
            'area': entry.get('area', ''),
            'code': entry.get('code', ''),
            'text': entry.get('text', ''),
            'procedure': entry.get('originalData', {}).get('procedure', ''),
            'reinforcement': entry.get('originalData', {}).get('reinforcement', '')
        })

    # lifeskills 배열도 수집 (코드 매핑용)
    lifeskills_map = {}
    for entry in data.get('lifeskills', []):
        code = entry.get('code', '')
        lifeskills_map[code] = entry
        # lifeskills 항목도 all_goals에 추가 (유사도 계산 대상)
        # 이미 related에 대괄호 버전으로 포함되어 있으므로 추가하지 않음

    print(f"\n총 목표 개수 (related): {len(all_goals)}개")
    print(f"LifeSkills 목표: {len(lifeskills_map)}개")

    # 1단계: 모든 문서 토큰화
    print("\n1단계: 텍스트 토큰화...")
    tokenized_docs = []
    for goal in all_goals:
        tokens = tokenize_korean(goal['text'])
        tokenized_docs.append(tokens)

    # 2단계: IDF 계산
    print("2단계: IDF 계산...")
    idf = compute_idf(tokenized_docs)
    print(f"  유니크 단어 수: {len(idf)}개")

    # 3단계: 각 목표의 TF-IDF 벡터 계산
    print("3단계: TF-IDF 벡터 계산...")
    goal_tfidf_vectors = {}
    for i, goal in enumerate(all_goals):
        tokens = tokenized_docs[i]
        tfidf_vec = compute_tfidf_vector(tokens, idf)
        goal_tfidf_vectors[goal['code']] = tfidf_vec

    # 4단계: 관련 목표 계산
    print("\n4단계: 관련 목표 계산...")
    threshold = 0.1   # 낮은 임계값 (TF-IDF는 더 정확하므로)
    max_related = 10
    min_related = 3

    for idx, goal in enumerate(all_goals):
        related_goals = find_related_goals(goal, all_goals, goal_tfidf_vectors, threshold, max_related, min_related)
        goal['related_goals'] = related_goals

        if (idx + 1) % 100 == 0:
            print(f"  진행: {idx + 1}/{len(all_goals)} ({(idx + 1) / len(all_goals) * 100:.1f}%)")

    print("\n✅ 완료!")

    # lifeskills 배열에도 related_goals 추가하고, related 배열의 LifeSkills 항목 text도 업데이트
    print("\n5단계: LifeSkills 배열에 관련 목표 추가 및 related 배열 동기화...")
    for code, entry in lifeskills_map.items():
        # related 배열에서 대괄호 버전 코드로 찾기
        code_with_brackets = f"[{code}]"
        related_goal = next((g for g in all_goals if g['code'] == code_with_brackets), None)
        if related_goal and 'related_goals' in related_goal:
            entry['related_goals'] = related_goal['related_goals']
            # related 배열의 LifeSkills 항목 text도 lifeskills의 수정된 goal로 동기화
            related_goal['text'] = entry['goal']
        else:
            entry['related_goals'] = []

    # 저장
    output_data = {
        'lifeskills': list(lifeskills_map.values()),
        'related': all_goals
    }

    with open('data/iep_library_with_similarities.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print("\n✅ 파일 저장: data/iep_library_with_similarities.json")

    # 통계
    total_related = sum(len(goal.get('related_goals', [])) for goal in all_goals)
    avg_related = total_related / len(all_goals) if all_goals else 0

    print("\n" + "=" * 80)
    print("통계")
    print("=" * 80)
    print(f"평균 관련 목표: {avg_related:.2f}개")
    print(f"총 관련 연결: {total_related}개")

    # 유사도 분포 확인
    all_sims = []
    for goal in all_goals:
        for rg in goal.get('related_goals', []):
            all_sims.append(rg['similarity'])

    if all_sims:
        print(f"\n유사도 범위: {min(all_sims):.4f} ~ {max(all_sims):.4f}")
        print(f"평균 유사도: {sum(all_sims)/len(all_sims):.4f}")

    # 샘플 출력
    print("\n" + "=" * 80)
    print("샘플 (처음 3개)")
    print("=" * 80)

    for i, goal in enumerate(all_goals[:3]):
        print(f"\n{i+1}. {goal['code']} ({goal['curriculum']})")
        print(f"   목표: {goal['text'][:60]}...")
        print(f"   관련 목표 {len(goal.get('related_goals', []))}개:")
        for rg in goal.get('related_goals', [])[:5]:
            print(f"     - {rg['code']} ({rg['curriculum']}, {rg['similarity']:.4f})")

if __name__ == "__main__":
    main()
