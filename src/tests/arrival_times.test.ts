/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: arrival_times.test.ts              *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

// ===== dayGroup ===== //

assert.equal(mrt.dayGroup(mrt.Line.R, 1), "12345");
assert.equal(mrt.dayGroup(mrt.Line.R, 6), "6");
assert.equal(mrt.dayGroup(mrt.Line.R, 7), "7");
assert.equal(mrt.dayGroup(mrt.Line.G, 6), "67");
assert.equal(mrt.dayGroup(mrt.Line.Y, 7), "67");

assert.throws(() => mrt.dayGroup(mrt.Line.R, 0));
assert.throws(() => mrt.dayGroup(mrt.Line.R, 8));

// ===== loadStationSchedule ===== //

const r10_weekday = mrt.loadStationSchedule(mrt.stn(mrt.Line.R, 10), 1);

assert.equal(r10_weekday.length > 0, true);
assert.equal(
    r10_weekday.every((train) => mrt.sameStation(train.arrive, mrt.stn(mrt.Line.R, 10))),
    true,
);

assert.throws(
    () => mrt.loadStationSchedule(mrt.stn(mrt.Line.BR, 10), 1),
);

// ===== oneTrainReachDest ===== //

const r10_to_tamsui_train = r10_weekday.find((train) =>
    mrt.stationToCode(train.train_dest) === "R28"
);

assert.notEqual(r10_to_tamsui_train, undefined);

assert.equal(
    mrt.oneTrainReachDest(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 28),
        r10_to_tamsui_train!,
    ),
    true,
);

assert.equal(
    mrt.oneTrainReachDest(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 2),
        r10_to_tamsui_train!,
    ),
    false,
);

assert.throws(
    () => mrt.oneTrainReachDest(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 10),
        r10_to_tamsui_train!,
    ),
);

// ===== nextTrainTime ===== //

const next_r10_to_r28 = mrt.nextTrainTime(
    mrt.stn(mrt.Line.R, 10),
    1,
    { hr: 6, min: 0 },
    mrt.stn(mrt.Line.R, 28),
);

assert.equal(
    mrt.sameTime(next_r10_to_r28, mrt.INVALID_TIME),
    false,
);

// ===== firstTrainTime / lastTrainTime non-BR ===== //

const first_r10_to_r28 = mrt.firstTrainTime(
    mrt.stn(mrt.Line.R, 10),
    1,
    mrt.stn(mrt.Line.R, 28),
);

const last_r10_to_r28 = mrt.lastTrainTime(
    mrt.stn(mrt.Line.R, 10),
    1,
    mrt.stn(mrt.Line.R, 28),
);

assert.equal(
    mrt.timeToMins(first_r10_to_r28) <= mrt.timeToMins(last_r10_to_r28),
    true,
);

// ===== BR special case ===== //

assert.deepEqual(
    mrt.firstTrainTime(
        mrt.stn(mrt.Line.BR, 1),
        1,
        mrt.stn(mrt.Line.BR, 24),
    ),
    { hr: 6, min: 0 },
);

assert.deepEqual(
    mrt.lastTrainTime(
        mrt.stn(mrt.Line.BR, 1),
        1,
        mrt.stn(mrt.Line.BR, 24),
    ),
    { hr: 24, min: 0 },
);

assert.deepEqual(
    mrt.nextTrainTime(
        mrt.stn(mrt.Line.BR, 10),
        1,
        { hr: 8, min: 0 },
        mrt.stn(mrt.Line.BR, 11),
    ),
    { hr: 8, min: 4 },
);

// ===== holidays ===== //

assert.equal(mrt.isPublicHoliday(2026, 1, 1), true);
assert.equal(mrt.isPublicHoliday(2026, 12, 25), true);
assert.equal(mrt.isPublicHoliday(2026, 10, 15), false);
assert.equal(mrt.isPublicHoliday(2025, 1, 1), false);

console.log("arrival_times.test.ts passed");