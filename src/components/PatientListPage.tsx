import type { Patient } from "../types";

type Props = {
  patients: Patient[];
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
};

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function PatientListPage({ patients, onSelect, onCreate, onDelete }: Props) {
  const sorted = [...patients].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="patient-list-page">
      <div className="patient-list-header">
        <h1>身体障害者診断書・意見書（肢体不自由障害用）</h1>
        <button className="primary-btn" onClick={onCreate}>
          + 新規患者を追加
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="note-text">まだ患者データがありません。「新規患者を追加」から入力を始めてください。</p>
      ) : (
        <ul className="patient-list">
          {sorted.map((p) => (
            <li key={p.id} className="patient-list-item">
              <button className="patient-list-item-main" onClick={() => onSelect(p.id)}>
                <span className="patient-name">{p.summary.name || "（氏名未入力）"}</span>
                <span className="patient-meta">最終更新: {formatDate(p.updatedAt)}</span>
              </button>
              <button
                className="danger-btn"
                onClick={() => {
                  if (confirm(`「${p.summary.name || "（氏名未入力）"}」のデータを削除しますか？この操作は取り消せません。`)) {
                    onDelete(p.id);
                  }
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
