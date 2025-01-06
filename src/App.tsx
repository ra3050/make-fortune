import React, { useEffect, useState } from "react";
import btc1d from "./resource/BINANCE_BTCUSDT, 1D.csv";
import btc4h from "./resource/BINANCE_BTCUSDT, 240.csv";
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
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

function App() {
  const [marketData, setMarketData] = useState([]); // restAPI로 불러온 데이터
  const [marketCsvData, setMarketCsvData] = useState<heikinashiInformation[]>(
    []
  );
  const [heikinData, setHeikinData] = useState<heikinashiInformation[]>([]); // 하이킨아시 데이터
  const [smaArray, setSmaArray] = useState([]);
  const [emaArray, setEmaArray] = useState<movingAverageInfo[]>([]);
  const [rsiArray, setRsiArray] = useState<rsiInformation[]>([]);
  const [rsiFourMulArray, setRsiFourMulArray] = useState<rsiInformation[]>([]);

  const [interval, setInterval] = useState<string>("4h");

  const fetchMarketData = async (
    symbol: string,
    interval: string,
    limit: number
  ) => {
    try {
      const response = await klines(symbol, interval, limit);

      if (response && response.data) {
        setMarketData(response.data);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  // market data csv read
  const readMarketData = async () => {
    let csvData: heikinashiInformation[] = [];

    try {
      const response = await fetch(btc4h);
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

      setMarketCsvData(csvData);
    } catch (e) {
      console.log("csv 파일로드 에러, ", e);
    }
  };

  // csv데이터와 서버호출 데이터의 첫번째 타임프레임과 같은 값을 찾아 해당부분부터 값을 병합합니다.
  const sortMarketData = (
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

        setHeikinData(cs);

        const c = [];
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
        setEmaArray(c);
        console.log(c);

        const rsiArr = rsi(cs, 14, 1);
        const rsiFourMulArr = rsiFourMul(cs, 14, 1, interval);
        setRsiArray(rsiArr);
        setRsiFourMulArray(rsiFourMulArr);

        console.log(rsiArr);
        console.log(rsiFourMulArr);
      }
    });
  };

  useEffect(() => {
    fetchMarketData("BTCUSDT", interval, 1000);
    readMarketData();
  }, []);

  useEffect(() => {
    if (marketData.length !== 0) {
      // heikinashi 및 rsi
      const heikin = heikinashi(marketData);
      setHeikinData(heikin);
    }
  }, [marketData]);

  useEffect(() => {
    if (heikinData.length !== 0 && marketCsvData.length !== 0) {
      sortMarketData(marketCsvData, heikinData);
    }

    if (
      heikinData.length !== 0 &&
      emaArray.length !== 0 &&
      rsiArray.length !== 0 &&
      rsiFourMulArray.length !== 0
    ) {
      emarsi(heikinData, emaArray, rsiArray, rsiFourMulArray);
    }
  }, [heikinData, marketCsvData]);

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
