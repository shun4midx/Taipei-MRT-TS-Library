############################################
# Copyright (c) 2026 Shun/修海 (@shun4midx) #
# Project: Taipei-MRT-TS-Library           #
# File Type: Python file                   #
# File: parse_non_y_arrival_times.py       #
############################################

import csv
import json
import os
from collections import defaultdict

def extract_time(dep):
    dep = dep.strip("{}")
    return dep.split(",")[3]

def to_mins(hhmm):
    h, m = map(int, hhmm.split(":"))
    minute = h * 60 + m
    day_offset = 1 if h < 3 else 0
    return minute + day_offset * 60 * 24

def parse_raw_csv(path):
    buckets = defaultdict(list)

    with open(path, encoding="cp950", newline="") as f:
        reader = csv.DictReader(f)

        for row in reader:
            dir_str = row["Direction"].strip()
            if dir_str == "":
                continue

            dep = row["DepartureTimes"].strip()
            if not dep or dep == "{}":
                continue

            station = row["StationID"]

            buckets[station].append({
                "destination": row["DestinationStaionID"],
                "direction": int(row["Direction"]),
                "time": to_mins(extract_time(row["DepartureTimes"])),
            })

    return buckets

def add_station_schedules(data, suffix, buckets):
    for station, trains in buckets.items():
        key = f"{station}_{suffix}"

        data[key] = sorted(
            trains,
            key=lambda x: x["time"],
        )

def generate_non_y_json(raw_base="raw"):
    data = {}

    for line in os.listdir(raw_base):
        line_dir = os.path.join(raw_base, line)

        if not os.path.isdir(line_dir):
            continue

        if line == "Y":
            continue

        for filename in os.listdir(line_dir):
            if not filename.endswith(".csv"):
                continue

            suffix = filename.replace(".csv", "")
            path = os.path.join(line_dir, filename)

            buckets = parse_raw_csv(path)
            add_station_schedules(data, suffix, buckets)

    return data

if __name__ == "__main__":
    data = generate_non_y_json("raw")

    os.makedirs("generated", exist_ok=True)

    with open("generated/arrivalTimes.nonY.json", "w", encoding="utf8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)