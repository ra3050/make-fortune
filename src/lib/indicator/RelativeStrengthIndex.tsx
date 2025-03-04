import { heikinashiInformation } from "lib/chart/heikinashi";
import React from "react";
import { calculateClose } from "utils/calculate";

/**
 * 지수 가중 이동 평균으로써 rsi의 up down값을 계산하는데 사용됩니다.
 * @param values 이전값의 종가를 현재값의 종가로 뺀 값을 의미함
 * @param rsiLengthInput ris길이
 * @returns
 */
const rma = (
  values: Array<rsiInformation>,
  rsiLengthInput: number
): rsiInformation[] => {
  const alpha = 1 / rsiLengthInput;
  const rmaArray: rsiInformation[] = [];
  let prevRMA: number = 0;

  for (let i = 0; i < values.length; i++) {
    if (i < rsiLengthInput - 1) {
      rmaArray.push({
        timeFrame: values[i].timeFrame,
        value: 0,
      });
    } else if (i === rsiLengthInput) {
      // 초기 rsi값은 sma에 해당함
      const initialSMA =
        values.slice(0, rsiLengthInput).reduce((a, b) => a + b.value, 0) /
        rsiLengthInput;
      prevRMA = initialSMA;
      rmaArray.push({
        timeFrame: values[i].timeFrame,
        value: initialSMA,
      });
    } else {
      prevRMA = alpha * values[i].value + (1 - alpha) * prevRMA;
      rmaArray.push({
        timeFrame: values[i].timeFrame,
        value: prevRMA,
      });
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
): rsiInformation[] => {
  // 이전값과 종가를 뺀 값을 계산하여 반환합니다.
  const change = calculateClose(marketData, chartType);

  const up = change.map((c, i) => {
    return {
      timeFrame:
        chartType === 1 ? marketData[i + 1].timeFrame : marketData[i][0],
      value: Math.max(c, 0),
    };
  });
  const down = change.map((c, i) => {
    return {
      timeFrame:
        chartType === 1 ? marketData[i + 1].timeFrame : marketData[i][0],
      value: Math.abs(Math.min(c, 0)),
    };
  });
  const upRMA = rma(up, length);
  const downRMA = rma(down, length);
  let rsi = upRMA.map((u, i) => {
    const d = downRMA[i];
    if (d.value === 0) return { timeFrame: u.timeFrame, value: 100 };
    if (u.value === 0) return { timeFrame: u.timeFrame, value: 0 };
    return {
      timeFrame: u.timeFrame,
      value: 100 - 100 / (1 + u.value / d.value),
    };
  });

  // rsi의 길이를 시장데이터 길이와 맞춥니다.
  const ac = marketData.length - rsi.length;
  if (0 < ac) {
    for (let i = 0; i < ac; i++) {
      rsi = [{ timeFrame: 0, value: 0 }, ...rsi];
    }
  }

  // console.log("calc same rsi : ", rsi);

  return rsi;
};

export interface rsiInformation {
  timeFrame: number;
  value: number;
}
