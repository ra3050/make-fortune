import React from "react";

/**
 * 단일 타임스템프에 대한 sma값을 반환합니다.
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

  if (length <= 1) {
    return mData[0][4];
  }

  let mLenght = mData.length;

  let value = 0;
  for (let i = mLenght - 1; mLenght - length - 1 < i; i--) {
    value = value + parseInt(mData[i][4]);
  }
  const sma = value / length;

  console.log(sma);

  return sma;
};

/**
 * 단일 타임스템프에 대한 ema값을 반환합니다.
 * ** 주의 2미만의 값을 입력한 경우 버그가 발생할 수 있습니다.
 * @param mData marketData :: 시장데이터 배열
 * @param length MA길이
 * @param beforeValue 이전 EMA데이터, 첫번째 값일 경우 sma반환
 * @param timeStamp 데이터 타임스템프
 * @returns ema값을 반환합니다.
 */
export const emaIndicator = (
  mData: Array<any>,
  length: number = 13,
  beforeValue: number,
  timeStamp?: number
): number => {
  if (length <= 1) {
    return mData[0][4]; // clsoe 가격 반환
  }

  const exponent: number = 2 / (1 + length); // exponent :: 상수

  const mLength = mData.length;
  const ema =
    parseInt(mData[mLength - 1][4]) * exponent + beforeValue * (1 - exponent);

  console.log(ema);
  return ema;
};
