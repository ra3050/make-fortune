import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(url: string) {
  if (!url) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Binance API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
