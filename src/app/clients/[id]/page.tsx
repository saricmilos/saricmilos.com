import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  Link2Off,
  Mail,
  MessageCircle,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import Brand from "@/components/clients/Brand";
import { isAdmin } from "@/lib/clients/auth";
import { firstName, formatWhen } from "@/lib/clients/i18n";
import { deviceName } from "@/lib/clients/request";
import { getClient, listDocuments, listEvents, liveLink, signaturesFor, type Client } from "@/lib/clients/store";
import {
  clearSignaturesAction,
  createLinkAction,
  deleteClientAction,
  deleteDocumentAction,
  moveDocumentAction,
  revokeLinkAction,
  updateClientAction,
  updateDocumentAction,
} from "../actions";
import { ConfirmSubmit, CopyButton, ProviderSignForm, field, label, primary } from "../ui";

type Props = { params: Promise<{ id: string }> };

const card =
  "rounded-2xl border border-indigo-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-slate-900/60";
const heading = "text-xs font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400";
const quiet =
  "inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800";
const danger =
  "inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-400/40 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-400/10";

const EVENTS: Record<string, string> = {
  link_created: "Link created",
  link_revoked: "Link switched off",
  opened: "Opened their page",
  viewed: "Opened a document",
  signed: "Signed",
  document_added: "Document added",
  document_deleted: "Document deleted",
  signatures_cleared: "Signatures cleared",
};

/** The message that goes with the link, in the client's language. */
function invitation(client: Client, url: string): string {
  const first = firstName(client.name);
  if (client.lang === "en") {
    return `Hi ${first},\n\nhere are the documents for ${client.company || "your project"}. You can read them and sign the ones that need signing in one place, on your phone or computer:\n\n${url}\n\nThe link is only for you, so please don't forward it.\n\nMiloš`;
  }
  return `Zdravo ${first},\n\novde su dokumenti za ${client.company || "Vaš projekat"}. Na istom mestu možete da ih pročitate i da potpišete one koje treba, na telefonu ili računaru:\n\n${url}\n\nLink je samo za Vas, molim Vas da ga ne prosleđujete.\n\nMiloš`;
}

