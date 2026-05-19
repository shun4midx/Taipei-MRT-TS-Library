/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: arrival_times.ts                   *
 ****************************************** */

import arrivalTimesData from "./arrival_times_data/generated/arrivalTimes.json";
import * as basic from "./basic";

// ======== DEFINITIONS ======== //
type JsonTrain = {
    destination: string;
    time: number;
    direction: 0 | 1;
};

export type Train = {
    arrive: basic.Station; // station it will arrive
    time: number; // minutes since midnight (can exceed 1440)
    direction: 0 | 1; // 0 (incr) / 1 (decr)
    train_dest: basic.Station; // final station
};

const ARRIVAL_TIMES = arrivalTimesData as Record<string, JsonTrain[]>;

// Make the following 1-idxed

// {increasing dir/nangang exhib center, decreaisng dir/taipei zoo}

export const BR_FIRST_TRAINS: basic.Time[][] = [
    [basic.INVALID_TIME, basic.INVALID_TIME],
    [{ hr: 6, min: 0 }, basic.INVALID_TIME], // BR01
    [{ hr: 6, min: 1 }, { hr: 6, min: 4 }], // BR02
    [{ hr: 6, min: 2 }, { hr: 6, min: 3 }], // BR03
    [{ hr: 6, min: 4 }, { hr: 6, min: 1 }], // BR04
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR05
    [{ hr: 6, min: 1 }, { hr: 6, min: 3 }], // BR06
    [{ hr: 6, min: 3 }, { hr: 6, min: 1 }], // BR07
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR08
    [{ hr: 6, min: 1 }, { hr: 6, min: 5 }], // BR09
    [{ hr: 6, min: 3 }, { hr: 6, min: 3 }], // BR10
    [{ hr: 6, min: 5 }, { hr: 6, min: 1 }], // BR11
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR12
    [{ hr: 6, min: 2 }, { hr: 6, min: 2 }], // BR13
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR14
    [{ hr: 6, min: 1 }, { hr: 6, min: 3 }], // BR15
    [{ hr: 6, min: 3 }, { hr: 6, min: 1 }], // BR16
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR17
    [{ hr: 6, min: 1 }, { hr: 6, min: 5 }], // BR18
    [{ hr: 6, min: 2 }, { hr: 6, min: 3 }], // BR19
    [{ hr: 6, min: 4 }, { hr: 6, min: 1 }], // BR20
    [{ hr: 6, min: 0 }, { hr: 6, min: 0 }], // BR21
    [{ hr: 6, min: 1 }, { hr: 6, min: 3 }], // BR22
    [{ hr: 6, min: 3 }, { hr: 6, min: 1 }], // BR23
    [basic.INVALID_TIME, { hr: 6, min: 0 }] // BR24
];

export const BR_LAST_TRAINS: basic.Time[][] = [
    [basic.INVALID_TIME, basic.INVALID_TIME],
    [{ hr: 24, min: 0 }, basic.INVALID_TIME], // BR01
    [{ hr: 24, min: 1 }, { hr: 24, min: 53 }], // BR02
    [{ hr: 24, min: 2 }, { hr: 24, min: 52 }], // BR03
    [{ hr: 24, min: 5 }, { hr: 24, min: 49 }], // BR04
    [{ hr: 24, min: 7 }, { hr: 24, min: 47 }], // BR05
    [{ hr: 24, min: 10 }, { hr: 24, min: 44 }], // BR06
    [{ hr: 24, min: 12 }, { hr: 24, min: 42 }], // BR07
    [{ hr: 24, min: 15 }, { hr: 24, min: 39 }], // BR08
    [{ hr: 24, min: 33 }, { hr: 24, min: 37 }], // BR09
    [{ hr: 24, min: 35 }, { hr: 24, min: 35 }], // BR10
    [{ hr: 24, min: 38 }, { hr: 24, min: 32 }], // BR11
    [{ hr: 24, min: 40 }, { hr: 24, min: 30 }], // BR12
    [{ hr: 24, min: 43 }, { hr: 24, min: 27 }], // BR13
    [{ hr: 24, min: 46 }, { hr: 24, min: 23 }], // BR14
    [{ hr: 24, min: 49 }, { hr: 24, min: 20 }], // BR15
    [{ hr: 24, min: 52 }, { hr: 24, min: 18 }], // BR16
    [{ hr: 24, min: 54 }, { hr: 24, min: 15 }], // BR17
    [{ hr: 24, min: 56 }, { hr: 24, min: 13 }], // BR18
    [{ hr: 24, min: 58 }, { hr: 24, min: 11 }], // BR19
    [{ hr: 25, min: 0 }, { hr: 24, min: 9 }], // BR20
    [{ hr: 25, min: 3 }, { hr: 24, min: 5 }], // BR21
    [{ hr: 25, min: 5 }, { hr: 24, min: 3 }], // BR22
    [{ hr: 25, min: 7 }, { hr: 24, min: 1 }], // BR23
    [basic.INVALID_TIME, { hr: 24, min: 0 }] // BR24
];

