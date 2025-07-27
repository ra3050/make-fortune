import { NextResponse } from "next/server";
import { GET } from "./route";

// 바이내스 spot 현재가격
export const price = async (symbol: string): Promise<NextResponse | void> => {
  const request: string = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  try {
    return await GET(request);
  } catch (e) {
    console.log("error: 알수없는 오류: ", e);
  }
};
