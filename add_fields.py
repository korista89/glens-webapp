#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lifeskills.json에 procedure와 개선된 IEP 목표 문장 추가
"""

import json

def generate_procedure(item_title, sd, behavior):
    """수업 절차 생성"""
    return (
        f"준비물: {item_title} 지도에 필요한 실물·시각자료, 강화물, 기록지를 준비한다.\n"
        f"제시(변별자극): {sd} 안내와 함께 단계별 시범·언어 프롬프트를 제공한다.\n"
        f"기대 반응: {behavior} 행동을 순서에 맞춰 독립적으로 수행한다.\n"
        "오반응/무반응 시 후속결과: 즉시 언어·모델·신체 프롬프트를 적용하고 필요한 단계부터 재시작한다.\n"
        "강화 및 기록: 성공 시 구체적 칭찬과 강화물을 제공하고, 세션 기록지에 독립/촉구 수준 및 관찰 메모를 남긴다.\n"
        "성공 기준: 5회 시도 중 4회 이상 독립 수행을 3회기 연속 달성하면 목표를 유지·일반화 단계로 전환한다."
    )

def generate_iep_goal(item_title, sd, behavior):
    """IEP 목표 문장 생성 (조건-단서-행동-결과 형식)"""
    # SD에서 조건 추출
    condition = sd if sd else "적절한 상황에서"

    # 행동 동사 추출 및 목표 문장 생성
    # 예: "손 씻기 루틴 완료하기" -> "손 씻기 루틴을 완료한다"
    behavior_verb = behavior if behavior else item_title

    # IEP 목표 문장 템플릿
    goal = f"{condition}, 학생은 시각적 단서를 보고 언어적 촉구를 받아 {behavior_verb}."

    return goal

# JSON 파일 로드
with open('lifeskills.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 각 도메인의 각 항목에 procedure와 iep_goal 추가
for domain in data['domains']:
    for item in domain['items']:
        title = item.get('title', '')
        sd = item.get('sd', '')
        behavior = item.get('behavior', '')

        # procedure 추가 (기존에 없으면)
        if 'procedure' not in item:
            item['procedure'] = generate_procedure(title, sd, behavior)

        # iep_goal 개선 (기존 iep_goal을 improved_iep_goal로 백업하고 새로 생성)
        if 'iep_goal' in item:
            # 기존 목표를 백업
            item['original_iep_goal'] = item['iep_goal']

        # 새로운 IEP 목표 생성
        item['iep_goal'] = generate_iep_goal(title, sd, behavior)

# JSON 파일 저장 (들여쓰기 유지)
with open('lifeskills.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ procedure 및 IEP 목표 문장 추가 완료!")
print(f"총 도메인 수: {len(data['domains'])}")
total_items = sum(len(domain['items']) for domain in data['domains'])
print(f"총 항목 수: {total_items}")
