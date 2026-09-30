import type { BodyMark } from "../types";
import { getHandMarkRects, HAND_VIEW_BOX } from "../data/handDiagramCoords";

type Props = {
  marks: BodyMark[];
  className?: string;
};

export function HandDiagramOverlay({ marks, className }: Props) {
  const handMarks = marks.filter((m) => m.region === "hand");
  return (
    <svg
      className={className}
      viewBox={`0 0 ${HAND_VIEW_BOX.width} ${HAND_VIEW_BOX.height}`}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <pattern id="handMarkHatch" patternUnits="userSpaceOnUse" width="12" height="12" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="#000" strokeWidth="0.9" />
        </pattern>
        <pattern id="handMarkWave" patternUnits="userSpaceOnUse" width="11" height="11">
          <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#000" strokeWidth="0.9" />
        </pattern>
      </defs>
      {handMarks.map((mark) => {
        const rects = getHandMarkRects(mark);
        const fill = mark.type === "sensory" ? "url(#handMarkHatch)" : "url(#handMarkWave)";
        return (
          <g key={mark.id}>
            {rects.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={r.width} height={r.height} fill={fill} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
