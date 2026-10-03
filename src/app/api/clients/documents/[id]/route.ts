import { isAdmin } from "@/lib/clients/auth";
import { notFound, pdfResponse } from "@/lib/clients/pdf-response";
import { documentBytes, getDocument } from "@/lib/clients/store";

// A document as uploaded, for the admin.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return notFound();
  const doc = await getDocument(Number((await ctx.params).id));
  const bytes = doc && (await documentBytes(doc.id));
  if (!doc || !bytes) return notFound();
  return pdfResponse(bytes, doc.title);
}
