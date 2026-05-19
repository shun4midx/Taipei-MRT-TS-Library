/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: routing.ts                         *
 ****************************************** */

import * as basic from "../utils/basic";
import * as transfer from "../utils/transfer";
import * as path_duration from "../utils/path_duration";

export type RoutedPath = {
    path: path_duration.Path;
    times: path_duration.PathTimes; // Arrival/departure timeline
    total_mins: number;
    transfer_count: number;
};

export type RouteConstraints = {
    must_stations: basic.Station[];
    avoid_stations: basic.Station[];
    avoid_lines: basic.Line[];
    must_lines: basic.Line[];

    // Ranking pref
    minimize_time: boolean;
    minimize_transfers: boolean;

    // Search limits
    max_transfers: number;

    avoid_station_keys: Set<number>;
};

export type CandState = {
    stn: basic.Station;
    path: path_duration.Path;
    transfer_count: number;
    checkpoint_mask: number;
    line_mask: number;
};

export function defaultRouteConstraints(): RouteConstraints {
    return {
        must_stations: [],
        avoid_stations: [],
        avoid_lines: [],
        must_lines: [],

        minimize_time: true,
        minimize_transfers: true,

        max_transfers: 30,

        avoid_station_keys: new Set<number>(),
    };
}

function stationKey(s: basic.Station): number {
    return s.line * 1000 + s.stn_num;
}

// ======== HELPERS ======== //

export function stationInList(s: basic.Station, v: basic.Station[]): boolean {
    for (const stn of v) {
        if (basic.sameStation(stn, s)) {
            return true;
        }
    }

    return false;
}

export function forbiddenStation(s: basic.Station, c: RouteConstraints): boolean {
    if (c.avoid_station_keys.has(stationKey(s))) {
        return true;
    }

    for (const l of c.avoid_lines) {
        if (s.line === l) {
            return true;
        }
    }

    return false;
}

export function countTransfers(path: path_duration.Path): number {
    let count = 0;
    let counted_orange_branch = false;

    for (let i = 0; i < path.length - 1; ++i) {
        const curr = path[i]!;
        const next = path[i + 1]!;

        if (curr.line !== next.line) {
            ++count;
            counted_orange_branch = false; // reset when leaving O
        } else if (curr.line === basic.Line.O && i > 0 && path[i - 1]!.line === basic.Line.O && !counted_orange_branch) {
            const prev = path[i - 1]!;

            if (curr.stn_num >= 1 && curr.stn_num <= 12 && ((prev.stn_num >= 50 && next.stn_num < 50) || (prev.stn_num < 50 && next.stn_num >= 50))) {
                ++count;
                counted_orange_branch = true;
            }
        }
    }

    return count;
}

export function usesLine(path: path_duration.Path, line: basic.Line): boolean {
    for (const s of path) {
        if (s.line === line) {
            return true;
        }
    }

    return false;
}

export function hashPath(p: path_duration.Path): string {
    let hash = "";

    for (const s of p) {
        hash += basic.stationToCode(s) + "-";
    }

    return hash;
}

function isCheckpoint(s: basic.Station, c: RouteConstraints): boolean {
    for (const ms of c.must_stations) {
        if (basic.sameStation(s, ms)) {
            return true;
        }
    }

    return false;
}

// E.g. R07 R06 R05 gets simplifed to R07 R05
export function simplifyPath(p: path_duration.Path, c: RouteConstraints): path_duration.Path {
    if (p.length <= 2) {
        return p;
    }

    const out: path_duration.Path = [];
    out.push(p[0]!); // Always add start

    for (let i = 1; i < p.length - 1; ++i) {
        let must_include = false;

        // Must include checkpoints
        if (isCheckpoint(p[i]!, c)) {
            must_include = true;
        }

        // Must include if line changes
        if (p[i - 1]!.line !== p[i]!.line || p[i]!.line !== p[i + 1]!.line) {
            must_include = true;
        }

        // Must include for Orange line branch switches at O12
        if (p[i]!.line === basic.Line.O && basic.sameStation(p[i]!, basic.stn(basic.Line.O, 12))) {
            const from_luzhou = p[i - 1]!.stn_num >= 50;
            const to_luzhou = p[i + 1]!.stn_num >= 50;
            const from_huilong = p[i - 1]!.stn_num >= 13 && p[i - 1]!.stn_num < 50;
            const to_huilong = p[i + 1]!.stn_num >= 13 && p[i + 1]!.stn_num < 50;

            // Only show O12 if switching between Luzhou and Huilong branches
            if ((from_luzhou && to_huilong) || (from_huilong && to_luzhou)) {
                must_include = true;
            }
        }

        if (must_include) {
            out.push(p[i]!);
        }
    }

    out.push(p[p.length - 1]!); // Always add end
    return out;
}

