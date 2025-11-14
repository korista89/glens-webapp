#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
커리큘럼 데이터 재구조화 스크립트
- PBIS: 영역 추출, 코드 형식 변경 ([P-모든장소-스스로1-1])
- 교육과정: 과목명 추출
- VB-MAPP: 영역 추출 (Mand, LR 등)
"""

import json
import re

def extract_pbis_area(text):
    """PBIS 텍스트에서 영역 추출"""
    # [화장실-안전1] -> 화장실
    # [급식실-바르게1] -> 급식실
    # [교실-스스로1] -> 교실
    # [복도계단-바르게1] -> 복도계단 (복도·계단)

    match = re.match(r'\[([^-\]]+)-', text)
    if match:
        area = match.group(1)
        # 표준화
        if '화장실' in area:
            return '화장실'
        elif '급식실' in area or '급식' in area:
            return '급식실'
        elif '교실' in area:
            return '교실'
        elif '복도' in area or '계단' in area:
            return '복도계단'
        elif '모든' in area or '전체' in area:
            return '모든장소'
        return area
    return '모든장소'  # 기본값

def restructure_pbis_code(text):
    """
    PBIS 코드 재구조화
    [화장실-안전1] -> [P-화장실-안전1]
    구체적 목표가 있으면 -1, -2, -3 추가
    """
    # 코드 추출
    code_match = re.match(r'\[([^\]]+)\]', text)
    if not code_match:
        return None, text

    old_code = code_match.group(1)
    parts = old_code.split('-')

    if len(parts) >= 2:
        area = parts[0]
        behavior = parts[1]

        # 영역 표준화
        if '화장실' in area:
            area = '화장실'
        elif '급식실' in area or '급식' in area:
            area = '급식실'
        elif '교실' in area:
            area = '교실'
        elif '복도' in area or '계단' in area:
            area = '복도계단'
        elif '모든' in area:
            area = '모든장소'

        # 새 코드 생성: [P-영역-행동]
        new_code_base = f"[P-{area}-{behavior}]"

        # 목표 문장 분리 (2줄 형식)
        # 첫 줄: [P-영역-행동] 행동 설명
        # 둘째 줄: [P-영역-행동-1] 구체적 목표
        lines = text.split('\n')
        first_line = lines[0] if lines else text

        # 첫 줄에서 설명 추출
        desc_match = re.match(r'\[[^\]]+\]\s*(.+)', first_line)
        description = desc_match.group(1) if desc_match else ''

        # 새 포맷: 2줄
        # 첫 줄: [P-영역-행동] 설명
        # 둘째 줄: 구체적 목표가 있으면 추가
        new_text = f"{new_code_base} {description}"

        # 구체적 단계가 있으면 추가 (원래 텍스트에서 추출)
        if len(text) > len(first_line) + 10:  # 충분히 긴 텍스트
            # 두 번째 줄 이후 내용이 있으면
            rest = '\n'.join(lines[1:]).strip()
            if rest and len(rest) > 20:
                # -1 코드로 구체적 목표 추가
                new_text += f"\n[P-{area}-{behavior}-1] {rest[:200]}"

        return new_code_base, new_text

    return None, text

def extract_curriculum_subject(text):
    """교육과정 코드에서 과목명 추출"""
    # [9보건01-02] -> 보건
    # [6체육01-02] -> 체육
    # [12국어03-01] -> 국어

    match = re.match(r'\[\\d+([가-힣]+)\\d+-\\d+\]', text)
    if match:
        return match.group(1)

    # 한글 부분 찾기
    match2 = re.search(r'[가-힣]{2,}', text[:30])
    if match2:
        subject = match2.group(0)
        # 일반적인 과목명
        subjects = ['국어', '수학', '영어', '사회', '과학', '체육', '음악', '미술', '도덕', '실과', '기술', '가정', '보건', '진로', '창체']
        for s in subjects:
            if s in subject:
                return s

    return '기타'

def extract_vbmapp_area(text):
    """VB-MAPP 코드에서 영역 추출"""
    # [Mand-L3-M12] -> Mand
    # [LR-L2-M8] -> LR (Listener Responding)
    # [Linguistic-L2-M9] -> Linguistic

    match = re.match(r'\[([^-\]]+)-', text)
    if match:
        area = match.group(1)
        # 영역명 매핑
        area_map = {
            'Mand': 'Mand',
            'LR': 'Listener Responding (LR)',
            'Tact': 'Tact',
            'Echoic': 'Echoic',
            'LRFFC': 'LRFFC',
            'IV': 'Intraverbal (IV)',
            'Group': 'Group',
            'Linguistic': 'Linguistic Structure',
            'Math': 'Math',
            'Reading': 'Reading',
            'Writing': 'Writing',
            'Social': 'Social Behavior and Play'
        }
        return area_map.get(area, area)
    return 'Other'

def restructure_data():
    """데이터 재구조화"""
    print("=" * 80)
    print("커리큘럼 데이터 재구조화 시작")
    print("=" * 80)

    # Load data
    with open('data/iep_library.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    related = data.get('related', [])
    print(f"\n📊 총 {len(related)}개 항목")

    # 재구조화
    restructured = []

    for entry in related:
        curr = entry.get('curriculum', 'Unknown')
        text = entry.get('text', '')
        old_code = entry.get('code', '')

        new_entry = {
            'code': old_code,
            'curriculum': curr,
            'text': text,
            'similarity': entry.get('similarity'),
            'lifeId': entry.get('lifeId')
        }

        if curr == 'PBIS':
            # PBIS 재구조화
            area = extract_pbis_area(text)
            new_code, new_text = restructure_pbis_code(text)

            new_entry['area'] = area
            if new_code:
                new_entry['code'] = new_code
            new_entry['text'] = new_text

            print(f"✏️  PBIS: {area} - {new_code} - {new_text[:60]}...")

        elif curr == '교육과정':
            # 교육과정 과목명 추출
            subject = extract_curriculum_subject(text)
            new_entry['area'] = subject
            # 코드는 텍스트에서 추출한 것 그대로 사용
            code_match = re.match(r'\[([^\]]+)\]', text)
            if code_match:
                new_entry['code'] = code_match.group(1)

        elif curr == 'VB-MAPP':
            # VB-MAPP 영역 추출
            area = extract_vbmapp_area(text)
            new_entry['area'] = area
            # 코드는 텍스트에서 추출한 것 그대로 사용
            code_match = re.match(r'\[([^\]]+)\]', text)
            if code_match:
                new_entry['code'] = code_match.group(1)

        restructured.append(new_entry)

    # Save
    data['related'] = restructured

    with open('data/iep_library.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # 통계 출력
    print("\n" + "=" * 80)
    print("재구조화 완료!")
    print("=" * 80)

    by_curriculum = {}
    for entry in restructured:
        curr = entry.get('curriculum', 'Unknown')
        if curr not in by_curriculum:
            by_curriculum[curr] = []
        by_curriculum[curr].append(entry)

    for curr_name, entries in sorted(by_curriculum.items()):
        print(f"\n📂 {curr_name}: {len(entries)}개")

        # 영역별 통계
        areas = {}
        for e in entries:
            area = e.get('area', 'Unknown')
            areas[area] = areas.get(area, 0) + 1

        if areas:
            print("   영역:")
            for area, count in sorted(areas.items(), key=lambda x: -x[1])[:10]:
                print(f"     - {area}: {count}개")

if __name__ == "__main__":
    restructure_data()
