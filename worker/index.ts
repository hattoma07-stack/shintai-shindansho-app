export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

type PatientRow = {
  id: string;
  created_at: number;
  updated_at: number;
  updated_by: string | null;
  summary: string;
  status: string;
  rom_mmt: string;
};

function rowToPatient(row: PatientRow) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    summary: JSON.parse(row.summary),
    status: JSON.parse(row.status),
    romMmt: JSON.parse(row.rom_mmt),
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function getUserEmail(request: Request): string | null {
  // Cloudflare Access が設定されている場合、認証済みメールがヘッダーに入る
  return request.headers.get("Cf-Access-Authenticated-User-Email");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    const method = request.method;
    const parts = url.pathname.split("/").filter(Boolean); // ["api", "patients", ":id"?]

    try {
      if (parts[1] === "patients" && !parts[2]) {
        if (method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM patients ORDER BY updated_at DESC"
          ).all<PatientRow>();
          return json(results.map(rowToPatient));
        }
        if (method === "POST") {
          const body = (await request.json()) as {
            id: string;
            summary: unknown;
            status: unknown;
            romMmt: unknown;
          };
          const now = Date.now();
          const updatedBy = getUserEmail(request);
          await env.DB.prepare(
            `INSERT INTO patients (id, created_at, updated_at, updated_by, summary, status, rom_mmt)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               updated_at = excluded.updated_at,
               updated_by = excluded.updated_by,
               summary = excluded.summary,
               status = excluded.status,
               rom_mmt = excluded.rom_mmt`
          )
            .bind(
              body.id,
              now,
              now,
              updatedBy,
              JSON.stringify(body.summary),
              JSON.stringify(body.status),
              JSON.stringify(body.romMmt)
            )
            .run();
          const row = await env.DB.prepare("SELECT * FROM patients WHERE id = ?")
            .bind(body.id)
            .first<PatientRow>();
          return json(row ? rowToPatient(row) : null, 201);
        }
      }

      if (parts[1] === "patients" && parts[2]) {
        const id = parts[2];
        if (method === "PUT") {
          const body = (await request.json()) as { summary: unknown; status: unknown; romMmt: unknown };
          const now = Date.now();
          const updatedBy = getUserEmail(request);
          await env.DB.prepare(
            `UPDATE patients SET updated_at = ?, updated_by = ?, summary = ?, status = ?, rom_mmt = ? WHERE id = ?`
          )
            .bind(now, updatedBy, JSON.stringify(body.summary), JSON.stringify(body.status), JSON.stringify(body.romMmt), id)
            .run();
          const row = await env.DB.prepare("SELECT * FROM patients WHERE id = ?").bind(id).first<PatientRow>();
          if (!row) return json({ error: "not found" }, 404);
          return json(rowToPatient(row));
        }
        if (method === "DELETE") {
          await env.DB.prepare("DELETE FROM patients WHERE id = ?").bind(id).run();
          return json({ ok: true });
        }
      }

      return json({ error: "not found" }, 404);
    } catch (err) {
      return json({ error: String(err) }, 500);
    }
  },
};
