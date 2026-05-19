/********************************************
 * Copyright (c) 2026 Shun/修海 (@shun4midx) *
 * Project: Taipei-MRT-TS-Library           *
 * File Type: TypeScript file               *
 * File: basic.ts                           *
 ****************************************** */

// ======== ENUMS AND TYPES ======== //

export enum Language {
    zh = 0,
    en = 1,
    jp = 2,
    kr = 3,
}

export enum Line {
    R = 0,
    O = 1,
    G = 2,
    BL = 3,
    BR = 4,
    Y = 5,
}

export type Station = {
    line: Line,
    stn_num: number;
};

export type Time = {
    hr: number,
    min: number;
};

// ======== BASIC INFORMATION ======== //
export const INVALID = "N/A";

export const INVALID_STATION: Station = { line: Line.R, stn_num: -1 };
export const INVALID_TIME: Time = { hr: -1, min: -1 };

export const LINE_TO_STR = new Map<Line, string>([
    [Line.R, "R"],
    [Line.O, "O"],
    [Line.G, "G"],
    [Line.BL, "BL"],
    [Line.BR, "BR"],
    [Line.Y, "Y"],
]);

export const LINES = new Map<string, Line>([
    ["R", Line.R],
    ["O", Line.O],
    ["G", Line.G],
    ["BL", Line.BL],
    ["BR", Line.BR],
    ["Y", Line.Y],
]);

export const stn = (line: Line, stn_num: number): Station => ({ line, stn_num });

// For convenience, we make the array index align with the number of the station (except for orange line, that's an exception, for O50 branch we minus 50)
type StationNames = Record<Language, string>;

export const R_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "象山", [Language.en]: "Xiangshan", [Language.jp]: "象山", [Language.kr]: "샹산"}, // R02
    {[Language.zh]: "台北101/世貿", [Language.en]: "Taipei 101/World Trade Center", [Language.jp]: "台北101/世界貿易センター", [Language.kr]: "타이베이101/세계무역센터"}, // R03
    {[Language.zh]: "信義安和", [Language.en]: "Xinyi Anhe", [Language.jp]: "信義安和", [Language.kr]: "신이 안허"}, // R04
    {[Language.zh]: "大安", [Language.en]: "Daan", [Language.jp]: "大安", [Language.kr]: "다안"}, // R05
    {[Language.zh]: "大安森林公園", [Language.en]: "Daan Park", [Language.jp]: "大安森林公園", [Language.kr]: "다안 삼림 공원"}, // R06
    {[Language.zh]: "東門", [Language.en]: "Dongmen", [Language.jp]: "東門", [Language.kr]: "둥먼"}, // R07
    {[Language.zh]: "中正紀念堂", [Language.en]: "Chiang Kai-Shek Memorial Hall", [Language.jp]: "中正紀念堂", [Language.kr]: "중정 기념당"}, // R08
    {[Language.zh]: "台大醫院", [Language.en]: "NTU Hospital", [Language.jp]: "台湾大学病院", [Language.kr]: "대만 대학 병원"}, // R09
    {[Language.zh]: "台北車站", [Language.en]: "Taipei Main Station", [Language.jp]: "台北駅", [Language.kr]: "타이베이 역"}, // R10
    {[Language.zh]: "中山", [Language.en]: "Zhongshan", [Language.jp]: "中山", [Language.kr]: "중산"}, // R11
    {[Language.zh]: "雙連", [Language.en]: "Shuanglian", [Language.jp]: "双連", [Language.kr]: "솽롄"}, // R12
    {[Language.zh]: "民權西路", [Language.en]: "Minquan W. Rd.", [Language.jp]: "民権西路", [Language.kr]: "민취안시루"}, // R13
    {[Language.zh]: "圓山", [Language.en]: "Yuanshan", [Language.jp]: "圓山", [Language.kr]: "위안산"}, // R14
    {[Language.zh]: "劍潭", [Language.en]: "Jiantan", [Language.jp]: "剣潭", [Language.kr]: "젠탄"}, // R15
    {[Language.zh]: "士林", [Language.en]: "Shilin", [Language.jp]: "士林", [Language.kr]: "스린"}, // R16
    {[Language.zh]: "芝山", [Language.en]: "Zhishan", [Language.jp]: "芝山", [Language.kr]: "즈산"}, // R17
    {[Language.zh]: "明德", [Language.en]: "Mingde", [Language.jp]: "明徳", [Language.kr]: "밍더"}, // R18
    {[Language.zh]: "石牌", [Language.en]: "Shipai", [Language.jp]: "石牌", [Language.kr]: "스파이"}, // R19
    {[Language.zh]: "唭哩岸", [Language.en]: "Qilian", [Language.jp]: "唭哩岸", [Language.kr]: "치리안"}, // R20
    {[Language.zh]: "奇岩", [Language.en]: "Qiyan", [Language.jp]: "奇岩", [Language.kr]: "치옌"}, // R21
    {[Language.zh]: "北投", [Language.en]: "Beitou", [Language.jp]: "北投", [Language.kr]: "베이터우"}, // R22
    {[Language.zh]: "復興崗", [Language.en]: "Fuxinggang", [Language.jp]: "復興崗", [Language.kr]: "푸싱강"}, // R23
    {[Language.zh]: "忠義", [Language.en]: "Zhongyi", [Language.jp]: "忠義", [Language.kr]: "중이"}, // R24
    {[Language.zh]: "關渡", [Language.en]: "Guandu", [Language.jp]: "関渡", [Language.kr]: "관두"}, // R25
    {[Language.zh]: "竹圍", [Language.en]: "Zhuwei", [Language.jp]: "竹囲", [Language.kr]: "주웨이"}, // R26
    {[Language.zh]: "紅樹林", [Language.en]: "Hongshulin", [Language.jp]: "紅樹林", [Language.kr]: "훙수린"}, // R27
    {[Language.zh]: "淡水", [Language.en]: "Tamsui", [Language.jp]: "淡水", [Language.kr]: "단수이"} // R28
];

