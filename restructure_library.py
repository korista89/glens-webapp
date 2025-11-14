#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
목표 라이브러리 재구조화 스크립트
- LifeSkills, EFL, PBIS, VB-MAPP, 교육과정 데이터 재구조화
- 코드 형식 변경 및 영역 추출
- 목표 문장에서 대괄호 코드 부분 제거
"""

import json
import re

def process_lifeskills(lifeskills):
    """LifeSkills 데이터 처리"""
    result = []
    for item in lifeskills:
        code = item.get('code', '')
        domain = item.get('domain', '')
        goal = item.get('goal', '')

        # 코드에 대괄호 추가
        if not code.startswith('['):
            code = f'[{code}]'

        result.append({
            'curriculum': 'LifeSkills',
            'area': domain,
            'code': code,
            'text': goal,  # 목표 문장 그대로
            'originalData': item
        })

    return result

def extract_efl_domain(text, all_entries, current_index):
    """EFL에서 Domain 정보 추출 - 이전 항목들에서 찾기"""
    # 현재 항목부터 역순으로 검색하여 가장 가까운 Domain 찾기
    for i in range(current_index, -1, -1):
        entry_text = all_entries[i].get('text', '')
        domain_match = re.search(r'(Domain\s+\d+:\s+[^\n]+)', entry_text)
        if domain_match:
            return domain_match.group(1).strip()
    return 'EFL'

def process_efl(related):
    """EFL 데이터 처리"""
    result = []
    efl_entries = [e for e in related if e.get('curriculum') == 'EFL']

    for idx, entry in enumerate(efl_entries):
        text = entry.get('text', '')

        # R11. 패턴 찾기 (알파벳 1-3글자 + 숫자)
        pattern_match = re.search(r'\b([A-Z]{1,3})(\d+)\.\s+(.+)', text)

        if pattern_match:
            letter = pattern_match.group(1)
            number = pattern_match.group(2)
            goal_text = pattern_match.group(3).strip()

            # Domain 정보 추출 (이전 항목들에서)
            domain = extract_efl_domain(text, efl_entries, idx)

            # 코드 생성: [E-R-11]
            code = f'[E-{letter}-{number}]'

            result.append({
                'curriculum': 'EFL',
                'area': domain,
                'code': code,
                'text': goal_text,  # 대괄호 부분 제거된 목표 문장
                'originalData': entry
            })

    return result

def process_pbis(related):
    """PBIS 데이터 처리"""
    result = []
    pbis_entries = [e for e in related if e.get('curriculum') == 'PBIS']

    for entry in pbis_entries:
        text = entry.get('text', '')

        # 패턴 1: [화장실-안전1-1] (구체적 단계)
        pattern_step = re.match(r'\[([^-\]]+)-([^-\]]+)-(\d+)\](.+)', text)
        if pattern_step:
            area = pattern_step.group(1).strip()
            behavior = pattern_step.group(2).strip()
            step = pattern_step.group(3).strip()
            goal = pattern_step.group(4).strip()

            code = f'[P-{area}-{behavior}-{step}]'

            result.append({
                'curriculum': 'PBIS',
                'area': area,
                'code': code,
                'text': goal,  # 대괄호 부분 제거된 목표 문장
                'originalData': entry
            })
            continue

        # 패턴 2: [화장실-안전1] (일반 목표)
        pattern_general = re.match(r'\[([^-\]]+)-([^-\]]+)\](.+)', text)
        if pattern_general:
            area = pattern_general.group(1).strip()
            behavior = pattern_general.group(2).strip()
            goal = pattern_general.group(3).strip()

            code = f'[P-{area}-{behavior}]'

            result.append({
                'curriculum': 'PBIS',
                'area': area,
                'code': code,
                'text': goal,  # 대괄호 부분 제거된 목표 문장
                'originalData': entry
            })

    return result

def process_vbmapp(related):
    """VB-MAPP 데이터 처리"""
    result = []
    vb_entries = [e for e in related if e.get('curriculum') == 'VB-MAPP']

    for entry in vb_entries:
        text = entry.get('text', '')

        # [Mand-L3-M12] 패턴 찾기
        code_match = re.match(r'\[([^\]]+)\](.+)', text)
        if code_match:
            orig_code = code_match.group(1).strip()
            goal = code_match.group(2).strip()

            # 영역 추출 (첫 번째 - 앞부분)
            area = orig_code.split('-')[0] if '-' in orig_code else orig_code

            # 코드 생성: [V-Mand-L3-M12]
            code = f'[V-{orig_code}]'

            result.append({
                'curriculum': 'VB-MAPP',
                'area': area,
                'code': code,
                'text': goal,  # 대괄호 부분 제거된 목표 문장
                'originalData': entry
            })

    return result

def process_curriculum(related):
    """교육과정 데이터 처리"""
    result = []
    edu_entries = [e for e in related if e.get('curriculum') == '교육과정']

    for entry in edu_entries:
        text = entry.get('text', '')

        # [9보건01-02] 패턴 찾기
        code_match = re.match(r'\[([^\]]+)\](.+)', text)
        if code_match:
            orig_code = code_match.group(1).strip()
            goal = code_match.group(2).strip()

            # 과목명 추출 (숫자 뒤 한글 부분)
            subject_match = re.search(r'\d+([가-힣]+)\d+', orig_code)
            area = subject_match.group(1) if subject_match else '기타'

            # 코드는 그대로 유지
            code = f'[{orig_code}]'

            result.append({
                'curriculum': '교육과정',
                'area': area,
                'code': code,
                'text': goal,  # 대괄호 부분 제거된 목표 문장
                'originalData': entry
            })

    return result

def remove_duplicates(entries):
    """100% 동일한 목표 문장 중복 제거"""
    seen = {}
    result = []
    duplicates = 0

    for entry in entries:
        text = entry.get('text', '').strip()
        curriculum = entry.get('curriculum', '')

        # 커리큘럼별로 중복 체크
        key = f"{curriculum}:::{text}"

        if key not in seen:
            seen[key] = True
            result.append(entry)
        else:
            duplicates += 1

    print(f"   중복 제거: {duplicates}개")
    return result

def restructure_library():
    """라이브러리 재구조화 메인 함수"""
    print("=" * 80)
    print("목표 라이브러리 재구조화 시작")
    print("=" * 80)

    # Load data
    with open('data/iep_library.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    lifeskills = data.get('lifeskills', [])
    related = data.get('related', [])

    print(f"\n📊 원본 데이터:")
    print(f"   LifeSkills: {len(lifeskills)}개")
    print(f"   Related: {len(related)}개")

    # 각 커리큘럼별 처리
    print("\n" + "=" * 80)
    print("커리큘럼별 데이터 재구조화")
    print("=" * 80)

    all_entries = []

    # 1. LifeSkills
    print("\n1. LifeSkills 처리 중...")
    ls_result = process_lifeskills(lifeskills)
    all_entries.extend(ls_result)
    print(f"   ✅ {len(ls_result)}개 항목 처리 완료")

    # 2. EFL
    print("\n2. EFL 처리 중...")
    efl_result = process_efl(related)
    all_entries.extend(efl_result)
    print(f"   ✅ {len(efl_result)}개 항목 처리 완료")

    # 3. PBIS
    print("\n3. PBIS 처리 중...")
    pbis_result = process_pbis(related)
    all_entries.extend(pbis_result)
    print(f"   ✅ {len(pbis_result)}개 항목 처리 완료")

    # 4. VB-MAPP
    print("\n4. VB-MAPP 처리 중...")
    vb_result = process_vbmapp(related)
    all_entries.extend(vb_result)
    print(f"   ✅ {len(vb_result)}개 항목 처리 완료")

    # 5. 교육과정
    print("\n5. 교육과정 처리 중...")
    edu_result = process_curriculum(related)
    all_entries.extend(edu_result)
    print(f"   ✅ {len(edu_result)}개 항목 처리 완료")

    # 중복 제거
    print("\n" + "=" * 80)
    print("중복 데이터 제거 (100% 일치)")
    print("=" * 80)
    all_entries = remove_duplicates(all_entries)

    # 저장
    output = {
        'generated_at': data.get('generated_at'),
        'lifeskills': lifeskills,  # 원본 유지
        'related': all_entries
    }

    with open('data/iep_library.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # 통계 출력
    print("\n" + "=" * 80)
    print("재구조화 완료!")
    print("=" * 80)

    by_curriculum = {}
    for entry in all_entries:
        curr = entry.get('curriculum', 'Unknown')
        if curr not in by_curriculum:
            by_curriculum[curr] = []
        by_curriculum[curr].append(entry)

    print(f"\n📊 최종 데이터: {len(all_entries)}개")
    for curr_name, entries in sorted(by_curriculum.items()):
        print(f"\n📂 {curr_name}: {len(entries)}개")

        # 영역별 통계
        areas = {}
        for e in entries:
            area = e.get('area', 'Unknown')
            areas[area] = areas.get(area, 0) + 1

        if areas:
            print("   영역:")
            for area, count in sorted(areas.items(), key=lambda x: -x[1])[:5]:
                print(f"     - {area}: {count}개")

    # 샘플 출력
    print("\n" + "=" * 80)
    print("샘플 데이터 (각 커리큘럼 첫 항목)")
    print("=" * 80)
    for curr_name in sorted(by_curriculum.keys()):
        entries = by_curriculum[curr_name]
        if entries:
            e = entries[0]
            print(f"\n{curr_name}:")
            print(f"  영역: {e.get('area')}")
            print(f"  코드: {e.get('code')}")
            print(f"  목표 문장: {e.get('text')[:80]}...")

if __name__ == "__main__":
    restructure_library()
