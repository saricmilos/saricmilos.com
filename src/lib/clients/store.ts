import { createHash, randomBytes } from "node:crypto";
import { db, int, iso, isoOrNull } from "./db";

// Everything the client centre reads and writes. Admin pages and client pages both go
// through here; who may call what is checked by the caller (requireAdmin, or a live link).

export type Lang = "sr" | "en";
export type Role = "provider" | "client";

export type Client = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  lang: Lang;
  createdAt: string;
};

export type Doc = {
  id: number;
  clientId: number;
  title: string;
  filename: string;
  sha256: string;
  size: number;
  position: number;
  needsSignature: boolean;
  /** Lines the client ticks when signing (an account received, a password changed …). */
  confirmations: string[];
  /** Whether the client may write remarks when signing (a handover's „primedbe“). */
  remarks: boolean;
  createdAt: string;
};

export type Signature = {
  id: number;
  documentId: number;
  role: Role;
  name: string;
  image: string;
  confirmations: string[];
  remarks: string;
  docSha256: string;
  ip: string;
  userAgent: string;
  signedAt: string;
};

export type Link = { id: number; clientId: number; token: string; createdAt: string; revokedAt: string | null };

export type Event = {
  id: number;
  documentId: number | null;
  kind: string;
  detail: string;
  ip: string;
  userAgent: string;
  at: string;
};

const lines = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const asClient = (r: Record<string, unknown>): Client => ({
  id: int(r.id),
  name: String(r.name),
  company: String(r.company),
  email: String(r.email),
  phone: String(r.phone),
  lang: r.lang === "en" ? "en" : "sr",
  createdAt: iso(r.created_at),
});

const asDoc = (r: Record<string, unknown>): Doc => ({
  id: int(r.id),
  clientId: int(r.client_id),
  title: String(r.title),
  filename: String(r.filename),
  sha256: String(r.sha256),
  size: int(r.size),
  position: int(r.position),
  needsSignature: Boolean(r.needs_signature),
  confirmations: lines(String(r.confirmations ?? "")),
  remarks: Boolean(r.remarks),
  createdAt: iso(r.created_at),
});

const asSignature = (r: Record<string, unknown>): Signature => ({
  id: int(r.id),
  documentId: int(r.document_id),
  role: r.role === "provider" ? "provider" : "client",
  name: String(r.name),
  image: String(r.image),
  confirmations: JSON.parse(String(r.confirmations ?? "[]")) as string[],
  remarks: String(r.remarks ?? ""),
  docSha256: String(r.doc_sha256),
  ip: String(r.ip ?? ""),
  userAgent: String(r.user_agent ?? ""),
  signedAt: iso(r.signed_at),
});

const asLink = (r: Record<string, unknown>): Link => ({
  id: int(r.id),
  clientId: int(r.client_id),
  token: String(r.token),
  createdAt: iso(r.created_at),
  revokedAt: isoOrNull(r.revoked_at),
});

const DOC_COLUMNS = `id, client_id, title, filename, sha256, size, position, needs_signature, confirmations, remarks, created_at`;

// ---------------------------------------------------------------- clients

export type ClientInput = { name: string; company: string; email: string; phone: string; lang: Lang };

export async function listClients(): Promise<
  (Client & { documents: number; toSign: number; signed: number; linkLive: boolean; lastActivity: string | null })[]
> {
  const d = await db();
  const rows = await d.query(`
    SELECT c.*,
      (SELECT count(*) FROM cc_documents x WHERE x.client_id = c.id) AS documents,
      (SELECT count(*) FROM cc_documents x WHERE x.client_id = c.id AND x.needs_signature) AS to_sign,
      (SELECT count(*) FROM cc_documents x WHERE x.client_id = c.id AND x.needs_signature
         AND EXISTS (SELECT 1 FROM cc_signatures s WHERE s.document_id = x.id AND s.role = 'client')
         AND EXISTS (SELECT 1 FROM cc_signatures s WHERE s.document_id = x.id AND s.role = 'provider')) AS signed,
      EXISTS (SELECT 1 FROM cc_links l WHERE l.client_id = c.id AND l.revoked_at IS NULL) AS link_live,
      (SELECT max(at) FROM cc_events e WHERE e.client_id = c.id) AS last_activity
    FROM cc_clients c ORDER BY c.created_at DESC`);
  return rows.map((r) => ({
    ...asClient(r),
    documents: int(r.documents),
    toSign: int(r.to_sign),
    signed: int(r.signed),
    linkLive: Boolean(r.link_live),
    lastActivity: isoOrNull(r.last_activity),
  }));
}

export async function getClient(id: number): Promise<Client | null> {
  const [row] = await (await db()).query(`SELECT * FROM cc_clients WHERE id = $1`, [id]);
  return row ? asClient(row) : null;
}

