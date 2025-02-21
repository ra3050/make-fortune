import { heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import React from "react";

/**
 * RSI계산에 필요한 아래와 같은 값을 반환합니다
 * 시장데이터를 입력받아가 종가의 변화를 계산합니다.
 * (현재종가 - 이전종가)
 * @param data 시장 마켓데이터를 받습니다
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 */
export const calculateClose = (
  data: Array<any | heikinashiInformation>,
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

  return changeArray;
};

/**
 * 타임프레임 값을 문자열로 반환합니다.    ex: 2025.02.20 16:51
 * @param timeFrame
 * @returns
 */
export const calcTimeFrameToString = (timeFrame: number): string => {
  const date = new Date(timeFrame * 1000); // 초 단위를 밀리초로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * closetTimeFrame: 현재 시간에서 가장 가까운 시간 값
 * interval: 인터벌 시간 값
 * intervalTimeFrame: 인터벌값을 초 단위로 나타낸 값
 */
export interface timeFrameInfo {
  closetTimeFrame: number;
  interval: string;
  intervalTime: number;
}
