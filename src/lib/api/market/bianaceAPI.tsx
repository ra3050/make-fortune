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