export const G_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "新店", [Language.en]: "Xindian", [Language.jp]: "新店", [Language.kr]: "신뎬"}, // G01
    {[Language.zh]: "新店區公所", [Language.en]: "Xindian District Office", [Language.jp]: "新店区役所", [Language.kr]: "신뎬 구청"}, // G02
    {[Language.zh]: "七張", [Language.en]: "Qizhang", [Language.jp]: "七張", [Language.kr]: "치장"}, // G03
    {[Language.zh]: "大坪林", [Language.en]: "Dapinglin", [Language.jp]: "大坪林", [Language.kr]: "다핑린"}, // G04
    {[Language.zh]: "景美", [Language.en]: "Jingmei", [Language.jp]: "景美", [Language.kr]: "징메이"}, // G05
    {[Language.zh]: "萬隆", [Language.en]: "Wanlong", [Language.jp]: "万隆", [Language.kr]: "완룽"}, // G06
    {[Language.zh]: "公館", [Language.en]: "Gongguan", [Language.jp]: "公館", [Language.kr]: "궁관"}, // G07
    {[Language.zh]: "台電大樓", [Language.en]: "Taipower Building", [Language.jp]: "台湾電力ビル", [Language.kr]: "대만 전력공사 빌딩"}, // G08
    {[Language.zh]: "古亭", [Language.en]: "Guting", [Language.jp]: "古亭", [Language.kr]: "구팅"}, // G09
    {[Language.zh]: "中正紀念堂", [Language.en]: "Chiang Kai-Shek Memorial Hall", [Language.jp]: "中正紀念堂", [Language.kr]: "중정 기념당"}, // G10
    {[Language.zh]: "小南門", [Language.en]: "Xiaonanmen", [Language.jp]: "小南門", [Language.kr]: "샤오난먼"}, // G11
    {[Language.zh]: "西門", [Language.en]: "Ximen", [Language.jp]: "西門", [Language.kr]: "시먼"}, // G12
    {[Language.zh]: "北門", [Language.en]: "Beimen", [Language.jp]: "北門", [Language.kr]: "베이머"}, // G13
    {[Language.zh]: "中山", [Language.en]: "Zhongshan", [Language.jp]: "中山", [Language.kr]: "중산"}, // G14
    {[Language.zh]: "松江南京", [Language.en]: "Songjiang Nanjing", [Language.jp]: "松江南京", [Language.kr]: "송장 난징"}, // G15
    {[Language.zh]: "南京復興", [Language.en]: "Nanjing Fuxing", [Language.jp]: "南京復興", [Language.kr]: "난징 푸싱"}, // G16
    {[Language.zh]: "台北小巨蛋", [Language.en]: "Taipei Arena", [Language.jp]: "台北アリーナ", [Language.kr]: "타이베이 아레나"}, // G17
    {[Language.zh]: "南京三民", [Language.en]: "Nanjing Sanmin", [Language.jp]: "南京三民", [Language.kr]: "난징 싼민"}, // G18
    {[Language.zh]: "松山", [Language.en]: "Songshan", [Language.jp]: "松山", [Language.kr]: "송산"} // G19
];

