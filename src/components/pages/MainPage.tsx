import React, { useEffect, useState, useCallback } from "react";
import btc4d from "../../resource/BINANCE_BTCUSDT, 4D.csv";
import btc2d from "../../resource/BINANCE_BTCUSDT, 2D.csv";
import btc1d from "../../resource/BINANCE_BTCUSDT, 1D.csv";
import btc12h from "../../resource/BINANCE_BTCUSDT, 720.csv";
import btc6h from "../../resource/BINANCE_BTCUSDT, 360.csv";
import btc4h from "../../resource/BINANCE_BTCUSDT, 240.csv";
import btc2h from "../../resource/BINANCE_BTCUSDT, 120.csv";
import btc1h from "../../resource/BINANCE_BTCUSDT, 60.csv";
import btc30m from "../../resource/BINANCE_BTCUSDT, 30.csv";
import btc15m from "../../resource/BINANCE_BTCUSDT, 15.csv";
import eth1d from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 1D.csv";
import eth12h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 720.csv";
import eth6h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 360.csv";
import eth4h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 240.csv";
import eth3h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 180.csv";
import eth2h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 120.csv";
import eth1h from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 60.csv";
import eth30m from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 30.csv";
import eth15m from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 15.csv";
import eth5m from "../../resource/ETHUSDT/BINANCE_ETHUSDT, 5.csv";
import logo from "../../logo.svg";
import "../../App.css";
import { klines, price } from "../../lib/api/market/bianaceAPI";
import { ema, movingAverageInfo, sma } from "../../lib/indicator/movingAverage";
import { heikinashi, heikinashiInformation } from "../../lib/chart/heikinashi";
import { rsi, rsiInformation } from "../../lib/indicator/RelativeStrengthIndex";
import {
  emaBullDivergence,
  divergenceInformation,
} from "../../lib/stategy/emaDivergence";
import styled from "styled-components";
import Chart from "components/ui/chart/chart";

const IntervalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  top: 10px;
  left: 10px;
`;

const IntervalButton = styled.button`
  width: 60px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
`;

const MainPage = () => {
  const [marketData, setMarketData] = useState([]); // restAPI로 불러온 데이터
  const [basePriceArr, setBasePriceArr] = useState<number[]>([]);

  const [condition, setCondition] = useState<paramsInvestmentStrategy>(); // emarsi 조건을 충족시키기 위한 데이터
  const [longSignal, setLongSignal] = useState<divergenceInformation[]>();
  const marketInterval: string[] = [
    "1d",
    "12h",
    "6h",
    "4h",
    "2h",
    "1h",
    "30m",
    "15m",
  ];
  const [isMarketInterval, setIsMarketInterval] = useState<string>("12h");

  const fetchMarketData = useCallback(
    async (symbol: string, interval: string, limit: number) => {
      try {
        const response = await klines(symbol, interval, limit);
        const csvRes = await readMarketData(symbol, interval);

        if (response && response.data) {
          setMarketData(response.data);
          const serverData = heikinashi(response.data);
          sortMarketData(symbol, interval, csvRes, serverData);
        }
      } catch (e) {
        console.log("market data host error: ", e);
        throw e;
      }
    },
    []
  );

  // csv에 저장된 마켓 데이터를 불러옵니다
  const readMarketData = async (
    symbol: string,
    interval: string
  ): Promise<heikinashiInformation[]> => {
    let csvData: heikinashiInformation[] = [];

    try {
      let response: Response = new Response();
      if (symbol === "BTCUSDT") {
        if (interval === "4d") response = await fetch(btc4d);
        if (interval === "2d") response = await fetch(btc2d);
        if (interval === "1d") response = await fetch(btc1d);
        if (interval === "12h") response = await fetch(btc12h);
        if (interval === "6h") response = await fetch(btc6h);
        if (interval === "4h") response = await fetch(btc4h);
        if (interval === "2h") response = await fetch(btc2h);
        if (interval === "1h") response = await fetch(btc1h);
        if (interval === "30m") response = await fetch(btc30m);
        if (interval === "15m") response = await fetch(btc15m);
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
      // 아 여기서 걸러지는구나, 맞는 시간이 없거나 하는 문제가 있겠지 고작해봐야 타임프레임 차이는 1000개밖에 안나니까
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
        //   cs,
        //   "interval:",
        //   interval
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
          ema(cs, 2440),
          ema(cs, 4181),
          ema(cs, 3948)
        );

        const rsiArr = rsi(cs, 14, 1);

        setCondition({
          symbol: symbol,
          interval: interval,
          heikin: cs,
          ema: c,
          rsi: rsiArr,
        });
      }
    });
  };

  useEffect(() => {
    fetchMarketData("BTCUSDT", isMarketInterval, 60000);
  }, [isMarketInterval, fetchMarketData]);

  useEffect(() => {
    if (condition?.interval === isMarketInterval) {
      const longSignalInfo = emaBullDivergence(
        condition.heikin,
        condition.ema,
        condition.rsi,
        isMarketInterval
      ); // 하나만 화면에 표기하도록 설정되어있
      // 1. 인터벌 한번에 처리
      // 2. 인터벌 여러번 나눠서 처리
      // 3. 인터벌 나눠서 처리 후 하나만 화면에 표기

      setLongSignal(longSignalInfo);
      console.log(condition);
    }
  }, [condition, isMarketInterval]);

  const handleIntervalButton = (interval: string) => {
    setIsMarketInterval(interval);
  };

  return (
    <div>
      <IntervalWrapper>
        {marketInterval.map((interval) => (
          <IntervalButton
            onClick={() => handleIntervalButton(interval)}
            key={interval}
          >
            {interval}
          </IntervalButton>
        ))}
      </IntervalWrapper>
      <Chart
        {...{
          divergence: longSignal,
          heikin: condition?.heikin,
          ema: condition?.ema,
          rsi: condition?.rsi,
        }}
      />
    </div>
  ); // condition의 값을 어떻게 컨트롤 할 것인가 ==> 추후 수정하면서 고칠것
};

interface paramsInvestmentStrategy {
  symbol: string;
  interval: string;
  heikin: heikinashiInformation[];
  ema: movingAverageInfo[];
  rsi: rsiInformation[];
}

export default MainPage;
