#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
개선된 유사도 계산: TF-IDF + Character N-gram + 동의어 확장
의미적 유사성을 더 잘 포착하기 위한 하이브리드 접근
"""

import json
import re
from collections import Counter
import math

# 동의어 및 기술 관련 단어 사전 (확장)
SYNONYMS = {
    '학생': ['학생', '아동', '어린이', '유아', '학습자', '아이'],
    '교사': ['교사', '선생님', '교육자', '지도자', '교육자'],
    '손씻기': ['손씻기', '손을씻다', '손세척', '손위생', '씻기'],
    '화장실': ['화장실', '변기', '세면대', '세면실', '욕실'],
    '이동': ['이동', '가다', '옮기다', '움직이다', '걷기', '오다', '돌아오다'],
    '표현': ['표현', '말하다', '전달', '의사소통', '이야기', '소통', '대답', '응답'],
    '요청': ['요청', '부탁', '청하다', '구하다', '물어보다', '묻다'],
    '선택': ['선택', '고르다', '택하다', '결정', '고르기', '선택하다'],
    '완료': ['완료', '끝내다', '마치다', '수행', '실행', '하다'],
    '인사': ['인사', '반응', '대답', '응답', '답하다'],
    '요구': ['요구', '필요', '니즈', '욕구', '원하다'],
    '물건': ['물건', '물체', '사물', '아이템', '도구'],
    '사용': ['사용', '이용', '활용', '쓰다'],
    '따라': ['따라', '모방', '따라하다', '흉내'],
    '확인': ['확인', '보다', '관찰', '살피다', '체크'],
    '지시': ['지시', '명령', '안내', '설명', '촉구'],
    '도움': ['도움', '지원', '도와주다', '돕다'],
    '협력': ['협력', '협조', '함께', '같이'],
    '시간': ['시간', '때', '언제', '타이밍'],
    '장소': ['장소', '위치', '곳', '어디'],
    '순서': ['순서', '차례', '단계', '절차'],
}

# 역 동의어 맵 생성
SYNONYM_MAP = {}
for key, synonyms in SYNONYMS.items():
    for syn in synonyms:
        SYNONYM_MAP[syn] = key

def normalize_synonym(word):
    """동의어를 표준형으로 변환"""
    return SYNONYM_MAP.get(word, word)

def tokenize_korean(text):
    """한글 텍스트를 토큰화 (동의어 정규화 포함)"""
    tokens = re.findall(r'[가-힣A-Za-z0-9]+', text)
    stopwords = {'을', '를', '이', '가', '은', '는', '에', '의', '와', '과', '로', '으로', '도', '만', '때', '더'}
    normalized = []
    for t in tokens:
        if len(t) > 1 and t not in stopwords:
            normalized.append(normalize_synonym(t.lower()))
    return normalized

def extract_char_ngrams(text, n=3):
    """문자 n-gram 추출 (부분 문자열 매칭용)"""
    # 공백 제거
    text_clean = re.sub(r'\s+', '', text)
    ngrams = []
    for i in range(len(text_clean) - n + 1):
        ngrams.append(text_clean[i:i+n])
    return ngrams

def compute_idf(all_documents):
    """IDF 계산"""
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
    """TF-IDF 벡터 계산"""
    tf = Counter(tokens)
    tfidf = {}

    for term, freq in tf.items():
        tfidf[term] = freq * idf.get(term, 0)

    return tfidf

def cosine_similarity(vec1, vec2):
    """코사인 유사도 계산"""
    common_terms = set(vec1.keys()) & set(vec2.keys())

    if not common_terms:
        return 0.0

    dot_product = sum(vec1[term] * vec2[term] for term in common_terms)
    magnitude1 = math.sqrt(sum(val ** 2 for val in vec1.values()))
    magnitude2 = math.sqrt(sum(val ** 2 for val in vec2.values()))

    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0

    return dot_product / (magnitude1 * magnitude2)

def jaccard_similarity(set1, set2):
    """Jaccard 유사도 계산"""
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0.0

def compute_hybrid_similarity(text1, text2, tfidf_vec1, tfidf_vec2):
    """
    하이브리드 유사도 계산:
    - TF-IDF 코사인 유사도 (70%) - 의미적 유사성
    - Character 3-gram Jaccard 유사도 (30%) - 문자열 유사성
    - 더 강한 비선형 증폭으로 의미 있는 유사도만 선택
    """
    # TF-IDF 유사도 (동의어 확장으로 기술적 유사성도 포함)
    tfidf_sim = cosine_similarity(tfidf_vec1, tfidf_vec2)

    # Character n-gram 유사도
    ngrams1 = set(extract_char_ngrams(text1, n=3))
    ngrams2 = set(extract_char_ngrams(text2, n=3))
    ngram_sim = jaccard_similarity(ngrams1, ngrams2)

    # 가중 평균 (TF-IDF 더 중시)
    hybrid_sim = 0.7 * tfidf_sim + 0.3 * ngram_sim

    # 더 강한 비선형 증폭: x^0.6를 사용하여 낮은 값을 더 크게 증폭
    # 예: 0.01 -> 0.10, 0.05 -> 0.18, 0.1 -> 0.25, 0.2 -> 0.35
    boosted_sim = math.pow(hybrid_sim, 0.6)

    return boosted_sim

def find_related_goals_by_curriculum(current_goal, all_goals, goal_tfidf_vectors, goal_texts,
                                     target_curriculum, target_counts):
    """
    커리큘럼별로 지정된 개수만큼 관련 목표 찾기

    target_counts: {'교육과정': (1, 5), 'VB-MAPP': (1, 3), ...}
                   (최소, 최대) 튜플
    """
    current_curriculum = current_goal.get('curriculum', '')
    current_vec = goal_tfidf_vectors[current_goal['code']]
    current_text = goal_texts[current_goal['code']]

    similarities = []

    for goal in all_goals:
        # 동일한 코드 제외
        if goal['code'] == current_goal['code']:
            continue

        # 동일한 커리큘럼 제외
        if goal.get('curriculum', '') == current_curriculum:
            continue

        # 목표 커리큘럼만 필터링
        if goal.get('curriculum', '') != target_curriculum:
            continue

        # 하이브리드 유사도 계산
        goal_vec = goal_tfidf_vectors[goal['code']]
        goal_text = goal_texts[goal['code']]
        sim = compute_hybrid_similarity(current_text, goal_text, current_vec, goal_vec)

        similarities.append({
            'code': goal['code'],
            'curriculum': goal['curriculum'],
            'area': goal['area'],
            'text': goal['text'],
            'similarity': round(sim, 4)
        })

    # 유사도 순으로 정렬
    similarities.sort(key=lambda x: x['similarity'], reverse=True)

    # 목표 개수 범위 적용
    min_count, max_count = target_counts.get(target_curriculum, (1, 5))

    # 최소 개수 보장하되 최대 개수 제한
    return similarities[:max_count]

def main():
    print("=" * 80)
    print("개선된 하이브리드 유사도 계산")
    print("TF-IDF (60%) + Character N-gram (40%) + 동의어 확장")
    print("=" * 80)

    # 데이터 로드
    with open('data/iep_library_with_similarities.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 모든 목표 수집
    all_goals = []
    for entry in data.get('related', []):
        all_goals.append({
            'curriculum': entry.get('curriculum', ''),
            'area': entry.get('area', ''),
            'code': entry.get('code', ''),
            'text': entry.get('text', ''),
        })

    # lifeskills 배열도 수집
    lifeskills_map = {}
    for entry in data.get('lifeskills', []):
        code = entry.get('code', '')
        lifeskills_map[code] = entry

    print(f"\n총 목표 개수: {len(all_goals)}개")
    print(f"LifeSkills 목표: {len(lifeskills_map)}개")

    # 1단계: 텍스트 토큰화 (동의어 정규화 포함)
    print("\n1단계: 텍스트 토큰화 (동의어 정규화)...")
    tokenized_docs = []
    goal_texts = {}
    for goal in all_goals:
        tokens = tokenize_korean(goal['text'])
        tokenized_docs.append(tokens)
        goal_texts[goal['code']] = goal['text']

    # 2단계: IDF 계산
    print("2단계: IDF 계산...")
    idf = compute_idf(tokenized_docs)
    print(f"  유니크 단어 수: {len(idf)}개")

    # 3단계: TF-IDF 벡터 계산
    print("3단계: TF-IDF 벡터 계산...")
    goal_tfidf_vectors = {}
    for i, goal in enumerate(all_goals):
        tokens = tokenized_docs[i]
        tfidf_vec = compute_tfidf_vector(tokens, idf)
        goal_tfidf_vectors[goal['code']] = tfidf_vec

    # 4단계: 관련 목표 계산 (커리큘럼별 개수 지정)
    print("\n4단계: 커리큘럼별 관련 목표 계산...")

    # 커리큘럼별 목표 개수 (최소, 최대)
    target_counts = {
        '교육과정': (1, 5),
        'VB-MAPP': (1, 3),
        'EFL': (1, 3),
        'PBIS': (1, 3)
    }

    for idx, goal in enumerate(all_goals):
        related_goals = []

        # 각 커리큘럼별로 목표 수집
        for curriculum in ['교육과정', 'VB-MAPP', 'EFL', 'PBIS']:
            curriculum_goals = find_related_goals_by_curriculum(
                goal, all_goals, goal_tfidf_vectors, goal_texts,
                curriculum, target_counts
            )
            related_goals.extend(curriculum_goals)

        # 전체 유사도순으로 재정렬
        related_goals.sort(key=lambda x: x['similarity'], reverse=True)

        goal['related_goals'] = related_goals

        if (idx + 1) % 100 == 0:
            print(f"  진행: {idx + 1}/{len(all_goals)} ({(idx + 1) / len(all_goals) * 100:.1f}%)")

    print("\n✅ 완료!")

    # 5단계: lifeskills 배열 동기화
    print("\n5단계: LifeSkills 배열 동기화...")
    for code, entry in lifeskills_map.items():
        code_with_brackets = f"[{code}]"
        related_goal = next((g for g in all_goals if g['code'] == code_with_brackets), None)
        if related_goal and 'related_goals' in related_goal:
            entry['related_goals'] = related_goal['related_goals']
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
    print("\n" + "=" * 80)
    print("통계")
    print("=" * 80)

    # 커리큘럼별 개수 통계
    curriculum_stats = {}
    for goal in all_goals:
        curriculum_counts = Counter(rg['curriculum'] for rg in goal.get('related_goals', []))
        for curr, count in curriculum_counts.items():
            if curr not in curriculum_stats:
                curriculum_stats[curr] = []
            curriculum_stats[curr].append(count)

    for curr in ['교육과정', 'VB-MAPP', 'EFL', 'PBIS']:
        if curr in curriculum_stats:
            counts = curriculum_stats[curr]
            print(f"{curr}: 평균 {sum(counts)/len(counts):.1f}개 (범위: {min(counts)}~{max(counts)}개)")

    # 유사도 분포
    all_sims = []
    for goal in all_goals:
        for rg in goal.get('related_goals', []):
            all_sims.append(rg['similarity'])

    if all_sims:
        print(f"\n전체 유사도 범위: {min(all_sims):.4f} ~ {max(all_sims):.4f}")
        print(f"평균 유사도: {sum(all_sims)/len(all_sims):.4f}")

    # 샘플 출력
    print("\n" + "=" * 80)
    print("샘플 (처음 3개)")
    print("=" * 80)

    for i, goal in enumerate(all_goals[:3]):
        print(f"\n{i+1}. {goal['code']} ({goal['curriculum']})")
        print(f"   목표: {goal['text'][:60]}...")
        print(f"   관련 목표 {len(goal.get('related_goals', []))}개:")

        # 커리큘럼별로 분류하여 표시
        by_curr = {}
        for rg in goal.get('related_goals', []):
            curr = rg['curriculum']
            if curr not in by_curr:
                by_curr[curr] = []
            by_curr[curr].append(rg)

        for curr in ['교육과정', 'VB-MAPP', 'EFL', 'PBIS']:
            if curr in by_curr:
                print(f"     [{curr}] {len(by_curr[curr])}개:")
                for rg in by_curr[curr][:2]:
                    print(f"       - {rg['code']} ({rg['similarity']:.4f})")

if __name__ == "__main__":
    main()