export const BL_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "頂埔", [Language.en]: "Dingpu", [Language.jp]: "頂埔", [Language.kr]: "딩푸"}, // BL01
    {[Language.zh]: "永寧", [Language.en]: "Yongning", [Language.jp]: "永寧", [Language.kr]: "융닝"}, // BL02
    {[Language.zh]: "土城", [Language.en]: "Tucheng", [Language.jp]: "土城", [Language.kr]: "투청"}, // BL03
    {[Language.zh]: "海山", [Language.en]: "Haishan", [Language.jp]: "海山", [Language.kr]: "하이산"}, // BL04
    {[Language.zh]: "亞東醫院", [Language.en]: "Far Eastern Hospital", [Language.jp]: "亜東病院", [Language.kr]: "야둥 병원"}, // BL05
    {[Language.zh]: "府中", [Language.en]: "Fuzhong", [Language.jp]: "府中", [Language.kr]: "푸중"}, // BL06
    {[Language.zh]: "板橋", [Language.en]: "Banqiao", [Language.jp]: "板橋", [Language.kr]: "반차오"}, // BL07
    {[Language.zh]: "新埔", [Language.en]: "Xinpu", [Language.jp]: "新埔", [Language.kr]: "신푸"}, // BL08
    {[Language.zh]: "江子翠", [Language.en]: "Jiangzicui", [Language.jp]: "江子翠", [Language.kr]: "장쯔추이"}, // BL09
    {[Language.zh]: "龍山寺", [Language.en]: "Longshan Temple", [Language.jp]: "龍山寺", [Language.kr]: "용산사"}, // BL10
    {[Language.zh]: "西門", [Language.en]: "Ximen", [Language.jp]: "西門", [Language.kr]: "시먼"}, // BL11
    {[Language.zh]: "台北車站", [Language.en]: "Taipei Main Station", [Language.jp]: "台北駅", [Language.kr]: "타이베이 역"}, // BL12
    {[Language.zh]: "善導寺", [Language.en]: "Shandao Temple", [Language.jp]: "善導寺", [Language.kr]: "산다오사"}, // BL13
    {[Language.zh]: "忠孝新生", [Language.en]: "Zhongxiao Xinsheng", [Language.jp]: "忠孝新生", [Language.kr]: "중샤오 신성"}, // BL14
    {[Language.zh]: "忠孝復興", [Language.en]: "Zhongxiao Fuxing", [Language.jp]: "忠孝復興", [Language.kr]: "중샤오 푸싱"}, // BL15
    {[Language.zh]: "忠孝敦化", [Language.en]: "Zhongxiao Dunhua", [Language.jp]: "忠孝敦化", [Language.kr]: "중샤오 둔화"}, // BL16
    {[Language.zh]: "國父紀念館", [Language.en]: "Sun Yat-Sen Memorial Hall", [Language.jp]: "国父紀念館", [Language.kr]: "국부 기념관"}, // BL17
    {[Language.zh]: "市政府", [Language.en]: "Taipei City Hall", [Language.jp]: "台北市政府", [Language.kr]: "타이베이 시청"}, // BL18
    {[Language.zh]: "永春", [Language.en]: "Yongchun", [Language.jp]: "永春", [Language.kr]: "융춘"}, // BL19
    {[Language.zh]: "後山埤", [Language.en]: "Houshanpi", [Language.jp]: "後山埤", [Language.kr]: "허우산피"}, // BL20
    {[Language.zh]: "昆陽", [Language.en]: "Kunyang", [Language.jp]: "昆陽", [Language.kr]: "쿤양"}, // BL21
    {[Language.zh]: "南港", [Language.en]: "Nangang", [Language.jp]: "南港", [Language.kr]: "난강"}, // BL22
    {[Language.zh]: "南港展覽館", [Language.en]: "Taipei Nangang Exhibition Center", [Language.jp]: "南港展覧館", [Language.kr]: "난강 전람관"} // BL23
];