export function mergePaths(a: path_duration.Path, b: path_duration.Path): path_duration.Path {
    if (a.length === 0 && b.length === 0) {
        throw new Error("Path length is 0");
    } else if (a.length === 0) {
        return b;
    } else if (b.length === 0) {
        return a;
    }

    const p = [...a];

    if (!basic.sameStation(a[a.length - 1]!, b[0]!)) {
        p.push(...b);
    } else {
        p.push(...b.slice(1));
    }

    return p;
}

function bonus(rp: RoutedPath, c: RouteConstraints): number {
    let b = 0;

    for (const l of c.must_lines) {
        if (usesLine(rp.path, l)) {
            ++b;
        }
    }

    return b;
}

// Ranking/tie breaker
export function betterThan(a: RoutedPath, b: RoutedPath, c: RouteConstraints): boolean {
    // If time
    if (c.minimize_time) {
        if (a.total_mins !== b.total_mins) {
            return a.total_mins < b.total_mins;
        }

        if (a.transfer_count !== b.transfer_count) {
            return a.transfer_count < b.transfer_count;
        }

        // Fallback
        return a.path.length < b.path.length;
    }

    // Only transfer
    if (!c.minimize_time && c.minimize_transfers) {
        if (a.transfer_count !== b.transfer_count) {
            return a.transfer_count < b.transfer_count;
        }

        if (a.total_mins !== b.total_mins) {
            return a.total_mins < b.total_mins;
        }

        // Fallback
        return a.path.length < b.path.length;
    }

    // Bonus lines
    const scoreA = bonus(a, c);
    const scoreB = bonus(b, c);

    if (scoreA !== scoreB) {
        return scoreA > scoreB;
    }

    // Neither
    return a.path.length < b.path.length;
}

// ======== LAYER 1: UNTIMED ======== //
// Generate all paths without schedules, with avoid constraints applied
// must_stations can be handled by concatenation later and must_lines is global and filtered later

