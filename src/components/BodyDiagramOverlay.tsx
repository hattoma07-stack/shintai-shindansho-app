import type { BodyMark } from "../types";
import { getMarkRects, VIEW_BOX } from "../data/bodyDiagramCoords";
import { diagonalHatchLines, horizontalLines } from "../utils/hatchLines";

type Props = {
  marks: BodyMark[];
  className?: string;
};

function HatchRect({ rect, type }: { rect: { x: number; y: number; width: number; height: number }; type: "sensory" | "motor" }) {
  const lines = type === "sensory" ? diagonalHatchLines(rect, 16) : horizontalLines(rect, 16);
  return (
    <>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#000" strokeWidth={1} />
      ))}
    </>
  );
}

export function BodyDiagramOverlay({ marks, className }: Props) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {marks.map((mark) => {
        const rectPairs = getMarkRects(mark);
        return (
          <g key={mark.id}>
            {rectPairs.map((rects, i) => (
              <g key={i}>
                <HatchRect rect={rects.front} type={mark.type} />
                <HatchRect rect={rects.back} type={mark.type} />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
