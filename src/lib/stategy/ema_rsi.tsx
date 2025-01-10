import { heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";
import React from "react";
import { calcTimeFrameToString } from "utils/calculate";

/**
 * 롱 관점으로 ema와 ema4배수 사이에 종가가 위치하고 rsi조건이 맞는지 확인합니다.
 * @param chartInfo heikinashi or marketData
 * @param ema 배열로 정렬된 ema 데이터
 * @param rsi 배열로 정렬된 rsi 데이터
 * @param rsiFourMul 배열로 정렬된 rsi 4배수 데이터
 * @param chartType default = 1, 1: heikinashi, 0: candle
 */
export const emarsi = (
  chartInfo: any[] | heikinashiInformation[],
  ema: movingAverageInfo[],
  rsi: rsiInformation[],
  rsiFourMul: rsiInformation[],
  chartType: number = 1
) => {
  const ema89 = ema[0].ma;
  const ema89_4 = ema[1].ma;
  const ema144 = ema[2].ma;
  const ema144_4 = ema[3].ma;
  const ema233 = ema[4].ma;
  const ema233_4 = ema[5].ma;
  const ema377 = ema[6].ma;
  const ema377_4 = ema[7].ma;
  const ema610 = ema[8].ma;
  const ema610_4 = ema[9].ma;
  const ema987 = ema[10].ma;
  const ema987_4 = ema[11].ma;
  const ema1597 = ema[12].ma;
  const ema1597_4 = ema[13].ma;
  const ema2584 = ema[14].ma;
  const ema2584_4 = ema[15].ma;

  const date = new Date();

  if (chartType === 1) {
    const chartlength = chartInfo.length;

    // rsi, rsiFourMul의 타임프레임이 처음 일치하는 부분을 찾아 해당 타임프레임 값이 첫번째 인덱스에 위치할 수 있도록 변경합니다.
    const firstTimeFrame = rsiFourMul[0].timeFrame;
    let sRsi = rsi.slice(1, rsi.length);

    // chartlength에 맞춰 rsi크기를 맞춥니다.
    const ac = chartlength - sRsi.length;
    if (0 < ac) {
      for (let i = 0; i < ac; i++) {
        sRsi = [{ timeFrame: 0, value: 0 }, ...sRsi];
      }
    }

    for (let i = 0; i < chartlength; i++) {
      // 0. ema 타임프레임이 rsi와 일치하는지 확인합니다.
      if (firstTimeFrame <= sRsi[i].timeFrame) {
        // 타임프레임이 현재 시간 기준으로 72시간 이내에 있는지 확인합니다. // 3600000 = 1h, 259200000 = 72h
        const curTF =
          Math.floor(Date.parse(date.toISOString()) / 1000) - 259200;
        if (sRsi[i].timeFrame < curTF) {
          continue;
        }
        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema89[i].value &&
          ema89_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema89, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema144[i].value &&
          ema144_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema144, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema233[i].value &&
          ema233_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema233, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema377[i].value &&
          ema377_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema377, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema610[i].value &&
          ema610_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema610, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema987[i].value &&
          ema987_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema987, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema1597[i].value &&
          ema1597_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema1597, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].low < ema2584[i].value &&
          ema2584_4[i].value < chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value < 30) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value < 30 && sRsi[i - 1].value < 30) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value < sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema2584, ",
                  "close: ",
                  chartInfo[i].close,
                  "low: ",
                  chartInfo[i].low,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
      } else {
        console.log("ERROR, 타임프레임이 일치하지 않습니다.");
      }
    }
    //
  }
};

/**
 * 숏 관점으로 ema와 ema4배수 사이에 종가가 위치하고 rsi조건이 맞는지 확인합니다.
 * @param chartInfo heikinashi or marketData
 * @param ema 배열로 정렬된 ema 데이터
 * @param rsi 배열로 정렬된 rsi 데이터
 * @param rsiFourMul 배열로 정렬된 rsi 4배수 데이터
 * @param chartType default = 1, 1: heikinashi, 0: candle
 */
