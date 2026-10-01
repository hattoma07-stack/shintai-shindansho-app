import { useState } from "react";
import type { Patient } from "../types";
import { SummaryTab } from "./SummaryTab";
import { StatusTab } from "./StatusTab";
import { RomMmtTab } from "./RomMmtTab";
import { PrintLayout } from "./PrintLayout";
import { exportPatientPdf } from "../utils/exportPdf";

type Props = {
  patient: Patient;
  onChange: (patient: Patient) => void;
  onBack: () => void;
};

type TabKey = "summary" | "status" | "rom" | "print";

const TABS: { key: TabKey; label: string }[] = [
  { key: "summary", label: "総括表" },
  { key: "status", label: "肢体不自由の状況及び所見" },
  { key: "rom", label: "ROM・MMT測定表" },
  { key: "print", label: "印刷プレビュー" },
];

export function PatientEditor({ patient, onChange, onBack }: Props) {
  const [tab, setTab] = useState<TabKey>("summary");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPdf = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const name = patient.summary.name || "患者";
      await exportPatientPdf(`${name}_身体障害者診断書.pdf`);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : String(e));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="patient-editor">
      <div className="editor-toolbar no-print">
        <button className="secondary-btn" onClick={onBack}>
          ← 患者一覧へ戻る
        </button>
        <span className="editor-patient-name">{patient.summary.name || "（氏名未入力）"}</span>
        <button className="primary-btn" onClick={handleExportPdf} disabled={exporting}>
          {exporting ? "PDF作成中..." : "PDFを保存（A3横2枚）"}
        </button>
      </div>
      <p className="no-print export-hint">
        印刷する場合は、保存したPDFを開いてから印刷してください（ブラウザから直接印刷すると、A3横の用紙設定が正しく反映されないことがあります）。
      </p>
      {exportError && (
        <div className="save-error-banner no-print" role="alert">
          PDF作成に失敗しました：{exportError}
          <button type="button" onClick={() => setExportError(null)}>
            閉じる
          </button>
        </div>
      )}

      <nav className="tab-nav no-print">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-nav-btn${tab === t.key ? " active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="editor-body">
        {tab === "summary" && (
          <div className="no-print">
            <SummaryTab value={patient.summary} onChange={(summary) => onChange({ ...patient, summary })} />
          </div>
        )}
        {tab === "status" && (
          <div className="no-print">
            <StatusTab value={patient.status} onChange={(status) => onChange({ ...patient, status })} />
          </div>
        )}
        {tab === "rom" && (
          <div className="no-print">
            <RomMmtTab value={patient.romMmt} onChange={(romMmt) => onChange({ ...patient, romMmt })} />
          </div>
        )}
        {tab === "print" && (
          <div className="no-print">
            <PrintLayout patient={patient} />
          </div>
        )}
      </div>

      {/* PDF書き出し・印刷時は常にフル出力を使う */}
      <div className="print-only">
        <PrintLayout patient={patient} />
      </div>
    </div>
  );
}
