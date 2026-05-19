/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: transfer.test.ts                   *
 ****************************************** */

import * as assert from "node:assert/strict";

import * as mrt from "../shun4mrt";

const codes = (stations: mrt.Station[]) => stations.map(mrt.stationToCode);

assert.equal(
    mrt.isTransfer(mrt.stn(mrt.Line.R, 10)),
    true,
    "R10 should be a transfer station",
);

assert.deepEqual(
    codes(mrt.getEquivalentStations(mrt.stn(mrt.Line.R, 10))),
    ["R10", "BL12"],
    "R10 equivalent stations should be R10 and BL12",
);

assert.equal(
    mrt.canTransfer(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.BL, 12)),
    true,
    "R10 should transfer to BL12",
);

assert.equal(
    mrt.getTransferTime(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.BL, 12)),
    4,
    "R10 -> BL12 transfer should take 4 mins",
);

assert.equal(
    mrt.canTransfer(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.R, 10)),
    true,
    "same station should count as transferable like C++",
);

assert.equal(
    mrt.getTransferTime(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.R, 10)),
    0,
    "same station transfer time should be 0",
);

assert.equal(
    mrt.canTransfer(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.G, 10)),
    false,
    "R10 should not directly transfer to G10",
);

assert.throws(
    () => mrt.getTransferTime(mrt.stn(mrt.Line.R, 10), mrt.stn(mrt.Line.G, 10)),
    /not transferrable/,
);

assert.equal(
    mrt.strStnVector([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ]),
    "R10, BL12",
);

assert.deepEqual(
    mrt.getStationNode(mrt.stn(mrt.Line.R, 5))?.station_codes.map(mrt.stationToCode),
    ["R05", "BR09"],
);
  
assert.equal(
    mrt.isTransfer(mrt.stn(mrt.Line.R, 6)),
    false,
);
  
assert.deepEqual(
    mrt.getTransfers(mrt.stn(mrt.Line.R, 5)).map(([s, mins]) => [
        mrt.stationToCode(s),
        mins,
    ]),
    [["BR09", 5]],
);
  
assert.equal(
    mrt.canTransfer(mrt.stn(mrt.Line.R, 5), mrt.stn(mrt.Line.BR, 9)),
    true,
);
  
assert.equal(
    mrt.getTransferTime(mrt.stn(mrt.Line.R, 5), mrt.stn(mrt.Line.BR, 9)),
    5,
);
  
assert.deepEqual(
    mrt.getEquivalentStations(mrt.stn(mrt.Line.BL, 23)).map(mrt.stationToCode),
    ["BL23", "BR24"],
);
  
// Formatting test
assert.equal(
    mrt.strTransfersVector([
        [mrt.stn(mrt.Line.BL, 12), 4],
        [mrt.stn(mrt.Line.G, 14), 3],
    ]),
    "BL12(4)\nG14(3)",
);
  
assert.deepEqual(
    mrt.getLineTransferStations(mrt.Line.R, mrt.Line.G).map(([node, mins]) => [
        node.station_codes.map(mrt.stationToCode),
        mins,
    ]),
    [
        [["R08", "G10"], 1],
        [["R11", "G14"], 3],
    ],
);

console.log("transfer.test.ts passed");