/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: prettify.test.ts                   *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

// ===== basic formatting ===== //

assert.equal(
    mrt.colon(mrt.Language.en),
    ": ",
);

assert.equal(
    mrt.colon(mrt.Language.zh),
    "：",
);

assert.equal(
    mrt.prettifyStation(mrt.stn(mrt.Line.R, 10), mrt.Language.en),
    "Taipei Main Station 🟥 R10",
);

assert.equal(
    mrt.pathToStr([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ]),
    "R10 BL12",
);

assert.equal(
    mrt.pathMinsToStr([0, 4, 6]),
    "0 4 6",
);

// ===== transfer info for users ===== //

const transfer_text = mrt.transferLinesToUser(
    mrt.Line.R,
    mrt.Line.BL,
    mrt.Language.en,
);

console.log("\n=== Transfer lines R <-> BL ===");
console.log(transfer_text);

assert.equal(transfer_text.includes("Taipei Main Station"), true);
assert.equal(transfer_text.includes("R10"), true);
assert.equal(transfer_text.includes("BL12"), true);

const all_codes = mrt.allStnCodesToUser(
    mrt.stn(mrt.Line.R, 10),
    mrt.Language.en,
);

console.log("\n=== All station codes for R10 ===");
console.log(all_codes);

assert.equal(all_codes.includes("R10"), true);
assert.equal(all_codes.includes("BL12"), true);

// ===== untimed path demo ===== //

const simple_path: mrt.Path = [
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 12),
    mrt.stn(mrt.Line.BL, 13),
];

const perfect_eta = mrt.perfectPathETA(simple_path);

const untimed_details = mrt.namedPathMinsToStr(
    simple_path,
    perfect_eta,
    mrt.Language.en,
    mrt.TicketType.ADULT,
);

console.log("\n=== Untimed path details ===");
console.log(untimed_details);

assert.equal(untimed_details.includes("Adult") || untimed_details.includes("$"), true);
assert.equal(untimed_details.includes("Taipei Main Station"), true);
assert.equal(untimed_details.includes("R10"), true);
assert.equal(untimed_details.includes("BL12"), true);

// Same thing via user-facing wrapper
const untimed_wrapper = mrt.pathDetailsToUser(
    simple_path,
    mrt.Language.en,
    mrt.TicketType.ADULT,
);

assert.equal(untimed_wrapper.includes("Taipei Main Station"), true);

// ===== timed path demo ===== //

const timed_details = mrt.pathDetailsToUser(
    simple_path,
    { hr: 8, min: 0 },
    1,
    mrt.Language.en,
    mrt.TicketType.ADULT,
);

console.log("\n=== Timed path details ===");
console.log(timed_details);

assert.equal(timed_details.includes("Arriving at"), true);
assert.equal(timed_details.includes("Departing at"), true);
assert.equal(timed_details.includes("Taipei Main Station"), true);

// ===== route suggestion demo ===== //

const routes = mrt.routeDefault(
    mrt.stn(mrt.Line.Y, 7),
    mrt.stn(mrt.Line.BR, 24),
    { hr: 8, min: 0 },
    1,
    3,
);

assert.equal(routes.length > 0, true);

console.log("\n=== Suggested routes Y07 -> BR24 ===");

for (let i = 0; i < routes.length; ++i) {
    const route = routes[i]!;

    console.log(`\n--- Route ${i + 1} ---`);
    console.log(`Raw path: ${mrt.pathToStr(route.path)}`);
    console.log(
        mrt.namedPathTimesToStr(
            route.path,
            route.times,
            mrt.Language.en,
            mrt.TicketType.ADULT,
        ),
    );

    assert.equal(route.path.length, route.times.length);
    assert.equal(route.total_mins >= 0, true);
}

// ===== multilingual smoke tests ===== //

const zh_details = mrt.pathDetailsToUser(
    simple_path,
    mrt.Language.zh,
    mrt.TicketType.ADULT,
);

console.log("\n=== 中文 untimed path details ===");
console.log(zh_details);

assert.equal(zh_details.includes("分鐘"), true);
assert.equal(zh_details.includes("台北車站"), true);

const jp_station = mrt.prettifyStation(
    mrt.stn(mrt.Line.R, 10),
    mrt.Language.jp,
);

assert.equal(jp_station.includes("台北駅"), true);

// ===== custom route demo ===== //

const custom = mrt.defaultRouteConstraints();

// Avoid specific physical stations.
// routeEngine expands these to equivalent station codes internally.
custom.avoid_stations.push(
    mrt.stn(mrt.Line.R, 10), // avoid Taipei Main Station / BL12
);

// Avoid whole lines
custom.avoid_lines.push(
    mrt.Line.BR, // avoid Brown line
);

// Require passing through specific stations (max 4 are allowed to avoid troll behavior)
custom.must_stations.push(
    mrt.stn(mrt.Line.G, 12), // require Ximen
);

// Require using specific lines somewhere in the route.
custom.must_lines.push(
    mrt.Line.G, // must use Green line
);

// Ranking behavior
custom.minimize_time = true;
custom.minimize_transfers = true;

// Search limit
custom.max_transfers = 6;

const custom_routes = mrt.routeCustom(
    mrt.stn(mrt.Line.Y, 7),
    mrt.stn(mrt.Line.BL, 23),
    { hr: 8, min: 0 },
    1,
    custom,
    3,
);

console.log("\n=== Custom route demo ===");

for (let i = 0; i < custom_routes.length; ++i) {
    const route = custom_routes[i]!;

    console.log(`\n--- Custom route ${i + 1} ---`);
    console.log(`Raw path: ${mrt.pathToStr(route.path)}`);

    console.log(
        mrt.namedPathTimesToStr(
            route.path,
            route.times,
            mrt.Language.en,
            mrt.TicketType.ADULT,
        ),
    );

    assert.equal(route.path.some((s) => mrt.sameStation(s, mrt.stn(mrt.Line.G, 12))), true);
    assert.equal(route.path.some((s) => s.line === mrt.Line.G), true);
    assert.equal(route.path.every((s) => s.line !== mrt.Line.BR), true);
}

console.log("\nprettify.test.ts passed");