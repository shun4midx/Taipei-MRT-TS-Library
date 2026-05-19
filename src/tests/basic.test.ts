/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: basic.test.ts                      *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

assert.equal(
    mrt.getName(mrt.Line.R, 10, mrt.Language.en),
    "Taipei Main Station",
);

assert.throws(
    () => mrt.getName(mrt.Line.R, 1, mrt.Language.zh),
);

assert.deepEqual(
    mrt.codeToStation("R10"),
    { line: mrt.Line.R, stn_num: 10 },
);

assert.equal(
    mrt.stationToCode({ line: mrt.Line.R, stn_num: 10 }),
    "R10",
);

assert.equal(
    mrt.getName(mrt.Line.O, 12, mrt.Language.jp),
    "大橋頭",
);

assert.equal(
    mrt.getName(mrt.Line.O, 50, mrt.Language.kr),
    "싼충 초등학교",
);

assert.throws(
    () => mrt.getName(mrt.Line.O, 30, mrt.Language.jp),
);

assert.deepEqual(
    mrt.codeToStation("O54"),
    { line: mrt.Line.O, stn_num: 54 },
);

assert.equal(
    mrt.stationToCode({ line: mrt.Line.O, stn_num: 10 }),
    "O10",
);

assert.equal(mrt.getName(mrt.Line.G, 7), "公館");
assert.equal(mrt.getName(mrt.Line.BL, 7), "板橋");
assert.equal(mrt.getName(mrt.Line.BR, 7), "六張犁");

assert.equal(
    mrt.timeToMins({ hr: 6, min: 30 }),
    390,
);

assert.deepEqual(
    mrt.minsToTime(390),
    { hr: 6, min: 30 },
);

assert.equal(
    mrt.timeToStr(mrt.minsToTime(514)),
    "08:34",
);

console.log("basic.test.ts passed");