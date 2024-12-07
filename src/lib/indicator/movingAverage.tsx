import React from "react";

/**
 * 단일 타임스템프에 대한 값을 반환합니다.
 * @param mData marketData :: 시장데이터 배열
 * @param length MA의 길이
 * @returns 입력한 타임스템프의 SMA를 반환함
 */
export const smaIndicator = (
  mData: Array<any>,
  length: number = 13,
  timeStamp?: number
): number => {
  // console.log(mData[0][4]);

  if (length < 1) {
    return mData[0][4];
  }

  let mLenght = mData.length;

  let value = 0;
  for (let i = mLenght - 1; mLenght - length - 1 < i; i--) {
    value = value + parseInt(mData[i][4]);
  }
  const sma = value / length;

  console.log(sma);

  return 0;
};

export const EMA_indicator = () => {};
