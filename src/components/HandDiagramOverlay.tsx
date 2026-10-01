import type { BodyMark } from "../types";
import { getHandMarkRects, HAND_VIEW_BOX } from "../data/handDiagramCoords";
import { diagonalHatchLines, horizontalLines } from "../utils/hatchLines";

type Props = {
  marks: BodyMark[];
  className?: string;
};

function HatchRect({ rect, type }: { rect: { x: number; y: number; width: number; height: number }; type: "sensory" | "motor" }) {
  const lines = type === "sensory" ? diagonalHatchLines(rect, 12) : horizontalLines(rect, 11);
  return (
    <>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#000" strokeWidth={0.9} />
      ))}
    </>
  );
}

export function HandDiagramOverlay({ marks, className }: Props) {
  const handMarks = marks.filter((m) => m.region === "hand");
  return (
    <svg
      className={className}
      viewBox={`0 0 ${HAND_VIEW_BOX.width} ${HAND_VIEW_BOX.height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {handMarks.map((mark) => {
        const rects = getHandMarkRects(mark);
        return (
          <g key={mark.id}>
            {rects.map((r, i) => (
              <HatchRect key={i} rect={r} type={mark.type} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
