import type { Patient } from "../types";
import { ROM_MMT_AXES } from "../data/romMmtAxes";
import { ROM_MMT_ROWS } from "../data/romMmtRows";
import type { RomMmtRowDef } from "../data/romMmtRows";
import { RomAxisRuler } from "./RomAxisRuler";
import { mmtToSymbol } from "../utils/mmt";

const ROW_BY_ID: Record<string, RomMmtRowDef> = Object.fromEntries(ROM_MMT_ROWS.map((r) => [r.id, r]));

function refDeg(id: string | undefined): number {
  if (!id) return 0;
  const row = ROW_BY_ID[id];
  if (!row) return 0;
  return parseFloat(row.refRom) || 0;
}

function num(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

// MP・PIPの指名（母・示・中・環・小）は、表の左右両端（外側）では省き、
// 中央寄り（内側）の側だけに表示する。
function movementLabel(row: RomMmtRowDef, hideFinger: boolean): string {
  const isFingerRow = row.id.startsWith("mp-") || row.id.startsWith("pip-");
  return hideFinger && isFingerRow ? row.movement.replace(/^\S+\s+/, "") : row.movement;
}

function SideCell({
  axisNegId,
  axisPosId,
  negRef,
  posRef,
  romValues,
  side,
  flip,
  showScale,
  swapLabels,
  hideMmt,
}: {
  axisNegId?: string;
  axisPosId?: string;
  negRef: number;
  posRef: number;
  romValues: Patient["romMmt"];
  side: "rightRom" | "leftRom";
  flip: boolean;
  showScale: boolean;
  swapLabels: boolean;
  hideMmt?: "left" | "right";
}) {
  const mmtSide = side === "rightRom" ? "rightMmt" : "leftMmt";
  const negRow = axisNegId ? ROW_BY_ID[axisNegId] : undefined;
  const posRow = axisPosId ? ROW_BY_ID[axisPosId] : undefined;
  const negVal = axisNegId ? num(romValues[axisNegId]?.[side]) : null;
  const posVal = axisPosId ? num(romValues[axisPosId]?.[side]) : null;
  const negMmt = axisNegId ? mmtToSymbol(romValues[axisNegId]?.[mmtSide]) : "";
  const posMmt = axisPosId ? mmtToSymbol(romValues[axisPosId]?.[mmtSide]) : "";

  const labelOf = (row: RomMmtRowDef | undefined, mmt: string, pos: "left" | "right", hideFinger: boolean) => {
    if (!row) return "";
    const text = movementLabel(row, hideFinger);
    if (hideMmt === pos) return text;
    return pos === "left" ? (
      <>
        ({mmt || " "}){text}
      </>
    ) : (
      <>
        {text}({mmt || " "})
      </>
    );
  };

  // swapLabels のときは左右の文字ラベル（運動方向とMMT記号）の位置を入れ替える。
  // 指名の省略は位置（左右両端側）で決まるので、入れ替え後も位置基準のまま。
  const leftRow = swapLabels ? posRow : negRow;
  const leftMmt = swapLabels ? posMmt : negMmt;
  const rightRow = swapLabels ? negRow : posRow;
  const rightMmt = swapLabels ? negMmt : posMmt;

  return (
    <div className="rom-axis-cell">
      <span className="rom-axis-label rom-axis-label-left">
        {labelOf(leftRow, leftMmt, "left", side === "rightRom")}
      </span>
      <RomAxisRuler
        negRef={negRef}
        posRef={posRef}
        negVal={negVal}
        posVal={posVal}
        flip={flip}
        showScale={showScale}
      />
      <span className="rom-axis-label rom-axis-label-right">
        {labelOf(rightRow, rightMmt, "right", side === "leftRom")}
      </span>
    </div>
  );
}

export function RomMmtPrintSection({ patient }: { patient: Patient }) {
  let lastSection = "";

  return (
    <div className="rom-graphic-wrap">
      <table className="rom-graphic-table">
        <tbody>
          {ROM_MMT_AXES.map((axis, idx) => {
            const negRef = refDeg(axis.neg?.id);
            const posRef = refDeg(axis.pos?.id);
            const showSection = axis.section !== lastSection;
            lastSection = axis.section;
            return (
              <tr key={idx} className={showSection ? "section-start" : undefined}>
                <td className="rom-graphic-side">
                  {showSection && axis.section === "肩" && <span className="rom-side-tag rom-side-tag-right">右</span>}
                  <SideCell
                    axisNegId={axis.neg?.id}
                    axisPosId={axis.pos?.id}
                    negRef={negRef}
                    posRef={posRef}
                    romValues={patient.romMmt}
                    side="rightRom"
                    swapLabels={!!axis.swapRightLabels}
                    hideMmt={axis.hideMmt}
                    flip={!!axis.swapRightLabels}
                    showScale={idx === 0}
                  />
                </td>
                <td className="rom-graphic-section">{showSection ? axis.section : ""}</td>
                <td className="rom-graphic-side">
                  {showSection && axis.section === "肩" && <span className="rom-side-tag rom-side-tag-left">左</span>}
                  <SideCell
                    axisNegId={axis.neg?.id}
                    axisPosId={axis.pos?.id}
                    negRef={negRef}
                    posRef={posRef}
                    romValues={patient.romMmt}
                    side="leftRom"
                    swapLabels={!!axis.swapLeftLabels}
                    hideMmt={axis.hideMmt}
                    flip={!!axis.swapLeftLabels}
                    showScale={idx === 0}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
