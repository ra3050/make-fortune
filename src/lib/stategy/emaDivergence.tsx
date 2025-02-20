import { heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";
import React from "react";

/**
 * EMA와 RSI다이버전스를 이용한 전략
 * @param heikin 계산된 하이킨아시값
 * @param ema 계산된 ema값
 * @param rsi 계산된 rsi값
 * @param interval 계산할 차트의 시간값
 * @param symbol 계산할 데이터의 이름 || default: BTCUSDT
 */
export const emaBullDivergence = (
  heikin: heikinashiInformation[],
  ema: movingAverageInfo[],
  rsi: rsiInformation,
  interval: string,
  symbol: string = "BTCUSDT"
) => {};

export const emaBearDivergence = () => {};
