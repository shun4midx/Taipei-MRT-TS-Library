############################################
# Copyright (c) 2026 Shun/修海 (@shun4midx) #
# Project: Taipei-MRT-TS-Library           #
# File Type: Python file                   #
# File: parse_y_arrival_times.py           #
############################################

import os
import json
import re

RAW_Y_DIR = "raw/Y"

DIR_MAP = {
    "Y-1": 0,  # increasing station number
    "Y-2": 1,  # decreasing station number
}

DEST_MAP = {
    "Y-1": "Y20",
    "Y-2": "Y07",
}

def hhmm_to_abs_minutes(hhmm: str) -> int:
    h, m = map(int, hhmm.split(":"))
    return h * 60 + m

def parse_y_txt(path: str):
    trips = []
    current_route = None

    with open(path, "r", encoding="utf8") as f:
        for raw in f:
            line = raw.strip()
            if not line:
                continue

            if line in DIR_MAP:
                current_route = line
                continue

            if current_route is None:
                continue

            parts = [p.strip() for p in line.split(",") if p.strip()]
            if not parts:
                continue

            if not re.fullmatch(r"\d{2}:\d{2}", parts[0]):
                continue

            base_hhmm = parts[0]
            base_hour = int(base_hhmm[:2])
            direction = DIR_MAP[current_route]
            destination = DEST_MAP[current_route]

            trips.append({
                "destination": destination,
                "direction": direction,
                "time": hhmm_to_abs_minutes(base_hhmm),
            })

            for mm in parts[1:]:
                if not mm.isdigit():
                    continue

                trips.append({
                    "destination": destination,
                    "direction": direction,
                    "time": base_hour * 60 + int(mm),
                })

    return sorted(trips, key=lambda x: x["time"])

def generate_y_json(raw_y_dir=RAW_Y_DIR):
    data = {}

    for fn in os.listdir(raw_y_dir):
        if not fn.endswith(".txt"):
            continue

        m = re.fullmatch(r"(Y\d{2})_(\d+)\.txt", fn)
        if not m:
            continue

        station, suffix = m.group(1), m.group(2)
        key = f"{station}_{suffix}"

        path = os.path.join(raw_y_dir, fn)
        data[key] = parse_y_txt(path)

    return data

if __name__ == "__main__":
    data = generate_y_json()

    os.makedirs("generated", exist_ok=True)

    with open("generated/arrivalTimes.Y.json", "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)