export const BR_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "動物園", [Language.en]: "Taipei Zoo", [Language.jp]: "動物園", [Language.kr]: "동물원"}, // BR01
    {[Language.zh]: "木柵", [Language.en]: "Muzha", [Language.jp]: "木柵", [Language.kr]: "무자"}, // BR02
    {[Language.zh]: "萬芳社區", [Language.en]: "Wanfang Community", [Language.jp]: "万芳コミュニティ", [Language.kr]: "완팡 단지"}, // BR03
    {[Language.zh]: "萬芳醫院", [Language.en]: "Wanfang Hospital", [Language.jp]: "万芳病院", [Language.kr]: "완팡 병원"}, // BR04
    {[Language.zh]: "辛亥", [Language.en]: "Xinhai", [Language.jp]: "辛亥", [Language.kr]: "신하이"}, // BR05
    {[Language.zh]: "麟光", [Language.en]: "Linguang", [Language.jp]: "麟光", [Language.kr]: "린광"}, // BR06
    {[Language.zh]: "六張犁", [Language.en]: "Liuzhangli", [Language.jp]: "六張犁", [Language.kr]: "류장리"}, // BR07
    {[Language.zh]: "科技大樓", [Language.en]: "Technology Building", [Language.jp]: "テクノロジービル", [Language.kr]: "테크놀로지 빌딩"}, // BR08
    {[Language.zh]: "大安", [Language.en]: "Daan", [Language.jp]: "大安", [Language.kr]: "다안"}, // BR09
    {[Language.zh]: "忠孝復興", [Language.en]: "Zhongxiao Fuxing", [Language.jp]: "忠孝復興", [Language.kr]: "중샤오 푸싱"}, // BR10
    {[Language.zh]: "南京復興", [Language.en]: "Nanjing Fuxing", [Language.jp]: "南京復興", [Language.kr]: "난징 푸싱"}, // BR11
    {[Language.zh]: "中山國中", [Language.en]: "Zhongshan Junior High School", [Language.jp]: "中山中学校", [Language.kr]: "중산 중학교"}, // BR12
    {[Language.zh]: "松山機場", [Language.en]: "Songshan Airport", [Language.jp]: "松山空港", [Language.kr]: "송산 공항"}, // BR13
    {[Language.zh]: "大直", [Language.en]: "Dazhi", [Language.jp]: "大直", [Language.kr]: "다즈"}, // BR14
    {[Language.zh]: "劍南路", [Language.en]: "Jiannan Rd.", [Language.jp]: "剣南路", [Language.kr]: "젠난루"}, // BR15
    {[Language.zh]: "西湖", [Language.en]: "Xihu", [Language.jp]: "西湖", [Language.kr]: "시후"}, // BR16
    {[Language.zh]: "港墘", [Language.en]: "Gangqian", [Language.jp]: "港墘", [Language.kr]: "강첸"}, // BR17
    {[Language.zh]: "文德", [Language.en]: "Wende", [Language.jp]: "文徳", [Language.kr]: "원더"}, // BR18
    {[Language.zh]: "內湖", [Language.en]: "Neihu", [Language.jp]: "内湖", [Language.kr]: "네이후"}, // BR19
    {[Language.zh]: "大湖公園", [Language.en]: "Dahu Park", [Language.jp]: "大湖公園", [Language.kr]: "다후 공원"}, // BR20
    {[Language.zh]: "葫州", [Language.en]: "Huzhou", [Language.jp]: "葫洲", [Language.kr]: "후저우"}, // BR21
    {[Language.zh]: "東湖", [Language.en]: "Donghu", [Language.jp]: "東湖", [Language.kr]: "둥후"}, // BR22
    {[Language.zh]: "南港軟體園區", [Language.en]: "Nangang Software Park", [Language.jp]: "南港ソフトウェアパーク", [Language.kr]: "난강 소프트웨어 단지"}, // BR23
    {[Language.zh]: "南港展覽館", [Language.en]: "Taipei Nangang Exhibition Center", [Language.jp]: "南港展覧館", [Language.kr]: "난강 전람관"} // BR24
];

