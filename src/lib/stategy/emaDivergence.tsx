import { heikinashi, heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";
import React from "react";
import { calcTimeFrameToString } from "utils/calculate";

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
  rsi: rsiInformation[],
  interval: string,
  symbol: string = "BTCUSDT"
): divergenceInformation[] | void => {
  // timeFrame 불일치 오류 검사
  if (heikin.length != rsi.length) {
    console.log(
      "emaBullDivergence전략 실행중 rsiInformation에 timeFrame 오류가 발생했습니다."
    );
    return;
  }

  const marketLength = heikin.length;
  let x = -1; // rsi 과매도 진입시점(index) default: -1
  let alpha = -1; // rsi 정상범위 진입시점(index) default: -1
  let beta = -1; // rsi 과매도 재진입 시점(index) default: -1
  let a: heikinashiInformation; // alpha 일 때 가격정보
  let b: heikinashiInformation; // beta 일 때 가격정보
  // beta의 timeFrame이 필요한거야 그렇지?
  for (let i = 0; i < marketLength; i++) {
    // 첫 과매도 진입시점
    if (x === -1 && rsi[i].value < 30 && rsi[i].value !== 0) {
      x = i;
    }
    // 과매도 => 정상 전환시점
    if (x !== -1 && 30 <= rsi[i].value) {
      alpha = i;
      a = heikin[i];
    }
    // 정상 => 과매도 진입시점
    if (x !== -1 && alpha !== -1 && rsi[i].value < 30) {
      beta = i;
      b = heikin[i];
    }

    // RSI 과매수 진입시 초기화
    if (70 <= rsi[i].value) {
      x = -1;
      alpha = -1;
      beta = -1;
    }

    // 조건 1. 다이버전스 만족
    if (x !== -1 && alpha !== -1 && beta !== -1) {
      // 조건 2. ema 사이값 만족
      const time = calcTimeFrameToString(heikin[i].timeFrame);
      console.log("발생시간 : ", time);
    }

    // console.log("x: ", x, "alpha: ", alpha, "beta: ", beta);
  }
};

interface divergenceInformation {
  timeFrame: number;
  value: number;
}

export const emaBearDivergence = () => {};
