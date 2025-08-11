import { heikinashiInformation } from "../chart/heikinashi";
import { rsiInformation } from "../indicator/RelativeStrengthIndex";

/** 상승다이버전스 구분여부 반환 */
export const upperDivergence = (
  heikin: heikinashiInformation[],
  rsi: rsiInformation[]
) => {
  // timeFrame 불일치 오류 검사
  if (heikin.length !== rsi.length) {
    console.log("Error, the emaDivergence stategy");
    return [];
  }

  const info: heikinashiInformation[] = [...heikin];

  const marketLength = heikin.length;

  // 다이버전스 발생여부 저장
  let x = -1; // rsi 과매도 진입시점(index) default: -1
  let y = -1; // rsi 과매도 재진입 시점(index) default: -1
  let divergenceEnable = false; // 다이버전스 기록 가능여부

  // 다이버전스 계산
  for (let i = 0; i < marketLength; i++) {
    // 가장 강한 과매도가 발생한 시점
    if (rsi[i].value < 30 && rsi[i].value !== 0) {
      // 과매도 최초진입
      if (x === -1) {
        x = i;

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

    if (x !== -1 && y !== -1 && divergenceEnable) {
      // 배열 범위 체크 추가
      if (i + 1 < marketLength) {
        info[i + 1] = {
          ...heikin[i + 1],
          upperDivergence: true,
        };
      }
    }
  }

  return info;
};

/**
 * 하락다이버전스 구분여부 반환
 * @param heikin
 * @param rsi
 * @returns
 */
export const lowwerDivergence = (
  heikin: heikinashiInformation[],
  rsi: rsiInformation[]
) => {
  // timeFrame 불일치 오류 검사
  if (heikin.length !== rsi.length) {
    console.log("Error, the emaDivergence stategy");
    return [];
  }

  const info: heikinashiInformation[] = [...heikin];

  const marketLength = heikin.length;

  // 다이버전스 발생여부 저장
  let x = -1; // rsi 과매수 진입시점(index) default: -1
  let y = -1; // rsi 과매수 재진입 시점(index) default: -1
  let divergenceEnable = false; // 다이버전스 기록 가능여부

  // 다이버전스 계산
  for (let i = 0; i < marketLength; i++) {
    // 가장 강한 매수가 발생한 시점
    if (70 < rsi[i].value && rsi[i].value !== 0) {
      // 과매수 최초진입
      if (x === -1) {
        x = i;
      } else if (rsi[x].value < rsi[i].value) {
        // 과매수 갱신
        x = i;
        y = -1;
        divergenceEnable = false;
      }
    }

    // 과매수 상태에서 정상범위로 돌아왔을 때
    if (x !== -1 && rsi[i].value <= 70) {
      divergenceEnable = true;
    }

    // 정상 => 과매수 진입시점 :: 다비어전스 발생시점
    if (x !== -1 && rsi[i].value > 70 && divergenceEnable) {
      if (heikin[i].high > heikin[x].high) {
        // x = i;
        y = i;
      } else {
        y = -1;
      }
    } else {
      y = -1;
    }

    // RSI 과매도 진입시 초기화
    if (30 >= rsi[i].value) {
      x = -1;
      y = -1;
      divergenceEnable = false;
    }

    if (x !== -1 && y !== -1 && divergenceEnable) {
      // 배열 범위 체크 추가
      if (i + 1 < marketLength) {
        info[i + 1] = {
          ...heikin[i + 1],
          lowwerDivergence: true,
        };
      }
    }
  }

  return info;
};
