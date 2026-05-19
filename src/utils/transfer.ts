/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: transfer.ts                        *
 ****************************************** */

import * as basic from "./basic";

// ======== BASIC DATA ======== //

export type StationNode = {
    station_codes: basic.Station[];
};

export const INVALID_STATION_NODE: StationNode = {
    station_codes: []
};

// All physical stations in the system (e.g. R10 we can access as [R][10])
export const STATION_NODES = new Map<basic.Line, StationNode[]>([
    // Red Line
    [basic.Line.R, [
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.R, 2)] }, // R02: Xiangshan
        { station_codes: [basic.stn(basic.Line.R, 3)] }, // R03: Tpe 101
        { station_codes: [basic.stn(basic.Line.R, 4)] }, // R04: Xinyi Anhe
        { station_codes: [basic.stn(basic.Line.R, 5), basic.stn(basic.Line.BR, 9)] }, // R05: Daan
        { station_codes: [basic.stn(basic.Line.R, 6)] }, // R06: Daan Park
        { station_codes: [basic.stn(basic.Line.R, 7), basic.stn(basic.Line.O, 6)] }, // R07: Dongmen
        { station_codes: [basic.stn(basic.Line.R, 8), basic.stn(basic.Line.G, 10)] }, // R08: CKSMH
        { station_codes: [basic.stn(basic.Line.R, 9)] }, // R09: NTUH
        { station_codes: [basic.stn(basic.Line.R, 10), basic.stn(basic.Line.BL, 12)] }, // R10: TPEMS
        { station_codes: [basic.stn(basic.Line.R, 11), basic.stn(basic.Line.G, 14)] }, // R11: Zhongshan
        { station_codes: [basic.stn(basic.Line.R, 12)] }, // R12: Shuanglian
        { station_codes: [basic.stn(basic.Line.R, 13), basic.stn(basic.Line.O, 11)] }, // R13: Minquan W Road
        { station_codes: [basic.stn(basic.Line.R, 14)] }, // R14
        { station_codes: [basic.stn(basic.Line.R, 15)] }, // R15
        { station_codes: [basic.stn(basic.Line.R, 16)] }, // R16
        { station_codes: [basic.stn(basic.Line.R, 17)] }, // R17
        { station_codes: [basic.stn(basic.Line.R, 18)] }, // R18
        { station_codes: [basic.stn(basic.Line.R, 19)] }, // R19
        { station_codes: [basic.stn(basic.Line.R, 20)] }, // R20
        { station_codes: [basic.stn(basic.Line.R, 21)] }, // R21
        { station_codes: [basic.stn(basic.Line.R, 22)] }, // R22
        { station_codes: [basic.stn(basic.Line.R, 23)] }, // R23
        { station_codes: [basic.stn(basic.Line.R, 24)] }, // R24
        { station_codes: [basic.stn(basic.Line.R, 25)] }, // R25
        { station_codes: [basic.stn(basic.Line.R, 26)] }, // R26
        { station_codes: [basic.stn(basic.Line.R, 27)] }, // R27
        { station_codes: [basic.stn(basic.Line.R, 28)] } // R28
    ]],

    // Green Line
    [basic.Line.G, [
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.G, 1)] }, // G01: Xindian
        { station_codes: [basic.stn(basic.Line.G, 2)] }, // G02: Xindian Dist Office
        { station_codes: [basic.stn(basic.Line.G, 3)] }, // G03: Qizhang
        { station_codes: [basic.stn(basic.Line.G, 4), basic.stn(basic.Line.Y, 7)] }, // G04: Dapinglin
        { station_codes: [basic.stn(basic.Line.G, 5)] }, // G05: Jingmei
        { station_codes: [basic.stn(basic.Line.G, 6)] }, // G06: Wanlong
        { station_codes: [basic.stn(basic.Line.G, 7)] }, // G07: Gongguan
        { station_codes: [basic.stn(basic.Line.G, 8)] }, // G08: Taipwr bldg
        { station_codes: [basic.stn(basic.Line.G, 9), basic.stn(basic.Line.O, 5)] }, // G09: Guting
        { station_codes: [basic.stn(basic.Line.G, 10), basic.stn(basic.Line.R, 8)] }, // G10: CKSMH
        { station_codes: [basic.stn(basic.Line.G, 11)] }, // G11: Xiaonanmen
        { station_codes: [basic.stn(basic.Line.G, 12), basic.stn(basic.Line.BL, 11)] }, // G12: Ximen
        { station_codes: [basic.stn(basic.Line.G, 13)] }, // G13: Beimen
        { station_codes: [basic.stn(basic.Line.G, 14), basic.stn(basic.Line.R, 11)] }, // G14: Zhongshan
        { station_codes: [basic.stn(basic.Line.G, 15), basic.stn(basic.Line.O, 8)] }, // G15: Songjiang Nanjing
        { station_codes: [basic.stn(basic.Line.G, 16), basic.stn(basic.Line.BR, 11)] }, // G16: Nanjing Fuxing
        { station_codes: [basic.stn(basic.Line.G, 17)] }, // G17
        { station_codes: [basic.stn(basic.Line.G, 18)] }, // G18
        { station_codes: [basic.stn(basic.Line.G, 19)] } // G19
    ]],

    // Blue Line
    [basic.Line.BL, [
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.BL, 1)] }, // BL01
        { station_codes: [basic.stn(basic.Line.BL, 2)] }, // BL02
        { station_codes: [basic.stn(basic.Line.BL, 3)] }, // BL03
        { station_codes: [basic.stn(basic.Line.BL, 4)] }, // BL04
        { station_codes: [basic.stn(basic.Line.BL, 5)] }, // BL05
        { station_codes: [basic.stn(basic.Line.BL, 6)] }, // BL06
        { station_codes: [basic.stn(basic.Line.BL, 7), basic.stn(basic.Line.Y, 16)] }, // BL07: Banqiao
        { station_codes: [basic.stn(basic.Line.BL, 8), basic.stn(basic.Line.Y, 17)] }, // Bl08: Xinpu
        { station_codes: [basic.stn(basic.Line.BL, 9)] }, // BL09
        { station_codes: [basic.stn(basic.Line.BL, 10)] }, // BL10
        { station_codes: [basic.stn(basic.Line.BL, 11), basic.stn(basic.Line.G, 12)] }, // BL11: Ximen
        { station_codes: [basic.stn(basic.Line.BL, 12), basic.stn(basic.Line.R, 10)] }, // BL12: TPEMS
        { station_codes: [basic.stn(basic.Line.BL, 13)] }, // BL13
        { station_codes: [basic.stn(basic.Line.BL, 14), basic.stn(basic.Line.O, 7)] }, // BL14: Zhongxiao Xinsheng
        { station_codes: [basic.stn(basic.Line.BL, 15), basic.stn(basic.Line.BR, 10)] }, // BL15: Zhongxiao Fuxing
        { station_codes: [basic.stn(basic.Line.BL, 16)] }, // BL16
        { station_codes: [basic.stn(basic.Line.BL, 17)] }, // BL17
        { station_codes: [basic.stn(basic.Line.BL, 18)] }, // BL18
        { station_codes: [basic.stn(basic.Line.BL, 19)] }, // BL19
        { station_codes: [basic.stn(basic.Line.BL, 20)] }, // BL20
        { station_codes: [basic.stn(basic.Line.BL, 21)] }, // BL21
        { station_codes: [basic.stn(basic.Line.BL, 22)] }, // BL22
        { station_codes: [basic.stn(basic.Line.BL, 23), basic.stn(basic.Line.BR, 24)] } // BL23: Nangang exhib center
    ]],

    // Brown Line
    [basic.Line.BR, [
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.BR, 1)] }, // BR01
        { station_codes: [basic.stn(basic.Line.BR, 2)] }, // BR02
        { station_codes: [basic.stn(basic.Line.BR, 3)] }, // BR03
        { station_codes: [basic.stn(basic.Line.BR, 4)] }, // BR04
        { station_codes: [basic.stn(basic.Line.BR, 5)] }, // BR05
        { station_codes: [basic.stn(basic.Line.BR, 6)] }, // BR06
        { station_codes: [basic.stn(basic.Line.BR, 7)] }, // BR07
        { station_codes: [basic.stn(basic.Line.BR, 8)] }, // BR08
        { station_codes: [basic.stn(basic.Line.BR, 9), basic.stn(basic.Line.R, 5)] }, // BR09: Daan
        { station_codes: [basic.stn(basic.Line.BR, 10), basic.stn(basic.Line.BL, 15)] }, // BR10: Zhongxiao Fuxing
        { station_codes: [basic.stn(basic.Line.BR, 11), basic.stn(basic.Line.G, 16)] }, // BR11: Nanjing Fuxing
        { station_codes: [basic.stn(basic.Line.BR, 12)] }, // BR12
        { station_codes: [basic.stn(basic.Line.BR, 13)] }, // BR13
        { station_codes: [basic.stn(basic.Line.BR, 14)] }, // BR14
        { station_codes: [basic.stn(basic.Line.BR, 15)] }, // BR15
        { station_codes: [basic.stn(basic.Line.BR, 16)] }, // BR16
        { station_codes: [basic.stn(basic.Line.BR, 17)] }, // BR17
        { station_codes: [basic.stn(basic.Line.BR, 18)] }, // BR18
        { station_codes: [basic.stn(basic.Line.BR, 19)] }, // BR19
        { station_codes: [basic.stn(basic.Line.BR, 20)] }, // BR20
        { station_codes: [basic.stn(basic.Line.BR, 21)] }, // BR21
        { station_codes: [basic.stn(basic.Line.BR, 22)] }, // BR22
        { station_codes: [basic.stn(basic.Line.BR, 23)] }, // BR23
        { station_codes: [basic.stn(basic.Line.BR, 24), basic.stn(basic.Line.BL, 23)] } // BR24: Nangang exhib center
    ]],

    // Yellow Line
    [basic.Line.Y, [
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.Y, 7), basic.stn(basic.Line.G, 4)] }, // Y07: Dapinglin
        { station_codes: [basic.stn(basic.Line.Y, 8)] }, // Y08
        { station_codes: [basic.stn(basic.Line.Y, 9)] }, // Y09
        { station_codes: [basic.stn(basic.Line.Y, 10)] }, // Y10
        { station_codes: [basic.stn(basic.Line.Y, 11), basic.stn(basic.Line.O, 2)] }, // Y11: Jingan
        { station_codes: [basic.stn(basic.Line.Y, 12)] }, // Y12
        { station_codes: [basic.stn(basic.Line.Y, 13)] }, // Y13
        { station_codes: [basic.stn(basic.Line.Y, 14)] }, // Y14
        { station_codes: [basic.stn(basic.Line.Y, 15)] }, // Y15
        { station_codes: [basic.stn(basic.Line.Y, 16), basic.stn(basic.Line.BL, 7)] }, // Y16: Banqiao
        { station_codes: [basic.stn(basic.Line.Y, 17), basic.stn(basic.Line.BL, 8)] }, // Y17: Xinpu Minsheng
        { station_codes: [basic.stn(basic.Line.Y, 18), basic.stn(basic.Line.O, 17)] }, // Y18: Touqianzhuang
        { station_codes: [basic.stn(basic.Line.Y, 19)] }, // Y19
        { station_codes: [basic.stn(basic.Line.Y, 20)] }, // Y20
    ]],

    // Orange Line
    [basic.Line.O, [
        INVALID_STATION_NODE,
        { station_codes: [basic.stn(basic.Line.O, 1)] }, // O01
        { station_codes: [basic.stn(basic.Line.O, 2), basic.stn(basic.Line.Y, 11)] }, // O02: Jingan
        { station_codes: [basic.stn(basic.Line.O, 3)] }, // O03
        { station_codes: [basic.stn(basic.Line.O, 4)] }, // O04
        { station_codes: [basic.stn(basic.Line.O, 5), basic.stn(basic.Line.G, 9)] }, // O05: Guting
        { station_codes: [basic.stn(basic.Line.O, 6), basic.stn(basic.Line.R, 7)] }, // O06: Dongmen
        { station_codes: [basic.stn(basic.Line.O, 7), basic.stn(basic.Line.BL, 14)] }, // O07: Zhongxiao Xinsheng
        { station_codes: [basic.stn(basic.Line.O, 8), basic.stn(basic.Line.G, 15)] }, // O08: Songjiang Nanjing
        { station_codes: [basic.stn(basic.Line.O, 9)] }, // O09
        { station_codes: [basic.stn(basic.Line.O, 10)] }, // O10
        { station_codes: [basic.stn(basic.Line.O, 11), basic.stn(basic.Line.R, 13)] }, // O11: Minquan W Road
        { station_codes: [basic.stn(basic.Line.O, 12)] }, // O12
        { station_codes: [basic.stn(basic.Line.O, 13)] }, // O13
        { station_codes: [basic.stn(basic.Line.O, 14)] }, // O14
        { station_codes: [basic.stn(basic.Line.O, 15)] }, // O15
        { station_codes: [basic.stn(basic.Line.O, 16)] }, // O16
        { station_codes: [basic.stn(basic.Line.O, 17), basic.stn(basic.Line.Y, 18)] }, // O17: Touqianzhuang
        { station_codes: [basic.stn(basic.Line.O, 18)] }, // O18
        { station_codes: [basic.stn(basic.Line.O, 19)] }, // O19
        { station_codes: [basic.stn(basic.Line.O, 20)] }, // O20
        { station_codes: [basic.stn(basic.Line.O, 21)] }, // O21
        INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, // 22-29 empty
        INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, // 30-39 empty
        INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, INVALID_STATION_NODE, // 40-49 empty
        { station_codes: [basic.stn(basic.Line.O, 50)] }, // O50
        { station_codes: [basic.stn(basic.Line.O, 51)] }, // O51
        { station_codes: [basic.stn(basic.Line.O, 52)] }, // O52
        { station_codes: [basic.stn(basic.Line.O, 53)] }, // O53
        { station_codes: [basic.stn(basic.Line.O, 54)] } // O54
    ]]
]);

