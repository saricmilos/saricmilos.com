import { neon } from "@neondatabase/serverless";

// The client centre's database. On Vercel it is Neon Postgres (DATABASE_URL, set when a
// Neon database is added to the project); in `npm run dev` without it, PGlite, a real
// Postgres running in-process and kept in .data/clients, so local work needs no account.
// Client documents live here and nowhere else: never in the repository, which is public.

type Row = Record<string, unknown>;
export type Db = { query: <R extends Row = Row>(text: string, params?: unknown[]) => Promise<R[]> };

declare global {
  var __clientsDb: Promise<Db> | undefined;
}

// Tables are created on first use. A later change is a new statement at the end
// (ALTER TABLE … ADD COLUMN IF NOT EXISTS), never an edit to one above.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS cc_clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    lang TEXT NOT NULL DEFAULT 'sr',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS cc_documents (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES cc_clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    pdf BYTEA NOT NULL,
    sha256 TEXT NOT NULL,
    size INT NOT NULL,
    position INT NOT NULL DEFAULT 0,
    needs_signature BOOLEAN NOT NULL DEFAULT false,
    confirmations TEXT NOT NULL DEFAULT '',
    remarks BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS cc_documents_by_client ON cc_documents (client_id, position)`,
  `CREATE TABLE IF NOT EXISTS cc_links (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES cc_clients(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS cc_signatures (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES cc_documents(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('provider', 'client')),
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    confirmations TEXT NOT NULL DEFAULT '[]',
    remarks TEXT NOT NULL DEFAULT '',
    doc_sha256 TEXT NOT NULL,
    ip TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (document_id, role)
  )`,
  `CREATE TABLE IF NOT EXISTS cc_events (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES cc_clients(id) ON DELETE CASCADE,
    document_id INT REFERENCES cc_documents(id) ON DELETE SET NULL,
    kind TEXT NOT NULL,
    detail TEXT NOT NULL DEFAULT '',
    ip TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS cc_events_by_client ON cc_events (client_id, at DESC)`,
  `CREATE TABLE IF NOT EXISTS cc_login_attempts (
    ip TEXT NOT NULL,
    at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
];

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const sql = neon(url);
    return { query: (text, params = []) => sql.query(text, params) as never };
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is not set: add a Neon database to the Vercel project");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdirSync } = await import("node:fs");
  mkdirSync(".data", { recursive: true }); // PGlite makes its own folder, not the one around it
  const pg = new PGlite(".data/clients");
  return { query: async (text, params = []) => (await pg.query(text, params)).rows as never };
}

/** The database, with its tables in place. */
export function db(): Promise<Db> {
  globalThis.__clientsDb ??= connect()
    .then(async (d) => {
      for (const statement of SCHEMA) await d.query(statement);
      return d;
    })
    .catch((error: unknown) => {
      globalThis.__clientsDb = undefined;
      throw error;
    });
  return globalThis.__clientsDb;
}

/** Timestamps come back as Date from one driver and as text from another; callers get ISO text. */
export const iso = (v: unknown): string => (v instanceof Date ? v : new Date(String(v))).toISOString();
export const isoOrNull = (v: unknown): string | null => (v === null || v === undefined ? null : iso(v));
/** Counts come back as text from Neon and as numbers or BigInt from PGlite. */
export const int = (v: unknown): number => Number(v ?? 0);
