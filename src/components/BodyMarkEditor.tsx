import { useState } from "react";
import type { BodyMark, BodyMarkType, BodyRegion, BodySide, HandPart } from "../types";
import { HAND_PART_LABEL, HAND_PART_OPTIONS, REGION_LABEL, REGION_OPTIONS, SIDE_LABEL } from "../data/bodyRegions";

type Props = {
  type: BodyMarkType;
  allMarks: BodyMark[];
  onChange: (next: BodyMark[]) => void;
};

let counter = 0;
function newId() {
  counter += 1;
  return `mark_${Date.now()}_${counter}`;
}

export function BodyMarkEditor({ type, allMarks, onChange }: Props) {
  const [region, setRegion] = useState<BodyRegion>("upperLimb");
  const [side, setSide] = useState<BodySide>("right");
  const [handPart, setHandPart] = useState<HandPart>("whole");

  const regionDef = REGION_OPTIONS.find((r) => r.value === region)!;
  const isHand = region === "hand";
  const marksOfType = allMarks.filter((m) => m.type === type);

  const add = () => {
    const mark: BodyMark = {
      id: newId(),
      type,
      region,
      side: regionDef.hasSide ? side : "",
      ...(isHand ? { handPart } : {}),
    };
    onChange([...allMarks, mark]);
  };

  const remove = (id: string) => {
    onChange(allMarks.filter((m) => m.id !== id));
  };

  const markLabel = (m: BodyMark) => {
    const parts = [REGION_LABEL[m.region]];
    if (m.side) parts.push(SIDE_LABEL[m.side]);
    if (m.region === "hand" && m.handPart && m.handPart !== "whole") parts.push(HAND_PART_LABEL[m.handPart]);
    return parts.join("・");
  };

  return (
    <div className="body-mark-editor">
      {marksOfType.length > 0 && (
        <div className="body-mark-chips">
          {marksOfType.map((m) => (
            <span key={m.id} className="body-mark-chip">
              {markLabel(m)}
              <button type="button" onClick={() => remove(m.id)} aria-label="削除">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="body-mark-form">
        <select value={region} onChange={(e) => setRegion(e.target.value as BodyRegion)}>
          {REGION_OPTIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {isHand && (
          <select value={handPart} onChange={(e) => setHandPart(e.target.value as HandPart)}>
            {HAND_PART_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
        {regionDef.hasSide && (
          <select value={side} onChange={(e) => setSide(e.target.value as BodySide)}>
            <option value="right">右</option>
            <option value="left">左</option>
            <option value="both">両側</option>
          </select>
        )}
        <button type="button" className="secondary-btn body-mark-add-btn" onClick={add}>
          + 部位を追加
        </button>
      </div>
    </div>
  );
}