// All transfer times in the system e.g. R10 to BL12, we can search TRANSFERS[R][10] and find the pair that has Station BL12 and find the int for how many mins the transfer takes
export type Transfer = [basic.Station, number];

export const TRANSFERS = new Map<basic.Line, Transfer[][]>([
    // Red line
    [basic.Line.R, [
        [],
        [],
        [], // R02
        [], // R03
        [], // R04
        [[basic.stn(basic.Line.BR, 9), 5]], // R05: Daan
        [], // R06
        [[basic.stn(basic.Line.O, 6), 1]], // R07: Dongmen
        [[basic.stn(basic.Line.G, 10), 1]], // R08: CKSMH
        [], // R09
        [[basic.stn(basic.Line.BL, 12), 4]], // R10: TPEMS
        [[basic.stn(basic.Line.G, 14), 3]], // R11: Zhongshan
        [], // R12
        [[basic.stn(basic.Line.O, 11), 3]], // R13: Minquan W Road
        [], [], [], [], [], [], // R14-19
        [], [], [], [], [], [], [], [], [] // R20-28
    ]],

    // Green line
    [basic.Line.G, [
        [],
        [], // G01
        [], // G02
        [], // G03
        [[basic.stn(basic.Line.Y, 7), 3]], // G04: Dapinglin
        [], // G05
        [], // G06
        [], // G07
        [], // G08
        [[basic.stn(basic.Line.O, 5), 1]], // G09: Guting
        [[basic.stn(basic.Line.R, 8), 1]], // G10: CKSMH
        [], // G11
        [[basic.stn(basic.Line.BL, 11), 1]], // G12: Ximen
        [], // G13
        [[basic.stn(basic.Line.R, 11), 3]], // G14: Zhongshan
        [[basic.stn(basic.Line.O, 8), 2]], // G15: Songjiang Nanjing
        [[basic.stn(basic.Line.BR, 11), 5]], // G16: Nanjing Fuxing
        [], // G17
        [], // G18
        [] // G19
    ]],

    // Blue line
    [basic.Line.BL, [
        [],
        [], [], [], [], [], [], // BL1-6
        [[basic.stn(basic.Line.Y, 16), 11]], // BL07: Banqiao
        [[basic.stn(basic.Line.Y, 17), 9]], // BL08: Xinpu
        [], // BL09
        [], // BL10
        [[basic.stn(basic.Line.G, 12), 1]], // BL11: Ximen
        [[basic.stn(basic.Line.R, 10), 4]], // BL12: TPEMS
        [], // BL13
        [[basic.stn(basic.Line.O, 7), 3]], // BL14: Zhongxiao Xinsheng
        [[basic.stn(basic.Line.BR, 10), 5]], // BL15: Zhongxiao Fuxing
        [], [], [], [], [], [], [], // BL16-22
        [[basic.stn(basic.Line.BR, 24), 6]] // BL23: Nangang exhib center
    ]],

    // Brown line
    [basic.Line.BR, [
        [],
        [], [], [], [], [], [], [], [], // BR1-8
        [[basic.stn(basic.Line.R, 5), 5]], // BR09: Daan
        [[basic.stn(basic.Line.BL, 15), 5]], // BR10: Zhongxiao Fuxing
        [[basic.stn(basic.Line.G, 16), 5]], // BR11: Nanjing Fuxing
        [], [], [], [], [], [], [], [], [], [], [], [], // BR12-23
        [[basic.stn(basic.Line.BL, 23), 6]], // BR24: Nangang exhib center
    ]],

    // Yellow line
    [basic.Line.Y, [
        [],
        [], [], [], [], [], [], // No Y1-6
        [[basic.stn(basic.Line.G, 4), 3]], // Y07: Dapinglin
        [], // Y08
        [], // Y09
        [], // Y10
        [[basic.stn(basic.Line.O, 2), 6]], // Y11: Jingan
        [], // Y12
        [], // Y13
        [], // Y14
        [], // Y15
        [[basic.stn(basic.Line.BL, 7), 11]], // Y16: Banqiao
        [[basic.stn(basic.Line.BL, 8), 9]], // Y17: Xinpu Minsheng
        [[basic.stn(basic.Line.O, 17), 6]], // Y18: Touqianzhuang
        [], // Y19
        [] // Y20
    ]],

    // Orange line
    [basic.Line.O, [
        [],
        [], // O01
        [[basic.stn(basic.Line.Y, 11), 6]], // O02: Jingan
        [], // O03
        [], // O04
        [[basic.stn(basic.Line.G, 9), 1]], // O05: Guting
        [[basic.stn(basic.Line.R, 7), 1]], // O06: DOngmen
        [[basic.stn(basic.Line.BL, 14), 3]], // O07: Zhongxiao Xinsheng
        [[basic.stn(basic.Line.G, 15), 2]], // O08: Songjiang Nanjing
        [], // O09
        [], // O10
        [[basic.stn(basic.Line.R, 13), 3]], // O11: Minquan W Road
        [], [], [], [], [], // O12-16
        [[basic.stn(basic.Line.Y, 18), 6]], // O17: Touqianzhuang
        [], [], [], [], // O18-21
        [], [], [], [], [], [], [], [], // empty 22-29
        [], [], [], [], [], [], [], [], [], // empty 31-39
        [], [], [], [], [], [], [], [], [], // empty 41-49
        [], [], [], [], [] // O50-54
    ]]
]);

