import { heikinashi, heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";
import { calcIsBetween, calcTimeFrameToString } from "utils/calculate";

// /**
//  * EMA와 RSI다이버전스를 이용한 전략
//  * @param heikin 계산된 하이킨아시값
//  * @param ema 계산된 ema값
//  * @param rsi 계산된 rsi값
//  * @param interval 계산할 차트의 시간값
//  * @param symbol 계산할 데이터의 이름 || default: BTCUSDT
//  */
// export const emaBullDivergence = (
//   heikin: heikinashiInformation[],
//   ema: movingAverageInfo[],
//   rsi: rsiInformation[],
//   interval: string,
//   symbol: string = "BTCUSDT"
// ): heikinashiInformation[] => {
//   // timeFrame 불일치 오류 검사
//   if (heikin.length !== rsi.length) {
//     console.log("Error, the emaDivergence stategy");
//     return [];
//   }

//   const marketLength = heikin.length;

//   // 다이버전스 발생여부 저장
//   const divergenceArr: { x: number; y: number }[] = [];
//   let x = -1; // rsi 과매도 진입시점(index) default: -1
//   let y = -1; // rsi 과매도 재진입 시점(index) default: -1
//   let divergencePrice = 0; // 다이버전스의 기준이 되는 가격
//   let divergenceEnable = false; // 다이버전스 기록 가능여부

//   const info: heikinashiInformation[] = [...heikin];

//   // 다이버전스 계산
//   for (let i = 0; i < marketLength; i++) {
//     // 가장 강한 과매도가 발생한 시점
//     if (rsi[i].value < 30 && rsi[i].value !== 0) {
//       // 과매도 최초진입
//       if (x === -1) {
//         x = i;
//         divergencePrice = heikin[i].low;
//         // 과매도 갱신
//       } else if (rsi[i].value < rsi[x].value) {
//         x = i;
//         y = -1;
//         divergenceEnable = false;
//       }
//     }

//     // 과매도 => 정상범위 전환시점
//     if (x !== -1 && 30 <= rsi[i].value) {
//       divergenceEnable = true;
//     }

//     // 정상 => 과매도 진입시점 :: 다비어전스 발생시점
//     if (x !== -1 && rsi[i].value < 30 && divergenceEnable) {
//       if (heikin[i].low < heikin[x].low) {
//         // x = i;
//         y = i;
//       } else {
//         y = -1;
//       }
//     } else {
//       y = -1;
//     }

//     // RSI 과매수 진입시 초기화
//     if (70 <= rsi[i].value) {
//       x = -1;
//       y = -1;
//       divergenceEnable = false;
//     }

//     divergenceArr.push({ x, y });

//     // if (x !== -1 && y !== -1 && divergenceEnable) {
//     //   info[i + 1] = {
//     //     ...heikin[i + 1],
//     //     divergence: true,
//     //   };
//     // }
//   }

//   // 전략 대입
//   for (let i = 0; i < marketLength; i++) {
//     // 조건 1. 다이버전스 검사
//     if (divergenceArr[i].x !== -1 && divergenceArr[i].y !== -1) {
//       // const time = calcTimeFrameToString(heikin[i].timeFrame);

//       // 조건 2-1. 하이킨아시 몸통, 꼬리 계산 (현재봉)
//       const bodyWidth = Math.abs(heikin[i].open - heikin[i].close);
//       const upperWick =
//         heikin[i].high - Math.max(heikin[i].open, heikin[i].close);
//       const lowerWick =
//         Math.min(heikin[i].open, heikin[i].close) - heikin[i].low;
//       // 조건 2-2, 하이킨아시 몸통, 꼬리 계산 (다음봉)
//       let nbodyWidth = 0;
//       let nUppmerWick = 0;
//       let nLowerWick = 0;
//       if (marketLength - 1 !== i) {
//         nbodyWidth = Math.abs(heikin[i + 1].open - heikin[i + 1].close);
//         nUppmerWick =
//           heikin[i + 1].high -
//           Math.max(heikin[i + 1].open, heikin[i + 1].close);
//         nLowerWick =
//           Math.min(heikin[i + 1].open, heikin[i + 1].close) - heikin[i + 1].low;
//       }

//       // 조건 2-3. 길이검사
//       if (bodyWidth < upperWick && bodyWidth < lowerWick) {
//         info[i] = {
//           ...heikin[i],
//           divergence: true,
//         };
//       }
//       // 조건 2-3. 길이검사
//       if (nbodyWidth < nUppmerWick && nbodyWidth < nLowerWick) {
//         info[i + 1] = {
//           ...heikin[i + 1],
//           divergence: true,
//         };
//       }
//     }
//   }

//   return info;
// };

// export const emaBearDivergence = (
//   heikin: heikinashiInformation[],
//   ema: movingAverageInfo[],
//   rsi: rsiInformation[],
//   interval: string,
//   symbol: string = "BTCUSDT"
// ): heikinashiInformation[] => {
//   if (heikin.length !== rsi.length) {
//     console.log("Error, the emaBearDivergence strategy");
//     return [];
//   }

//   const marketLength = heikin.length;
//   const info: heikinashiInformation[] = [...heikin];

//   const divergenceArr: { x: number; y: number }[] = [];
//   let x = -1;
//   let y = -1;
//   let divergenceEnable = false;

//   // 1. 다이버전스 계산 루프
//   for (let i = 0; i < marketLength; i++) {
//     // 다이버전스 발생 지점(y)은 해당 루프 내에서만 유효해야 하므로 매번 초기화
//     y = -1;

//     if (rsi[i].value > 70) {
//       if (x === -1) {
//         x = i;
//       } else {
//         // 정상 -> 과매수 재진입 시점 (다이버전스 체크)
//         if (divergenceEnable) {
//           // 조건 1: 가격은 고점을 높였는가?
//           if (heikin[i].high > heikin[x].high) {
//             // 조건 2: RSI는 고점을 낮췄는가?
//             if (rsi[i].value < rsi[x].value) {
//               y = i; // 현재 인덱스(i)에서 다이버전스 발생 확정
//             } else {
//               // 가격과 RSI 모두 고점을 높였으므로, 새로운 기준점(x)으로 삼음
//               x = i;
//             }
//           }
//         }
//         // RSI가 이전 고점보다 높으면 기준점(x)을 현재 위치로 갱신
//         else if (rsi[i].value > rsi[x].value) {
//           x = i;
//         }
//       }
//       // 과매수 구간에 있으므로 `divergenceEnable`은 비활성화 상태로 유지
//       divergenceEnable = false;
//     }

//     if (x !== -1 && rsi[i].value <= 70) {
//       divergenceEnable = true;
//     }

//     if (rsi[i].value <= 30) {
//       x = -1;
//       divergenceEnable = false;
//     }

//     divergenceArr.push({ x, y });
//   }

//   // 2. 전략 대입 루프 (Heikin-Ashi 캔들 패턴 확인)
//   for (let i = 0; i < marketLength; i++) {
//     // ⚠️ [수정된 핵심 로직]
//     // 현재 인덱스(i)가 다이버전스가 확정된 지점(y)과 정확히 일치하는지 확인합니다.
//     if (divergenceArr[i].y === i) {
//       const bodyWidth = Math.abs(heikin[i].open - heikin[i].close);
//       const upperWick =
//         heikin[i].high - Math.max(heikin[i].open, heikin[i].close);
//       const lowerWick =
//         Math.min(heikin[i].open, heikin[i].close) - heikin[i].low;

//       let nBodyWidth = 0;
//       let nUpperWick = 0;
//       if (marketLength - 1 !== i) {
//         nBodyWidth = Math.abs(heikin[i + 1].open - heikin[i + 1].close);
//         nUpperWick =
//           heikin[i + 1].high -
//           Math.max(heikin[i + 1].open, heikin[i + 1].close);
//       }

//       if (bodyWidth < upperWick && bodyWidth < lowerWick) {
//         info[i] = {
//           ...heikin[i],
//           divergence: true,
//         };
//       }
//       if (nBodyWidth < nUpperWick && marketLength - 1 !== i) {
//         info[i + 1] = {
//           ...heikin[i + 1],
//           divergence: true,
//         };
//       }
//     }
//   }

//   return info;
// };
