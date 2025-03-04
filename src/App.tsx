import React, { useEffect, useState } from "react";
import btc1d from "./resource/BINANCE_BTCUSDT, 1D.csv";
import btc12h from "./resource/BINANCE_BTCUSDT, 720.csv";
import btc6h from "./resource/BINANCE_BTCUSDT, 360.csv";
import btc4h from "./resource/BINANCE_BTCUSDT, 240.csv";
import btc3h from "./resource/BINANCE_BTCUSDT, 180.csv";
import btc2h from "./resource/BINANCE_BTCUSDT, 120.csv";
import btc1h from "./resource/BINANCE_BTCUSDT, 60.csv";
import btc45m from "./resource/BINANCE_BTCUSDT, 45.csv";
import btc30m from "./resource/BINANCE_BTCUSDT, 30.csv";
import btc15m from "./resource/BINANCE_BTCUSDT, 15.csv";
import btc5m from "./resource/BINANCE_BTCUSDT, 5.csv";
import eth1d from "./resource/ETHUSDT/BINANCE_ETHUSDT, 1D.csv";
import eth12h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 720.csv";
import eth6h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 360.csv";
import eth4h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 240.csv";
import eth3h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 180.csv";
import eth2h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 120.csv";
import eth1h from "./resource/ETHUSDT/BINANCE_ETHUSDT, 60.csv";
import eth30m from "./resource/ETHUSDT/BINANCE_ETHUSDT, 30.csv";
import eth15m from "./resource/ETHUSDT/BINANCE_ETHUSDT, 15.csv";
import eth5m from "./resource/ETHUSDT/BINANCE_ETHUSDT, 5.csv";
import logo from "./logo.svg";
import "./App.css";
import { klines, price } from "lib/api/market/bianaceAPI";
import { ema, movingAverageInfo, sma } from "lib/indicator/movingAverage";
import { heikinashi, heikinashiInformation } from "lib/chart/heikinashi";
import {
  rsi,
  rsiFourMul,
  rsiInformation,
} from "lib/indicator/RelativeStrengthIndex";
import { emarsi } from "lib/stategy/ema_rsi";

