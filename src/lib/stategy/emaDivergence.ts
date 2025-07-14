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
    console.log("Error, the emaDivergence stategy");
    return [];
  }

  const marketLength = heikin.length;

  // 다이버전스 발생여부 저장
  const divergenceArr: { x: number; y: number }[] = [];
  let x = -1; // rsi 과매도 진입시점(index) default: -1
  let y = -1; // rsi 과매도 재진입 시점(index) default: -1
  let divergencePrice = 0; // 다이버전스의 기준이 되는 가격
  let divergenceEnable = false; // 다이버전스 기록 가능여부

  const info: heikinashiInformation[] = [...heikin];

  // 다이버전스 계산
  for (let i = 0; i < marketLength; i++) {
    // 가장 강한 과매도가 발생한 시점
    if (rsi[i].value < 30 && rsi[i].value !== 0) {
      // 과매도 최초진입
      if (x === -1) {
        x = i;
        divergencePrice = heikin[i].low;
        // 과매도 갱신
      } else if (rsi[i].value < rsi[x].value) {
        x = i;
        y = -1;
        divergenceEnable = false;
      }
    }

    // 과매도 => 정상범위 전환시점
    if (x !== -1 && 30 <= rsi[i].value) {
      divergenceEnable = true;
    }

    // 정상 => 과매도 진입시점 :: 다비어전스 발생시점
    if (x !== -1 && rsi[i].value < 30 && divergenceEnable) {
      if (heikin[i].low < heikin[x].low) {
        // x = i;
        y = i;
      } else {
        y = -1;
      }
    } else {
      y = -1;
    }

    // RSI 과매수 진입시 초기화
    if (70 <= rsi[i].value) {
      x = -1;
      y = -1;
      divergenceEnable = false;
    }

    divergenceArr.push({ x, y });

    // if (x !== -1 && y !== -1 && divergenceEnable) {
    //   info[i + 1] = {
    //     ...heikin[i + 1],
    //     divergence: true,
    //   };
    // }
  }

  // 전략 대입
  for (let i = 0; i < marketLength; i++) {
    // 조건 1. 다이버전스 검사
    if (divergenceArr[i].x !== -1 && divergenceArr[i].y !== -1) {
      // const time = calcTimeFrameToString(heikin[i].timeFrame);

      // 조건 2-1. 하이킨아시 몸통, 꼬리 계산 (현재봉)
      const bodyWidth = Math.abs(heikin[i].open - heikin[i].close);
      const upperWick =
        heikin[i].high - Math.max(heikin[i].open, heikin[i].close);
      const lowerWick =
        Math.min(heikin[i].open, heikin[i].close) - heikin[i].low;
      // 조건 2-2, 하이킨아시 몸통, 꼬리 계산 (다음봉)
      let nbodyWidth = 0;
      let nUppmerWick = 0;
      let nLowerWick = 0;
      if (marketLength - 1 !== i) {
        nbodyWidth = Math.abs(heikin[i + 1].open - heikin[i + 1].close);
        nUppmerWick =
          heikin[i + 1].high -
          Math.max(heikin[i + 1].open, heikin[i + 1].close);
        nLowerWick =
          Math.min(heikin[i + 1].open, heikin[i + 1].close) - heikin[i + 1].low;
      }

      // 조건 2-3. 길이검사
      if (bodyWidth < upperWick && bodyWidth < lowerWick) {
        info[i] = {
          ...heikin[i],
          divergence: true,
        };
      }
      // 조건 2-3. 길이검사
      if (nbodyWidth < nUppmerWick && nbodyWidth < nLowerWick) {
        info[i + 1] = {
          ...heikin[i + 1],
          divergence: true,
        };
      }
    }
  }

  return info;
};

export const emaBearDivergence = () => {};