// ======== LOADING ======== //

function scheduleKey(stn: basic.Station, day_type: number): string {
    return `${basic.stationToCode(stn)}_${dayGroup(stn.line, day_type)}`;
}

export function dayGroup(line: basic.Line, day_type: number): string {
    if (day_type <= 0 || day_type > 7) {
        throw new Error(`Invalid day_type: ${day_type}`);
    } else {
        if (day_type <= 5) {
            return "12345";
        } else if (line === basic.Line.R) { // Only R has 6 and 7 separately
            return `${day_type}`;
        } else {
            return "67";
        }
    }
}

// Reads arrival times
// Rmb to have exception for BR line
export function loadStationSchedule(stn: basic.Station,day_type: number): Train[] { // day_type: 1-7, 7: holiday, others are which day of the week
    // Detect wrong inputs
    if (day_type <= 0 || day_type > 7) {
        throw new Error(`Invalid day type: ${day_type}`);
    }

    if (!basic.validStation(stn)) {
        throw new Error("Invalid station");
    }

    if (stn.line === basic.Line.BR) {
        throw new Error("BR line stations don't have station schedules provided, we only have a rough estimate of how many minutes are between trains.");
    }

    // Find correct entry
    const json_schedule = ARRIVAL_TIMES[scheduleKey(stn, day_type)] ?? [];
    const train_schedule: Train[] = [];

    for (const t of json_schedule) {
        try {
            train_schedule.push({
                arrive: stn,
                time: t.time,
                direction: t.direction,
                train_dest: basic.codeToStation(t.destination),
            });
        } catch {
            // Don't do anything
        }
    }

    return train_schedule;
}

export function printTrainSchedule(train_schedule: Train[]): void {
    for (const t of train_schedule) {
        console.log(
            `${basic.stationToCode(t.arrive)} ${t.time} ${t.direction} ${basic.stationToCode(t.train_dest)}`
        );
    }
}

// ======== QUERY ======== //
export function oneTrainReachDest(stn: basic.Station, dest: basic.Station, train: Train): boolean {
    // Detect exceptions
    if (!basic.validStation(stn)) {
        throw new Error("Invalid station stn");
    }

    if (!basic.validStation(dest)) {
        throw new Error("Invalid station dest");
    }

    if (basic.sameStation(stn, dest)) {
        throw new Error("stn and dest are the same station");
    }

    // Code
    if (stn.line !== dest.line) { // Need transfer
        return false;
    }

    if (stn.line !== basic.Line.O) { // Orange line is diff
        if (stn.stn_num < dest.stn_num && stn.stn_num < train.train_dest.stn_num) { // Increasing
            return dest.stn_num <= train.train_dest.stn_num;
        } else if (stn.stn_num > dest.stn_num && stn.stn_num > train.train_dest.stn_num) { // Decreasing
            return dest.stn_num >= train.train_dest.stn_num;
        } else { // Wrong dir
            return false;
        }
    } else {
        // Rule out wrong direction stuff
        if ((stn.stn_num > dest.stn_num && stn.stn_num <= train.train_dest.stn_num) || (stn.stn_num < dest.stn_num && stn.stn_num >= train.train_dest.stn_num)) {
            return false;
        }

        if (stn.stn_num > dest.stn_num) { // Decreasing branch (definitely fine since the train is a valid train)
            return dest.stn_num >= train.train_dest.stn_num;
        } else { // Increasing branch
            // O12 is the last station that overlaps both branches
            if (dest.stn_num <= 12) {
                return dest.stn_num <= train.train_dest.stn_num;
            } else if (dest.stn_num <= train.train_dest.stn_num) { // Check the correct branch given that its number is plausibly reachable
                if (dest.stn_num < 50) { // dest in O01 branch
                    return train.train_dest.stn_num < 50;
                } else { // dest in O50 branch
                    return train.train_dest.stn_num >= 50;
                }
            } else { // Impossible
                return false;
            }
        }
    }
}

