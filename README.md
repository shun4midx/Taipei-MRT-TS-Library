# Taipei-MRT-TS-Library
Shun's Taipei MRT Scheduler C++ code translated into TypeScript

This project is a TypeScript translation/adaptation of [my original C++ Taipei MRT scheduler project](https://github.com/shun4midx/Taipei-MRT-Scheduler).

Original project licensed under the [Apache License 2.0](https://github.com/shun4midx/Taipei-MRT-Scheduler/blob/main/LICENSE).

# Installation

```bash
git clone https://github.com/shun4midx/Taipei-MRT-TS-Library
cd Taipei-MRT-TS-Library
cd src
npm install
```

Note that `npm install` is mandatory before running anything.

# Running tests

```bash
npx tsx tests/<fiile_name>.test.ts
```

# Example usage

```ts
import * as mrt from "./shun4mrt";

const routes = mrt.routeDefault(
    mrt.stn(mrt.Line.R, 10),
    mrt.stn(mrt.Line.BL, 23),
    { hr: 8, min: 0 },
    1,
    3,
);

console.log(
    mrt.namedPathTimesToStr(
        routes[0]!.path,
        routes[0]!.times,
        mrt.Language.en,
    ),
);
```

# How to Run
More detailed documentation will be provided later, but for now, I recommend looking at the files under `src/tests/`, and especially `src/tests/prettify.test.ts` to get a brief idea of how to use the library. Note that the languages `en` (English), `zh` (Chinese), `jp` (Japanese), and `kr` (Korean) are all supported, and in terms of displaying cost, `ADULT`, `CHILD`, and `ELDERLY` are all supported.