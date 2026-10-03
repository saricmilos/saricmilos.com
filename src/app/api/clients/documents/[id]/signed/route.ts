import { isAdmin } from "@/lib/clients/auth";
import { signedPdf } from "@/lib/clients/certificate";
import { notFound, pdfResponse } from "@/lib/clients/pdf-response";
import { documentBytes, documentTrail, getClient, getDocument, signaturesFor } from "@/lib/clients/store";

// A document with its signature certificate as it stands, for the admin (even before the
// client has signed: the certificate then says so).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return notFound();
  const doc = await getDocument(Number((await ctx.params).id));
  if (!doc) return notFound();
  const client = await getClient(doc.clientId);
  const original = await documentBytes(doc.id);
  if (!client || !original) return notFound();
  const bytes = await signedPdf({
    original,
    doc,
    client,
    signatures: await signaturesFor([doc.id]),
    trail: await documentTrail(client.id, doc.id),
  });
  return pdfResponse(bytes, doc.title, { suffix: client.lang === "en" ? "signed" : "potpisano" });
}
