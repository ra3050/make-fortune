"use client";

import { heikinashiInformation } from "../../../../src/lib/chart/heikinashi";
import { movingAverageInfo } from "../../../../src/lib/indicator/movingAverage";
import { rsiInformation } from "../../../../src/lib/indicator/RelativeStrengthIndex";
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import RSICanvas from "./RsiCanvas"; // RSICanvas 컴포넌트 임포트
import useIsClient from "../../useHook/useIsClient";

const CanvasWrapper = styled.div`
  overflow-x: auto; // 가로 스크롤 활성화
  overflow-y: hidden; // 세로 스크롤 비활성화
  background: #131722;
  /* user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none; */

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; // Chrome, Safari, Opera
  }
  -ms-overflow-style: none; // IE, Edge
  scrollbar-width: none; //Firebox
`;

interface chartProps {
  heikin?: heikinashiInformation[];
  ema?: movingAverageInfo[];
  rsi?: rsiInformation[];
}

const ChartCanvas = (chartProps?: chartProps | null) => {
  // chartProps
  const { heikin = [], ema = [], rsi = [] } = chartProps || {};

  // canvas 요소
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // 캔버스 요소를 참조하는 요소
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 요소를 참조하는 요소
  const contextRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스의 컨텐스트를 참조하는 요소
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null); // 컨텐스트 속성 값을 저장하는 상태

  const [scrollX, setScrollX] = useState(0); // 캔버스 위치
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);

  // 드래그 관련 상태 추가
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // canvas 높이, 너비 설정
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCanvasHeight(window.innerHeight - 100); // 여백설정
    setCanvasWidth(window.innerWidth); // 전체화면
  }, []);

  // canvas Rect 설정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = heikin.length ?? 0;
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
  }, [canvasHeight, canvasWidth, heikin]);

  // chart draw
  useEffect(() => {
    // 차트를 그리는데 필요한 데이터가 없는경우
    if (!ema || !heikin || !ctx) return;

    const canvas = canvasRef.current;
    // canvas not found
    if (!canvas) return;

    // 컨텍스트 초기화
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 보이는 영역의 데이터만 계산
    const visibleData = heikin.slice(scrollX, scrollX + canvasWidth);
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
    ema.forEach((ma: movingAverageInfo) => {
      ctx.beginPath();
      let isFirst = true;

      for (let i = scrollX; i < scrollX + canvasWidth; i++) {
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
    for (let i = scrollX; i < scrollX + canvasWidth; i++) {
      ctx.beginPath();
      if (i >= heikin.length) break;

      // 양봉, 음봉 구분
      if (i !== 0 && heikin[i].open > heikin[i].close) {
        ctx.strokeStyle = "#F05350"; // 음봉
      } else {
        ctx.strokeStyle = "#26A69A"; // 양봉
      }

      // 다이버전스 여부에 따라 색상 설정
      if (heikin[i].upperDivergence) {
        if (heikin[i].shiftInTrend) {
          ctx.strokeStyle = "#FFD700"; // 다이버전스가 있는 경우 금색
        }
      } else if (heikin[i].lowwerDivergence) {
        if (heikin[i].shiftInTrend) {
          ctx.strokeStyle = "#FFD700"; // 다이버전스가 있는 경우 금색
        }
      }

      ctx.moveTo(i, heikin[i].high);
      ctx.lineTo(i, heikin[i].low);
      ctx.stroke();
    }

    ctx.strokeStyle = "white";
  }, [scrollX, ema, heikin]);

  // 마우스 다운 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasWrapperRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - canvasWrapperRef.current.offsetLeft);
    setScrollLeft(canvasWrapperRef.current.scrollLeft);
  };

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasWrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - canvasWrapperRef.current.offsetLeft;
    const walk = startX - x;
    canvasWrapperRef.current.scrollLeft = scrollLeft + walk;
    setScrollX(canvasWrapperRef.current.scrollLeft);
  };

  // 마우스 업 이벤트 핸들러
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <CanvasWrapper
      ref={canvasWrapperRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} />
      <RSICanvas {...{ rsi, scrollX }} />
    </CanvasWrapper>
  );
};

export default ChartCanvas;
//
