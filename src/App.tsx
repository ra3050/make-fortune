import React from "react";

import logo from "./logo.svg";
import "./App.css";
import { klines, price } from "lib/api/market/bianaceAPI";

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

const fetchMarketData = async (
  symbol: string,
  interval: string,
  limit: number
) => {
  try {
    const response = await klines(symbol, interval, limit);

    if (response && response.data) {
      console.log(response.data);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

function App() {
  fetchTickerPrice();
  fetchMarketData("BTCUSDT", "1h", 1000);

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