// ======= FUNCTIONS ======= //
// Get physical station node (undefined if none)
export function getStationNode(stn_code: basic.Station): StationNode | undefined {
    const line_nodes = STATION_NODES.get(stn_code.line);
    if (!line_nodes) {
        return undefined;
    }

    return line_nodes[stn_code.stn_num];
}

// Is stn part of a transfer
export function isTransfer(stn_code: basic.Station): boolean {
    const node = getStationNode(stn_code);
    return node !== undefined && node.station_codes.length > 1;
}

// All transfers from stn
export function getTransfers(stn_code: basic.Station): Transfer[] {
    const line_transfers = TRANSFERS.get(stn_code.line);
    if (!line_transfers) {
        return [];
    }

    return line_transfers[stn_code.stn_num] ?? [];
}

export function canTransfer(from: basic.Station, to: basic.Station): boolean {
    try {
        getTransferTime(from, to);
        return true;
    } catch {
        return false;
    }
}

// Get transfer time (error if non transferrable)
export function getTransferTime(from: basic.Station, to: basic.Station): number {
    if (basic.sameStation(from, to)) {
        return 0;
    }

    const found = getTransfers(from).find(([target]) => basic.sameStation(target, to));

    if (found) {
        return found[1];
    } else {
        throw new Error("Station to is not transferrable from Station from");
    }
}

// All equivalent station codes at the same physical station
export function getEquivalentStations(stn_code: basic.Station): basic.Station[] {
    const node = getStationNode(stn_code);
    return node ? node.station_codes : [];
}

export function strStnVector(stn_vec: basic.Station[]): string {
    return stn_vec.map(basic.stationToCode).join(", ");
}

export function strTransfersVector(trans_vec: Transfer[]): string {
    return trans_vec
        .map(([station, mins]) => `${basic.stationToCode(station)}(${mins})`)
        .join("\n");
}

// Returns stations where you can transfer between the lines
export function getLineTransferStations(a: basic.Line, b: basic.Line): [StationNode, number][] {
    // Search for line a ones in line b

    const stn_nodes: [StationNode, number][] = [];
  
    const line_transfers = TRANSFERS.get(b);
  
    if (!line_transfers) {
        return [];
    }
  
    for (const stn_transfers of line_transfers) {
        for (const stn_pair of stn_transfers) {
            if (stn_pair[0].line === a) {
    
            const node = getStationNode(stn_pair[0]);
    
                if (node) {
                    stn_nodes.push([node, stn_pair[1]]);
                }
            }
        }
    }
  
    return stn_nodes;
}