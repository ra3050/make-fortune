import React, { useEffect, useState } from "react";
import btc1d from "./resource/BINANCE_BTCUSDT, 1D.csv";
import btc4h from "./resource/BINANCE_BTCUSDT, 240.csv";
import logo from "./logo.svg";
import "./App.css";
import { klines, price } from "lib/api/market/bianaceAPI";
import { ema, movingAverageInfo, sma } from "lib/indicator/movingAverage";
import { heikinashi, heikinashiInformation } from "lib/chart/heikinashi";
import { rsi, rsiFourMul } from "lib/indicator/RelativeStrengthIndex";
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
  const [rsiArray, setRsiArray] = useState<number[]>([]);
  const [rsiFourMulArray, setRsiFourMulArray] = useState<number[]>([]);

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
          { length: 89, ma: ema(cs, 89) },
          { length: 84, ma: ema(cs, 84) },
          { length: 144, ma: ema(cs, 144) },
          { length: 136, ma: ema(cs, 136) },
          { length: 233, ma: ema(cs, 233) },
          { length: 220, ma: ema(cs, 220) },
          { length: 377, ma: ema(cs, 377) },
          { length: 356, ma: ema(cs, 356) },
          { length: 610, ma: ema(cs, 610) },
          { length: 576, ma: ema(cs, 576) },
          { length: 987, ma: ema(cs, 987) },
          { length: 932, ma: ema(cs, 932) },
          { length: 1597, ma: ema(cs, 1597) },
          { length: 1508, ma: ema(cs, 1508) },
          { length: 2584, ma: ema(cs, 2584) },
          { length: 2440, ma: ema(cs, 2440) }
        );
        setEmaArray(c);

        const rsiArr = rsi(cs, 14, 1);
        const rsiFourMulArr = rsiFourMul(cs, 14, 1, interval);
        setRsiArray(rsiArr);
        setRsiFourMulArray(rsiFourMulArr);
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
