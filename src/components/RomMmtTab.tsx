import type { RomMmtRowValue } from "../types";
import { ROM_MMT_ROWS } from "../data/romMmtRows";
import { MmtButtons } from "./MmtButtons";

type Props = {
  value: Record<string, RomMmtRowValue>;
  onChange: (value: Record<string, RomMmtRowValue>) => void;
};

export function RomMmtTab({ value, onChange }: Props) {
  const setRow = (id: string, patch: Partial<RomMmtRowValue>) => {
    const current: RomMmtRowValue = value[id] ?? {
      rightRom: "",
      rightMmt: "",
      leftRom: "",
      leftMmt: "",
    };
    onChange({ ...value, [id]: { ...current, ...patch } });
  };

  let lastSection = "";

  return (
    <div className="tab-panel">
      <h2>関節可動域 (ROM) と筋力テスト (MMT)</h2>
      <p className="note-text">必要な部分のみ記入してください。</p>

      <table className="rom-table">
        <thead>
          <tr>
            <th>部位</th>
            <th>運動方向</th>
            <th>参考ROM値</th>
            <th>右 ROM (°)</th>
            <th>右 MMT</th>
            <th>左 ROM (°)</th>
            <th>左 MMT</th>
          </tr>
        </thead>
        <tbody>
          {ROM_MMT_ROWS.map((row) => {
            const showSection = row.section !== lastSection;
            lastSection = row.section;
            const v = value[row.id] ?? { rightRom: "", rightMmt: "", leftRom: "", leftMmt: "" };
            return (
              <tr key={row.id} className={showSection ? "section-start" : undefined}>
                <td className="section-cell">{showSection ? row.section : ""}</td>
                <td>{row.movement}</td>
                <td className="ref-rom-cell">{row.refRom}</td>
                <td>
                  <input
                    className="rom-input"
                    inputMode="numeric"
                    value={v.rightRom}
                    onChange={(e) => setRow(row.id, { rightRom: e.target.value })}
                  />
                </td>
                <td>
                  <MmtButtons
                    value={v.rightMmt}
                    onChange={(m) => setRow(row.id, { rightMmt: m })}
                    label={`${row.movement} 右MMT`}
                  />
                </td>
                <td>
                  <input
                    className="rom-input"
                    inputMode="numeric"
                    value={v.leftRom}
                    onChange={(e) => setRow(row.id, { leftRom: e.target.value })}
                  />
                </td>
                <td>
                  <MmtButtons
                    value={v.leftMmt}
                    onChange={(m) => setRow(row.id, { leftMmt: m })}
                    label={`${row.movement} 左MMT`}
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
