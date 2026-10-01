import { useMemo } from "react";
import type { BodyMark } from "../types";
// PDF書き出し（html-to-image）は<img>を画像データとして埋め込むためにfetchを行うが、
// iPad（Safari）ではこの取得に失敗し図が欠落することがあるため、
// ?inline を付けてビルド時にbase64として直接JSへ埋め込み、fetch自体を不要にする。
import bodyDiagram from "../assets/body-diagram.png?inline";
import handDiagram from "../assets/hand-diagram.png?inline";
import { DiagramCanvas } from "./DiagramCanvas";
import { getMarkRects, VIEW_BOX } from "../data/bodyDiagramCoords";
import { getHandMarkRects, HAND_VIEW_BOX } from "../data/handDiagramCoords";
import { diagonalHatchLines, horizontalLines, type LineSeg } from "../utils/hatchLines";

type Props = {
  marks?: BodyMark[];
};

function bodyMarkLines(marks: BodyMark[]): LineSeg[] {
  const lines: LineSeg[] = [];
  for (const mark of marks) {
    for (const { front, back } of getMarkRects(mark)) {
      for (const rect of [front, back]) {
        lines.push(...(mark.type === "sensory" ? diagonalHatchLines(rect, 16, 1) : horizontalLines(rect, 16, 1)));
      }
    }
  }
  return lines;
}

function handMarkLines(marks: BodyMark[]): LineSeg[] {
  const lines: LineSeg[] = [];
  for (const mark of marks) {
    for (const rect of getHandMarkRects(mark)) {
      lines.push(...(mark.type === "sensory" ? diagonalHatchLines(rect, 12, 0.9) : horizontalLines(rect, 11, 0.9)));
    }
  }
  return lines;
}

export function ReferenceDiagram({ marks = [] }: Props) {
  const bodyLines = useMemo(() => bodyMarkLines(marks), [marks]);
  const handLines = useMemo(() => handMarkLines(marks), [marks]);

  return (
    <div className="ref-diagram-wrap">
      <div className="ref-diagram-title">参考図示</div>
      <div className="ref-diagram-images">
        <div className="ref-diagram-body-wrap">
          <DiagramCanvas
            src={bodyDiagram}
            nativeWidth={VIEW_BOX.width}
            nativeHeight={VIEW_BOX.height}
            displayHeight={210}
            lines={bodyLines}
            alt="身体前面・背面図"
            className="ref-diagram-body"
          />
        </div>
        <div className="ref-diagram-hands">
          <div className="ref-diagram-hand-wrap">
            <DiagramCanvas
              src={handDiagram}
              nativeWidth={HAND_VIEW_BOX.width}
              nativeHeight={HAND_VIEW_BOX.height}
              displayHeight={110}
              lines={handLines}
              alt="手掌図（右・左）"
              className="ref-diagram-hand-img"
            />
          </div>
          <div className="ref-diagram-hand-labels">
            <span>右</span>
            <span>左</span>
          </div>
        </div>
      </div>
      <div className="ref-diagram-legend">
        <span>
          <span className="legend-mark legend-mark-x">×</span> 変形
        </span>
        <span>
          <span className="legend-mark legend-mark-solid" /> 切離断
        </span>
        <span>
          <span className="legend-mark legend-mark-hatch" /> 感覚障害
        </span>
        <span>
          <span className="legend-mark legend-mark-wave" /> 運動障害
        </span>
      </div>
    </div>
  );
}
