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
  flex-wrap: nowrap; // 한 줄로 표시
  overflow-x: auto; // 가로 스크롤 활성화
  position: absolute;
  top: 10px;
  left: 10px;
  max-width: calc(100vw - 20px); // 화면 너비에서 여백 제외
  padding-right: 10px; // 오른쪽 여백 추가

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const IntervalButton = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;
  margin-right: 10px;
`;

const TickerButton = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const HelpButton = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #131722;
  border: 1px solid #2a2e39;
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #2a2e39;
  padding-bottom: 15px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 24px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #007bff;
  }
`;

const ModalBody = styled.div`
  line-height: 1.6;

  h3 {
    color: #007bff;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 15px;
  }

  ul {
    margin-bottom: 15px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

interface paramsInvestmentStrategy {
  symbol: string;
  interval: string;
  heikin: heikinashiInformation[];
  ema: movingAverageInfo[];
  rsi: rsiInformation[];
}

const MainPage = () => {
  const [ticker, setTicker] = useState<string>("BTCUSDT");
  const [marketData, setMarketData] = useState([]); // restAPI로 불러온 데이터
  const [condition, setCondition] = useState<paramsInvestmentStrategy>(); // emarsi 조건을 충족시키기 위한 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const marketInterval: string[] = [
    "1d",
    "12h",
    "8h",
    "6h",
    "4h",
    "2h",
    "1h",
    "30m",
    "15m",
  ];
  const [isMarketInterval, setIsMarketInterval] = useState<string>("1d");

  // 모달 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        if (interval === "8h") response = await fetch("/BTCUSDT/480.csv");
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
        if (interval === "8h") response = await fetch("/ETHUSDT/480.csv");
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
    fetchMarketData(ticker, isMarketInterval, 60000);
  }, [isMarketInterval, fetchMarketData, ticker]);

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
        <TickerButton onClick={() => setTicker("BTCUSDT")}>
          BTCUSDT
        </TickerButton>
        <TickerButton onClick={() => setTicker("ETHUSDT")}>
          ETHUSDT
        </TickerButton>
        <HelpButton onClick={handleOpenModal}>도움말</HelpButton>
      </IntervalWrapper>

      <Chart
        {...{
          heikin: condition?.heikin,
          ema: condition?.ema,
          rsi: condition?.rsi,
        }}
      />

      {/* 모달 */}
      {isModalOpen && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>차트 사용법</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <h3>기본 조작</h3>
              <ul>
                <li>
                  <strong>드래그:</strong> 차트를 좌우로 스크롤할 수 있습니다.
                </li>
                <li>
                  <strong>휠:</strong> 차트를 확대/축소할 수 있습니다 (지원예정)
                </li>
                <li>
                  <strong>터치패드:</strong> Mac 터치패드로도 동일한 조작이
                  가능합니다.
                </li>
              </ul>

              <h3>차트 구성</h3>
              <ul>
                <li>
                  <strong>메인 차트:</strong> 하이킨아시 캔들차트와 EMA
                  이동평균선
                </li>
                <li>
                  <strong>RSI 차트:</strong> 상대강도지수 (30 이하: 과매도, 70
                  이상: 과매수)
                </li>
                <li>
                  <strong>색상 구분:</strong> 녹색(양봉), 빨간색(음봉),
                  금색(다이버전스)
                </li>
              </ul>

              <h3>지표 설명</h3>
              <ul>
                <li>
                  <strong>EMA:</strong> 지수이동평균선 (89, 144, 233, 377, 610,
                  987, 1597, 2584, 4181)
                </li>
                <li>
                  <strong>RSI:</strong> 14기간 상대강도지수
                </li>
                <li>
                  <strong>다이버전스:</strong> 가격과 RSI의 괴리 현상
                </li>
              </ul>

              <h3>시간대 선택</h3>
              <p>
                상단의 시간대 버튼을 클릭하여 1분부터 1일까지 다양한 시간대의
                차트를 볼 수 있습니다.
              </p>

              <h3>코인 선택</h3>
              <p>BTCUSDT와 ETHUSDT 중 원하는 코인을 선택할 수 있습니다.</p>

              <h3>전략설명</h3>
              <p>
                몸통이 짧은 하이킨아시(도지캔들, 스타캔들)와 RSI다이버전스가
                발생한 부분은 금색으로 표시되면, 해당부분을 진입 타점으로 볼 수
                있습니다. 그러나 하이킨아시 차트는 시각적인 모양을 참고하기
                때문에, 다이버전스 완성된 후, 하이킨아시 모양을 확인하고
                진입해야합니다.
              </p>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default MainPage;