const fetchTickerPrice = async () => {
  try {
    const response = await price("BTCUSDT");

    if (response && response.data) {
      // console.log(response.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function App() {
  const [marketData, setMarketData] = useState([]); // restAPI로 불러온 데이터

  const [heikinData, setHeikinData] = useState<heikinashiInformation[]>([]); // 하이킨아시 데이터
  const [emaArray, setEmaArray] = useState<movingAverageInfo[]>([]);
  const [rsiArray, setRsiArray] = useState<rsiInformation[]>([]);
  const [rsiFourMulArray, setRsiFourMulArray] = useState<rsiInformation[]>([]);

  const [condition, setCondition] = useState<paramsInvestmentStrategy[]>([]); // emarsi 조건을 충족시키기 위한 데이터
  const marketInterval: string[] = [
    "1d",
    "12h",
    "6h",
    "4h",
    "2h",
    "1h",
    "30m",
    "15m",
    "5m",
  ];

  const fetchMarketData = async (
    symbol: string,
    interval: string,
    limit: number
  ) => {
    try {
      const response = await klines(symbol, interval, limit);
      const csvRes = await readMarketData(symbol, interval);

      if (response && response.data) {
        // 서버데이터 저장
        setMarketData(response.data);

        // 서버데이터와 csv데이터를 불러와 데이터를 정렬합니다.
        const serverData = heikinashi(response.data);
        sortMarketData(symbol, interval, csvRes, serverData);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  // market data csv read
  const readMarketData = async (
    symbol: string,
    interval: string
  ): Promise<heikinashiInformation[]> => {
    let csvData: heikinashiInformation[] = [];

    try {
      let response: Response = new Response();
      if (symbol === "BTCUSDT") {
        if (interval === "1d") response = await fetch(btc1d);
        if (interval === "12h") response = await fetch(btc12h);
        if (interval === "6h") response = await fetch(btc6h);
        if (interval === "4h") response = await fetch(btc4h);
        if (interval === "2h") response = await fetch(btc2h);
        if (interval === "1h") response = await fetch(btc1h);
        if (interval === "30m") response = await fetch(btc30m);
        if (interval === "15m") response = await fetch(btc15m);
        if (interval === "5m") response = await fetch(btc5m);
      }
      if (symbol === "ETHUSDT") {
        if (interval === "1d") response = await fetch(eth1d);
        if (interval === "12h") response = await fetch(eth12h);
        if (interval === "6h") response = await fetch(eth6h);
        if (interval === "4h") response = await fetch(eth4h);
        if (interval === "2h") response = await fetch(eth2h);
        if (interval === "1h") response = await fetch(eth1h);
        if (interval === "30m") response = await fetch(eth30m);
        if (interval === "15m") response = await fetch(eth15m);
        if (interval === "5m") response = await fetch(eth5m);
      }

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const csvText = await response.text();
      const rows = csvText
        .split("\n")
        .map((row) => row.split(","))
        .splice(1);

      for (const element of rows) {
        csvData.push({
          timeFrame: parseInt(element[0]),
          open: parseFloat(element[1]),
          high: parseFloat(element[2]),
          low: parseFloat(element[3]),
          close: parseFloat(element[4]),
        });
      }
    } catch (e) {
      console.log("csv 파일로드 에러, ", e);
    } finally {
      return csvData;
    }
  };

  // 서버데이터와 csv데이터를 불러와 정렬하며 ema, rsi를 계산하여 반영합니다.
  const sortMarketData = (
    symbol: string,
    interval: string,
    csvData: heikinashiInformation[],
    serverData: heikinashiInformation[]
  ) => {
    csvData.forEach((item, index) => {
      if (item.timeFrame === serverData[0].timeFrame) {
        const spliceCsvData = csvData.splice(0, index);

        const cs = [...spliceCsvData, ...serverData];

        // console.log(
        //   "csv timeFrame: ",
        //   item.timeFrame,
        //   "server timeTrame: ",
        //   serverData[0].timeFrame,
        //   "index: ",
        //   index,
        //   "spliceCsvData: ",
        //   spliceCsvData,
        //   "spliceServerData: ",
        //   serverData,
        //   "cs: ",
        //   cs
        // );

        const c: movingAverageInfo[] = [];
        c.push(
          ema(cs, 89),
          ema(cs, 84),
          ema(cs, 144),
          ema(cs, 136),
          ema(cs, 233),
          ema(cs, 220),
          ema(cs, 377),
          ema(cs, 356),
          ema(cs, 610),
          ema(cs, 576),
          ema(cs, 987),
          ema(cs, 932),
          ema(cs, 1597),
          ema(cs, 1508),
          ema(cs, 2584),
          ema(cs, 2440)
        );

        const rsiArr = rsi(cs, 14, 1);
        const rsiFourMulArr = rsiFourMul(cs, 14, 1, interval);
        // setEmaArray(c);
        // setRsiArray(rsiArr);
        // setRsiFourMulArray(rsiFourMulArr);
        // setHeikinData(cs);
        setCondition((prev) => [
          ...prev,
          {
            symbol: symbol,
            interval: interval,
            heikin: cs,
            ema: c,
            rsi: rsiArr,
            rsifourmul: rsiFourMulArr,
          },
        ]);
      }
    });
  };

  useEffect(() => {
    // const callInvestmentStrategy = setInterval(() => {

    // }, 1000);

    marketInterval.forEach((interval: string) => {
      setTimeout(() => {
        fetchMarketData("BTCUSDT", interval, 1000);
        fetchMarketData("ETHUSDT", interval, 1000);
      }, 1000);
    });

    return () => {
      // clearInterval(callInvestmentStrategy);
    };
  }, []);

  useEffect(() => {
    if (
      heikinData.length !== 0 &&
      emaArray.length !== 0 &&
      rsiArray.length !== 0 &&
      rsiFourMulArray.length !== 0
    ) {
      emarsi(heikinData, emaArray, rsiArray, rsiFourMulArray);
    }
  }, [heikinData]);

  useEffect(() => {
    console.log(condition);
  }, [condition]);

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

interface paramsInvestmentStrategy {
  symbol: string;
  interval: string;
  heikin: heikinashiInformation[];
  ema: movingAverageInfo[];
  rsi: rsiInformation[];
  rsifourmul: rsiInformation[];
}

export default App;
