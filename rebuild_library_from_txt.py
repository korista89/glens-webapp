#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
목표 라이브러리 완전 재구축 스크립트
원본 TXT 파일들의 모든 내용을 생략, 왜곡, 변형, 요약 없이 그대로 반영
"""

import json
import re

def load_efl_goals(filepath):
    """EFL 목표문장.txt 파일 읽기 및 파싱"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    goals = []
    current_domain = None
    current_domain_full = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Domain 정보 추출
        domain_match = re.match(r'(Domain\s+\d+:\s+.+)', line)
        if domain_match:
            current_domain_full = domain_match.group(1)
            # Domain 번호 추출
            domain_num_match = re.search(r'Domain\s+(\d+)', current_domain_full)
            current_domain = domain_num_match.group(1) if domain_num_match else None
            continue

        # 목표 문장 추출: R1., LR5., AQ3. 등의 패턴
        goal_match = re.match(r'([A-Z]{1,3})(\d+)\.\s+(.+)', line)
        if goal_match and current_domain_full and current_domain:
            letter = goal_match.group(1)
            number = goal_match.group(2)
            goal_text = goal_match.group(3).strip()

            # Domain 번호를 포함하여 코드 생성 (Domain 10과 13이 모두 CP를 사용하므로)
            code = f'[E-D{current_domain}-{letter}-{number}]'

            goals.append({
                'curriculum': 'EFL',
                'area': current_domain_full,
                'code': code,
                'text': goal_text
            })

    return goals

def load_curriculum_goals(filepath):
    """교육과정 목표문장.txt 파일 읽기 및 파싱"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    goals = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # [2바생01-01] 형식 찾기
        match = re.match(r'\[([^\]]+)\]\s+(.+)', line)
        if match:
            code_str = match.group(1).strip()
            goal_text = match.group(2).strip()

            # 과목명 추출
            subject_match = re.search(r'\d+([가-힣]+)\d+', code_str)
            area = subject_match.group(1) if subject_match else '기타'

            code = f'[{code_str}]'

            goals.append({
                'curriculum': '교육과정',
                'area': area,
                'code': code,
                'text': goal_text
            })

    return goals

def load_vbmapp_goals(filepath):
    """VB-MAPP 목표문장.txt 파일 읽기 및 파싱"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    goals = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # [Mand-L3-M12] 형식 찾기
        match = re.match(r'\[([^\]]+)\]\s+(.+)', line)
        if match:
            code_str = match.group(1).strip()
            goal_text = match.group(2).strip()

            # 영역 추출 (첫 번째 - 앞부분)
            area = code_str.split('-')[0] if '-' in code_str else code_str

            code = f'[V-{code_str}]'

            goals.append({
                'curriculum': 'VB-MAPP',
                'area': area,
                'code': code,
                'text': goal_text
            })

    return goals

def load_pbis_from_backup(backup_filepath):
    """백업 파일에서 PBIS 데이터 추출"""
    with open(backup_filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    related = data.get('related', [])
    pbis_entries = [e for e in related if e.get('curriculum') == 'PBIS']

    goals = []

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

            goals.append({
                'curriculum': 'PBIS',
                'area': area,
                'code': code,
                'text': goal
            })
            continue

        # 패턴 2: [화장실-안전1] (일반 목표)
        pattern_general = re.match(r'\[([^-\]]+)-([^-\]]+)\](.+)', text)
        if pattern_general:
            area = pattern_general.group(1).strip()
            behavior = pattern_general.group(2).strip()
            goal = pattern_general.group(3).strip()

            code = f'[P-{area}-{behavior}]'

            goals.append({
                'curriculum': 'PBIS',
                'area': area,
                'code': code,
                'text': goal
            })

    return goals

def load_lifeskills_from_backup(backup_filepath):
    """백업 파일에서 LifeSkills 데이터 추출"""
    with open(backup_filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    lifeskills = data.get('lifeskills', [])

    goals = []

    for item in lifeskills:
        code = item.get('code', '')
        domain = item.get('domain', '')
        goal = item.get('goal', '')

        # 코드에 대괄호 추가
        if not code.startswith('['):
            code = f'[{code}]'

        goals.append({
            'curriculum': 'LifeSkills',
            'area': domain,
            'code': code,
            'text': goal,
            'originalData': item
        })

    return goals

def remove_exact_duplicates(entries):
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

def rebuild_library():
    """라이브러리 완전 재구축"""
    print("=" * 80)
    print("목표 라이브러리 완전 재구축 시작")
    print("=" * 80)

    all_entries = []

    # 1. LifeSkills (백업에서)
    print("\n1. LifeSkills 로드 중...")
    lifeskills_goals = load_lifeskills_from_backup('data/iep_library.json.backup')
    all_entries.extend(lifeskills_goals)
    print(f"   ✅ {len(lifeskills_goals)}개 항목 로드")

    # 2. EFL (TXT 파일에서)
    print("\n2. EFL 로드 중...")
    efl_goals = load_efl_goals('data/EFL 목표문장.txt')
    all_entries.extend(efl_goals)
    print(f"   ✅ {len(efl_goals)}개 항목 로드")

    # 3. 교육과정 (TXT 파일에서)
    print("\n3. 교육과정 로드 중...")
    curriculum_goals = load_curriculum_goals('data/교육과정 목표문장.txt')
    all_entries.extend(curriculum_goals)
    print(f"   ✅ {len(curriculum_goals)}개 항목 로드")

    # 4. VB-MAPP (TXT 파일에서)
    print("\n4. VB-MAPP 로드 중...")
    vbmapp_goals = load_vbmapp_goals('data/vb-mapp 목표문장.txt')
    all_entries.extend(vbmapp_goals)
    print(f"   ✅ {len(vbmapp_goals)}개 항목 로드")

    # 5. PBIS (백업에서)
    print("\n5. PBIS 로드 중...")
    pbis_goals = load_pbis_from_backup('data/iep_library.json.backup')
    all_entries.extend(pbis_goals)
    print(f"   ✅ {len(pbis_goals)}개 항목 로드")

    # 중복 제거
    print("\n" + "=" * 80)
    print("중복 데이터 제거 (100% 일치)")
    print("=" * 80)
    all_entries = remove_exact_duplicates(all_entries)

    # 백업에서 원본 lifeskills와 generated_at 가져오기
    with open('data/iep_library.json.backup', 'r', encoding='utf-8') as f:
        backup_data = json.load(f)

    # 저장
    output = {
        'generated_at': backup_data.get('generated_at'),
        'lifeskills': backup_data.get('lifeskills', []),
        'related': all_entries
    }

    with open('data/iep_library.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # 통계 출력
    print("\n" + "=" * 80)
    print("재구축 완료!")
    print("=" * 80)

    by_curriculum = {}
    for entry in all_entries:
        curr = entry.get('curriculum', 'Unknown')
        if curr not in by_curriculum:
            by_curriculum[curr] = []
        by_curriculum[curr].append(entry)

    print(f"\n📊 최종 데이터: {len(all_entries)}개")
    for curr_name in sorted(by_curriculum.keys()):
        entries = by_curriculum[curr_name]
        print(f"\n📂 {curr_name}: {len(entries)}개")

        # 영역별 통계
        areas = {}
        for e in entries:
            area = e.get('area', 'Unknown')
            areas[area] = areas.get(area, 0) + 1

        if areas:
            print("   영역 (상위 5개):")
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
    rebuild_library()
