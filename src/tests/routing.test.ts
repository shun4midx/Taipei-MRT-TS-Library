/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript test file          *
 * File: routing.test.ts                    *
 ****************************************** */

import * as assert from "node:assert/strict";
import * as mrt from "../shun4mrt";

const codes = (path: mrt.Path): string[] => path.map(mrt.stationToCode);

// ===== helpers ===== //

assert.equal(
    mrt.stationInList(
        mrt.stn(mrt.Line.R, 10),
        [mrt.stn(mrt.Line.R, 10)],
    ),
    true,
);

assert.equal(
    mrt.countTransfers([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
        mrt.stn(mrt.Line.BL, 13),
    ]),
    1,
);

assert.equal(
    mrt.usesLine(
        [
            mrt.stn(mrt.Line.R, 10),
            mrt.stn(mrt.Line.BL, 12),
        ],
        mrt.Line.BL,
    ),
    true,
);

assert.equal(
    mrt.hashPath([
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 12),
    ]),
    "R10-BL12-",
);

// ===== candidatePaths ===== //

const c = mrt.defaultRouteConstraints();

const candidates = mrt.candidatePaths(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 13),
    5,
    4,
    c,
);

assert.equal(candidates.length > 0, true);

assert.equal(
    candidates.some((p) =>
        codes(p).includes("R10") &&
        codes(p).includes("BL12") &&
        codes(p).includes("BL13")
    ),
    true,
);

// avoid line should block route
const avoidBlue = mrt.defaultRouteConstraints();
avoidBlue.avoid_lines.push(mrt.Line.BL);

assert.deepEqual(
    mrt.candidatePaths(
        mrt.stn(mrt.Line.R, 10),
        mrt.stn(mrt.Line.BL, 13),
        5,
        4,
        avoidBlue,
    ),
    [],
);

// must station
const mustXimen = mrt.defaultRouteConstraints();
mustXimen.must_stations.push(mrt.stn(mrt.Line.G, 12));

const must_candidates = mrt.candidatePaths(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 13),
    10,
    4,
    mustXimen,
);

assert.equal(
    must_candidates.every((p) =>
        p.some((s) => mrt.sameStation(s, mrt.stn(mrt.Line.G, 12)))
    ),
    true,
);

// ===== routeDefault ===== //

const routes = mrt.routeDefault(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 13),
    { hr: 6, min: 0 },
    1,
    3,
);

assert.equal(routes.length > 0, true);
assert.equal(routes.length <= 3, true);

assert.equal(
    mrt.sameStation(routes[0]!.path[0]!, mrt.stn(mrt.Line.R, 10)),
    true,
);

assert.equal(
    mrt.sameStation(
        routes[0]!.path[routes[0]!.path.length - 1]!,
        mrt.stn(mrt.Line.BL, 13),
    ),
    true,
);

assert.equal(routes[0]!.total_mins >= 0, true);
assert.equal(routes[0]!.times.length, routes[0]!.path.length);

// ===== routeLeastTransfer ===== //

const least_transfer_routes = mrt.routeLeastTransfer(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 13),
    { hr: 6, min: 0 },
    1,
    3,
);

assert.equal(least_transfer_routes.length > 0, true);
assert.equal(least_transfer_routes.length <= 3, true);

// ===== routeCustom ===== //

const custom = mrt.defaultRouteConstraints();
custom.avoid_lines.push(mrt.Line.BL);

const no_route = mrt.routeCustom(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 13),
    { hr: 6, min: 0 },
    1,
    custom,
    3,
);

assert.deepEqual(no_route, []);

// same src/dst
const same_station_route = mrt.routeCustom(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.R, 10),
    { hr: 6, min: 0 },
    1,
    mrt.defaultRouteConstraints(),
    3,
);

assert.equal(same_station_route.length, 1);
assert.equal(same_station_route[0]!.total_mins, 0);
assert.equal(same_station_route[0]!.transfer_count, 0);

// ===== invalid input ===== //

