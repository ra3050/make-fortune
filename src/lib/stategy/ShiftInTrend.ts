import { heikinashiInformation } from "lib/chart/heikinashi";
import { rsiInformation } from "lib/indicator/RelativeStrengthIndex";

export const shiftInTrend_Heikin = (
  heikin: heikinashiInformation[],
  rsi: rsiInformation[]
) => {
  const info: heikinashiInformation[] = [...heikin];
  const marketLength = heikin.length;

  for (let i = 0; i < marketLength; i++) {
    // 꼬리, 몸통 계산
    const bodyWidth = Math.abs(heikin[i].open - heikin[i].close);
    const upperWick =
      heikin[i].high - Math.max(heikin[i].open, heikin[i].close);
    const lowerWick = Math.min(heikin[i].open, heikin[i].close) - heikin[i].low;

    // 몸통 꼬리 길이검사
    if (bodyWidth < upperWick && bodyWidth < lowerWick) {
      // rsi 과매도 여부 검사
      if (rsi[i].value > 70 || rsi[i].value < 30) {
        info[i] = {
          ...heikin[i],
          shiftInTrend: true,
        };
      }

      // 직전봉의 rsi 검사
      if (i !== 0) {
        if (rsi[i - 1].value > 70 || rsi[i - 1].value < 30) {
          info[i] = {
            ...heikin[i],
            shiftInTrend: true,
          };
        }
      }
    }
  }

  return info;
};
