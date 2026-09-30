import type { BodyMark } from "../types";
import { getMarkRects, VIEW_BOX } from "../data/bodyDiagramCoords";

type Props = {
  marks: BodyMark[];
  className?: string;
};

export function BodyDiagramOverlay({ marks, className }: Props) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <pattern id="markHatch" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#000" strokeWidth="1" />
        </pattern>
        <pattern id="markWave" patternUnits="userSpaceOnUse" width="16" height="16">
          <line x1="0" y1="8" x2="16" y2="8" stroke="#000" strokeWidth="1" />
        </pattern>
      </defs>
      {marks.map((mark) => {
        const rectPairs = getMarkRects(mark);
        const fill = mark.type === "sensory" ? "url(#markHatch)" : "url(#markWave)";
        return (
          <g key={mark.id}>
            {rectPairs.map((rects, i) => (
              <g key={i}>
                <rect
                  x={rects.front.x}
                  y={rects.front.y}
                  width={rects.front.width}
                  height={rects.front.height}
                  fill={fill}
                />
                <rect
                  x={rects.back.x}
                  y={rects.back.y}
                  width={rects.back.width}
                  height={rects.back.height}
                  fill={fill}
                />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
