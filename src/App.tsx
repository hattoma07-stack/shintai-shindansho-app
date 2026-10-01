import { useEffect, useRef, useState } from "react";
import "./styles/app.css";
import type { Patient } from "./types";
import { emptyPatient } from "./types";
import { createPatient, deletePatient, fetchPatients, newPatientId, updatePatient } from "./storage/patientStore";
import { PatientListPage } from "./components/PatientListPage";
import { PatientEditor } from "./components/PatientEditor";

const SAVE_DEBOUNCE_MS = 800;

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    fetchPatients()
      .then((list) => setPatients(list))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const selected = patients.find((p) => p.id === selectedId) ?? null;

  const handleCreate = async () => {
    const id = newPatientId();
    const p = emptyPatient(id);
    setPatients((prev) => [p, ...prev]);
    setSelectedId(id);
    try {
      await createPatient(p);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleDelete = async (id: string) => {
    // 削除後に保留中の自動保存が走って復活してしまわないよう、先にタイマーを止める
    clearTimeout(saveTimers.current[id]);
    delete saveTimers.current[id];
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await deletePatient(id);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleChange = (p: Patient) => {
    const updated = { ...p, updatedAt: Date.now() };
    setPatients((prev) => prev.map((existing) => (existing.id === updated.id ? updated : existing)));

    clearTimeout(saveTimers.current[updated.id]);
    saveTimers.current[updated.id] = setTimeout(() => {
      updatePatient(updated).catch((e) => setSaveError(e instanceof Error ? e.message : String(e)));
    }, SAVE_DEBOUNCE_MS);
  };

  if (loading) {
    return (
      <div className="app-root">
        <p className="note-text" style={{ padding: 24 }}>
          読み込み中...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-root">
        <p className="note-text" style={{ padding: 24, color: "var(--color-danger)" }}>
          データの読み込みに失敗しました：{error}
        </p>
      </div>
    );
  }

  return (
    <div className="app-root">
      {saveError && (
        <div className="save-error-banner no-print" role="alert">
          保存に失敗しました：{saveError}
          <button type="button" onClick={() => setSaveError(null)}>
            閉じる
          </button>
        </div>
      )}
      {selected ? (
        <PatientEditor patient={selected} onChange={handleChange} onBack={() => setSelectedId(null)} />
      ) : (
        <PatientListPage
          patients={patients}
          onSelect={setSelectedId}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
