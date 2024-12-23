import React, { useEffect, useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import { klines, price } from "lib/api/market/bianaceAPI";
import { ema, sma } from "lib/indicator/movingAverage";
import { heikinashi } from "lib/chart/heikinashi";
import { rsi, rsiFourMul } from "lib/indicator/RelativeStrengthIndex";

const fetchTickerPrice = async () => {
  try {
    const response = await price("BTCUSDT");

    if (response && response.data) {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function App() {
  const [marketData, setMarketData] = useState([]);
  const [smaArray, setSmaArray] = useState([]);
  const [emaArray, setEmaArray] = useState([]);
  const interval = "4h";

  const fetchMarketData = async (
    symbol: string,
    interval: string,
    limit: number
  ) => {
    try {
      const response = await klines(symbol, interval, limit);

      if (response && response.data) {
        // console.log(response?.data);
        setMarketData(response.data);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  useEffect(() => {
    fetchMarketData("BTCUSDT", interval, 1000);
  }, []);

  useEffect(() => {
    if (marketData.length !== 0) {
      sma(marketData, 89);
      ema(marketData, 89);
      const heikin = heikinashi(marketData);
      // tradingView의 rsi와 차이를 보임
      // tradingview의 rsi도 만들어서 테스트 해봐야 할 것으로 보임
      rsi(heikin, 14, 1);
      rsiFourMul(heikin, 14, 1, interval);
    }
  }, [marketData]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
