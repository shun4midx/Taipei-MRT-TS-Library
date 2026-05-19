/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: path_duration.ts                   *
 ****************************************** */

import * as basic from "./basic";
import * as arrival from "./arrival_times"
import * as transfer from "./transfer";

// ======== DEFINITIONS ======== //

export type Path = basic.Station[];

export type StationTime = {
    arrive: basic.Time;
    depart: basic.Time;
}

export type PathTimes = StationTime[];

export type PathMins = number[];

export const INVALID_DURATION = -114514;

// ======== DATA ======== //

export const LINE_PREFIX_DURATION = new Map<basic.Line, number[]>([
    // Red line
    [basic.Line.R, [
        INVALID_DURATION, INVALID_DURATION,
        0, 2, 4, 6, 8, 9, 13, 15, // R02-09
        17, 18, 20, 21, 23, 26, 28, 30, 31, 33, // R10-19
        35, 37, 39, 41, 44, 45, 48, 51, 54 // R20-28
    ]],

    // Green line
    [basic.Line.G, [
        INVALID_DURATION,
        0, 2, 4, 6, 8, 10, 12, 14, 16, // G01-09
        18, 20, 22, 24, 26, 28, 31, 32, 35, 37 // G10-19
    ]],

    // Blue line
    [basic.Line.BL, [
        INVALID_DURATION,
        0, 3, 6, 8, 11, 13, 14, 17, 18, // BL01-09
        22, 24, 27, 29, 30, 33, 34, 36, 38, 40, // BL10-19
        41, 44, 46, 48 // BL20-23
    ]],

    // Brown line
    [basic.Line.BR, [
        INVALID_DURATION,
        0, 2, 3, 5, 7, 10, 11, 14, 15, // BR01-09
        17, 19, 21, 23, 27, 29, 31, 33, 34, 36, // BR10-19
        37, 40, 42, 43, 45 // BR20-24
    ]],

    // Yellow line
    [basic.Line.Y, [
        INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, // empty 00-06
        0, 3, 5, 7, 9, 12, 15, 16, 19, 21, 25, 28, 30, 33
    ]],

    // Orange line
    [basic.Line.O, [
        INVALID_DURATION,
        0, 2, 4, 6, 10, 14, 17, 19, 21, 23, 25, 26, // Up til O12
        29, 31, 33, 36, 38, 40, 43, 45, 48, // Up til O21
        INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, // empty 22-29
        INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, // empty 30-39
        INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, INVALID_DURATION, // empty 40-49
        29, 32, 33, 35, 38 // O50 to O54
    ]]
]);

// ======== FUNCTIONS ======== //

// One line without transfer
export function getLineDuration(stn1: basic.Station, stn2: basic.Station): number | undefined {
    if (!basic.validStation(stn1)) {
        throw new Error("Invalid station stn1");
    }

    if (!basic.validStation(stn2)) {
        throw new Error("Invalid station stn2");
    }

    if (stn1.line !== stn2.line) {
        throw new Error("Stations stn1 and stn2 must be on the same line");
    }

    if (stn1.line !== basic.Line.O || (stn1.stn_num < 50 && stn2.stn_num < 50)) { // Same branch
        return Math.abs(LINE_PREFIX_DURATION.get(stn2.line)![stn2.stn_num]! - LINE_PREFIX_DURATION.get(stn1.line)![stn1.stn_num]!);
    } else { // Consider O line branching
        if (stn1.stn_num < stn2.stn_num) {
            if ((stn2.stn_num >= 50 && stn1.stn_num <= 12) || (stn1.stn_num >= 50 && stn2.stn_num >= 50)) { // Same branch
                return LINE_PREFIX_DURATION.get(basic.Line.O)![stn2.stn_num]! - LINE_PREFIX_DURATION.get(basic.Line.O)![stn1.stn_num]!;
            } else { // Needs to account for wait time so we can't rly calculate
                throw new Error("Although on the same line, it can't be done by being on the same branch, i.e. we need wait time between trains, so this is an invalid input.");
            }
        } else {
            return getLineDuration(stn2, stn1); // DRY
        }
    }
}

