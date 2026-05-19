/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: cost.test.ts                       *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

// ===== stationOrderIdx ===== //

assert.equal(
    typeof mrt.stationOrderIdx(mrt.stn(mrt.Line.R, 10)),
    "number",
);

assert.equal(
    mrt.stationOrderIdx(mrt.stn(mrt.Line.R, 10)) >= 0,
    true,
);

assert.throws(
    () => mrt.stationOrderIdx(mrt.stn(mrt.Line.R, 1)),
);

// ===== travelPrice ===== //

const r10_to_r11 = mrt.travelPrice(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.R, 11),
);

assert.equal(
    typeof r10_to_r11,
    "number",
);

assert.equal(
    r10_to_r11 > 0,
    true,
);

// Symmetry
assert.equal(
    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 11),
    ),

    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 11),
        mrt.stn(mrt.Line.R, 10),
    ),
);

// Same station
assert.equal(
    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 10),
    ),

    20,
);

// Child ticket cheaper/equal
assert.equal(
    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.CHILD,
    )

    <=

    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.ADULT,
    ),

    true,
);

// Elderly cheaper/equal
assert.equal(
    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.ELDERLY,
    )

    <=

    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.ADULT,
    ),

    true,
);

// Exceed 120 mins
assert.equal(
    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.ADULT,
        true,
    ),

    mrt.travelPrice(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.R, 20),
        mrt.TicketType.ADULT,
    ) + 20,
);

console.log("cost.test.ts passed");