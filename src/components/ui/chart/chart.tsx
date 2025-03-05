import { heikinashiInformation } from "../../../lib/chart/heikinashi";
import { movingAverageInfo } from "../../../lib/indicator/movingAverage";
import { rsiInformation } from "../../../lib/indicator/RelativeStrengthIndex";
import { divergenceInformation } from "../../../lib/stategy/emaDivergence";
import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";
import RSICanvas from "./rsi"; // RSICanvas 컴포넌트 임포트

const CanvasWrapper = styled.div`
  overflow-x: auto; // 가로 스크롤 활성화
  overflow-y: hidden; // 세로 스크롤 비활성화
  background: #131722;
`;

const ChartCanvas = (chartProps?: chartProps | null) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // 캔버스 요소를 참조하는 요소
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 요소를 참조하는 요소
  const contextRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스의 컨텐스트를 참조하는 요소

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null); // 컨텐스트 속성 값을 저장하는 상태

  const [scrollX, setScrollX] = useState(0); // 캔버스 위치
  const canvasHeight = window.innerHeight - 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = chartProps?.heikin?.length ?? 0;
    canvas.height = canvasHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    // 기본 설정 초기화
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "white";
    context.lineWidth = 2;

    contextRef.current = context;
    setCtx(context);
  }, [chartProps?.ema]);

  // 캔버스 스크롤 위치 이벤트
  useEffect(() => {
    const handleScrollCanvas = () => {
      if (canvasWrapperRef.current) {
        setScrollX(canvasWrapperRef.current.scrollLeft);
      }
    };

    const canvas = canvasWrapperRef.current;
    if (canvas) {
      canvas.addEventListener("scroll", handleScrollCanvas);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("scroll", handleScrollCanvas);
      }
    };
  }, []);

  useEffect(() => {
    if (!chartProps?.ema || !chartProps?.heikin || !ctx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 컨텍스트 초기화
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 보이는 영역의 데이터만 계산
    const visibleData = chartProps.heikin.slice(
      scrollX,
      scrollX + window.innerWidth
    );
    const maxHeikin = Math.max(...visibleData.map((item) => item.high));
    const minHeikin = Math.min(...visibleData.map((item) => item.low));

    // 여백(상・하) 추가
    const padding = (maxHeikin - minHeikin) * 0.1;
    const yScale = (canvasHeight * 0.9) / (maxHeikin - minHeikin + padding * 2);

    // 스케일 및 위치 조정
    ctx.translate(0, canvasHeight);
    ctx.scale(1, -yScale);
    ctx.translate(0, -(minHeikin - padding));

    ctx.beginPath();

    // EMA 선 그리기
    chartProps.ema.forEach((ma: movingAverageInfo) => {
      ctx.beginPath();
      let isFirst = true;

      for (let i = scrollX; i < scrollX + window.innerWidth; i++) {
        if (i >= ma.ma.length) break;
        if (isFirst) {
          ctx.moveTo(i, ma.ma[i].value);
          isFirst = false;
        } else {
          ctx.lineTo(i, ma.ma[i].value);
        }
      }
      ctx.stroke();
    });

    // 캔들 그리기
    for (let i = scrollX; i < scrollX + window.innerWidth; i++) {
      // 캔들
      ctx.beginPath();
      if (i >= chartProps.heikin.length) break;
      if (i !== 0 && chartProps.heikin[i].open > chartProps.heikin[i].close) {
        ctx.strokeStyle = "#F05350";
      } else {
        ctx.strokeStyle = "#26A69A";
      }
      ctx.moveTo(i, chartProps.heikin[i].high);
      ctx.lineTo(i, chartProps.heikin[i].low);
      ctx.stroke();

      // heikin안에 다이버전스를 포함하도록 수정할 필요성 있음 - 3월 6(목) 진행예정
    }

    ctx.strokeStyle = "white";
  }, [scrollX, chartProps?.ema, chartProps?.heikin]);

  return (
    <CanvasWrapper ref={canvasWrapperRef}>
      <canvas ref={canvasRef} />
      <RSICanvas {...{ rsi: chartProps?.rsi, scrollX }} />
    </CanvasWrapper>
  );
};

interface chartProps {
  heikin?: heikinashiInformation[];
  ema?: movingAverageInfo[];
  rsi?: rsiInformation[];
  divergence?: divergenceInformation[];
}

export default ChartCanvas;