export const Y_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "大坪林", [Language.en]: "Dapinglin", [Language.jp]: "大坪林", [Language.kr]: "다핑린"}, // Y07
    {[Language.zh]: "十四張", [Language.en]: "Shisizhang", [Language.jp]: "十四張", [Language.kr]: "스쓰장"}, // Y08
    {[Language.zh]: "秀朗橋", [Language.en]: "Xiulang Bridge", [Language.jp]: "秀朗橋", [Language.kr]: "시우랑챠오"}, // Y09
    {[Language.zh]: "景平", [Language.en]: "Jingping", [Language.jp]: "景平", [Language.kr]: "징핑"}, // Y10
    {[Language.zh]: "景安", [Language.en]: "Jingan", [Language.jp]: "景安", [Language.kr]: "징안"}, // Y11
    {[Language.zh]: "中和", [Language.en]: "Zhonghe", [Language.jp]: "中和", [Language.kr]: "중허"}, // Y12
    {[Language.zh]: "橋和", [Language.en]: "Qiaohe", [Language.jp]: "橋和", [Language.kr]: "챠오허"}, // Y13
    {[Language.zh]: "中原", [Language.en]: "Zhongyuan", [Language.jp]: "中原", [Language.kr]: "중위엔"}, // Y14
    {[Language.zh]: "板新", [Language.en]: "Banxin", [Language.jp]: "板新", [Language.kr]: "반신"}, // Y15
    {[Language.zh]: "板橋", [Language.en]: "Banqiao", [Language.jp]: "板橋", [Language.kr]: "반차오"}, // Y16
    {[Language.zh]: "新埔民生", [Language.en]: "Xinpu Minsheng", [Language.jp]: "新埔民生", [Language.kr]: "신푸민셩"}, // Y17
    {[Language.zh]: "頭前庄", [Language.en]: "Touqianzhuang", [Language.jp]: "頭前庄", [Language.kr]: "터우첸좡"}, // Y18
    {[Language.zh]: "幸福", [Language.en]: "Xingfu", [Language.jp]: "幸福", [Language.kr]: "씽푸"}, // Y19
    {[Language.zh]: "新北產業園區", [Language.en]: "New Taipei Industrial Park", [Language.jp]: "新北産業園区", [Language.kr]: "신베이 산업원 단지"} // Y20
];

