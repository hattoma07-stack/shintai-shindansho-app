import type { BodyMark } from "../types";
// PDF書き出し（html-to-image）は<img>を画像データとして埋め込むためにfetchを行うが、
// iPad（Safari）ではこの取得に失敗し図が欠落することがあるため、
// ?inline を付けてビルド時にbase64として直接JSへ埋め込み、fetch自体を不要にする。
import bodyDiagram from "../assets/body-diagram.png?inline";
import handDiagram from "../assets/hand-diagram.png?inline";
import { BodyDiagramOverlay } from "./BodyDiagramOverlay";
import { HandDiagramOverlay } from "./HandDiagramOverlay";

type Props = {
  marks?: BodyMark[];
};

export function ReferenceDiagram({ marks = [] }: Props) {
  return (
    <div className="ref-diagram-wrap">
      <div className="ref-diagram-title">参考図示</div>
      <div className="ref-diagram-images">
        <div className="ref-diagram-body-wrap">
          <img src={bodyDiagram} alt="身体前面・背面図" className="ref-diagram-body" />
          <BodyDiagramOverlay marks={marks} className="ref-diagram-overlay" />
        </div>
        <div className="ref-diagram-hands">
          <div className="ref-diagram-hand-wrap">
            <img src={handDiagram} alt="手掌図（右・左）" className="ref-diagram-hand-img" />
            <HandDiagramOverlay marks={marks} className="ref-diagram-overlay" />
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
