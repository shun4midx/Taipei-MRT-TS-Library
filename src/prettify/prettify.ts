/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: prettify.ts                         *
 ****************************************** */

// Prettify structures when printing them out to be visible, or just like converting between natural language and station codes

import * as basic from "../utils/basic";
import * as transfer from "../utils/transfer";
import * as cost from "../utils/cost";
import * as path_duration from "../utils/path_duration";

// ======== DEFINITIONS ======= //

export const LINE_EMOJIS = new Map<basic.Line, string>([
    [basic.Line.R, "🟥"],
    [basic.Line.O, "🟧"],
    [basic.Line.Y, "🟨"],
    [basic.Line.G, "🟩"],
    [basic.Line.BL, "🟦"],
    [basic.Line.BR, "🟫"],
]);

export const MINS = new Map<basic.Language, string>([
    [basic.Language.en, " min"],
    [basic.Language.zh, "分鐘"],
    [basic.Language.jp, "分"],
    [basic.Language.kr, "분"],
]);

// ======== MISC OUTPUT STUFF ======== //

export function colon(lang: basic.Language): string {
    return (lang === basic.Language.en || lang === basic.Language.kr) ? ": " : "：";
}

// ======== STATION I/O TO USER ======== //

export function prettifyStation(stn: basic.Station, lang: basic.Language = basic.Language.zh): string {
    return `${basic.getName(stn, lang)} ${LINE_EMOJIS.get(stn.line)!} ${basic.stationToCode(stn)}`;
}

// ======== PATH OUTPUTS ======== //

export function stationTimeToStr(st: path_duration.StationTime, lang: basic.Language = basic.Language.zh): string {
    if (lang === basic.Language.en) {
        return `Arriving at ${basic.timeToStr(st.arrive)} / Departing at ${basic.timeToStr(st.depart)}`;
    } else if (lang === basic.Language.zh) {
        return `${basic.timeToStr(st.arrive)}抵達 / ${basic.timeToStr(st.depart)}離開`;
    } else if (lang === basic.Language.jp) {
        return `${basic.timeToStr(st.arrive)}到着 / ${basic.timeToStr(st.depart)}出発`;
    } else if (lang === basic.Language.kr) {
        return `${basic.timeToStr(st.arrive)}도착 / ${basic.timeToStr(st.depart)}출발`;
    }

    throw new Error("Invalid language");
}

export function pathTimesToStr(pt: path_duration.PathTimes, lang: basic.Language = basic.Language.zh): string {
    let result = "";

    for (const t of pt) {
        result += stationTimeToStr(t, lang) + "\n";
    }

    if (result.length > 0) {
        result = result.slice(0, -1);
    }

    return result;
}

function ticketTypeToStr(tt: cost.TicketType, lang: basic.Language): string {
    if (tt === cost.TicketType.ADULT) {
        if (lang === basic.Language.en) {
            return "Adult ";
        } else if (lang === basic.Language.zh) {
            return "成人 ";
        } else if (lang === basic.Language.jp) {
            return "大人 ";
        } else if (lang === basic.Language.kr) {
            return "성인 ";
        }
    } else if (tt === cost.TicketType.CHILD) {
        if (lang === basic.Language.en) {
            return "Child ";
        } else if (lang === basic.Language.zh) {
            return "兒童 ";
        } else if (lang === basic.Language.jp) {
            return "子供 ";
        } else if (lang === basic.Language.kr) {
            return "어린이 ";
        }
    } else if (tt === cost.TicketType.ELDERLY) {
        if (lang === basic.Language.en) {
            return "Elderly ";
        } else if (lang === basic.Language.zh) {
            return "敬老 ";
        } else if (lang === basic.Language.jp) {
            return "高齢者 ";
        } else if (lang === basic.Language.kr) {
            return "노인 ";
        }
    }

    return "";
}

function lineEmojiSequence(p: path_duration.Path): string {
    let output = LINE_EMOJIS.get(p[0]!.line)!;
    let curr_line = p[0]!.line;

    for (const stn of p) {
        if (stn.line !== curr_line) {
            output += LINE_EMOJIS.get(stn.line)!;
            curr_line = stn.line;
        }
    }

    return output;
}

export function pathHeaderStr(p: path_duration.Path, pt_or_pm: path_duration.PathTimes | path_duration.PathMins, lang: basic.Language = basic.Language.zh, tt: cost.TicketType = cost.TicketType.ADULT): string {
    if (p.length === 0 || pt_or_pm.length === 0) {
        throw new Error("Empty path or time list");
    }

    let duration: number;

    if (typeof pt_or_pm[0] === "number") {
        const pm = pt_or_pm as path_duration.PathMins;
        duration = pm[pm.length - 1]! - pm[0]!;
    } else {
        const pt = pt_or_pm as path_duration.PathTimes;
        duration =
            basic.timeToMins(pt[pt.length - 1]!.depart)
            - basic.timeToMins(pt[0]!.arrive);
    }

    let output =
        `${duration}${MINS.get(lang)!} `
        + `$${cost.travelPrice(p[0]!, p[p.length - 1]!, tt, duration > 120)} `;

    if (typeof pt_or_pm[0] !== "number") {
        output += ticketTypeToStr(tt, lang);
    }

    output += lineEmojiSequence(p);
    output += "\n";

    return output;
}

