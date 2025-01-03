import { heikinashiInformation } from "lib/chart/heikinashi";
import { movingAverageInfo } from "lib/indicator/movingAverage";
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
  rsi: number[],
  rsiFourMul: number[],
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

  if (chartType === 1) {
    const chartlength = chartInfo.length;

    for (let i = 0; i < chartlength; i++) {
      // 1. ema and ema_4 사이에 종가가 위치하는가
      if (ema89[i] < chartInfo[i].close && ema89[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema144[i] < chartInfo[i].close && ema144[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema233[i] < chartInfo[i].close && ema233[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema377[i] < chartInfo[i].close && ema377[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema610[i] < chartInfo[i].close && ema610[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema987[i] < chartInfo[i].close && ema987[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema1597[i] < chartInfo[i].close && ema1597[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
      if (ema2584[i] < chartInfo[i].close && ema2584[i] > chartInfo[i].low) {
        // 2. rsi 4배수가 과매도 상태인가
        if (rsiFourMul[i] < 30) {
          // 3. 이전 rsi, rsi 4배수가 과매도 상태인가
          if (rsiFourMul[i - 1] < 30 && rsi[i - 1] < 30) {
            // 4. rsi가 이전보다 높은가 (반등했는가)
            if (rsi[i - 1] < rsi[i]) {
              // 조건 디지게 많네 시발거
              console.log(
                "timeFrame: ",
                chartInfo[i].timeFrame,
                "close : ",
                chartInfo[i].close,
                "UTC: ",
                calcTimeFrameToString(chartInfo[i].timeFrame)
              );
            }
          }
        }
      }
    }
    //
  }
};

export interface emarsiStrategy {
  timeFrame: number;
  timeUTC: string;
}