export const emarsiForShort = (
  chartInfo: any[] | heikinashiInformation[],
  ema: movingAverageInfo[],
  rsi: rsiInformation[],
  rsiFourMul: rsiInformation[],
  chartType: number = 1
) => {
  const ema89 = ema[0].ma;
  const ema89_4 = ema[1].ma;
  const ema144 = ema[2].ma;
  const ema144_4 = ema[3].ma;
  const ema233 = ema[4].ma;
  const ema233_4 = ema[5].ma;
  const ema377 = ema[6].ma;
  const ema377_4 = ema[7].ma;
  const ema610 = ema[8].ma;
  const ema610_4 = ema[9].ma;
  const ema987 = ema[10].ma;
  const ema987_4 = ema[11].ma;
  const ema1597 = ema[12].ma;
  const ema1597_4 = ema[13].ma;
  const ema2584 = ema[14].ma;
  const ema2584_4 = ema[15].ma;

  const date = new Date();

  if (chartType === 1) {
    const chartlength = chartInfo.length;

    // rsi, rsiFourMul의 타임프레임이 처음 일치하는 부분을 찾아 해당 타임프레임 값이 첫번째 인덱스에 위치할 수 있도록 변경합니다.
    const firstTimeFrame = rsiFourMul[0].timeFrame;
    let sRsi = rsi.slice(1, rsi.length);

    // chartlength에 맞춰 rsi크기를 맞춥니다.
    const ac = chartlength - sRsi.length;
    if (0 < ac) {
      for (let i = 0; i < ac; i++) {
        sRsi = [{ timeFrame: 0, value: 0 }, ...sRsi];
      }
    }

    for (let i = 0; i < chartlength; i++) {
      // 0. ema 타임프레임이 rsi와 일치하는지 확인합니다.
      if (firstTimeFrame <= sRsi[i].timeFrame) {
        // 타임프레임이 현재 시간 기준으로 72시간 이내에 있는지 확인합니다. // 3600000 = 1h, 259200000 = 72h
        // const curTF =
        //   Math.floor(Date.parse(date.toISOString()) / 1000) - 259200;
        // if (sRsi[i].timeFrame < curTF) {
        //   continue;
        // }
        // 1. low값이 ema 혹은 ema4배수 하단에 위치하는지 확인하며, 종가가 ema4배수 아래에 위치하는지 확인합니다.
        if (
          chartInfo[i].high > ema89_4[i].value &&
          ema89[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema89, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }

        if (
          chartInfo[i].high > ema144_4[i].value &&
          ema144[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema144, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema233_4[i].value &&
          ema233[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema233, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema377_4[i].value &&
          ema377[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema377, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema610_4[i].value &&
          ema610[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema610, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema987_4[i].value &&
          ema987[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema987, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema1597_4[i].value &&
          ema1597[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema1597, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
        if (
          chartInfo[i].high > ema2584_4[i].value &&
          ema2584[i].value > chartInfo[i].close
        ) {
          // 2. rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i].value > 70) {
            // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
            if (rsiFourMul[i - 1].value > 70 && sRsi[i - 1].value > 70) {
              // 4. rsi가 이전보다 높은가 (반등했는가)
              if (sRsi[i - 1].value > sRsi[i].value) {
                // 조건 디지게 많네 시발거
                console.log(
                  "ema2584, ",
                  "close: ",
                  chartInfo[i].close,
                  "high: ",
                  chartInfo[i].high,
                  "UTC: ",
                  calcTimeFrameToString(chartInfo[i].timeFrame)
                );
              }
            }
          }
        }
      } else {
        console.log("ERROR, 타임프레임이 일치하지 않습니다.");
      }
    }
    //
  }
};

export interface emarsiStrategy {
  timeFrame: number;
  timeUTC: string;
}