export const O01_NAMES: StationNames[] = [
    {[Language.zh]: INVALID, [Language.en]: INVALID, [Language.jp]: INVALID, [Language.kr]: INVALID},
    {[Language.zh]: "南勢角", [Language.en]: "Nanshijiao", [Language.jp]: "南勢角", [Language.kr]: "난스자오"}, // O01
    {[Language.zh]: "景安", [Language.en]: "Jingan", [Language.jp]: "景安", [Language.kr]: "징안"}, // O02
    {[Language.zh]: "永安市場", [Language.en]: "Yongan Market", [Language.jp]: "永安市場", [Language.kr]: "융안 시장"}, // O03
    {[Language.zh]: "頂溪", [Language.en]: "Dingxi", [Language.jp]: "頂渓", [Language.kr]: "딩시"}, // O04
    {[Language.zh]: "古亭", [Language.en]: "Guting", [Language.jp]: "古亭", [Language.kr]: "구팅"}, // O05
    {[Language.zh]: "東門", [Language.en]: "Dongmen", [Language.jp]: "東門", [Language.kr]: "둥먼"}, // O06
    {[Language.zh]: "忠孝新生", [Language.en]: "Zhongxiao Xinsheng", [Language.jp]: "忠孝新生", [Language.kr]: "중샤오 신성"}, // O07
    {[Language.zh]: "松江南京", [Language.en]: "Songjiang Nanjing", [Language.jp]: "松江南京", [Language.kr]: "송장 난징"}, // O08
    {[Language.zh]: "行天宮", [Language.en]: "Xingtian Temple", [Language.jp]: "行天宮", [Language.kr]: "싱톈궁"}, // O09
    {[Language.zh]: "中山國小", [Language.en]: "Zhongshan Elementary School", [Language.jp]: "中山小学校", [Language.kr]: "중산 초등학교"}, // O10
    {[Language.zh]: "民權西路", [Language.en]: "Minquan W. Rd.", [Language.jp]: "民権西路", [Language.kr]: "민취안시루"}, // O11
    {[Language.zh]: "大橋頭", [Language.en]: "Daqiaotou", [Language.jp]: "大橋頭", [Language.kr]: "다차오터우"}, // O12
    // ~~~~~~~~ Y SHAPE SPLIT ~~~~~~~~~ //
    {[Language.zh]: "台北橋", [Language.en]: "Taipei Bridge", [Language.jp]: "台北橋", [Language.kr]: "타이베이 대교"}, // O13
    {[Language.zh]: "菜寮", [Language.en]: "Cailiao", [Language.jp]: "菜寮", [Language.kr]: "차이랴오"}, // O14
    {[Language.zh]: "三重", [Language.en]: "Sanchong", [Language.jp]: "三重", [Language.kr]: "싼충"}, // O15
    {[Language.zh]: "先嗇宮", [Language.en]: "Xianse Temple", [Language.jp]: "先嗇宮", [Language.kr]: "셴써궁"}, // O16
    {[Language.zh]: "頭前庄", [Language.en]: "Touqianzhuang", [Language.jp]: "頭前庄", [Language.kr]: "터우첸좡"}, // O17
    {[Language.zh]: "新莊", [Language.en]: "Xinzhuang", [Language.jp]: "新荘", [Language.kr]: "신좡"}, // O18
    {[Language.zh]: "輔大", [Language.en]: "Fu Jen University", [Language.jp]: "輔仁大学", [Language.kr]: "푸런 대학교"}, // O19
    {[Language.zh]: "丹鳳", [Language.en]: "Danfeng", [Language.jp]: "丹鳳", [Language.kr]: "단펑"}, // O20
    {[Language.zh]: "迴龍", [Language.en]: "Huilong", [Language.jp]: "迴龍", [Language.kr]: "후이룽"} // O21
];
    
export const O50_NAMES: StationNames[] = [
    {[Language.zh]: "三重國小", [Language.en]: "Sanchong Elementary School", [Language.jp]: "三重小学校", [Language.kr]: "싼충 초등학교"}, // O50
    {[Language.zh]: "三和國中", [Language.en]: "Sanhe Junior High School", [Language.jp]: "三和中学校", [Language.kr]: "싼허 중학교"}, // O51
    {[Language.zh]: "徐匯中學", [Language.en]: "St. Ignatius High School", [Language.jp]: "徐匯高校", [Language.kr]: "쉬후이 고등학교"}, // O52
    {[Language.zh]: "三民高中", [Language.en]: "Sanmin Senior High School", [Language.jp]: "三民高校", [Language.kr]: "싼민 고등학교"}, // O53
    {[Language.zh]: "蘆洲", [Language.en]: "Luzhou", [Language.jp]: "蘆洲", [Language.kr]: "루저우"} // O54
];

// ======== RETRIEVAL FUNCTIONS ======== //
export function sameTime(time1: Time, time2: Time): boolean {
    return time1.hr === time2.hr && time1.min === time2.min;
}

export function timeToMins(time: Time): number { // Time to mins after 00:00
    return time.hr * 60 + time.min;
}

export function minsToTime(mins: number): Time {
    if (mins < 0 || mins > 26 * 60) { // No train arrives at 2am of the next day
        throw new Error(`Invalid argument: ${mins}`);
    }

    return {hr: Math.floor(mins / 60), min: mins % 60};
}

