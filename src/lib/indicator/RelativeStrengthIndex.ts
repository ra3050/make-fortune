import { chartInformation } from "lib/chart/heikinashi";
import React from "react";
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
  marketData: Array<any | chartInformation>,
  length: number,
  chartType: number = 1
): number[] => {
  const mLength = marketData.length ?? 0; // marketData Length

  let averageUp = 0;
  let averageDown = 0;
  let rs = 0; // relative strength
  let rsi = [];
  for (let i = 0; i < mLength - length; i++) {
    let up = 0;
    let down = 0;
    for (let j = 0; j < length; j++) {
      const open =
        chartType === 1
          ? marketData[i + j].open
          : parseFloat(marketData[i - j][1]);
      const close =
        chartType === 1
          ? marketData[i + j].close
          : parseFloat(marketData[i - j][4]);

      if (close - open > 0) {
        up = up + close - open;
      }
      if (close - open < 0) {
        down = down + (close - open);
      }
    }

    averageUp = up / length;
    averageDown = Math.abs(down) / length;
    rs = averageUp / averageDown;

    rsi.push((rs / (1 + rs)) * 100);
  }

  console.log("calc same rsi : ", rsi);

  return rsi;
};
