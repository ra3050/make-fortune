import React from "react";

/**
 * 단일 타임스템프에 대한 sma값을 반환합니다.
 * @param mData marketData :: 시장데이터 배열
 * @param length MA의 길이
 * @returns 입력한 타임스템프의 SMA를 반환함
 */
export const sma = (
  mData: Array<any>,
  length: number = 13,
  timeStamp?: number
): Array<number> => {
  if (length <= 1) {
    return mData[-2][4];
  }

  let mLength = mData.length;

  let sma = [];
  for (let i = length; i < mLength; i++) {
    let value = 0;

    for (let j = 0; j < length; j++) {
      value = value + parseInt(mData[i - j][4]);
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
 * @param timeStamp 데이터 타임스템프
 * @returns ema값을 반환합니다.
 */
export const ema = (
  mData: Array<any>,
  length: number = 13,
  timeStamp?: number
): Array<number> => {
  if (length <= 1) {
    return mData[-2][4]; // clsoe 가격 반환
  }

  const exponent: number = 2 / (1 + length); // exponent :: 상수
  const mLength = mData.length ?? 0;

  let ema = [];
  let value: number = 0;
  for (let i = length; i < mLength; i++) {
    if (i !== length) {
      value = parseFloat(mData[i][4]) * exponent + value * (1 - exponent); // (금일종가 * 승수) + (전일 EMA * (1 - 승수))
    } else {
      // ema가 시작되는 부분
      value = parseFloat(mData[i][4]);
    }
    ema.push(value);
  }

  // console.log("calc ema for :: \n", ema);

  return ema;
};
