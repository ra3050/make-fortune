import { heikinashiInformation } from "lib/chart/heikinashi";
import React from "react";
import { calcMainTimeFrame, calculateClose } from "utils/calculate";

/**
 * 지수 가중 이동 평균으로써 rsi의 up down값을 계산하는데 사용됩니다.
 * @param values 이전값의 종가를 현재값의 종가로 뺀 값을 의미함
 * @param rsiLengthInput ris길이
 * @returns
 */
const rma = (values: Array<number>, rsiLengthInput: number): number[] => {
  const alpha = 1 / rsiLengthInput;
  const rmaArray = [];
  let prevRMA: number = 0;

  for (let i = 0; i < values.length; i++) {
    if (i < rsiLengthInput - 1) {
      rmaArray.push(0);
    } else if (i === rsiLengthInput) {
      // 초기 rsi값은 sma에 해당함
      const initialSMA =
        values.slice(0, rsiLengthInput).reduce((a, b) => a + b, 0) /
        rsiLengthInput;
      prevRMA = initialSMA;
      rmaArray.push(initialSMA);
    } else {
      prevRMA = alpha * values[i] + (1 - alpha) * prevRMA;
      rmaArray.push(prevRMA);
    }
  }

  return rmaArray;
};

/**
 * 현재 차트에 대한 rsi를 계산합니다.
 * 캔들차트는 마켓데이터를 그대로 받습니다.
 * 하이킨아시 차트는 하이킨아시로 변형된 차트 데이터를 받습니다.
 * @param marketData 시장데이터
 * @param length RSI길이
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 * @returns rsi배열을 반환합니다.
 */
export const rsi = (
  marketData: Array<any | heikinashiInformation>,
  length: number,
  chartType: number = 1
): number[] => {
  const change = calculateClose(marketData, chartType);
  const up = change.map((c) => Math.max(c, 0));
  const down = change.map((c) => Math.abs(Math.min(c, 0)));

  const upRMA = rma(up, length);
  const downRMA = rma(down, length);

  const rsi = upRMA.map((u, i) => {
    const d = downRMA[i];
    if (d === 0) return 100;
    if (u === 0) return 0;
    return 100 - 100 / (1 + u / d);
  });

  // console.log("calc same rsi : ", rsi);

  return rsi;
};

/**
 * 현재 시간에서 4배수에 해당하는 시간의 rsi를 반환합니다.
 * 캔들 차트는 마켓데이터를 그대로받습니다.
 * 하이킨 아시 차트는 하이킨아시로 변형된 차트를 받습니다. (heikinashi함수 사용)
 * @param marketData 시장데이터
 * @param length rsi길이
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 * @param interval 현재 차트의 시간
 */
export const rsiFourMul = (
  marketData: Array<any | heikinashiInformation>,
  length: number,
  chartType: number = 1,
  interval: string = "1d"
): number[] => {
  let timeFrame = calcMainTimeFrame(interval);

  const change = [];
  for (let i = 0; i < marketData.length; i++) {
    if (chartType === 1) {
      if (marketData[i].timeFrame % (timeFrame.intervalTime * 4) === 0) {
        // console.log(
        //   "timeframe ",
        //   marketData[i].timeFrame,
        //   "dividing ",
        //   marketData[i].timeFrame / timeFrame.intervalTime,
        //   marketData[i].timeFrame % timeFrame.intervalTime
        // );
        if (i + 1 < marketData.length) {
          change.push(marketData[i + 1].close - marketData[i].close);
        }
        if (i + 2 < marketData.length) {
          change.push(marketData[i + 2].close - marketData[i].close);
        }
        if (i + 3 < marketData.length) {
          change.push(marketData[i + 3].close - marketData[i].close);
        }
        if (i + 4 < marketData.length) {
          change.push(marketData[i + 4].close - marketData[i].close);
        }
      }
    } else if (chartType === 0) {
      if (marketData[i][0] % timeFrame.intervalTime === 0) {
        if (i + 1 < marketData.length) {
          change.push(marketData[i + 1][0] - marketData[i][0]);
        }
        if (i + 2 < marketData.length) {
          change.push(marketData[i + 2][0] - marketData[i][0]);
        }
        if (i + 3 < marketData.length) {
          change.push(marketData[i + 3][0] - marketData[i][0]);
        }
        if (i + 4 < marketData.length) {
          change.push(marketData[i + 4][0] - marketData[i][0]);
        }
      }
    }
  }

  const up = change.map((c) => Math.max(c, 0));
  const down = change.map((c) => Math.abs(Math.min(c, 0)));
  const upRMA = rma(up, length);
  const downRMA = rma(down, length);
  const rsi = upRMA.map((u, i) => {
    const d = downRMA[i];
    if (d === 0) return 100;
    if (u === 0) return 0;
    return 100 - 100 / (1 + u / d);
  });
  // console.log("calc same rsi four mul: ", rsi);
  return rsi;
};
