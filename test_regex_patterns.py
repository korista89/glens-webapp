#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# 테스트 케이스
test_l02 = "급식 전·화장실 사용 후·외부활동 후 '손 씻으세요'라는 말을 들었을 때 학생은 교사의 제스처 촉구를 받아 세면대로 이동하여 비누로 손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는다 첫 단계에 협조적으로 반응한다."

test_l03 = "급식 전·화장실 사용 후·외부활동 후 '손 씻으세요'라는 말을 들었을 때 학생은 교사의 언어적 촉구를 받아 세면대로 이동하여 비누로 손을 문지르고, 흐르는 물에 헹구며, 수건이나 핸드타올로 물기를 닦는다를 순서대로 수행한다."

# L02 패턴 테스트 (새 패턴)
pattern_l02 = r'(다)\s+첫\s*단계에\s*협조적으로\s*반응한다\.?$'
result_l02 = re.sub(pattern_l02, r'\1.', test_l02)
print('L02 패턴 매칭:', '성공' if result_l02 != test_l02 else '실패')
print('원본:', test_l02[-60:])
print('결과:', result_l02[-60:])
print()

# L03 패턴 테스트 (새 패턴)
pattern_l03 = r'(다)를\s+순서대로\s*수행한다\.?$'
result_l03 = re.sub(pattern_l03, r'\1.', test_l03)
print('L03 패턴 매칭:', '성공' if result_l03 != test_l03 else '실패')
print('원본:', test_l03[-60:])
print('결과:', result_l03[-60:])
