import { NextResponse } from "next/server";
import { GET } from "./route";

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
): Promise<NextResponse | void> => {
  const request: string = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  try {
    const response = await GET(request);
    return response;
  } catch (e) {
    console.log("error: 알수없는 오류: ", e);
  }
};
