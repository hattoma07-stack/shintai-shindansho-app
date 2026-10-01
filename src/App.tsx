import { useEffect, useRef, useState } from "react";
import "./styles/app.css";
import type { Patient } from "./types";
import { emptyPatient } from "./types";
import { createPatient, deletePatient, fetchPatients, newPatientId, updatePatient } from "./storage/patientStore";
import { PatientListPage } from "./components/PatientListPage";
import { PatientEditor } from "./components/PatientEditor";

const SAVE_DEBOUNCE_MS = 15000;

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // デバウンス待ちの未保存データ。画面遷移時や閉じるときに即座に保存するために使う。
  const pendingPatients = useRef<Record<string, Patient>>({});

  const flushSave = (id: string) => {
    const pending = pendingPatients.current[id];
    if (!pending) return;
    clearTimeout(saveTimers.current[id]);
    delete saveTimers.current[id];
    delete pendingPatients.current[id];
    updatePatient(pending).catch((e) => setSaveError(e instanceof Error ? e.message : String(e)));
  };

  const flushAll = () => {
    for (const id of Object.keys(pendingPatients.current)) flushSave(id);
  };

  useEffect(() => {
    fetchPatients()
      .then((list) => setPatients(list))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // タブを閉じる・リロードする・バックグラウンドに回る前に、保留中の変更を保存する
    const handleBeforeUnload = () => flushAll();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushAll();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
    delete pendingPatients.current[id];
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
    pendingPatients.current[updated.id] = updated;

    clearTimeout(saveTimers.current[updated.id]);
    saveTimers.current[updated.id] = setTimeout(() => flushSave(updated.id), SAVE_DEBOUNCE_MS);
  };

  // 患者を切り替える・一覧に戻るときは、待たずにすぐ保存する
  const handleSelect = (id: string) => {
    if (selectedId) flushSave(selectedId);
    setSelectedId(id);
  };

  const handleBack = () => {
    if (selectedId) flushSave(selectedId);
    setSelectedId(null);
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
        <PatientEditor patient={selected} onChange={handleChange} onBack={handleBack} />
      ) : (
        <PatientListPage
          patients={patients}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
