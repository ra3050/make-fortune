import { AxiosResponse } from "axios";
import { axiosGetForm } from "../client";

// 바이내스 spot 현재가격
export const price = async (symbol: string): Promise<AxiosResponse | void> => {
  let testURI =
    process.env.REACT_APP_MARKET_DATA_BASE_URL +
    `ticker/price?symbol=${symbol}`;
  try {
    return await axiosGetForm(testURI);
  } catch (e) {
    console.log("error: 알수없는 오류");
  }
};

/**
 * 현재 호가정보를 불러옵니다.
 * {
 *   lastUpdateId
 *    bids:[
 *       [
 *          price(float),
 *          qtc(float)
 *       ]
 *    ]
 *    asks:[
 *      [
 *          price(float),
 *          qtc(float)
 *      ]
 *    ]
 *
 * }
 */
export const depth = async (
  symbol: string,
  limit: number
): Promise<AxiosResponse | void> => {
  let URI =
    process.env.REACT_APP_MARKET_DATA_BASE_URL +
    `ticker/price?symbol=${symbol}&limit=${limit.toString}`;

  try {
    return await axiosGetForm(URI);
  } catch (e) {
    console.log("error: 알수없는 오류");
  }
};

/**
 * 바이낸스 마켓데이터를 불러옵니다
 * @param symbol 조회할 코인의 티커
 * @param interval 조회할 시간정보
 * @param limit 불러올 데이터 수 :: 기본 500개 최대 1000개
 */
export const klines = async (
  symbol: string,
  interval: string = "1d",
  limit: number = 500
): Promise<AxiosResponse | void> => {
  let uri =
    process.env.REACT_APP_MARKET_DATA_BASE_URL +
    `klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    return await axiosGetForm(uri);
  } catch (e) {
    console.log("error: 알수없는 오류");
  }
};
