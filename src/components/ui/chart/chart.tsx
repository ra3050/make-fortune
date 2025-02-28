import { heikinashiInformation } from "../../../lib/chart/heikinashi";
import { movingAverageInfo } from "../../../lib/indicator/movingAverage";
import { rsiInformation } from "../../../lib/indicator/RelativeStrengthIndex";
import { divergenceInformation } from "../../../lib/stategy/emaDivergence";
import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import styled from "styled-components";

const CanvasWrapper = styled.div`
  overflow-x: auto; // 가로 스크롤 활성화
  overflow-y: hidden; // 세로 스크롤 비활성화
`;

const Container = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #131722;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const BasePriceContainer = styled.div`
  width: 86px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-end;
  justify-content: center;
`;

const BasePriceText = styled.div`
  font-size: 16px;
  height: 10%;
  color: #9fa2ac;
  text-align: center;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartCanvas = (chartProps?: chartProps | null) => {
  const canvasWrapperRef = useRef<HTMLDivElement>(null); // 캔버스 요소를 참조하는 요소
  const canvasRef = useRef<HTMLCanvasElement>(null); // 캔버스 요소를 참조하는 요소
  const contextRef = useRef<CanvasRenderingContext2D | null>(null); // 캔버스의 컨텐스트를 참조하는 요소

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null); // 컨텐스트 속성 값을 저장하는 상태
  const [isDrawing, setIsDrawing] = useState(false); // 그리기 상태를 저장하는 상태

  const [scrollX, setScrollX] = useState(0); // 캔버스 위치
  const [isDrawX, setIsDrawX] = useState(0); // 마지막 값이 그려진 위치

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = chartProps?.heikin
      ? chartProps.heikin.length
      : window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    // 기본 설정 초기화
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.lineWidth = 0.5;

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

    // 여백 추가
    const padding = (maxHeikin - minHeikin) * 0.1;
    const yScale =
      (window.innerHeight * 0.8) / (maxHeikin - minHeikin + padding * 2);

    // 스케일 및 위치 조정
    ctx.translate(0, window.innerHeight);
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
    ctx.beginPath();
    for (let i = scrollX; i < scrollX + window.innerWidth; i++) {
      if (i >= chartProps.heikin.length) break;
      ctx.moveTo(i, chartProps.heikin[i].high);
      ctx.lineTo(i, chartProps.heikin[i].low);
    }
    ctx.stroke();
  }, [scrollX, chartProps?.ema, chartProps?.heikin]);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawing = ({ nativeEvent }: React.MouseEvent) => {
    const { offsetX, offsetY } = nativeEvent;
    // canvas.getconText("2d")값이 있을 때
    if (ctx) {
      if (!isDrawing) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      } else {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
  };

  return (
    <CanvasWrapper ref={canvasWrapperRef}>
      <canvas
        ref={canvasRef}
        //   onMouseDown={startDrawing}
        //   onMouseUp={stopDrawing}
        //   onMouseMove={drawing}
        //   onMouseLeave={stopDrawing}
        //   style={{ width: "100%", height: "100%" }}
      />
    </CanvasWrapper>
  );
  //   return (
  //     <Container>
  //       <BasePriceContainer title="시장기준가격">
  //         {chartProps.basePriceArr.map((item, i) => {
  //           return <BasePriceText>{item}</BasePriceText>;
  //         })}
  //       </BasePriceContainer>
  //     </Container>
  //   );
};

interface chartProps {
  heikin?: heikinashiInformation[];
  ema?: movingAverageInfo[];
  rsi?: rsiInformation[];
  divergence?: divergenceInformation[];
}

export default ChartCanvas;
