import { heikinashiInformation } from "lib/chart/heikinashi";
import React from "react";

/**
 * 단일 타임스템프에 대한 sma값을 반환합니다.
 * @param mData marketData :: 시장데이터 배열
 * @param length MA의 길이
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 * @returns 입력한 타임스템프의 SMA를 반환함
 */
export const sma = (
  mData: Array<any | heikinashiInformation>,
  length: number = 13,
  chartType: number = 1,
  timeStamp?: number
): Array<number> => {
  if (length <= 1) {
    if (chartType === 1) {
      return mData[-2].close;
    } else {
      return mData[-2][4];
    }
  }

  let mLength = mData.length;

  let sma = [];
  for (let i = length; i < mLength; i++) {
    let value = 0;

    for (let j = 0; j < length; j++) {
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

/**
 * 단일 타임스템프에 대한 ema값을 반환합니다.
 * @param mData marketData :: 시장데이터 배열
 * @param length MA길이
 * @param chartType 캔들 = 0, 하이킨아시 = 1, default: 1
 * @param timeStamp 데이터 타임스템프
 * @returns ema값을 반환합니다.
 */
export const ema = (
  mData: Array<any | heikinashiInformation>,
  length: number = 13,
  chartType: number = 1,
  timeStamp?: number
): movingAverageInfo => {
  if (length <= 1) {
    return mData[-2][4]; // clsoe 가격 반환
  }

  const exponent: number = 2 / (1 + length); // exponent :: 상수
  const mLength = mData.length ?? 0;

  let ema: movingAverageInfo = {
    length: length,
    ma: [],
  };
  let timeFrameInfo: timeFrameInfo[] = [];
  let value: number = 0;
  for (let i = 0; i < mLength; i++) {
    if (i !== 0) {
      if (chartType === 1) {
        value = mData[i].close * exponent + value * (1 - exponent);

        timeFrameInfo.push({
          timeFrame: mData[i].timeFrame,
          value: value,
        });
      } else {
        value = parseFloat(mData[i][4]) * exponent + value * (1 - exponent); // (금일종가 * 승수) + (전일 EMA * (1 - 승수))

        timeFrameInfo.push({
          timeFrame: parseFloat(mData[i][0]),
          value: value,
        });
      }
    } else {
      // ema가 시작되는 부분
      if (chartType === 1) {
        value = mData[i].close;

        timeFrameInfo.push({
          timeFrame: mData[i].timeFrame,
          value: value,
        });
      } else {
        value = parseFloat(mData[i][4]);

        timeFrameInfo.push({
          timeFrame: parseFloat(mData[i][0]),
          value: value,
        });
      }
    }
  }

  ema["ma"] = timeFrameInfo;

  // console.log("calc ema for :: \n", ema);

  return ema;
};

export interface timeFrameInfo {
  timeFrame: number;
  value: number;
}

export interface movingAverageInfo {
  length: number;
  ma: timeFrameInfo[];
}
