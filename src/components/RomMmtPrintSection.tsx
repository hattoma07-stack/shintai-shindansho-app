import type { Patient } from "../types";
import { ROM_MMT_AXES } from "../data/romMmtAxes";
import { ROM_MMT_ROWS } from "../data/romMmtRows";
import type { RomMmtRowDef } from "../data/romMmtRows";
import { RomAxisRuler, RomArrowMarkerDefs } from "./RomAxisRuler";
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

function SideCell({
  axisNegId,
  axisPosId,
  negRef,
  posRef,
  romValues,
  side,
  flip,
  showScale,
}: {
  axisNegId?: string;
  axisPosId?: string;
  negRef: number;
  posRef: number;
  romValues: Patient["romMmt"];
  side: "rightRom" | "leftRom";
  flip: boolean;
  showScale: boolean;
}) {
  const mmtSide = side === "rightRom" ? "rightMmt" : "leftMmt";
  const negRow = axisNegId ? ROW_BY_ID[axisNegId] : undefined;
  const posRow = axisPosId ? ROW_BY_ID[axisPosId] : undefined;
  const negVal = axisNegId ? num(romValues[axisNegId]?.[side]) : null;
  const posVal = axisPosId ? num(romValues[axisPosId]?.[side]) : null;
  const negMmt = axisNegId ? mmtToSymbol(romValues[axisNegId]?.[mmtSide]) : "";
  const posMmt = axisPosId ? mmtToSymbol(romValues[axisPosId]?.[mmtSide]) : "";

  return (
    <div className="rom-axis-cell">
      <span className="rom-axis-label rom-axis-label-left">
        {negRow ? (
          <>
            ({negMmt || " "}){negRow.movement}
          </>
        ) : (
          ""
        )}
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
        {posRow ? (
          <>
            {posRow.movement}({posMmt || " "})
          </>
        ) : (
          ""
        )}
      </span>
    </div>
  );
}

export function RomMmtPrintSection({ patient }: { patient: Patient }) {
  let lastSection = "";

  return (
    <div className="rom-graphic-wrap">
      <RomArrowMarkerDefs />
      <div className="rom-graphic-cols-label">
        <span>右</span>
        <span>左</span>
      </div>
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
                  <SideCell
                    axisNegId={axis.neg?.id}
                    axisPosId={axis.pos?.id}
                    negRef={negRef}
                    posRef={posRef}
                    romValues={patient.romMmt}
                    side="rightRom"
                    flip={false}
                    showScale={idx === 0}
                  />
                </td>
                <td className="rom-graphic-section">{showSection ? axis.section : ""}</td>
                <td className="rom-graphic-side">
                  <SideCell
                    axisNegId={axis.neg?.id}
                    axisPosId={axis.pos?.id}
                    negRef={negRef}
                    posRef={posRef}
                    romValues={patient.romMmt}
                    side="leftRom"
                    flip={true}
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
