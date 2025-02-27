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
      : window.innerWidth; // 데이터의 개수 만큼 길이 설정  defualt: window.innerWidth
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.strokeStyle = "black";
    context.lineWidth = 0.5;
    context.scale(1, window.innerHeight / 110000);
    contextRef.current = context;

    setCtx(context);
  }, [chartProps?.ema]);

  // 캔버스 스크롤 위치 이벤트
  useEffect(() => {
    const handleScrollCanvas = () => {
      if (canvasWrapperRef.current) {
        setScrollX(canvasWrapperRef.current.scrollLeft);
        console.log("scrollX", canvasWrapperRef.current.scrollLeft);
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
    if (chartProps?.ema && chartProps?.heikin) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      contextRef.current = context;

      context.beginPath();
      context.moveTo(0, 0);

      let drawX = 0;

      if (isDrawX < scrollX + window.innerWidth) {
        // ema 선을 화면에 그려줍니다
        chartProps.ema.forEach((ma: movingAverageInfo) => {
          context.moveTo(isDrawX, ma.ma[isDrawX].value);
          for (let i = isDrawX; i < scrollX + window.innerWidth; i++) {
            if (i >= ma.ma.length) break;
            context.lineTo(i, ma.ma[i].value);
            drawX = i;
          }
        });

        for (let i = isDrawX; i < scrollX + window.innerWidth; i++) {
          if (i >= chartProps.heikin.length) break;
          context.moveTo(i, chartProps.heikin[i].open);
          context.lineTo(i, chartProps.heikin[i].close);
        }

        context.stroke();
        setIsDrawX(drawX);
      }
      setCtx(context);
    }
  }, [scrollX]);

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