export default async function ClientAdminPage({ params }: Props) {
  if (!(await isAdmin())) notFound();
  const client = await getClient(Number((await params).id));
  if (!client) notFound();

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const link = await liveLink(client.id);
  const url = link ? `${origin}/c/${link.token}` : null;
  const docs = await listDocuments(client.id);
  const signatures = await signaturesFor(docs.map((d) => d.id));
  const events = await listEvents(client.id);
  const title = (id: number | null) => docs.find((d) => d.id === id)?.title;
  const message = url ? invitation(client, url) : "";
  const phoneDigits = client.phone.replace(/\D/g, "");

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24">
      <Brand caption="Client centre" />
      <Link href="/clients" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100">
        <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
        All clients
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        {client.name}
        {client.company && <span className="font-normal text-slate-500 dark:text-slate-400"> · {client.company}</span>}
      </h1>

      {/* ------------------------------------------------------------ the private link */}
      <section className={`${card} mt-8`}>
        <h2 className={heading}>Private link</h2>
        {url ? (
          <>
            <input readOnly value={url} aria-label="Private link" className={`${field} mt-3 font-mono text-xs`} />
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton value={url} />
              <CopyButton value={message}>Copy link with message</CopyButton>
              <a href={url} target="_blank" rel="noreferrer" className={quiet}>
                <ExternalLink className="h-4 w-4" strokeWidth={2} />
                Open as the client
              </a>
              {client.email && (
                <a
                  href={`mailto:${client.email}?subject=${encodeURIComponent(client.company || "Dokumenti")}&body=${encodeURIComponent(message)}`}
                  className={quiet}
                >
                  <Mail className="h-4 w-4" strokeWidth={2} />
                  E-mail
                </a>
              )}
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className={quiet}>
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  WhatsApp
                </a>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Made {formatWhen(link!.createdAt, "en")}. Anyone with this link sees this client&apos;s documents, so send it only to them.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={createLinkAction}>
                <input type="hidden" name="id" value={client.id} />
                <ConfirmSubmit question="Make a new link? The current one stops working at once." className={quiet}>
                  <RefreshCw className="h-4 w-4" strokeWidth={2} />
                  New link
                </ConfirmSubmit>
              </form>
              <form action={revokeLinkAction}>
                <input type="hidden" name="id" value={client.id} />
                <ConfirmSubmit question="Switch the link off? The client can't open their page until you make a new one." className={danger}>
                  <Link2Off className="h-4 w-4" strokeWidth={2} />
                  Switch off
                </ConfirmSubmit>
              </form>
            </div>
          </>
        ) : (
          <form action={createLinkAction} className="mt-3">
            <input type="hidden" name="id" value={client.id} />
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">No live link. Make one when the documents are ready.</p>
            <button type="submit" className={primary}>
              Create link
            </button>
          </form>
        )}
      </section>

      {/* ------------------------------------------------------------ documents */}
      <section id="documents" className={`${card} mt-6 scroll-mt-6`}>
        <h2 className={heading}>Documents</h2>

        <form action="/api/clients/upload" method="post" encType="multipart/form-data" className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 dark:bg-slate-800/50">
          <input type="hidden" name="clientId" value={client.id} />
          <div className="sm:col-span-2">
            <label htmlFor="file" className={label}>
              PDF (up to 4 MB)
            </label>
            <input id="file" name="file" type="file" accept="application/pdf" required className={`${field} file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-indigo-800`} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="title" className={label}>
              Title the client sees (empty: from the file name)
            </label>
            <input id="title" name="title" className={field} placeholder="Ugovor o izradi i održavanju veb-sajta" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
            <input type="checkbox" name="needsSignature" className="h-4 w-4 accent-[#2B44C7]" />
            Both of us sign it
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
            <input type="checkbox" name="remarks" className="h-4 w-4 accent-[#2B44C7]" />
            Client may add remarks when signing
          </label>
          <div className="sm:col-span-2">
            <label htmlFor="confirmations" className={label}>
              Lines the client ticks when signing (one per line, optional)
            </label>
            <textarea id="confirmations" name="confirmations" rows={3} className={field} placeholder={"Primila sam Google nalog i promenila lozinku\nDomen je na mom nalogu"} />
          </div>
          <div>
            <button type="submit" className={primary}>
              <Upload className="h-4 w-4" strokeWidth={2.25} />
              Upload
            </button>
          </div>
        </form>

        <ol className="mt-6 grid gap-4">
          {docs.map((doc, i) => {
            const provider = signatures.find((s) => s.documentId === doc.id && s.role === "provider");
            const mine = signatures.find((s) => s.documentId === doc.id && s.role === "client");
            const anySigned = Boolean(provider || mine);
            return (
              <li key={doc.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="mt-0.5 font-mono text-sm text-[#2B44C7] dark:text-indigo-300">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {doc.filename} · {(doc.size / 1024).toFixed(0)} KB · SHA-256 {doc.sha256.slice(0, 12)}… · added {formatWhen(doc.createdAt, "en", false)}
                    </p>
                    {doc.needsSignature ? (
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        {[
                          ["You", provider],
                          ["Client", mine],
                        ].map(([who, sig]) => (
                          <span key={who as string} className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            {sig ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={2.25} />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-400" strokeWidth={2} />
                            )}
                            {who as string}:{" "}
                            {sig && typeof sig === "object" ? `${sig.name}, ${formatWhen(sig.signedAt, "en")}` : "not signed"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">To read, no signatures.</p>
                    )}
                    {mine && (mine.confirmations.length > 0 || mine.remarks) && (
                      <div className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                        {mine.confirmations.map((c) => (
                          <p key={c}>✓ {c}</p>
                        ))}
                        {mine.remarks && <p className="mt-1">Remarks: {mine.remarks}</p>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {(["up", "down"] as const).map((direction) => (
                      <form key={direction} action={moveDocumentAction}>
                        <input type="hidden" name="id" value={doc.id} />
                        <input type="hidden" name="direction" value={direction} />
                        <button
                          type="submit"
                          aria-label={`Move ${direction}`}
                          disabled={direction === "up" ? i === 0 : i === docs.length - 1}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                        >
                          {direction === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`/api/clients/documents/${doc.id}`} target="_blank" rel="noreferrer" className={quiet}>
                    <FileText className="h-4 w-4" strokeWidth={2} />
                    Open
                  </a>
                  {anySigned && (
                    <a href={`/api/clients/documents/${doc.id}/signed`} target="_blank" rel="noreferrer" className={quiet}>
                      <FileText className="h-4 w-4" strokeWidth={2} />
                      Signed PDF
                    </a>
                  )}
                  {anySigned && (
                    <form action={clearSignaturesAction}>
                      <input type="hidden" name="id" value={doc.id} />
                      <ConfirmSubmit question="Clear both signatures on this document? Both of you will have to sign again." className={danger}>
                        Clear signatures
                      </ConfirmSubmit>
                    </form>
                  )}
                  <form action={deleteDocumentAction}>
                    <input type="hidden" name="id" value={doc.id} />
                    <ConfirmSubmit question={`Delete „${doc.title}“${anySigned ? " and its signatures" : ""}?`} className={danger}>
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>

                {doc.needsSignature && !provider && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-indigo-700 dark:text-indigo-300">Sign as provider</summary>
                    <ProviderSignForm documentId={doc.id} />
                  </details>
                )}

                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">Settings</summary>
                  <form action={updateDocumentAction} className="mt-3 grid gap-3">
                    <input type="hidden" name="id" value={doc.id} />
                    <div>
                      <label className={label} htmlFor={`title-${doc.id}`}>
                        Title
                      </label>
                      <input id={`title-${doc.id}`} name="title" defaultValue={doc.title} className={field} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input type="checkbox" name="needsSignature" defaultChecked={doc.needsSignature} disabled={anySigned} className="h-4 w-4 accent-[#2B44C7]" />
                      Both of us sign it {anySigned && "(locked while signed)"}
                    </label>
                    {anySigned && doc.needsSignature && <input type="hidden" name="needsSignature" value="on" />}
                    <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                      <input type="checkbox" name="remarks" defaultChecked={doc.remarks} className="h-4 w-4 accent-[#2B44C7]" />
                      Client may add remarks
                    </label>
                    <div>
                      <label className={label} htmlFor={`conf-${doc.id}`}>
                        Lines the client ticks (one per line)
                      </label>
                      <textarea id={`conf-${doc.id}`} name="confirmations" rows={4} defaultValue={doc.confirmations.join("\n")} className={field} />
                    </div>
                    <div>
                      <button type="submit" className={primary}>
                        Save
                      </button>
                    </div>
                  </form>
                </details>
              </li>
            );
          })}
        </ol>
        {docs.length === 0 && <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">No documents yet.</p>}
      </section>

      {/* ------------------------------------------------------------ the client's details */}
      <section className={`${card} mt-6`}>
        <h2 className={heading}>Client details</h2>
        <form action={updateClientAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={client.id} />
          {(
            [
              ["name", "Name", client.name],
              ["company", "Company / project", client.company],
              ["email", "E-mail", client.email],
              ["phone", "Phone", client.phone],
            ] as const
          ).map(([name, text, value]) => (
            <div key={name}>
              <label htmlFor={`c-${name}`} className={label}>
                {text}
              </label>
              <input id={`c-${name}`} name={name} defaultValue={value} required={name === "name"} className={field} />
            </div>
          ))}
          <div>
            <label htmlFor="c-lang" className={label}>
              Language of their page
            </label>
            <select id="c-lang" name="lang" defaultValue={client.lang} className={field}>
              <option value="sr">Srpski (latinica)</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" className={primary}>
              Save
            </button>
          </div>
        </form>
        <form action={deleteClientAction} className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
          <input type="hidden" name="id" value={client.id} />
          <ConfirmSubmit question={`Delete ${client.name} with every document, signature and link? This can't be undone.`} className={danger}>
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            Delete client
          </ConfirmSubmit>
        </form>
      </section>

      {/* ------------------------------------------------------------ activity */}
      <section className={`${card} mt-6`}>
        <h2 className={heading}>Activity</h2>
        {events.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Nothing yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-700">
            {events.map((e) => (
              <li key={e.id} className="flex flex-wrap gap-x-3 py-2 text-slate-700 dark:text-slate-300">
                <span className="w-44 flex-shrink-0 text-slate-500 dark:text-slate-400">{formatWhen(e.at, "en")}</span>
                <span className="font-medium">
                  {EVENTS[e.kind] ?? e.kind}
                  {e.kind === "signed" && ` (${e.detail === "provider" ? "you" : "client"})`}
                </span>
                {title(e.documentId) && <span>{title(e.documentId)}</span>}
                {e.kind === "document_deleted" && e.detail && <span>{e.detail}</span>}
                {(e.ip || e.userAgent) && (
                  <span className="text-slate-500 dark:text-slate-400">
                    {[e.ip, e.userAgent && deviceName(e.userAgent)].filter(Boolean).join(" · ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
