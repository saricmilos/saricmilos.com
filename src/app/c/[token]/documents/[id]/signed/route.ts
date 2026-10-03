import type { NextRequest } from "next/server";
import { signedPdf } from "@/lib/clients/certificate";
import { notFound, pdfResponse } from "@/lib/clients/pdf-response";
import { clientByToken, documentBytes, documentTrail, getDocument, signaturesFor } from "@/lib/clients/store";

// The document with its signature certificate, once the client has signed it.
export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await ctx.params;
  const found = await clientByToken(token);
  if (!found) return notFound();
  const doc = await getDocument(Number(id));
  if (!doc || doc.clientId !== found.client.id || !doc.needsSignature) return notFound();
  const signatures = await signaturesFor([doc.id]);
  if (!signatures.some((s) => s.role === "client")) return notFound();
  const original = await documentBytes(doc.id);
  if (!original) return notFound();
  const bytes = await signedPdf({
    original,
    doc,
    client: found.client,
    signatures,
    trail: await documentTrail(found.client.id, doc.id),
  });
  const suffix = found.client.lang === "en" ? "signed" : "potpisano";
  return pdfResponse(bytes, doc.title, { suffix, download: req.nextUrl.searchParams.has("download") });
}
