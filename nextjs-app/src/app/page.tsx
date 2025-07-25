"use client"; // 클라이언트 전용 페이지임을 선언

import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import btc4d from "../resource/BINANCE_BTCUSDT, 4D.csv"; // 이유야 어떻게 되었든간에 react에서는 아래 방법이 허용되지만 next에서는 안된다는 거잖아?
import btc2d from "../resource/BINANCE_BTCUSDT, 2D.csv";
import btc1d from "../resource/BINANCE_BTCUSDT, 1D.csv";
import btc12h from "../resource/BINANCE_BTCUSDT, 720.csv";
import btc6h from "../resource/BINANCE_BTCUSDT, 360.csv";
import btc4h from "../resource/BINANCE_BTCUSDT, 240.csv";
import btc2h from "../resource/BINANCE_BTCUSDT, 120.csv";
import btc1h from "../resource/BINANCE_BTCUSDT, 60.csv";
import btc30m from "../resource/BINANCE_BTCUSDT, 30.csv";
import btc15m from "../resource/BINANCE_BTCUSDT, 15.csv";
import eth1d from "../resource/ETHUSDT/BINANCE_ETHUSDT, 1D.csv";
import eth12h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 720.csv";
import eth6h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 360.csv";
import eth4h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 240.csv";
import eth3h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 180.csv";
import eth2h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 120.csv";
import eth1h from "../resource/ETHUSDT/BINANCE_ETHUSDT, 60.csv";
import eth30m from "../resource/ETHUSDT/BINANCE_ETHUSDT, 30.csv";
import eth15m from "../resource/ETHUSDT/BINANCE_ETHUSDT, 15.csv";
import eth5m from "../resource/ETHUSDT/BINANCE_ETHUSDT, 5.csv";

import { klines, price } from "../lib/api/market/bianaceAPI";
import { ema, movingAverageInfo } from "../lib/indicator/movingAverage";
import { heikinashi, heikinashiInformation } from "../lib/chart/heikinashi";
import { rsi, rsiInformation } from "../lib/indicator/RelativeStrengthIndex";
import { shiftInTrend_Heikin } from "../lib/stategy/ShiftInTrend";

import { lowwerDivergence, upperDivergence } from "../lib/stategy/Divergence";
import Chart from "../components/chart/ChartCanvas";

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

interface paramsInvestmentStrategy {
  symbol: string;
  interval: string;
  heikin: heikinashiInformation[];
  ema: movingAverageInfo[];
  rsi: rsiInformation[];
}

const MainPage = () => {
  const [marketData, setMarketData] = useState([]); // restAPI로 불러온 데이터
  const [basePriceArr, setBasePriceArr] = useState<number[]>([]);

  const [condition, setCondition] = useState<paramsInvestmentStrategy>(); // emarsi 조건을 충족시키기 위한 데이터
  const [longSignal, setLongSignal] = useState<heikinashiInformation[]>();
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
  const [isMarketInterval, setIsMarketInterval] = useState<string>("1d");

  const fetchMarketData = useCallback(
    async (symbol: string, interval: string, limit: number) => {
      try {
        // 서버데이터와 csv데이터를 불러옵니다.
        const response = await klines(symbol, interval, limit);
        const csvRes = await readMarketData(symbol, interval);

        // marketData에는 서버에서 불러온 원본 데이터 저장
        // sorktMarket함수를 실행하여 데이터 병합
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

  //csv에 저장된 마켓 데이터를 불러옵니다
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

        const emaArr: movingAverageInfo[] = [
          ema(cs, 89),
          ema(cs, 144),
          ema(cs, 233),
          ema(cs, 377),
          ema(cs, 610),
          ema(cs, 987),
          ema(cs, 1597),
          ema(cs, 2584),
          ema(cs, 4181),
        ];

        const rsiArr = rsi(cs, 14, 1);
        // const heikinWithDivergence = lowwerDivergence(cs, rsiArr);
        // const heikinWithDivergence = upperDivergence(cs, rsiArr);
        const upper = upperDivergence(cs, rsiArr);
        const lowwer = lowwerDivergence(upper, rsiArr);
        const newHeikinashiInfo = shiftInTrend_Heikin(lowwer, rsiArr);

        setCondition({
          symbol: symbol,
          interval: interval,
          heikin: newHeikinashiInfo,
          ema: emaArr,
          rsi: rsiArr,
        });
      }
    });
  };

  useEffect(() => {
    fetchMarketData("BTCUSDT", isMarketInterval, 60000);
  }, [isMarketInterval, fetchMarketData]);

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
          heikin: condition?.heikin,
          ema: condition?.ema,
          rsi: condition?.rsi,
        }}
      />
    </div>
  ); // condition의 값을 어떻게 컨트롤 할 것인가 ==> 추후 수정하면서 고칠것
};

export default MainPage;
