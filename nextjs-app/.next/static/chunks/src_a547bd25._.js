(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/api/market/klines.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "klines": ()=>klines
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-client] (ecmascript)");
;
const klines = async (symbol, interval = "1d", limit = 500)=>{
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (e) {
        console.log("error: 알수없는 오류: ", e);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/indicator/movingAverage.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ema": ()=>ema,
    "sma": ()=>sma
});
const sma = (mData, length = 13, chartType = 1, timeStamp)=>{
    if (length <= 1) {
        if (chartType === 1) {
            return mData[-2].close;
        } else {
            return mData[-2][4];
        }
    }
    let mLength = mData.length;
    let sma = [];
    for(let i = length; i < mLength; i++){
        let value = 0;
        for(let j = 0; j < length; j++){
            if (chartType === 1) {
                value = value + parseInt(mData[i - j].close);
            } else {
                value = value + parseInt(mData[i - j][4]);
            }
        }
        sma.push(value / length);
    }
    // console.log("calc sam for :: \n", sma);
    return sma;
};
const ema = (mData, length = 13, chartType = 1, timeStamp)=>{
    if (length <= 1) {
        return mData[-2][4]; // clsoe 가격 반환
    }
    const exponent = 2 / (1 + length); // exponent :: 상수
    const mLength = mData.length ?? 0;
    let ema = {
        length: length,
        ma: []
    };
    let timeFrameInfo = [];
    let value = 0;
    for(let i = 0; i < mLength; i++){
        if (i !== 0) {
            if (chartType === 1) {
                value = mData[i].close * exponent + value * (1 - exponent);
                timeFrameInfo.push({
                    timeFrame: mData[i].timeFrame,
                    value: value
                });
            } else {
                value = parseFloat(mData[i][4]) * exponent + value * (1 - exponent); // (금일종가 * 승수) + (전일 EMA * (1 - 승수))
                timeFrameInfo.push({
                    timeFrame: parseFloat(mData[i][0]),
                    value: value
                });
            }
        } else {
            // ema가 시작되는 부분
            if (chartType === 1) {
                value = mData[i].close;
                timeFrameInfo.push({
                    timeFrame: mData[i].timeFrame,
                    value: value
                });
            } else {
                value = parseFloat(mData[i][4]);
                timeFrameInfo.push({
                    timeFrame: parseFloat(mData[i][0]),
                    value: value
                });
            }
        }
    }
    ema["ma"] = timeFrameInfo;
    // console.log("calc ema for :: \n", ema);
    return ema;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/chart/heikinashi.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "heikinashi": ()=>heikinashi
});
const heikinashi = (mData)=>{
    const mLength = mData.length ?? 0;
    const value = [];
    for(let i = 0; i < mLength; i++){
        const timeFrame = mData[i][0] / 1000;
        const open = i !== 0 ? (value[i - 1].open + value[i - 1].close) / 2 : parseFloat(mData[0][1]);
        const close = (parseFloat(mData[i][1]) + parseFloat(mData[i][2]) + parseFloat(mData[i][3]) + parseFloat(mData[i][4])) / 4;
        const high = Math.max(parseFloat(mData[i][2]), open, close); // 캔들차트 고가, 하이킨아시 시가, 하이킨아시 종가 중 최고가
        const low = Math.min(parseFloat(mData[i][3]), open, close); // 캔들차트 저가, 하이킨아시 시가, 하이킨아시 종사 중 최고가
        value.push({
            timeFrame: timeFrame,
            open: open,
            high: high,
            low: low,
            close: close
        });
    }
    // console.log("heikinashi: ", value);
    return value;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/utils/calculate.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "calcIsBetween": ()=>calcIsBetween,
    "calcTimeFrameToString": ()=>calcTimeFrameToString,
    "calculateClose": ()=>calculateClose
});
const calculateClose = (data, chartType = 1)=>{
    const changeArray = [];
    for(let i = 1; i < data.length; i++){
        if (chartType === 1) {
            changeArray.push(data[i].close - data[i - 1].close);
        } else {
            changeArray.push(parseFloat(data[i][4]) - parseFloat(data[i - 1][4]));
        }
    }
    return changeArray;
};
const calcTimeFrameToString = (timeFrame)=>{
    const date = new Date(timeFrame * 1000); // 초 단위를 밀리초로 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
};
const calcIsBetween = (a, b, c)=>{
    return a <= c && c <= b || b <= c && c <= a;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/indicator/RelativeStrengthIndex.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "rsi": ()=>rsi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$calculate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/calculate.ts [app-client] (ecmascript)");
;
/**
 * 지수 가중 이동 평균으로써 rsi의 up down값을 계산하는데 사용됩니다.
 * @param values 이전값의 종가를 현재값의 종가로 뺀 값을 의미함
 * @param rsiLengthInput ris길이
 * @returns
 */ const rma = (values, rsiLengthInput)=>{
    const alpha = 1 / rsiLengthInput;
    const rmaArray = [];
    let prevRMA = 0;
    for(let i = 0; i < values.length; i++){
        if (i < rsiLengthInput - 1) {
            rmaArray.push({
                timeFrame: values[i].timeFrame,
                value: 0
            });
        } else if (i === rsiLengthInput) {
            // 초기 rsi값은 sma에 해당함
            const initialSMA = values.slice(0, rsiLengthInput).reduce((a, b)=>a + b.value, 0) / rsiLengthInput;
            prevRMA = initialSMA;
            rmaArray.push({
                timeFrame: values[i].timeFrame,
                value: initialSMA
            });
        } else {
            prevRMA = alpha * values[i].value + (1 - alpha) * prevRMA;
            rmaArray.push({
                timeFrame: values[i].timeFrame,
                value: prevRMA
            });
        }
    }
    return rmaArray;
};
const rsi = (marketData, length, chartType = 1)=>{
    // 이전값과 종가를 뺀 값을 계산하여 반환합니다.
    const change = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$calculate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateClose"])(marketData, chartType);
    const up = change.map((c, i)=>{
        return {
            timeFrame: chartType === 1 ? marketData[i + 1].timeFrame : marketData[i][0],
            value: Math.max(c, 0)
        };
    });
    const down = change.map((c, i)=>{
        return {
            timeFrame: chartType === 1 ? marketData[i + 1].timeFrame : marketData[i][0],
            value: Math.abs(Math.min(c, 0))
        };
    });
    const upRMA = rma(up, length);
    const downRMA = rma(down, length);
    let rsi = upRMA.map((u, i)=>{
        const d = downRMA[i];
        if (d.value === 0) return {
            timeFrame: u.timeFrame,
            value: 100
        };
        if (u.value === 0) return {
            timeFrame: u.timeFrame,
            value: 0
        };
        return {
            timeFrame: u.timeFrame,
            value: 100 - 100 / (1 + u.value / d.value)
        };
    });
    // rsi의 길이를 시장데이터 길이와 맞춥니다.
    const ac = marketData.length - rsi.length;
    if (0 < ac) {
        for(let i = 0; i < ac; i++){
            rsi = [
                {
                    timeFrame: 0,
                    value: 0
                },
                ...rsi
            ];
        }
    }
    // console.log("calc same rsi : ", rsi);
    return rsi;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/stategy/ShiftInTrend.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "shiftInTrend_Heikin": ()=>shiftInTrend_Heikin
});
const shiftInTrend_Heikin = (heikin, rsi)=>{
    const info = [
        ...heikin
    ];
    const marketLength = heikin.length;
    for(let i = 0; i < marketLength; i++){
        // 꼬리, 몸통 계산
        const bodyWidth = Math.abs(heikin[i].open - heikin[i].close);
        const upperWick = heikin[i].high - Math.max(heikin[i].open, heikin[i].close);
        const lowerWick = Math.min(heikin[i].open, heikin[i].close) - heikin[i].low;
        // 몸통 꼬리 길이검사
        if (bodyWidth < upperWick && bodyWidth < lowerWick) {
            // rsi 과매도 여부 검사
            if (rsi[i].value > 70 || rsi[i].value < 30) {
                info[i] = {
                    ...heikin[i],
                    shiftInTrend: true
                };
            }
            // 직전봉의 rsi 검사
            if (i !== 0) {
                if (rsi[i - 1].value > 70 || rsi[i - 1].value < 30) {
                    info[i] = {
                        ...heikin[i],
                        shiftInTrend: true
                    };
                }
            }
        }
    }
    return info;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/stategy/Divergence.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "lowwerDivergence": ()=>lowwerDivergence,
    "upperDivergence": ()=>upperDivergence
});
const upperDivergence = (heikin, rsi)=>{
    // timeFrame 불일치 오류 검사
    if (heikin.length !== rsi.length) {
        console.log("Error, the emaDivergence stategy");
        return [];
    }
    const info = [
        ...heikin
    ];
    const marketLength = heikin.length;
    // 다이버전스 발생여부 저장
    let x = -1; // rsi 과매도 진입시점(index) default: -1
    let y = -1; // rsi 과매도 재진입 시점(index) default: -1
    let divergenceEnable = false; // 다이버전스 기록 가능여부
    // 다이버전스 계산
    for(let i = 0; i < marketLength; i++){
        // 가장 강한 과매도가 발생한 시점
        if (rsi[i].value < 30 && rsi[i].value !== 0) {
            // 과매도 최초진입
            if (x === -1) {
                x = i;
            // 과매도 갱신
            } else if (rsi[i].value < rsi[x].value) {
                x = i;
                y = -1;
                divergenceEnable = false;
            }
        }
        // 과매도 => 정상범위 전환시점
        if (x !== -1 && 30 <= rsi[i].value) {
            divergenceEnable = true;
        }
        // 정상 => 과매도 진입시점 :: 다비어전스 발생시점
        if (x !== -1 && rsi[i].value < 30 && divergenceEnable) {
            if (heikin[i].low < heikin[x].low) {
                // x = i;
                y = i;
            } else {
                y = -1;
            }
        } else {
            y = -1;
        }
        // RSI 과매수 진입시 초기화
        if (70 <= rsi[i].value) {
            x = -1;
            y = -1;
            divergenceEnable = false;
        }
        if (x !== -1 && y !== -1 && divergenceEnable) {
            info[i + 1] = {
                ...heikin[i + 1],
                upperDivergence: true
            };
        }
    }
    return info;
};
const lowwerDivergence = (heikin, rsi)=>{
    // timeFrame 불일치 오류 검사
    if (heikin.length !== rsi.length) {
        console.log("Error, the emaDivergence stategy");
        return [];
    }
    const info = [
        ...heikin
    ];
    const marketLength = heikin.length;
    // 다이버전스 발생여부 저장
    let x = -1; // rsi 과매수 진입시점(index) default: -1
    let y = -1; // rsi 과매수 재진입 시점(index) default: -1
    let divergenceEnable = false; // 다이버전스 기록 가능여부
    // 다이버전스 계산
    for(let i = 0; i < marketLength; i++){
        // 가장 강한 매수가 발생한 시점
        if (70 < rsi[i].value && rsi[i].value !== 0) {
            // 과매수 최초진입
            if (x === -1) {
                x = i;
            } else if (rsi[x].value < rsi[i].value) {
                // 과매수 갱신
                x = i;
                y = -1;
                divergenceEnable = false;
            }
        }
        // 과매수 상태에서 정상범위로 돌아왔을 때
        if (x !== -1 && rsi[i].value <= 70) {
            divergenceEnable = true;
        }
        // 정상 => 과매수 진입시점 :: 다비어전스 발생시점
        if (x !== -1 && rsi[i].value > 70 && divergenceEnable) {
            if (heikin[i].high > heikin[x].high) {
                // x = i;
                y = i;
            } else {
                y = -1;
            }
        } else {
            y = -1;
        }
        // RSI 과매도 진입시 초기화
        if (30 >= rsi[i].value) {
            x = -1;
            y = -1;
            divergenceEnable = false;
        }
        if (x !== -1 && y !== -1 && divergenceEnable) {
            info[i + 1] = {
                ...heikin[i + 1],
                lowwerDivergence: true
            };
        }
    }
    return info;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/useHook/useIsClient.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const useIsClient = ()=>{
    _s();
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIsClient.useEffect": ()=>{
            setIsClient(true);
        }
    }["useIsClient.useEffect"], []);
    return isClient;
};
_s(useIsClient, "k460N28PNzD7zo1YW47Q9UigQis=");
const __TURBOPACK__default__export__ = useIsClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/chart/RsiCanvas.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$useHook$2f$useIsClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/useHook/useIsClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const RSICanvas = (rsiCanvasProps)=>{
    _s();
    const { rsi = [], scrollX = 0, canvasWidth = 0 } = rsiCanvasProps || {};
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [ctx, setCtx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$useHook$2f$useIsClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RSICanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = rsi?.length ?? 0;
            canvas.height = 100;
            const context = canvas.getContext("2d");
            if (!context) return;
            if (!isClient) return;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "#8D50AE";
            context.lineWidth = 1;
            contextRef.current = context;
            setCtx(context);
        }
    }["RSICanvas.useEffect"], [
        rsi,
        isClient,
        canvasWidth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RSICanvas.useEffect": ()=>{
            if (!ctx || !rsi) return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            if (!isClient) return;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 스케일 및 위치 재조정
            ctx.translate(0, 0);
            ctx.scale(1, -1);
            ctx.translate(0, -100);
            // rsi 그리기
            ctx.beginPath();
            let isFirst = true;
            for(let i = scrollX; i < scrollX + canvasWidth; i++){
                if (i >= rsi.length) break;
                if (isFirst) {
                    ctx.moveTo(i, rsi[i].value);
                    isFirst = false;
                } else {
                    ctx.lineTo(i, rsi[i].value);
                }
            }
            ctx.stroke();
            // rsi 과매수 기준선
            ctx.beginPath();
            ctx.moveTo(scrollX, 70);
            ctx.lineTo(scrollX + canvasWidth, 70);
            ctx.stroke();
            // rsi 과매도 기준선
            ctx.beginPath();
            ctx.moveTo(scrollX, 30);
            ctx.lineTo(scrollX + canvasWidth, 30);
            ctx.stroke();
        }
    }["RSICanvas.useEffect"], [
        scrollX,
        rsi,
        isClient,
        canvasWidth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        style: {
            borderTop: "1px solid #1F232E"
        }
    }, void 0, false, {
        fileName: "[project]/src/components/chart/RsiCanvas.tsx",
        lineNumber: 84,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(RSICanvas, "RRmLiCXXVvgY49LXap0RuC/uumA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$useHook$2f$useIsClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = RSICanvas;
const __TURBOPACK__default__export__ = RSICanvas;
var _c;
__turbopack_context__.k.register(_c, "RSICanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/chart/ChartCanvas.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chart$2f$RsiCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chart/RsiCanvas.tsx [app-client] (ecmascript)"); // RSICanvas 컴포넌트 임포트
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const CanvasWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  overflow-x: auto; // 가로 스크롤 활성화
  overflow-y: hidden; // 세로 스크롤 비활성화
  background: #131722;
  /* user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; */

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
  -ms-overflow-style: none; // IE, Edge
  scrollbar-width: none; //Firebox
`;
_c = CanvasWrapper;
const ChartCanvas = (chartProps)=>{
    _s();
    // chartProps
    const { heikin = [], ema = [], rsi = [] } = chartProps || {};
    // canvas 요소
    const canvasWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // 캔버스 요소를 참조하는 요소
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // 캔버스 요소를 참조하는 요소
    const contextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null); // 캔버스의 컨텐스트를 참조하는 요소
    const [ctx, setCtx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // 컨텐스트 속성 값을 저장하는 상태
    const [scrollX, setScrollX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0); // 캔버스 위치
    const [canvasHeight, setCanvasHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [canvasWidth, setCanvasWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // 드래그 관련 상태 추가
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [startX, setStartX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [scrollLeft, setScrollLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // canvas 높이, 너비 설정
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setCanvasHeight(window.innerHeight - 100); // 여백설정
            setCanvasWidth(window.innerWidth); // 전체화면
        }
    }["ChartCanvas.useEffect"], []);
    // canvas Rect 설정
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = heikin.length ?? 0;
            canvas.height = canvasHeight;
            const context = canvas.getContext("2d");
            if (!context) return;
            // 기본 설정 초기화
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = "white";
            context.lineWidth = 2;
            contextRef.current = context;
            setCtx(context);
        }
    }["ChartCanvas.useEffect"], [
        canvasHeight,
        canvasWidth,
        heikin
    ]);
    // chart draw
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChartCanvas.useEffect": ()=>{
            // 차트를 그리는데 필요한 데이터가 없는경우
            if (!ema || !heikin || !ctx) return;
            const canvas = canvasRef.current;
            // canvas not found
            if (!canvas) return;
            // 컨텍스트 초기화
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // 보이는 영역의 데이터만 계산
            const visibleData = heikin.slice(scrollX, scrollX + canvasWidth);
            // visibleData가 비어있는 경우 처리
            if (visibleData.length === 0) return;
            const maxHeikin = Math.max(...visibleData.map({
                "ChartCanvas.useEffect.maxHeikin": (item)=>item.high
            }["ChartCanvas.useEffect.maxHeikin"]));
            const minHeikin = Math.min(...visibleData.map({
                "ChartCanvas.useEffect.minHeikin": (item)=>item.low
            }["ChartCanvas.useEffect.minHeikin"]));
            // 여백(상・하) 추가
            const padding = (maxHeikin - minHeikin) * 0.1;
            const yScale = canvasHeight * 0.9 / (maxHeikin - minHeikin + padding * 2);
            // 스케일 및 위치 조정
            ctx.translate(0, canvasHeight);
            ctx.scale(1, -yScale);
            ctx.translate(0, -(minHeikin - padding));
            ctx.beginPath();
            // EMA 선 그리기
            ema.forEach({
                "ChartCanvas.useEffect": (ma)=>{
                    ctx.beginPath();
                    let isFirst = true;
                    for(let i = scrollX; i < scrollX + canvasWidth; i++){
                        if (i >= ma.ma.length) break;
                        if (isFirst) {
                            ctx.moveTo(i, ma.ma[i].value);
                            isFirst = false;
                        } else {
                            ctx.lineTo(i, ma.ma[i].value);
                        }
                    }
                    ctx.stroke();
                }
            }["ChartCanvas.useEffect"]);
            // 캔들 그리기
            for(let i = scrollX; i < scrollX + canvasWidth; i++){
                ctx.beginPath();
                if (i >= heikin.length) break;
                // 양봉, 음봉 구분
                if (i !== 0 && heikin[i].open > heikin[i].close) {
                    ctx.strokeStyle = "#F05350"; // 음봉
                } else {
                    ctx.strokeStyle = "#26A69A"; // 양봉
                }
                // 다이버전스 여부에 따라 색상 설정
                if (heikin[i].upperDivergence) {
                    if (heikin[i].shiftInTrend) {
                        ctx.strokeStyle = "#FFD700"; // 다이버전스가 있는 경우 금색
                    }
                } else if (heikin[i].lowwerDivergence) {
                    if (heikin[i].shiftInTrend) {
                        ctx.strokeStyle = "#FFD700"; // 다이버전스가 있는 경우 금색
                    }
                }
                ctx.moveTo(i, heikin[i].high);
                ctx.lineTo(i, heikin[i].low);
                ctx.stroke();
            }
            ctx.strokeStyle = "white";
        }
    }["ChartCanvas.useEffect"], [
        scrollX,
        ema,
        heikin,
        canvasWidth,
        canvasHeight
    ]);
    // 마우스 이벤트 핸들러
    const handleMouseDown = (e)=>{
        if (!canvasWrapperRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - canvasWrapperRef.current.offsetLeft);
        setScrollLeft(canvasWrapperRef.current.scrollLeft);
    };
    const handleMouseMove = (e)=>{
        if (!isDragging || !canvasWrapperRef.current) return;
        e.preventDefault();
        const x = e.pageX - canvasWrapperRef.current.offsetLeft;
        const walk = startX - x;
        canvasWrapperRef.current.scrollLeft = scrollLeft + walk;
        setScrollX(canvasWrapperRef.current.scrollLeft);
    };
    const handleMouseUp = ()=>{
        setIsDragging(false);
    };
    // 터치 이벤트 핸들러 (모바일)
    const handleTouchStart = (e)=>{
        if (!canvasWrapperRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - canvasWrapperRef.current.offsetLeft);
        setScrollLeft(canvasWrapperRef.current.scrollLeft);
    };
    const handleTouchMove = (e)=>{
        if (!isDragging || !canvasWrapperRef.current) return;
        e.preventDefault(); // 기본 스크롤 동작 방지
        const x = e.touches[0].pageX - canvasWrapperRef.current.offsetLeft;
        const walk = startX - x;
        canvasWrapperRef.current.scrollLeft = scrollLeft + walk;
        setScrollX(canvasWrapperRef.current.scrollLeft);
    };
    const handleTouchEnd = ()=>{
        setIsDragging(false);
    };
    // 포인터 이벤트 핸들러 (Mac 터치패드 포함)
    const handlePointerDown = (e)=>{
        if (!canvasWrapperRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - canvasWrapperRef.current.offsetLeft);
        setScrollLeft(canvasWrapperRef.current.scrollLeft);
    };
    const handlePointerMove = (e)=>{
        if (!isDragging || !canvasWrapperRef.current) return;
        e.preventDefault();
        const x = e.pageX - canvasWrapperRef.current.offsetLeft;
        const walk = startX - x;
        canvasWrapperRef.current.scrollLeft = scrollLeft + walk;
        setScrollX(canvasWrapperRef.current.scrollLeft);
    };
    const handlePointerUp = ()=>{
        setIsDragging(false);
    };
    // 휠 이벤트 핸들러 (Mac 터치패드 제스처)
    const handleWheel = (e)=>{
        e.preventDefault(); // 기본 스크롤 방지
        if (!canvasWrapperRef.current) return;
        // 터치패드의 수평 스크롤 감지
        const deltaX = e.deltaX;
        const currentScrollLeft = canvasWrapperRef.current.scrollLeft;
        canvasWrapperRef.current.scrollLeft = currentScrollLeft + deltaX;
        setScrollX(canvasWrapperRef.current.scrollLeft);
        // 확대 축소 기능
        const deltaY = e.deltaY;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    // setCanvasWidth((prev) => {
    //   const newCanvasWidth = prev + deltaY;
    //   if (newCanvasWidth <= 50) return 50;
    //   else if (newCanvasWidth >= window.innerWidth) return window.innerWidth;
    //   else return newCanvasWidth;
    // });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CanvasWrapper, {
        ref: canvasWrapperRef,
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUp,
        onWheel: handleWheel,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef
            }, void 0, false, {
                fileName: "[project]/src/components/chart/ChartCanvas.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chart$2f$RsiCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                rsi,
                scrollX,
                canvasWidth
            }, void 0, false, {
                fileName: "[project]/src/components/chart/ChartCanvas.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/chart/ChartCanvas.tsx",
        lineNumber: 250,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ChartCanvas, "6DdcLdNRuEANN+JyXGvk/wUHfSs=");
_c1 = ChartCanvas;
const __TURBOPACK__default__export__ = ChartCanvas;
var _c, _c1;
__turbopack_context__.k.register(_c, "CanvasWrapper");
__turbopack_context__.k.register(_c1, "ChartCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-components/dist/styled-components.browser.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$market$2f$klines$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/market/klines.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indicator/movingAverage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chart$2f$heikinashi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/chart/heikinashi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$RelativeStrengthIndex$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/indicator/RelativeStrengthIndex.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stategy$2f$ShiftInTrend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stategy/ShiftInTrend.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stategy$2f$Divergence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/stategy/Divergence.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chart$2f$ChartCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/chart/ChartCanvas.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client"; // 클라이언트 전용 페이지임을 선언
;
;
;
;
;
;
;
;
;
const IntervalWrapper = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap; // 한 줄로 표시
  overflow-x: auto; // 가로 스크롤 활성화
  position: absolute;
  top: 10px;
  left: 10px;
  max-width: calc(100vw - 20px); // 화면 너비에서 여백 제외
  padding-right: 10px; // 오른쪽 여백 추가

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
_c = IntervalWrapper;
const IntervalButton = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  margin-right: 10px;
`;
_c1 = IntervalButton;
const TickerButton = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`;
_c2 = TickerButton;
const HelpButton = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;
_c3 = HelpButton;
const Modal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
_c4 = Modal;
const ModalContent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  background-color: #131722;
  border: 1px solid #2a2e39;
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;
_c5 = ModalContent;
const ModalHeader = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #2a2e39;
  padding-bottom: 15px;
`;
_c6 = ModalHeader;
const ModalTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].h2`
  margin: 0;
  color: #fff;
  font-size: 24px;
`;
_c7 = ModalTitle;
const CloseButton = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #007bff;
  }
