import type { NextRequest } from "next/server";
import { isAdmin } from "@/lib/clients/auth";
import { addDocument, getClient, logEvent } from "@/lib/clients/store";

// A PDF from the admin page's upload form. A route and not a server action because a PDF
// is bigger than a server action's 1 MB; Vercel's own limit on a request is 4.5 MB.
const MAX = 4 * 1024 * 1024;

const back = (req: NextRequest, path: string) => Response.redirect(new URL(path, req.nextUrl.origin), 303);
const fail = (message: string, status = 400) =>
  new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return fail("Not signed in", 401);
  // The session cookie is SameSite=Lax, and this checks the form came from this site.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return fail("Wrong origin", 403);

  const form = await req.formData();
  const client = await getClient(Number(form.get("clientId")));
  if (!client) return fail("No such client", 404);
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a PDF to upload.");
  if (file.size > MAX) return fail("The PDF is over 4 MB.");
  const pdf = Buffer.from(await file.arrayBuffer());
  if (pdf.subarray(0, 5).toString("latin1") !== "%PDF-") return fail("That file isn't a PDF.");

  const filename = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || "document.pdf";
  const fromName = filename.replace(/\.pdf$/i, "").replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  const title = String(form.get("title") ?? "").trim().slice(0, 200) || fromName || "Dokument";
  const id = await addDocument(client.id, {
    title,
    filename,
    pdf,
    needsSignature: form.get("needsSignature") === "on",
    confirmations: String(form.get("confirmations") ?? "").slice(0, 5000),
    remarks: form.get("remarks") === "on",
  });
  await logEvent({ clientId: client.id, documentId: id, kind: "document_added" });
  return back(req, `/clients/${client.id}#documents`);
}
