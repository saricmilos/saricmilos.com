import type { NextRequest } from "next/server";
import { notFound, pdfResponse } from "@/lib/clients/pdf-response";
import { visitorFrom } from "@/lib/clients/request";
import { clientByToken, documentBytes, getDocument, logEvent } from "@/lib/clients/store";

// One of the client's documents, as uploaded. Only through a live link, and only that client's.
export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await ctx.params;
  const found = await clientByToken(token);
  if (!found) return notFound();
  const doc = await getDocument(Number(id));
  if (!doc || doc.clientId !== found.client.id) return notFound();
  const bytes = await documentBytes(doc.id);
  if (!bytes) return notFound();
  const v = visitorFrom(req.headers);
  if (!v.bot) {
    await logEvent({ clientId: found.client.id, documentId: doc.id, kind: "viewed", ip: v.ip, userAgent: v.ua, throttleMinutes: 30 });
  }
  return pdfResponse(bytes, doc.title, { download: req.nextUrl.searchParams.has("download") });
}
