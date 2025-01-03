import React from "react";

export interface heikinashiInformation {
  timeFrame: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const heikinashi = (mData: Array<any>): Array<heikinashiInformation> => {
  const mLength = mData.length ?? 0;
  const value: Array<heikinashiInformation> = [];

  for (let i = 0; i < mLength; i++) {
    const timeFrame = mData[i][0] / 1000;
    const open =
      i !== 0
        ? (value[i - 1].open + value[i - 1].close) / 2
        : parseFloat(mData[0][1]);
    const close =
      (parseFloat(mData[i][1]) +
        parseFloat(mData[i][2]) +
        parseFloat(mData[i][3]) +
        parseFloat(mData[i][4])) /
      4;
    const high = Math.max(parseFloat(mData[i][2]), open, close); // 캔들차트 고가, 하이킨아시 시가, 하이킨아시 종가 중 최고가
    const low = Math.min(parseFloat(mData[i][3]), open, close); // 캔들차트 저가, 하이킨아시 시가, 하이킨아시 종사 중 최고가

    value.push({
      timeFrame: timeFrame,
      open: open,
      high: high,
      low: low,
      close: close,
    });
  }

  // console.log("heikinashi: ", value);

  return value;
};
