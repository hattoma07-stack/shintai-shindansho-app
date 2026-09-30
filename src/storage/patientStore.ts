import type { Patient } from "../types";

const STORAGE_KEY = "shintai-shindansho:patients";

export function loadPatients(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Patient[];
  } catch {
    return [];
  }
}

export function savePatients(patients: Patient[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

export function upsertPatient(patient: Patient): Patient[] {
  const patients = loadPatients();
  const idx = patients.findIndex((p) => p.id === patient.id);
  const updated = { ...patient, updatedAt: Date.now() };
  if (idx >= 0) {
    patients[idx] = updated;
  } else {
    patients.push(updated);
  }
  savePatients(patients);
  return patients;
}

export function deletePatient(id: string): Patient[] {
  const patients = loadPatients().filter((p) => p.id !== id);
  savePatients(patients);
  return patients;
}

export function newPatientId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