export function candidatePaths(src: basic.Station, dst: basic.Station, max_paths: number, max_transfers: number, constraints: RouteConstraints): path_duration.Path[] {
    if (!basic.validStation(src) || !basic.validStation(dst)) {
        throw new Error("candidatePaths: invalid src/dst station");
    }

    if (max_paths <= 0 || max_transfers < 0) {
        return [];
    }

    // BFS-like exploration, prunes forbidden nodes & cycles
    const q: CandState[] = [];
    const results: path_duration.Path[] = [];

    if (forbiddenStation(src, constraints) || forbiddenStation(dst, constraints)) {
        return [];
    }

    // ===== checkpoint indexing =====
    const checkpoint_index = new Map<number, number>();

    for (let i = 0; i < constraints.must_stations.length; ++i) {
        checkpoint_index.set(
            stationKey(constraints.must_stations[i]!),
            i,
        );
    }

    let start_mask = 0;
    const src_key = stationKey(src);

    const src_checkpoint_idx = checkpoint_index.get(src_key);
    if (src_checkpoint_idx !== undefined) {
        start_mask |= (1 << src_checkpoint_idx);
    }

    const start_line_mask = (1 << src.line);

    q.push({
        stn: src,
        path: [src],
        transfer_count: 0,
        checkpoint_mask: start_mask,
        line_mask: start_line_mask,
    });

    const best_seen = new Map<string, number>();

    while (q.length > 0) {
        const curr = q.shift()!;

        if (curr.transfer_count > max_transfers) {
            continue;
        }

        if (basic.sameStation(curr.stn, dst)) {
            if (results.length >= max_paths) {
                continue;
            }

            const checkpoints_ok = (curr.checkpoint_mask === ((1 << constraints.must_stations.length) - 1));

            let lines_ok = true;

            for (const l of constraints.must_lines) {
                if (!(curr.line_mask & (1 << l))) {
                    lines_ok = false;
                    break;
                }
            }

            if (checkpoints_ok && lines_ok) {
                results.push(curr.path);
            }

            if (results.length >= max_paths) {
                continue;
            }

            continue;
        }

        const state_key = `${stationKey(curr.stn)}:${curr.checkpoint_mask}:${curr.line_mask}`;

        const best_inter = best_seen.get(state_key);

        if (best_inter !== undefined) {
            if (best_inter <= curr.transfer_count) {
                continue;
            }
        }

        // Store best transfer only
        best_seen.set(state_key, curr.transfer_count);

        // Same line neighbors: +/- station number
        for (const delta of [-1, 1]) {
            const next: basic.Station = {
                line: curr.stn.line,
                stn_num: curr.stn.stn_num + delta,
            };

            if (curr.stn.line === basic.Line.O && curr.stn.stn_num === 50 && delta === -1) {
                next.stn_num = 12; // O edge case
            }

            if (!basic.validStation(next) || forbiddenStation(next, constraints)) {
                continue;
            }

            // Avoid cycles
            let new_checkpoint_mask = curr.checkpoint_mask;
            const next_key = stationKey(next);

            const next_checkpoint_idx = checkpoint_index.get(next_key);
            if (next_checkpoint_idx !== undefined) {
                new_checkpoint_mask |= (1 << next_checkpoint_idx);
            }

            let new_line_mask = curr.line_mask;
            new_line_mask |= (1 << next.line);

            const np = [...curr.path];
            np.push(next);

            q.push({
                stn: next,
                path: np,
                transfer_count: curr.transfer_count,
                checkpoint_mask: new_checkpoint_mask,
                line_mask: new_line_mask,
            });
        }

        // Edge case for O line
        if (basic.sameStation(curr.stn, basic.stn(basic.Line.O, 12))) {
            const next = basic.stn(basic.Line.O, 50);

            if (!basic.validStation(next) || forbiddenStation(next, constraints)) {
                continue;
            }

            const new_line_mask = curr.line_mask | (1 << next.line);

            let new_checkpoint_mask = curr.checkpoint_mask;
            const next_key = stationKey(next);

            const next_checkpoint_idx = checkpoint_index.get(next_key);
            if (next_checkpoint_idx !== undefined) {
                new_checkpoint_mask |= (1 << next_checkpoint_idx);
            }

            const np = [...curr.path];
            np.push(next);

            q.push({
                stn: next,
                path: np,
                transfer_count: curr.transfer_count,
                checkpoint_mask: new_checkpoint_mask,
                line_mask: new_line_mask,
            });
        }

        // Transfer neighbors
        try {
            const transfers = transfer.getTransfers(curr.stn);

            for (const [to, _mins] of transfers) {
                if (!basic.validStation(to) || forbiddenStation(to, constraints)) {
                    continue;
                }

                // Avoid cycles
                let new_checkpoint_mask = curr.checkpoint_mask;
                const next_key = stationKey(to);

                const next_checkpoint_idx = checkpoint_index.get(next_key);
                if (next_checkpoint_idx !== undefined) {
                    new_checkpoint_mask |= (1 << next_checkpoint_idx);
                }

                const new_line_mask = curr.line_mask | (1 << to.line);

                const np = [...curr.path];
                np.push(to);

                q.push({
                    stn: to,
                    path: np,
                    transfer_count: curr.transfer_count + 1,
                    checkpoint_mask: new_checkpoint_mask,
                    line_mask: new_line_mask,
                });
            }
        } catch {
            // No transfers or invalid transfer table -> ignore
        }
    }

    return results;
}

// ======== LAYER 2: REAL LIFE PATH ======== //
// Default: top 3 by time (tie break by transfers), fixed candidate budget
export function routeDefault(src: basic.Station, dst: basic.Station, curr_time: basic.Time, day_type: number, k = 3): RoutedPath[] {
    const c = defaultRouteConstraints();
    c.minimize_time = true;
    c.minimize_transfers = true;
    c.max_transfers = 4;

    return routeEngine(src, dst, curr_time, day_type, c, k, 6, 6);
}

// Least transfers: top 3 by transfers (tie-break by time), fixed candidate budget
export function routeLeastTransfer(src: basic.Station, dst: basic.Station, curr_time: basic.Time, day_type: number, k = 3): RoutedPath[] {
    const c = defaultRouteConstraints();
    c.minimize_time = false;
    c.minimize_transfers = true;
    c.max_transfers = 4;

    return routeEngine(src, dst, curr_time, day_type, c, k, 6, 6);
}

