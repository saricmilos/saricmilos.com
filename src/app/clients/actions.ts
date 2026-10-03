"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, signIn, signOut } from "@/lib/clients/auth";
import { visitor } from "@/lib/clients/request";
import { validSignature } from "@/lib/clients/signature";
import {
  addSignature,
  clearSignatures,
  createClient,
  createLink,
  deleteClient,
  deleteDocument,
  documentBytes,
  getDocument,
  logEvent,
  moveDocument,
  revokeLinks,
  sha256,
  updateClient,
  updateDocument,
  type ClientInput,
} from "@/lib/clients/store";

// Every action here is a public endpoint as far as the network is concerned, so each one
// checks the admin session first, whatever page its form sits on.

export type FormState = { error?: string };

const text = (form: FormData, key: string, max = 200) => String(form.get(key) ?? "").trim().slice(0, max);
const id = (form: FormData, key = "id") => Number(form.get(key));

function clientInput(form: FormData): ClientInput {
  return {
    name: text(form, "name", 120),
    company: text(form, "company", 120),
    email: text(form, "email", 160),
    phone: text(form, "phone", 40),
    lang: form.get("lang") === "en" ? "en" : "sr",
  };
}

export async function signInAction(_: FormState, form: FormData): Promise<FormState> {
  const v = await visitor();
  const result = await signIn(String(form.get("password") ?? ""), v.ip);
  if (result === "locked") return { error: "Too many wrong tries. Wait 15 minutes." };
  if (result === "off") return { error: "CLIENTS_PASSWORD is not set on this deployment." };
  if (result === "wrong") return { error: "Wrong password." };
  redirect("/clients");
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect("/clients");
}

export async function createClientAction(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const input = clientInput(form);
  if (!input.name) return { error: "A client needs a name." };
  const clientId = await createClient(input);
  redirect(`/clients/${clientId}`);
}

export async function updateClientAction(form: FormData): Promise<void> {
  await requireAdmin();
  const input = clientInput(form);
  if (!input.name) return;
  await updateClient(id(form), input);
  revalidatePath(`/clients/${id(form)}`);
}

export async function deleteClientAction(form: FormData): Promise<void> {
  await requireAdmin();
  await deleteClient(id(form));
  redirect("/clients");
}

export async function createLinkAction(form: FormData): Promise<void> {
  await requireAdmin();
  const clientId = id(form);
  await createLink(clientId);
  const v = await visitor();
  await logEvent({ clientId, kind: "link_created", ip: v.ip, userAgent: v.ua });
  revalidatePath(`/clients/${clientId}`);
}

export async function revokeLinkAction(form: FormData): Promise<void> {
  await requireAdmin();
  const clientId = id(form);
  await revokeLinks(clientId);
  await logEvent({ clientId, kind: "link_revoked" });
  revalidatePath(`/clients/${clientId}`);
}

export async function updateDocumentAction(form: FormData): Promise<void> {
  await requireAdmin();
  const doc = await getDocument(id(form));
  if (!doc) return;
  await updateDocument(doc.id, {
    title: text(form, "title", 200) || doc.title,
    needsSignature: form.get("needsSignature") === "on",
    confirmations: String(form.get("confirmations") ?? "").slice(0, 5000),
    remarks: form.get("remarks") === "on",
  });
  revalidatePath(`/clients/${doc.clientId}`);
}

export async function moveDocumentAction(form: FormData): Promise<void> {
  await requireAdmin();
  const doc = await getDocument(id(form));
  if (!doc) return;
  await moveDocument(doc.id, form.get("direction") === "up" ? -1 : 1);
  revalidatePath(`/clients/${doc.clientId}`);
}

export async function deleteDocumentAction(form: FormData): Promise<void> {
  await requireAdmin();
  const doc = await getDocument(id(form));
  if (!doc) return;
  await deleteDocument(doc.id);
  await logEvent({ clientId: doc.clientId, kind: "document_deleted", detail: doc.title });
  revalidatePath(`/clients/${doc.clientId}`);
}

export async function clearSignaturesAction(form: FormData): Promise<void> {
  await requireAdmin();
  const doc = await getDocument(id(form));
  if (!doc) return;
  await clearSignatures(doc.id);
  await logEvent({ clientId: doc.clientId, documentId: doc.id, kind: "signatures_cleared" });
  revalidatePath(`/clients/${doc.clientId}`);
}

/** Milos signs as the provider, from the admin page. */
export async function signAsProviderAction(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const doc = await getDocument(id(form));
  if (!doc || !doc.needsSignature) return { error: "This document isn't set to be signed." };
  const name = text(form, "name", 120);
  const image = String(form.get("signature") ?? "");
  if (!name) return { error: "Enter your name." };
  if (!validSignature(image)) return { error: "Sign in the box first." };
  const bytes = await documentBytes(doc.id);
  if (!bytes) return { error: "The document is gone." };
  const v = await visitor();
  const result = await addSignature({
    documentId: doc.id,
    role: "provider",
    name,
    image,
    confirmations: [],
    remarks: "",
    docSha256: sha256(bytes),
    ip: v.ip,
    userAgent: v.ua,
  });
  if (result === "already") return { error: "Already signed." };
  await logEvent({ clientId: doc.clientId, documentId: doc.id, kind: "signed", detail: "provider", ip: v.ip, userAgent: v.ua });
  revalidatePath(`/clients/${doc.clientId}`);
  return {};
}
