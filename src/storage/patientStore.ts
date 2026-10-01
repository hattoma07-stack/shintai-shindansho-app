import type { Patient } from "../types";

const API_BASE = "/api/patients";

export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`患者データの取得に失敗しました (${res.status})`);
  return (await res.json()) as Patient[];
}

export async function createPatient(patient: Patient): Promise<Patient> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patient),
  });
  if (!res.ok) throw new Error(`患者の作成に失敗しました (${res.status})`);
  return (await res.json()) as Patient;
}

export async function updatePatient(patient: Patient): Promise<Patient> {
  const res = await fetch(`${API_BASE}/${patient.id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patient),
  });
  if (!res.ok) throw new Error(`患者データの保存に失敗しました (${res.status})`);
  return (await res.json()) as Patient;
}

export async function deletePatient(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`患者の削除に失敗しました (${res.status})`);
}

export function newPatientId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
