import { heikinashiInformation } from "lib/chart/heikinashi";
import React from "react";

/**
 * 시장데이터를 입력받아가 종가의 변화를 계산합니다.
 * 현재종가 - 이전종가
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
 *
 * @param interval 타임프레임 계산 시간값
 * @returns interval과 가장 가까운 타임프레임을 반환합니다.
 */
export const calcMainTimeFrame = (interval: string): timeFrameInfo => {
  const currentTimeFrame = Math.floor(Date.now() / 1000); // 초 단위 변환
  let timeSec = 0; // 기준이되는 시간의 초 단위 값

  const value = parseInt(interval.slice(0, interval.length - 1));
  if (interval.includes("m")) {
    timeSec = value * 60;
  } else if (interval.includes("h")) {
    timeSec = value * 3600;
  } else if (interval.includes("d")) {
    timeSec = value * 86400;
  }

  const closetTimeFrame = Math.floor(currentTimeFrame / timeSec) * timeSec; // 가장 가까운 시간의 타임프레임 확인

  return {
    closetTimeFrame: closetTimeFrame,
    interval: interval,
    intervalTime: timeSec,
  };
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
