import React, { useEffect, useState } from "react";

import logo from "./logo.svg";
import "./App.css";
import { klines, price } from "lib/api/market/bianaceAPI";
import { ema, sma } from "lib/indicator/movingAverage";

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

  const calcSimpleMovingAverage = (movingLength: number): void => {};

  const fetchMarketData = async (
    symbol: string,
    interval: string,
    limit: number
  ) => {
    try {
      const response = await klines(symbol, interval, limit);

      if (response && response.data) {
        console.log(response?.data);
        setMarketData(response.data);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  useEffect(() => {
    fetchMarketData("BTCUSDT", "1d", 1000);
  }, []);

  useEffect(() => {
    if (marketData.length !== 0) {
      sma(marketData, 89);
      ema(marketData, 89);
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
