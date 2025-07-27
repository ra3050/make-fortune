"use client"; // 클라이언트 전용 페이지임을 선언

import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

import { klines } from "./api/market/klines";
import { price } from "./api/market/price";
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
  flex-wrap: wrap;
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
        if (response) {
          const data = await response.json();
          setMarketData(data);
          const serverData = heikinashi(data);
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
    const csvData: heikinashiInformation[] = [];

    try {
      let response: Response = new Response();
      if (symbol === "BTCUSDT") {
        if (interval === "4d") response = await fetch("/BTCUSDT/4D.csv");
        if (interval === "2d") response = await fetch("/BTCUSDT/2D.csv");
        if (interval === "1d") response = await fetch("/BTCUSDT/1D.csv");
        if (interval === "12h") response = await fetch("/BTCUSDT/720.csv");
        if (interval === "6h") response = await fetch("/BTCUSDT/360.csv");
        if (interval === "4h") response = await fetch("/BTCUSDT/240.csv");
        if (interval === "2h") response = await fetch("/BTCUSDT/120.csv");
        if (interval === "1h") response = await fetch("/BTCUSDT/60.csv");
        if (interval === "30m") response = await fetch("/BTCUSDT/30.csv");
        if (interval === "15m") response = await fetch("/BTCUSDT/15.csv");
      }
      if (symbol === "ETHUSDT") {
        if (interval === "1d") response = await fetch("/ETHUSDT/1D.csv");
        if (interval === "12h") response = await fetch("/ETHUSDT/720.csv");
        if (interval === "6h") response = await fetch("/ETHUSDT/360.csv");
        if (interval === "4h") response = await fetch("/ETHUSDT/240.csv");
        if (interval === "2h") response = await fetch("/ETHUSDT/120.csv");
        if (interval === "1h") response = await fetch("/ETHUSDT/60.csv");
        if (interval === "30m") response = await fetch("/ETHUSDT/30.csv");
        if (interval === "15m") response = await fetch("/ETHUSDT/15.csv");
        if (interval === "5m") response = await fetch("/ETHUSDT/5.csv");
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