export function timeToStr(time: Time): string {
    if (sameTime(time, INVALID_TIME)) {
        return "INVALID_TIME";
    }

    const hr = time.hr < 10 ? `0${time.hr}` : `${time.hr}`;
    const min = time.min < 10 ? `0${time.min}` : `${time.min}`;

    return `${hr}:${min}`;
}

export function minsAfter(time: Time, mins: number): Time {
    return minsToTime(timeToMins(time) + mins);
}

export function sameStation(stn1: Station, stn2: Station): boolean {
    return stn1.line === stn2.line && stn1.stn_num === stn2.stn_num;
}

export function validStation(station: Station): boolean;
export function validStation(line: Line, stnNum: number): boolean;
export function validStation(arg1: Station | Line, arg2?: number): boolean {
    try {
        if (typeof arg1 === "object") {
            getName(arg1);
        } else {
            getName(arg1, arg2!);
        }
        return true;
    } catch {
        return false;
    }
}

export function makeStation(line: Line, stn_num: number): Station { // Returns Station given relevant detail
    if (!validStation(line, stn_num)) {
        throw new Error("Invalid argument");
    } else {
        return {line, stn_num};
    }
}

export function getName(station: Station, lang?: Language): string;
export function getName(line: Line, stn_num: number, lang?: Language): string;
export function getName(arg1: Station | Line, arg2: number | Language = Language.zh, arg3: Language = Language.zh): string { // Default to Chinese
    let line: Line;
    let stn_num: number;
    let lang: Language;

    if (typeof arg1 === "object") {
        line = arg1.line;
        stn_num = arg1.stn_num;
        lang = arg2 as Language;
    } else {
        line = arg1;
        stn_num = arg2 as number;
        lang = arg3;
    }

    // Detect invalid inputs
    if (line < Line.R || line > Line.Y) {
        throw new Error("getName: Invalid Line");
    }

    if (lang < Language.zh || lang > Language.kr) {
        throw new Error("getName: Invalid Language");
    }

    const LINE_NAMES = new Map<Line, StationNames[]>([
        [Line.R, R_NAMES],
        [Line.G, G_NAMES],
        [Line.BL, BL_NAMES],
        [Line.BR, BR_NAMES],
        [Line.Y, Y_NAMES]
    ]); // except for O because that's an exception

    if (line !== Line.O) {
        const names = LINE_NAMES.get(line);

        if (!names) {
            throw new Error("getName: Invalid Line");
        }

        if (stn_num <= 0 || stn_num >= names.length || names[stn_num]![lang] === INVALID) {
            throw new Error("getName: No such station");
        }
        return names[stn_num]![lang];
    } else {
        // Basic invalid
        if (stn_num <= 0 || stn_num >= 50 + O50_NAMES.length) {
            throw new Error("getName: No such station");
        }

        // O01 branch
        else if (stn_num < 50 && stn_num < O01_NAMES.length) {
            return O01_NAMES[stn_num]![lang];
        }

        // O50 branch
        else if (stn_num >= 50) {
            return O50_NAMES[stn_num - 50]![lang];
        }

        else {
            throw new Error("getName: No such station");
        }
    }
}

export function codeToStation(stn_code: string): Station {
    const match = stn_code.match(/^([A-Z]{1,2})([0-9]{2})$/);

    if (!match) {
        throw new Error(`Invalid station code: ${stn_code}`);
    }

    const line_str = match[1]!; // "BL"
    const stn_num = Number(match[2]); // 23

    const line = LINES.get(line_str);

    if (line === undefined) {
        throw new Error(`Invalid line code: ${line_str}`);
    }

    if (!validStation(line, stn_num)) {
        throw new Error(`Invalid station number for this line: ${stn_code}`);
    } else {
        return {line, stn_num};
    }
}

export function stationToCode(station: Station): string {
    if (!validStation(station)) {
        throw new Error("Invalid station");
    }

    const line_str = LINE_TO_STR.get(station.line);
    if (!line_str) {
        throw new Error("Invalid station");
    }

    const num = station.stn_num < 10 ? `0${station.stn_num}` : `${station.stn_num}`;
    return `${line_str}${num}`;
}