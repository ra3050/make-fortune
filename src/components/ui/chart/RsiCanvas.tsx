import React, { useRef, useEffect, useState } from "react";
import { rsiInformation } from "../../../lib/indicator/RelativeStrengthIndex";

const RSICanvas = (rsiCanvasProps?: rsiCanvasProps) => {
  const { rsi = [], scrollX = 0 } = rsiCanvasProps || {};

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = rsi?.length ?? 0;
    canvas.height = 100;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#8D50AE";
    context.lineWidth = 1;

    contextRef.current = context;
    setCtx(context);
  }, [rsi]);

  useEffect(() => {
    if (!ctx || !rsi) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 스케일 및 위치 재조정
    ctx.translate(0, 0);
    ctx.scale(1, -1);
    ctx.translate(0, -100);

    // rsi 그리기
    ctx.beginPath();
    let isFirst = true;
    for (let i = scrollX; i < scrollX + window.innerWidth; i++) {
      if (i >= rsi.length) break;
      if (isFirst) {
        ctx.moveTo(i, rsi[i].value);
        isFirst = false;
      } else {
        ctx.lineTo(i, rsi[i].value);
      }
    }
    ctx.stroke();

    // rsi 과매수 기준선
    ctx.beginPath();
    ctx.moveTo(scrollX, 70);
    ctx.lineTo(scrollX + window.innerWidth, 70);
    ctx.stroke();

    // rsi 과매도 기준선
    ctx.beginPath();
    ctx.moveTo(scrollX, 30);
    ctx.lineTo(scrollX + window.innerWidth, 30);
    ctx.stroke();
  }, [scrollX, rsi]);

  return <canvas ref={canvasRef} style={{ borderTop: "1px solid #1F232E" }} />;
};

interface rsiCanvasProps {
  rsi?: rsiInformation[];
  scrollX: number;
}

export default RSICanvas;