`;
_c8 = CloseButton;
const ModalBody = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$components$2f$dist$2f$styled$2d$components$2e$browser$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].div`
  line-height: 1.6;

  h3 {
    color: #007bff;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 15px;
  }

  ul {
    margin-bottom: 15px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;
_c9 = ModalBody;
const MainPage = ()=>{
    _s();
    const [ticker, setTicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("BTCUSDT");
    const [marketData, setMarketData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]); // restAPI로 불러온 데이터
    const [condition, setCondition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(); // emarsi 조건을 충족시키기 위한 데이터
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // 모달 상태
    const marketInterval = [
        "1d",
        "12h",
        "8h",
        "6h",
        "4h",
        "2h",
        "1h",
        "30m",
        "15m"
    ];
    const [isMarketInterval, setIsMarketInterval] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("1d");
    // 모달 핸들러
    const handleOpenModal = ()=>{
        setIsModalOpen(true);
    };
    const handleCloseModal = ()=>{
        setIsModalOpen(false);
    };
    const fetchMarketData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MainPage.useCallback[fetchMarketData]": async (symbol, interval, limit)=>{
            try {
                // 서버데이터와 csv데이터를 불러옵니다.
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$market$2f$klines$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["klines"])(symbol, interval, limit);
                const csvRes = await readMarketData(symbol, interval);
                // marketData에는 서버에서 불러온 원본 데이터 저장
                // sorktMarket함수를 실행하여 데이터 병합
                if (response) {
                    const data = await response.json();
                    setMarketData(data);
                    const serverData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$chart$2f$heikinashi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["heikinashi"])(data);
                    sortMarketData(symbol, interval, csvRes, serverData);
                }
            } catch (e) {
                console.log("market data host error: ", e);
                throw e;
            }
        }
    }["MainPage.useCallback[fetchMarketData]"], []);
    //csv에 저장된 마켓 데이터를 불러옵니다
    const readMarketData = async (symbol, interval)=>{
        const csvData = [];
        try {
            let response = new Response();
            if (symbol === "BTCUSDT") {
                if (interval === "4d") response = await fetch("/BTCUSDT/4D.csv");
                if (interval === "2d") response = await fetch("/BTCUSDT/2D.csv");
                if (interval === "1d") response = await fetch("/BTCUSDT/1D.csv");
                if (interval === "12h") response = await fetch("/BTCUSDT/720.csv");
                if (interval === "8h") response = await fetch("/BTCUSDT/480.csv");
                if (interval === "6h") response = await fetch("/BTCUSDT/360.csv");
                if (interval === "4h") response = await fetch("/BTCUSDT/240.csv");
                if (interval === "2h") response = await fetch("/BTCUSDT/120.csv");
                if (interval === "1h") response = await fetch("/BTCUSDT/60.csv");
                if (interval === "30m") response = await fetch("/BTCUSDT/30.csv");
                if (interval === "15m") response = await fetch("/BTCUSDT/15.csv");
            }
            if (symbol === "ETHUSDT") {
                if (interval === "1d") response = await fetch("/ETHUSDT/1D.csv");
                if (interval === "12h") response = await fetch("/ETHUSDT/720.csv");
                if (interval === "8h") response = await fetch("/ETHUSDT/480.csv");
                if (interval === "6h") response = await fetch("/ETHUSDT/360.csv");
                if (interval === "4h") response = await fetch("/ETHUSDT/240.csv");
                if (interval === "2h") response = await fetch("/ETHUSDT/120.csv");
                if (interval === "1h") response = await fetch("/ETHUSDT/60.csv");
                if (interval === "30m") response = await fetch("/ETHUSDT/30.csv");
                if (interval === "15m") response = await fetch("/ETHUSDT/15.csv");
                if (interval === "5m") response = await fetch("/ETHUSDT/5.csv");
            }
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const csvText = await response.text();
            const rows = csvText.split("\n").map((row)=>row.split(",")).splice(1);
            for (const element of rows){
                csvData.push({
                    timeFrame: parseInt(element[0]),
                    open: parseFloat(element[1]),
                    high: parseFloat(element[2]),
                    low: parseFloat(element[3]),
                    close: parseFloat(element[4])
                });
            }
        } catch (e) {
            console.log("csv 파일로드 에러, ", e);
        } finally{
            return csvData;
        }
    };
    // 서버데이터와 csv데이터를 불러와 정렬하며 ema, rsi를 계산하여 반영합니다.
    const sortMarketData = (symbol, interval, csvData, serverData)=>{
        csvData.forEach((item, index)=>{
            // 아 여기서 걸러지는구나, 맞는 시간이 없거나 하는 문제가 있겠지 고작해봐야 타임프레임 차이는 1000개밖에 안나니까
            if (item.timeFrame === serverData[0].timeFrame) {
                const spliceCsvData = csvData.splice(0, index);
                const cs = [
                    ...spliceCsvData,
                    ...serverData
                ];
                const emaArr = [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 89),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 144),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 233),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 377),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 610),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 987),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 1597),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 2584),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$movingAverage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ema"])(cs, 4181)
                ];
                const rsiArr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$indicator$2f$RelativeStrengthIndex$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rsi"])(cs, 14, 1);
                // const heikinWithDivergence = lowwerDivergence(cs, rsiArr);
                // const heikinWithDivergence = upperDivergence(cs, rsiArr);
                const upper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stategy$2f$Divergence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["upperDivergence"])(cs, rsiArr);
                const lowwer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stategy$2f$Divergence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lowwerDivergence"])(upper, rsiArr);
                const newHeikinashiInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$stategy$2f$ShiftInTrend$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shiftInTrend_Heikin"])(lowwer, rsiArr);
                setCondition({
                    symbol: symbol,
                    interval: interval,
                    heikin: newHeikinashiInfo,
                    ema: emaArr,
                    rsi: rsiArr
                });
            }
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainPage.useEffect": ()=>{
            fetchMarketData(ticker, isMarketInterval, 60000);
        }
    }["MainPage.useEffect"], [
        isMarketInterval,
        fetchMarketData,
        ticker
    ]);
    const handleIntervalButton = (interval)=>{
        setIsMarketInterval(interval);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IntervalWrapper, {
                children: [
                    marketInterval.map((interval)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IntervalButton, {
                            onClick: ()=>handleIntervalButton(interval),
                            children: interval
                        }, interval, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TickerButton, {
                        onClick: ()=>setTicker("BTCUSDT"),
                        children: "BTCUSDT"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TickerButton, {
                        onClick: ()=>setTicker("ETHUSDT"),
                        children: "ETHUSDT"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpButton, {
                        onClick: handleOpenModal,
                        children: "도움말"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$chart$2f$ChartCanvas$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                heikin: condition?.heikin,
                ema: condition?.ema,
                rsi: condition?.rsi
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Modal, {
                onClick: handleCloseModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalContent, {
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalHeader, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalTitle, {
                                    children: "차트 사용법"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 368,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CloseButton, {
                                    onClick: handleCloseModal,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 367,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModalBody, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "기본 조작"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 372,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "드래그:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 375,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 차트를 좌우로 스크롤할 수 있습니다."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "휠:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 차트를 확대/축소할 수 있습니다 (지원예정)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "터치패드:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Mac 터치패드로도 동일한 조작이 가능합니다."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 380,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 373,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "차트 구성"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 386,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "메인 차트:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 하이킨아시 캔들차트와 EMA 이동평균선"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 388,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "RSI 차트:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 상대강도지수 (30 이하: 과매도, 70 이상: 과매수)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 392,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "색상 구분:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 녹색(양봉), 빨간색(음봉), 금색(다이버전스)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 396,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 387,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "지표 설명"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 402,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "EMA:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 지수이동평균선 (89, 144, 233, 377, 610, 987, 1597, 2584, 4181)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 404,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "RSI:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 14기간 상대강도지수"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 408,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "다이버전스:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 412,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " 가격과 RSI의 괴리 현상"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 403,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "시간대 선택"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 416,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "상단의 시간대 버튼을 클릭하여 1분부터 1일까지 다양한 시간대의 차트를 볼 수 있습니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "코인 선택"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 422,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "BTCUSDT와 ETHUSDT 중 원하는 코인을 선택할 수 있습니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 423,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "전략설명"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "몸통이 짧은 하이킨아시(도지캔들, 스타캔들)와 RSI다이버전스가 발생한 부분은 금색으로 표시되면, 해당부분을 진입 타점으로 볼 수 있습니다. 그러나 하이킨아시 차트는 시각적인 모양을 참고하기 때문에, 다이버전스 완성된 후, 하이킨아시 모양을 확인하고 진입해야합니다."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 426,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 371,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 366,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 336,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MainPage, "Uk6EJLofQFlBFvVerC2fbLveKVQ=");
_c10 = MainPage;
const __TURBOPACK__default__export__ = MainPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "IntervalWrapper");
__turbopack_context__.k.register(_c1, "IntervalButton");
__turbopack_context__.k.register(_c2, "TickerButton");
__turbopack_context__.k.register(_c3, "HelpButton");
__turbopack_context__.k.register(_c4, "Modal");
__turbopack_context__.k.register(_c5, "ModalContent");
__turbopack_context__.k.register(_c6, "ModalHeader");
__turbopack_context__.k.register(_c7, "ModalTitle");
__turbopack_context__.k.register(_c8, "CloseButton");
__turbopack_context__.k.register(_c9, "ModalBody");
__turbopack_context__.k.register(_c10, "MainPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_a547bd25._.js.map