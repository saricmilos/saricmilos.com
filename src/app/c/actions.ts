"use server";

import { redirect } from "next/navigation";
import { strings } from "@/lib/clients/i18n";
import { visitor } from "@/lib/clients/request";
import { validSignature } from "@/lib/clients/signature";
import { addSignature, clientByToken, documentBytes, getDocument, logEvent, sha256 } from "@/lib/clients/store";

export type SignState = { error?: string };

/** The client signs one of their documents, through their link. */
export async function signAsClient(_: SignState, form: FormData): Promise<SignState> {
  const token = String(form.get("token") ?? "");
  const found = await clientByToken(token);
  if (!found) return { error: strings("sr").errGone };
  const { client } = found;
  const t = strings(client.lang);

  const doc = await getDocument(Number(form.get("doc")));
  if (!doc || doc.clientId !== client.id || !doc.needsSignature) return { error: t.errGone };

  const name = String(form.get("name") ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const image = String(form.get("signature") ?? "");
  if (!name) return { error: t.errName };
  if (!validSignature(image)) return { error: t.errSignature };
  if (form.get("consent") !== "on") return { error: t.errConsent };

  const bytes = await documentBytes(doc.id);
  if (!bytes) return { error: t.errFailed };
  const v = await visitor();
  const result = await addSignature({
    documentId: doc.id,
    role: "client",
    name,
    image,
    confirmations: doc.confirmations.filter((_, i) => form.get(`c${i}`) === "on"),
    remarks: doc.remarks ? String(form.get("remarks") ?? "").trim().slice(0, 2000) : "",
    docSha256: sha256(bytes),
    ip: v.ip,
    userAgent: v.ua,
  });
  if (result === "already") return { error: t.alreadySigned };
  await logEvent({ clientId: client.id, documentId: doc.id, kind: "signed", detail: "client", ip: v.ip, userAgent: v.ua });
  redirect(`/c/${token}?signed=${doc.id}#doc-${doc.id}`);
}
