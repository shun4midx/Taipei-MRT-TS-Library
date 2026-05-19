/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: path_duration.test.ts              *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

// ===== getLineDuration ===== //

assert.equal(
    mrt.getLineDuration(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 11),
    )! > 0,
    true,
);

assert.equal(
    mrt.getLineDuration(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 10),
    ),
    0,
);

assert.throws(
    () => mrt.getLineDuration(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ),
);

// ===== perfectPathDuration ===== //

assert.equal(
    mrt.perfectPathDuration([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 11),
    ]) > 0,
    true,
);

assert.equal(
    mrt.perfectPathDuration([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ]),
    4,
);

assert.equal(
    mrt.perfectPathDuration([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
        mrt.stn(mrt.Line.BL, 13),
    ]) > 4,
    true,
);

assert.throws(
    () => mrt.perfectPathDuration([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.G, 10),
    ]),
);

// ===== perfectPathETA ===== //

assert.deepEqual(
    mrt.perfectPathETA([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ]),
    [0, 4],
);

const eta = mrt.perfectPathETA([
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 12),
    mrt.stn(mrt.Line.BL, 13),
]);

assert.equal(eta.length, 3);
assert.equal(eta[0], 0);
assert.equal(eta[1], 4);
assert.equal(eta[2]! > eta[1]!, true);

// ===== pathETA ===== //

const path_eta = mrt.pathETA(
    [
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 11),
        mrt.stn(mrt.Line.G, 14),
    ],
    { hr: 6, min: 0 },
    1,
);

assert.equal(path_eta.length, 3);

assert.deepEqual(
    path_eta[0]!.arrive,
    { hr: 6, min: 0 },
);

assert.equal(
    mrt.timeToMins(path_eta[0]!.depart) >= mrt.timeToMins(path_eta[0]!.arrive),
    true,
);

assert.equal(
    mrt.timeToMins(path_eta[1]!.arrive) >= mrt.timeToMins(path_eta[0]!.depart),
    true,
);

assert.deepEqual(
    path_eta[path_eta.length - 1]!.arrive,
    path_eta[path_eta.length - 1]!.depart,
);

// Invalid path too short
assert.throws(
    () => mrt.pathETA(
        [mrt.stn(mrt.Line.R, 10)],
        { hr: 6, min: 0 },
        1,
    ),
);

// Invalid non-transfer jump
assert.throws(
    () => mrt.pathETA(
        [
            mrt.stn(mrt.Line.R, 10),
            mrt.stn(mrt.Line.G, 10),
        ],
        { hr: 6, min: 0 },
        1,
    ),
);

console.log("path_duration.test.ts passed");