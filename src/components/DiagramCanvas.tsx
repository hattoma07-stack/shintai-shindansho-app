import { useEffect, useRef } from "react";
import type { LineSeg } from "../utils/hatchLines";

// 参考図示の人体図・手掌図は、以前は<img>＋重ね合わせの<svg>という構成だったが、
// iPadのSafariでPDF書き出し（html-to-image）を行うと、この<img>部分だけが
// 白紙になって消えることが分かった。SVGのforeignObject内で<img>をラスタライズ
// する処理はSafari側の既知の弱点であるため、ここでは画像とマーク線をあらかじめ
// <canvas>に一度だけ描画して1枚のビットマップにしてしまう。html-to-imageは
// <canvas>の内容をtoDataURL()でそのまま取り込む専用の処理を持っており、
// foreignObject内でのラスタライズに依存しないため、どの環境でも同じ結果になる。

type Props = {
  src: string;
  nativeWidth: number;
  nativeHeight: number;
  displayHeight: number; // px
  lines: LineSeg[];
  alt: string;
  className?: string;
};

const SCALE = 2; // retina表示用

export function DiagramCanvas({ src, nativeWidth, nativeHeight, displayHeight, lines, alt, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = nativeWidth * SCALE;
    canvas.height = nativeHeight * SCALE;

    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#000000";
      for (const l of lines) {
        ctx.lineWidth = l.strokeWidth * SCALE;
        ctx.beginPath();
        ctx.moveTo(l.x1 * SCALE, l.y1 * SCALE);
        ctx.lineTo(l.x2 * SCALE, l.y2 * SCALE);
        ctx.stroke();
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, nativeWidth, nativeHeight, lines]);

  const displayWidth = (nativeWidth / nativeHeight) * displayHeight;

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ width: displayWidth, height: displayHeight, display: "block" }}
    />
  );
}
