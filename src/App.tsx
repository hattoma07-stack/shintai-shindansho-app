import { useEffect, useState } from "react";
import "./styles/app.css";
import type { Patient } from "./types";
import { emptyPatient } from "./types";
import { deletePatient, loadPatients, newPatientId, upsertPatient } from "./storage/patientStore";
import { PatientListPage } from "./components/PatientListPage";
import { PatientEditor } from "./components/PatientEditor";

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setPatients(loadPatients());
  }, []);

  const selected = patients.find((p) => p.id === selectedId) ?? null;

  const handleCreate = () => {
    const id = newPatientId();
    const p = emptyPatient(id);
    setPatients(upsertPatient(p));
    setSelectedId(id);
  };

  const handleDelete = (id: string) => {
    setPatients(deletePatient(id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleChange = (p: Patient) => {
    setPatients(upsertPatient(p));
  };

  return (
    <div className="app-root">
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