// Custom: supports must/avoid, uses adaptive widening if needed
export function routeCustom(src: basic.Station, dst: basic.Station, curr_time: basic.Time, day_type: number, constraints: RouteConstraints, k = 3): RoutedPath[] {
    if (basic.sameStation(src, dst)) {
        return [{
            path: [src],
            times: [{ arrive: curr_time, depart: curr_time }],
            total_mins: 0,
            transfer_count: 0,
        }];
    }

    // With bitmask-based candidatePaths, no segmentation needed.
    return routeEngine(src, dst, curr_time, day_type, constraints, k, 6, 100);
}

// ======== CORE ======== //
export function routeEngine(src: basic.Station, dst: basic.Station, curr_time: basic.Time, day_type: number, constraints: RouteConstraints, k: number, initial_budget: number, hard_cap: number): RoutedPath[] { // Takes all candidates, evaluates them wrt real time, filter must_lines, then rank
    if (!basic.validStation(src) || !basic.validStation(dst)) {
        throw new Error("routeEngine: invalid src/dst station");
    }

    if (day_type <= 0 || day_type > 7) {
        throw new Error("routeEngine: invalid day_type");
    }

    if (curr_time.hr < 0 || curr_time.min < 0) {
        throw new Error("routeEngine: invalid curr_time");
    }

    // Rebuild constraints avoidset
    const c: RouteConstraints = {
        must_stations: [...constraints.must_stations],
        avoid_stations: [...constraints.avoid_stations],
        avoid_lines: [...constraints.avoid_lines],
        must_lines: [...constraints.must_lines],

        minimize_time: constraints.minimize_time,
        minimize_transfers: constraints.minimize_transfers,

        max_transfers: constraints.max_transfers,

        avoid_station_keys: new Set<number>(constraints.avoid_station_keys),
    };

    for (const stn of c.avoid_stations) {
        for (const alt of transfer.getEquivalentStations(stn)) {
            c.avoid_station_keys.add(stationKey(alt));
        }
    }

    const routed: RoutedPath[] = [];
    const seen_paths = new Set<string>(); // avoid re-evaluating duplicates across budgets

    // If src/dst themselves forbidden, no solution.
    if (forbiddenStation(src, c) || forbiddenStation(dst, c)) {
        return [];
    }

    let budget = Math.max(1, initial_budget);
    const cap = Math.max(budget, hard_cap);

    for (; budget <= cap; budget *= 2) {
        const candidates = candidatePaths(src, dst, budget, c.max_transfers, c);

        for (let p of candidates) {
            const key = hashPath(p);

            if (seen_paths.has(key)) {
                continue;
            }

            seen_paths.add(key);

            try {
                // p = simplifyPath(p, constraints);

                const times = path_duration.pathETA(
                    p,
                    curr_time,
                    day_type,
                );

                // total_mins from query time to final arrival time (times.back().first)
                const total_mins =
                    basic.timeToMins(times[times.length - 1]!.arrive)
                    - basic.timeToMins(curr_time);

                const rp: RoutedPath = {
                    path: p,
                    times,
                    total_mins,
                    transfer_count: countTransfers(p),
                };

                routed.push(rp);
            } catch {
                // invalid at this time / schedule / etc -> skip
            }
        }

        // Enforce must_lines (global path property) *after* evaluation
        if (c.must_lines.length > 0) {
            for (let i = routed.length - 1; i >= 0; --i) {
                const rp = routed[i]!;

                for (const l of c.must_lines) {
                    if (!usesLine(rp.path, l)) {
                        routed.splice(i, 1);
                        break;
                    }
                }
            }
        }

        // Rank current pool
        routed.sort((a, b) => {
            if (betterThan(a, b, c)) {
                return -1;
            }

            if (betterThan(b, a, c)) {
                return 1;
            }

            return 0;
        });

        // keep pool small (SUPER important)
        const keep = Math.max(k * 10, 30); // tune

        if (routed.length > keep) {
            routed.length = keep;
        }

        // now break early
        if (routed.length >= k) {
            break;
        }
    }

    for (const rp of routed) {
        rp.path = simplifyPath(rp.path, c);
        rp.times = path_duration.pathETA(rp.path, curr_time, day_type);
        rp.total_mins = basic.timeToMins(rp.times[rp.times.length - 1]!.arrive)- basic.timeToMins(curr_time);
    }

    // Rank final pool
    routed.sort((a, b) => {
        if (betterThan(a, b, c)) {
            return -1;
        }

        if (betterThan(b, a, c)) {
            return 1;
        }

        return 0;
    });

    if (routed.length > k) {
        routed.length = k;
    }

    return routed;
}