// Arrival times without counting wait times at every station in the path along the way
export function perfectPathETA(stn_path: Path): PathMins {
    // Invalid input
    if (stn_path.length < 2) {
        throw new Error("stn_path must at least have 2 stations");
    }

    // Normal code
    if (!basic.validStation(stn_path[0]!)) {
        throw new Error("Invalid station stn_path[0]");
    }

    const pm: PathMins = [0];

    for (let i = 0; i < stn_path.length - 1; ++i) { // Consider i and i + 1
        if (!basic.validStation(stn_path[i + 1]!)) {
            throw new Error(`Invalid station stn_path [${i + 1}]`);
        }

        if (stn_path[i]!.line === stn_path[i + 1]!.line) { // Take a train
            try {
                pm.push(pm[pm.length - 1]! + getLineDuration(stn_path[i]!, stn_path[i + 1]!)!);
            } catch (e) {
                throw new Error(`No valid path from stn_path[${i}] to stn_path[${i + 1}]`);
            }
        } else { // Check if it's a transfer
            if (transfer.canTransfer(stn_path[i]!, stn_path[i + 1]!)) {
                pm.push(pm[pm.length - 1]! + transfer.getTransferTime(stn_path[i]!, stn_path[i + 1]!));
            } else {
                throw new Error(`No valid path from stn_path[${i}] to stn_path[${i + 1}]`);
            }
        }
    }

    return pm;
}

// Path including transfers, but assuming 0 wait time at all steps along the way (Same station but on different lines count as different points on the path for simplicity)
export function perfectPathDuration(stn_path: Path): number {
    let path = perfectPathETA(stn_path);

    return path[path.length - 1]!;
}

// Actual path ETA including train waiting time, returns {} if impossible. Every element should be when the user would arrive at that station corr to stn_path, not when the upcoming train arrives.
export function pathETA(stn_path: Path, curr_time: basic.Time, day_type: number): PathTimes {
    // Invalid input
    if (stn_path.length < 2) {
        throw new Error("stn_path must have at least 2 stations");
    }

    if (day_type <= 0 || day_type > 7) {
        throw new Error(`Invalid day_type: ${day_type}`);
    }

    // Remember to check invalid time
    if (curr_time.hr < 0 || curr_time.min < 0) {
        throw new Error("Invalid time curr_time");
    }

    // Normal code
    if (!basic.validStation(stn_path[0]!)) {
        throw new Error("Invalid station stn_path[0]");
    }

    const arrival_times: PathTimes = [];

    // Push first time
    let temp: StationTime = { arrive: curr_time, depart: basic.INVALID_TIME };

    // Iterate for all remaining times
    for (let i = 0; i < stn_path.length - 1; ++i) { // Consider i and i + 1
        if (!basic.validStation(stn_path[i + 1]!)) {
            throw new Error(`Invalid station stn_path[${i + 1}]`);
        }

        if (stn_path[i]!.line === stn_path[i + 1]!.line) { // Take a train
            try {
                // Calculate train arrival time and then calculate the time it'll take that train to reach i + 1
                // Fill "departure time"
                temp.depart = arrival.nextTrainTime(stn_path[i]!, day_type, temp.arrive, stn_path[i + 1]!);

                arrival_times.push({ ...temp});

                // Next temp
                temp.arrive = basic.minsAfter(temp.depart, getLineDuration(stn_path[i]!, stn_path[i + 1]!)!);
            } catch (e) {
                throw new Error(`No valid path from stn_path[${i}] to stn_path[${i + 1}]`);
            }
        } else { // Check if it's a transfer
            if (transfer.canTransfer(stn_path[i]!, stn_path[i + 1]!)) {
                // Fill "departure time"
                temp.depart = temp.arrive;

                arrival_times.push({ ...temp});

                // Next temp
                temp.arrive = basic.minsAfter(temp.depart, transfer.getTransferTime(stn_path[i]!, stn_path[i + 1]!));
            } else {
                throw new Error(`No valid path from stn_path[${i}] to stn_path[${i + 1}]`);
            }
        }
    }

    temp.depart = temp.arrive;

    arrival_times.push({ ...temp});

    return arrival_times;
}