export async function createClient(input: ClientInput): Promise<number> {
  const [row] = await (await db()).query<{ id: unknown }>(
    `INSERT INTO cc_clients (name, company, email, phone, lang) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [input.name, input.company, input.email, input.phone, input.lang],
  );
  return int(row.id);
}

export async function updateClient(id: number, input: ClientInput): Promise<void> {
  await (await db()).query(
    `UPDATE cc_clients SET name = $2, company = $3, email = $4, phone = $5, lang = $6 WHERE id = $1`,
    [id, input.name, input.company, input.email, input.phone, input.lang],
  );
}

export async function deleteClient(id: number): Promise<void> {
  await (await db()).query(`DELETE FROM cc_clients WHERE id = $1`, [id]);
}

// ---------------------------------------------------------------- documents

export async function listDocuments(clientId: number): Promise<Doc[]> {
  const rows = await (await db()).query(
    `SELECT ${DOC_COLUMNS} FROM cc_documents WHERE client_id = $1 ORDER BY position, id`,
    [clientId],
  );
  return rows.map(asDoc);
}

export async function getDocument(id: number): Promise<Doc | null> {
  const [row] = await (await db()).query(`SELECT ${DOC_COLUMNS} FROM cc_documents WHERE id = $1`, [id]);
  return row ? asDoc(row) : null;
}

/** The PDF itself, as stored. Base64 in and out, so both drivers hand bytes over the same way. */
export async function documentBytes(id: number): Promise<Buffer | null> {
  const [row] = await (await db()).query<{ b64: string }>(
    `SELECT encode(pdf, 'base64') AS b64 FROM cc_documents WHERE id = $1`,
    [id],
  );
  return row ? Buffer.from(row.b64.replace(/\s/g, ""), "base64") : null;
}

export const sha256 = (bytes: Buffer): string => createHash("sha256").update(bytes).digest("hex");

export async function addDocument(
  clientId: number,
  input: { title: string; filename: string; pdf: Buffer; needsSignature: boolean; confirmations: string; remarks: boolean },
): Promise<number> {
  const d = await db();
  const [last] = await d.query<{ p: unknown }>(
    `SELECT coalesce(max(position), 0) AS p FROM cc_documents WHERE client_id = $1`,
    [clientId],
  );
  const [row] = await d.query<{ id: unknown }>(
    `INSERT INTO cc_documents (client_id, title, filename, pdf, sha256, size, position, needs_signature, confirmations, remarks)
     VALUES ($1, $2, $3, decode($4, 'base64'), $5, $6, $7, $8, $9, $10) RETURNING id`,
    [
      clientId,
      input.title,
      input.filename,
      input.pdf.toString("base64"),
      sha256(input.pdf),
      input.pdf.length,
      int(last?.p) + 1,
      input.needsSignature,
      lines(input.confirmations).join("\n"),
      input.remarks,
    ],
  );
  return int(row.id);
}

export async function updateDocument(
  id: number,
  input: { title: string; needsSignature: boolean; confirmations: string; remarks: boolean },
): Promise<void> {
  await (await db()).query(
    `UPDATE cc_documents SET title = $2, needs_signature = $3, confirmations = $4, remarks = $5 WHERE id = $1`,
    [id, input.title, input.needsSignature, lines(input.confirmations).join("\n"), input.remarks],
  );
}

export async function deleteDocument(id: number): Promise<void> {
  await (await db()).query(`DELETE FROM cc_documents WHERE id = $1`, [id]);
}

/** Swaps a document with its neighbour above (-1) or below (+1). */
export async function moveDocument(id: number, direction: -1 | 1): Promise<void> {
  const doc = await getDocument(id);
  if (!doc) return;
  const docs = await listDocuments(doc.clientId);
  const at = docs.findIndex((x) => x.id === id);
  const other = docs[at + direction];
  if (!other) return;
  const d = await db();
  // Renumber 1…n first, so equal positions can't make the swap a no-op.
  for (const [i, x] of docs.entries()) await d.query(`UPDATE cc_documents SET position = $2 WHERE id = $1`, [x.id, i + 1]);
  await d.query(`UPDATE cc_documents SET position = $2 WHERE id = $1`, [id, at + 1 + direction]);
  await d.query(`UPDATE cc_documents SET position = $2 WHERE id = $1`, [other.id, at + 1]);
}

// ---------------------------------------------------------------- signatures

export async function signaturesFor(documentIds: number[]): Promise<Signature[]> {
  if (documentIds.length === 0) return [];
  const rows = await (await db()).query(
    `SELECT * FROM cc_signatures WHERE document_id = ANY($1::int[]) ORDER BY signed_at`,
    [documentIds],
  );
  return rows.map(asSignature);
}

export async function addSignature(input: {
  documentId: number;
  role: Role;
  name: string;
  image: string;
  confirmations: string[];
  remarks: string;
  docSha256: string;
  ip: string;
  userAgent: string;
}): Promise<"ok" | "already"> {
  const rows = await (await db()).query(
    `INSERT INTO cc_signatures (document_id, role, name, image, confirmations, remarks, doc_sha256, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (document_id, role) DO NOTHING RETURNING id`,
    [
      input.documentId,
      input.role,
      input.name,
      input.image,
      JSON.stringify(input.confirmations),
      input.remarks,
      input.docSha256,
      input.ip,
      input.userAgent,
    ],
  );
  return rows.length ? "ok" : "already";
}

export async function clearSignatures(documentId: number): Promise<void> {
  await (await db()).query(`DELETE FROM cc_signatures WHERE document_id = $1`, [documentId]);
}

// ---------------------------------------------------------------- links

/** 32 random bytes: the link is the only key to the client's documents. */
const newToken = () => randomBytes(32).toString("base64url");

export async function liveLink(clientId: number): Promise<Link | null> {
  const [row] = await (await db()).query(
    `SELECT * FROM cc_links WHERE client_id = $1 AND revoked_at IS NULL ORDER BY created_at DESC LIMIT 1`,
    [clientId],
  );
  return row ? asLink(row) : null;
}

/** A new link for the client; any older link stops working, so there is only ever one. */
export async function createLink(clientId: number): Promise<Link> {
  const d = await db();
  await d.query(`UPDATE cc_links SET revoked_at = now() WHERE client_id = $1 AND revoked_at IS NULL`, [clientId]);
  const [row] = await d.query(`INSERT INTO cc_links (client_id, token) VALUES ($1, $2) RETURNING *`, [clientId, newToken()]);
  return asLink(row);
}

export async function revokeLinks(clientId: number): Promise<void> {
  await (await db()).query(`UPDATE cc_links SET revoked_at = now() WHERE client_id = $1 AND revoked_at IS NULL`, [clientId]);
}

/** The client a link opens, or null for a link that never existed or was switched off. */
export async function clientByToken(token: string): Promise<{ client: Client; link: Link } | null> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const [row] = await (await db()).query(
    `SELECT l.id AS link_id, l.token, l.created_at AS link_created, l.revoked_at, c.*
     FROM cc_links l JOIN cc_clients c ON c.id = l.client_id
     WHERE l.token = $1 AND l.revoked_at IS NULL`,
    [token],
  );
  if (!row) return null;
  return {
    client: asClient(row),
    link: asLink({ id: row.link_id, client_id: row.id, token: row.token, created_at: row.link_created, revoked_at: null }),
  };
}

// ---------------------------------------------------------------- events

export async function logEvent(input: {
  clientId: number;
  documentId?: number | null;
  kind: string;
  detail?: string;
  ip?: string;
  userAgent?: string;
  /** Skip it when the same kind was logged for the same document within this many minutes. */
  throttleMinutes?: number;
}): Promise<void> {
  const d = await db();
  if (input.throttleMinutes) {
    const [recent] = await d.query(
      `SELECT 1 FROM cc_events WHERE client_id = $1 AND kind = $2 AND document_id IS NOT DISTINCT FROM $3
       AND at > now() - make_interval(mins => $4) LIMIT 1`,
      [input.clientId, input.kind, input.documentId ?? null, input.throttleMinutes],
    );
    if (recent) return;
  }
  await d.query(
    `INSERT INTO cc_events (client_id, document_id, kind, detail, ip, user_agent) VALUES ($1, $2, $3, $4, $5, $6)`,
    [input.clientId, input.documentId ?? null, input.kind, input.detail ?? "", input.ip ?? "", input.userAgent ?? ""],
  );
}

export async function listEvents(clientId: number, limit = 60): Promise<Event[]> {
  const rows = await (await db()).query(
    `SELECT * FROM cc_events WHERE client_id = $1 ORDER BY at DESC, id DESC LIMIT $2`,
    [clientId, limit],
  );
  return rows.map((r) => ({
    id: int(r.id),
    documentId: r.document_id === null ? null : int(r.document_id),
    kind: String(r.kind),
    detail: String(r.detail),
    ip: String(r.ip),
    userAgent: String(r.user_agent),
    at: iso(r.at),
  }));
}

/** The events that belong on a document's signature certificate, oldest first. */
export async function documentTrail(clientId: number, documentId: number): Promise<Event[]> {
  const rows = await (await db()).query(
    `SELECT * FROM cc_events WHERE client_id = $1 AND (document_id = $2 OR kind = 'link_created')
     ORDER BY at, id`,
    [clientId, documentId],
  );
  return rows.map((r) => ({
    id: int(r.id),
    documentId: r.document_id === null ? null : int(r.document_id),
    kind: String(r.kind),
    detail: String(r.detail),
    ip: String(r.ip),
    userAgent: String(r.user_agent),
    at: iso(r.at),
  }));
}
