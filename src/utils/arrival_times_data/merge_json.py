############################################
# Copyright (c) 2026 Shun/修海 (@shun4midx) #
# Project: Taipei-MRT-TS-Library           #
# File Type: Python file                   #
# File: merge_json.py                      #
############################################

import json
import os

INPUTS = [
    "generated/arrivalTimes.nonY.json",
    "generated/arrivalTimes.Y.json",
]

OUTPUT = "generated/arrivalTimes.json"

combined = {}

for path in INPUTS:
    with open(path, "r", encoding="utf8") as f:
        data = json.load(f)

    overlap = set(combined) & set(data)
    if overlap:
        raise ValueError(f"Duplicate keys found: {sorted(overlap)[:10]}")

    combined.update(data)

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

with open(OUTPUT, "w", encoding="utf8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print(f"Wrote {len(combined)} schedules to {OUTPUT}")