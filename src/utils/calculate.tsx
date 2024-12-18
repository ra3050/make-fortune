import { chartInformation } from "lib/chart/heikinashi";
import React from "react";

/**
 * 시장데이터를 입력받아가 종가의 변화를 계산합니다.
 * 현재종가 - 이전종가
 * @param data 시장 마켓데이터를 받습니다
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 */
export const calculateClose = (
  data: Array<any | chartInformation>,
  chartType: number = 1
): number[] => {
  const changeArray = [];
  for (let i = 1; i < data.length; i++) {
    if (chartType === 1) {
      changeArray.push(data[i].close - data[i - 1].close);
    } else {
      changeArray.push(parseFloat(data[i][4]) - parseFloat(data[i - 1][4]));
    }
  }

  console.log("change Array    : ", changeArray);

  return changeArray;
};
