#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lifeskills.json의 iep_goal과 procedure를 iep_library.json에 동기화
"""

import json

# Load lifeskills.json
with open('data/lifeskills.json', 'r', encoding='utf-8') as f:
    lifeskills_data = json.load(f)

# Load iep_library.json
with open('data/iep_library.json', 'r', encoding='utf-8') as f:
    iep_library = json.load(f)

# Create a mapping of itemId -> item data
item_map = {}
for domain in lifeskills_data['domains']:
    for item in domain['items']:
        item_map[item['id']] = {
            'iep_goal': item.get('iep_goal', ''),
            'procedure': item.get('procedure', ''),
            'sd': item.get('sd', ''),
            'behavior': item.get('behavior', '')
        }

# Update iep_library lifeskills goals
updated_count = 0
for entry in iep_library['lifeskills']:
    item_id = entry.get('itemId', '')
    if item_id in item_map:
        # Update goal to use the iep_goal from lifeskills.json
        entry['goal'] = item_map[item_id]['iep_goal']

        # Update procedure - keep the format but update content
        entry['procedure'] = item_map[item_id]['procedure']

        updated_count += 1

# Save updated iep_library.json
with open('data/iep_library.json', 'w', encoding='utf-8') as f:
    json.dump(iep_library, f, ensure_ascii=False, indent=2)

print(f"✅ iep_library.json 업데이트 완료!")
print(f"   업데이트된 항목 수: {updated_count}")