export function namedPathTimesToStr(p: path_duration.Path, pt: path_duration.PathTimes, lang: basic.Language = basic.Language.zh, tt: cost.TicketType = cost.TicketType.ADULT): string {
    if (p.length !== pt.length) {
        throw new Error("Path size != PathTimes size");
    }

    let result = pathHeaderStr(p, pt, lang, tt);

    let brown_warning = false;

    for (let i = 0; i < p.length; ++i) {
        result += prettifyStation(p[i]!, lang)
            + colon(lang)
            + stationTimeToStr(pt[i]!, lang)
            + "\n";

        if (p[i]!.line === basic.Line.BR) {
            brown_warning = true;
        }
    }

    if (brown_warning) {
        if (lang === basic.Language.en) {
            result += "⚠️ The train arrival times for the brown line stations are the WORST CASE SCENARIO only and do not reflect current conditions.\n";
        } else if (lang === basic.Language.zh) {
            result += "⚠️ 以上顯示文湖線的列車到達時間，都是以最壞狀況計算，且並非反映現實路線狀況。\n";
        } else if (lang === basic.Language.jp) {
            result += "⚠️ 上記の文湖線（茶色の線）の列車の到着時間は最悪の状況下で計算されており、実際の路線状況を反映するものではありません。\n";
        } else if (lang === basic.Language.kr) {
            result += "⚠️ 위에 표시된 원후선(갈색선) 열차 도착 시간은 최악의 상황을 가정하여 계산된 것이며 실제 운행 상황을 반영하지 않습니다.\n";
        }
    }

    if (result.length > 0) {
        result = result.slice(0, -1);
    }

    return result;
}

export function pathToStr(p: path_duration.Path): string {
    let result = "";

    for (const stn of p) {
        result += basic.stationToCode(stn) + " ";
    }

    if (result.length > 0) {
        result = result.slice(0, -1);
    }

    return result;
}

export function pathMinsToStr(pm: path_duration.PathMins): string {
    let output = "";

    for (const m of pm) {
        output += `${m} `;
    }

    if (output.length > 0) {
        output = output.slice(0, -1);
    }

    return output;
}

export function namedPathMinsToStr(p: path_duration.Path, pm: path_duration.PathMins, lang: basic.Language = basic.Language.zh, tt: cost.TicketType = cost.TicketType.ADULT): string {
    if (p.length !== pm.length) {
        throw new Error("Path size != PathMins size");
    }

    let result = pathHeaderStr(p, pm, lang, tt);

    for (let i = 0; i < p.length; ++i) {
        result += prettifyStation(p[i]!, lang)
            + colon(lang)
            + `${pm[i]!}${MINS.get(lang)!}`
            + "\n";
    }

    if (result.length > 0) {
        result = result.slice(0, -1);
    }

    return result;
}

// ======== PATH I/O TO USER ======== //

export function pathDetailsToUser(p: path_duration.Path, begin_time_or_lang: basic.Time | basic.Language = basic.Language.zh, day_type_or_tt: number | cost.TicketType = cost.TicketType.ADULT, lang: basic.Language = basic.Language.zh, tt: cost.TicketType = cost.TicketType.ADULT): string {
    if (typeof begin_time_or_lang === "object") {
        const begin_time = begin_time_or_lang;
        const day_type = day_type_or_tt as number;

        const pt = path_duration.pathETA(p, begin_time, day_type);
        return namedPathTimesToStr(p, pt, lang, tt);
    }

    const real_lang = begin_time_or_lang;
    const real_tt = day_type_or_tt as cost.TicketType;

    const pm = path_duration.perfectPathETA(p);
    return namedPathMinsToStr(p, pm, real_lang, real_tt);
}

// ======== TRANSFER I/O TO USER ======== //

export function transferLinesToUser(a: basic.Line, b: basic.Line, lang: basic.Language = basic.Language.zh): string {
    const int_stns = transfer.getLineTransferStations(a, b);

    let output = "";

    for (const stn of int_stns) {
        output += basic.getName(stn[0].station_codes[0]!, lang);

        for (const s of stn[0].station_codes) {
            if (s.line === a || s.line === b) {
                output += ` ${LINE_EMOJIS.get(s.line)!} ${basic.stationToCode(s)}`;
            }
        }

        output += colon(lang) + `${stn[1]}${MINS.get(lang)!}` + "\n";
    }

    if (output.length > 0) {
        output = output.slice(0, -1);
    }

    return output;
}

export function allStnCodesToUser(stn: basic.Station, lang: basic.Language = basic.Language.zh): string {
    let output = "";

    const equiv_stns = transfer.getEquivalentStations(stn);

    output += basic.getName(stn, lang) + colon(lang);

    for (const s of equiv_stns) {
        output += `${LINE_EMOJIS.get(s.line)!} ${basic.stationToCode(s)} `;
    }

    if (output.length > 0) {
        output = output.slice(0, -1);
    }

    return output;
}