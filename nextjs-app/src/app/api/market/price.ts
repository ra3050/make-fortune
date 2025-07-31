import { NextResponse } from "next/server";

// 바이내스 spot 현재가격
export const price = async (symbol: string): Promise<NextResponse | void> => {
  const url = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.log("error: 알수없는 오류: ", e);
  }
};
