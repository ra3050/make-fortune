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

const ChartCanvas = (chartProps?: chartProps | null) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // 캔버스 요소를 참조하는 요소
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 요소를 참조하는 요소
  const contextRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스의 컨텐스트를 참조하는 요소

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null); // 컨텐스트 속성 값을 저장하는 상태

  const [scrollX, setScrollX] = useState(0); // 캔버스 위치
  const canvasHeight = window.innerHeight - 100;

  // 드래그 관련 상태 추가
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mouseleave", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("scroll", handleScrollCanvas);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mouseleave", handleMouseUp);
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
    }

    ctx.strokeStyle = "white";
  }, [scrollX, chartProps?.ema, chartProps?.heikin]);

  return (
    <CanvasWrapper
      ref={canvasWrapperRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
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
