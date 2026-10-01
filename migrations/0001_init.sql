CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  summary TEXT NOT NULL,
  status TEXT NOT NULL,
  rom_mmt TEXT NOT NULL
);