assert.throws(
    () => mrt.routeDefault(
        mrt.stn(mrt.Line.R, 1),
        mrt.stn(mrt.Line.R, 10),
        { hr: 6, min: 0 },
        1,
    ),
);

// ===== complicated routes ===== //

const hard_routes = mrt.routeDefault(
    mrt.stn(mrt.Line.Y, 7),      // Dapinglin
    mrt.stn(mrt.Line.BR, 24),    // Nangang Exhibition Center
    { hr: 8, min: 0 },
    1,
    3,
);

assert.equal(hard_routes.length > 0, true);
assert.equal(hard_routes[0]!.times.length, hard_routes[0]!.path.length);
assert.equal(hard_routes[0]!.transfer_count >= 1, true);

console.log("Y07 -> BR24:", codes(hard_routes[0]!.path));

const many_transfer_routes = mrt.routeDefault(
    mrt.stn(mrt.Line.Y, 20),
    mrt.stn(mrt.Line.R, 28),
    { hr: 8, min: 0 },
    1,
    3,
);

assert.equal(many_transfer_routes.length > 0, true);
assert.equal(many_transfer_routes[0]!.transfer_count >= 1, true);

console.log("Y20 -> R28:", codes(many_transfer_routes[0]!.path));

// ===== Orange line branch edge cases ===== //

// O12 is the junction between O13-O21 and O50-O54.
// Candidate path from O21 to O54 should include O12 and O50.
const orange_branch_candidates = mrt.candidatePaths(
    mrt.stn(mrt.Line.O, 21),
    mrt.stn(mrt.Line.O, 54),
    5,
    4,
    mrt.defaultRouteConstraints(),
);

assert.equal(orange_branch_candidates.length > 0, true);

assert.equal(
    orange_branch_candidates.some((p) => {
        const cs = codes(p);
        return cs.includes("O12") && cs.includes("O50") && cs.includes("O54");
    }),
    true,
);

console.log("O21 -> O54 candidate:", codes(orange_branch_candidates[0]!));

// This should count as a branch-switch transfer-like event.
assert.equal(
    mrt.countTransfers(mrt.simplifyPath([
        mrt.stn(mrt.Line.O, 21),
        mrt.stn(mrt.Line.O, 20),
        mrt.stn(mrt.Line.O, 19),
        mrt.stn(mrt.Line.O, 18),
        mrt.stn(mrt.Line.O, 17),
        mrt.stn(mrt.Line.O, 16),
        mrt.stn(mrt.Line.O, 15),
        mrt.stn(mrt.Line.O, 14),
        mrt.stn(mrt.Line.O, 13),
        mrt.stn(mrt.Line.O, 12),
        mrt.stn(mrt.Line.O, 50),
        mrt.stn(mrt.Line.O, 51),
        mrt.stn(mrt.Line.O, 52),
        mrt.stn(mrt.Line.O, 53),
        mrt.stn(mrt.Line.O, 54)
    ], mrt.defaultRouteConstraints())),
    1,
);

// Real route should work if your arrival_times + O branch logic are correct.
const orange_branch_routes = mrt.routeDefault(
    mrt.stn(mrt.Line.O, 21),
    mrt.stn(mrt.Line.O, 54),
    { hr: 8, min: 0 },
    1,
    3,
);

assert.equal(orange_branch_routes.length > 0, true);

assert.equal(
    codes(orange_branch_routes[0]!.path).includes("O12"),
    true,
);

assert.equal(
    codes(orange_branch_routes[0]!.path).includes("O54"),
    true,
);

console.log("O21 -> O54 route:", codes(orange_branch_routes[0]!.path));

// Opposite direction branch switch.
const orange_reverse_routes = mrt.routeDefault(
    mrt.stn(mrt.Line.O, 54),
    mrt.stn(mrt.Line.O, 21),
    { hr: 8, min: 0 },
    1,
    3,
);

assert.equal(orange_reverse_routes.length > 0, true);
assert.equal(codes(orange_reverse_routes[0]!.path).includes("O12"), true);

console.log("O54 -> O21 route:", codes(orange_reverse_routes[0]!.path));

console.log("routing.test.ts passed");