// Returns next arrival time in minutes, or {-1, -1} if none
export function nextTrainTime(stn: basic.Station, day_type: number, curr_time_or_mins: basic.Time | number, dest: basic.Station): basic.Time {
    const now_mins = typeof curr_time_or_mins === "number" ? curr_time_or_mins : basic.timeToMins(curr_time_or_mins);

    if (!basic.validStation(stn)) {
        throw new Error("Invalid station stn");
    }

    if (!basic.validStation(dest)) {
        throw new Error("Invalid station dest");
    }

    // Brown line: Can give worst case approximations based on timeframe
    if (stn.line === basic.Line.BR && dest.line === basic.Line.BR) {
        /*
        平常日（週一至週五）
        (1) 尖峰時段（07:00～09:00，17:00～19:30）：約2～4分鐘。
        (2) 離峰時段：約4～10分鐘。
        (3) 23:00以後：約12分鐘。

        例假日（週六、週日及國定假日）
        (1) 06:00～23:00：約4～10分鐘。
        (2) 23:00以後：約12分鐘。
        */
        const first_br_train = firstTrainTime(stn, day_type, dest);
        const last_br_train = lastTrainTime(stn, day_type, dest);

        if (basic.timeToMins(first_br_train) > now_mins) {
            return first_br_train;
        } else if (basic.timeToMins(last_br_train) < now_mins) {
            return basic.INVALID_TIME;
        } else { // Normal: just use worst case approximations 
            if (day_type <= 0 || day_type > 7) {
                throw new Error(`Invalid day_type: ${day_type}`);
            }

            if (now_mins >= basic.timeToMins({ hr: 23, min: 0 })) {
                return basic.minsToTime(now_mins + 12);
            } else if (day_type <= 5 && ((now_mins >= basic.timeToMins({ hr: 7, min: 0 }) && now_mins <= basic.timeToMins({ hr: 9, min: 0 })) || (now_mins >= basic.timeToMins({ hr: 17, min: 0 }) && now_mins <= basic.timeToMins({ hr: 19, min: 30 })))) {
                return basic.minsToTime(now_mins + 4);
            } else {
                return basic.minsToTime(now_mins + 10);
            }
        }
    }

    // Otherwise

    const train_schedule = loadStationSchedule(stn, day_type);

    // Find the closest entry that has time >= now_mins
    const idx = train_schedule.findIndex((t) => t.time >= now_mins);

    if (idx === -1) {
        return basic.INVALID_TIME;
    }

    for (let i = idx; i < train_schedule.length; ++i) {
        const train = train_schedule[i];

        if (oneTrainReachDest(stn, dest, train!)) {
            return basic.minsToTime(train!.time);
        }
    }

    return basic.INVALID_TIME;
}

export function firstTrainTime(stn: basic.Station, day_type: number, dest: basic.Station): basic.Time {
    if (stn.line !== basic.Line.BR) { // Given timetable
        // All trains begin at 6am
        return nextTrainTime(stn, day_type, { hr: 6, min: 0 }, dest);
    } else { // Deal wih it separately
        if (!basic.validStation(stn)) {
            throw new Error("Invalid station stn");
        } else if (!basic.validStation(dest)) {
            throw new Error("Invalid station dest");
        } else if (day_type <= 0 || day_type > 7) {
            throw new Error(`Invalid day_type: ${day_type}`);
        } else {
            if (stn.stn_num === dest.stn_num) {
                throw new Error("stn and dest are the same station");
            }

            return BR_FIRST_TRAINS[stn.stn_num]![stn.stn_num < dest.stn_num ? 0 : 1]!;
        }
    }
}

export function lastTrainTime(stn: basic.Station, day_type: number, dest: basic.Station): basic.Time {
    if (stn.line !== basic.Line.BR) { // Given timetable
        const train_schedule = loadStationSchedule(stn, day_type);

        if (train_schedule.length === 0) {
            return basic.INVALID_TIME;
        }

        // Traverse from the end
        for (let i = train_schedule.length - 1; i >= 0; --i) {
            const train = train_schedule[i]!;

            if (oneTrainReachDest(stn, dest, train)) {
                return basic.minsToTime(train.time);
            }
        }

        return basic.INVALID_TIME;
    } else { // Deal with it separately
        if (!basic.validStation(stn)) {
            throw new Error("Invalid station stn");
        } else if (!basic.validStation(dest)) {
            throw new Error("Invalid station dest");
        } else if (day_type <= 0 || day_type > 7) {
            throw new Error(`Invalid day_type: ${day_type}`);
        } else {
            if (stn.stn_num === dest.stn_num) {
                throw new Error("stn and dest are the same station");
            }

            return BR_LAST_TRAINS[stn.stn_num]![stn.stn_num < dest.stn_num ? 0 : 1]!;
        }
    }
}

// ======== DAY TYPE ======== //
export function isPublicHoliday(year: number, month: number, day: number): boolean {
    if (year === 2026) {
        const HOLIDAYS_2026 = new Set<string>(["1-1", "2-15",
        "2-16", "2-17", "2-18", "2-19", "2-20", "2-27", "2-28", "4-3", "4-4", "4-5", "4-6", "5-1", "6-19", "9-25", "9-28", "10-9", "10-10", "10-25", "10-26", "12-25"]); // YYYYMMDD

        return HOLIDAYS_2026.has(`${month}-${day}`)
    }

    return false; // Idk yet
}