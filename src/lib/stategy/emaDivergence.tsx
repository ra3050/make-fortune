import React from "react";
import { heikinashi, heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";
import { calcIsBetween, calcTimeFrameToString } from "utils/calculate";

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
): heikinashiInformation[] => {
  // timeFrame 불일치 오류 검사
  if (heikin.length !== rsi.length) {
    console.log(
      "emaBullDivergence전략 실행중 rsiInformation에 timeFrame 오류가 발생했습니다."
    );
    return [];
  }

  const marketLength = heikin.length;
  let x = -1; // rsi 과매도 진입시점(index) default: -1
  let alpha = -1; // rsi 정상범위 진입시점(index) default: -1
  let beta = -1; // rsi 과매도 재진입 시점(index) default: -1
  let a: heikinashiInformation; // alpha 일 때 가격정보
  let b: heikinashiInformation; // beta 일 때 가격정보
  const info: heikinashiInformation[] = [...heikin];

  for (let i = 0; i < marketLength; i++) {
    // 가장 강한 과매도가 발생한 시점
    if (rsi[i].value < 30 && rsi[i].value !== 0) {
      // rsi 과매도 최초 진입
      if (x === -1) {
        x = i;
        // 과매도 갱신
      } else if (rsi[i].value < rsi[x].value) {
        x = i;
        alpha = -1;
      }
    }
    // 과매도 => 정상범위 전환시점
    if (x !== -1 && 30 <= rsi[i].value) {
      alpha = i;
      a = heikin[i];
    }
    // 정상 => 과매도 진입시점
    if (x !== -1 && alpha !== -1 && rsi[i].value < 30) {
      if (rsi[x].value < rsi[i].value) {
        beta = i;
        b = heikin[i];
      } else {
        beta = -1;
      }
    }

    // RSI 과매도 상태가 아닐경우 다이버전스 판단 x
    if (30 <= rsi[i].value) {
      beta = -1;
    }

    // RSI 과매수 진입시 초기화
    if (70 <= rsi[i].value) {
      x = -1;
      alpha = -1;
      beta = -1;
    }

    // 조건 1. 다이버전스 만족
    if (x !== -1 && alpha !== -1 && beta !== -1) {
      const time = calcTimeFrameToString(heikin[i].timeFrame);

      // 조건 2. ema 사이값 만족
      const ema89 = ema[0].ma;
      const ema84 = ema[1].ma;
      const ema144 = ema[2].ma;
      const ema136 = ema[3].ma;
      const ema233 = ema[4].ma;
      const ema220 = ema[5].ma;
      const ema377 = ema[6].ma;
      const ema356 = ema[7].ma;
      const ema610 = ema[8].ma;
      const ema576 = ema[9].ma;
      const ema987 = ema[10].ma;
      const ema932 = ema[11].ma;
      const ema1597 = ema[12].ma;
      const ema1508 = ema[13].ma;
      const ema2584 = ema[14].ma;
      const ema2440 = ema[15].ma;
      const ema4181 = ema[16].ma;
      const ema3948 = ema[17].ma;

      if (calcIsBetween(heikin[i].high, heikin[i].low, ema89[i].value)) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (calcIsBetween(heikin[i].high, heikin[i].low, ema84[i].value)) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema144[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema136[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema233[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema220[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema377[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema356[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema610[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema576[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema987[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema932[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema1597[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema1508[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema2584[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema2440[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema4181[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      } else if (
        calcIsBetween(heikin[i].high, heikin[i].low, ema3948[i].value)
      ) {
        // console.log("발생시간 : ", time, rsi[x].value, rsi[beta].value);
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      }
    }
  }

  // console.log(info);

  return info;
};

export const emaBearDivergence = () => {};
