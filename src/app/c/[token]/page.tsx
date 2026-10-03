import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, FileText, Mail, PenLine, Phone, ShieldCheck } from "lucide-react";
import Brand from "@/components/clients/Brand";
import { firstName, formatWhen, strings } from "@/lib/clients/i18n";
import { visitor } from "@/lib/clients/request";
import { clientByToken, listDocuments, logEvent, signaturesFor } from "@/lib/clients/store";

type Props = { params: Promise<{ token: string }>; searchParams: Promise<{ signed?: string }> };

const CONTACT = { email: "milossaric@outlook.com", phone: "+381 62 948 8846", tel: "+381629488846" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await clientByToken((await params).token);
  const t = strings(found?.client.lang ?? "sr");
  // A generic title: a chat app's link preview shows it, so no client's name goes in it.
  return { title: { absolute: `${t.centre} · Miloš Sarić` } };
}

const badge = {
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
  green: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200",
};

const button =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";
const primary = `${button} bg-[#2B44C7] text-white hover:bg-[#2338a6]`;
const secondary = `${button} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800`;

export default async function ClientPortal({ params, searchParams }: Props) {
  const { token } = await params;
  const { signed } = await searchParams;
  const found = await clientByToken(token);
  if (!found) notFound();
  const { client } = found;
  const t = strings(client.lang);

  const v = await visitor();
  if (!v.bot) await logEvent({ clientId: client.id, kind: "opened", ip: v.ip, userAgent: v.ua, throttleMinutes: 30 });

  const docs = await listDocuments(client.id);
  const signatures = await signaturesFor(docs.map((d) => d.id));
  const mine = (id: number) => signatures.find((s) => s.documentId === id && s.role === "client");
  const providerSigned = (id: number) => signatures.some((s) => s.documentId === id && s.role === "provider");
  const toSign = docs.filter((d) => d.needsSignature);
  const done = toSign.filter((d) => mine(d.id)).length;
  const base = `/c/${token}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-10 pb-20 md:pt-14">
      <Brand caption={client.company ? `${t.centre} · ${client.company}` : t.centre} />

      <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
        {t.greeting(firstName(client.name))}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">{t.intro}</p>

      {toSign.length > 0 && (
        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>{t.progress(done, toSign.length)}</span>
            {done === toSign.length && <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2.25} />}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-[#2B44C7] transition-all" style={{ width: `${(done / toSign.length) * 100}%` }} />
          </div>
        </div>
      )}

      {signed && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" strokeWidth={2.25} />
          {t.thanks}
        </p>
      )}

      <h2 className="mt-12 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{t.documents}</h2>
      {docs.length === 0 && <p className="mt-4 text-slate-600 dark:text-slate-300">{t.noDocuments}</p>}

      <ol className="mt-4 grid gap-3">
        {docs.map((doc, i) => {
          const sig = mine(doc.id);
          const state = !doc.needsSignature ? "read" : sig ? "signed" : "sign";
          return (
            <li
              key={doc.id}
              id={`doc-${doc.id}`}
              className="scroll-mt-6 rounded-2xl border border-indigo-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-slate-900/60"
            >
              <div className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-sm text-[#2B44C7] dark:text-indigo-300">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">{doc.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${state === "sign" ? badge.amber : state === "signed" ? badge.green : badge.slate}`}
                    >
                      {state === "sign" ? t.toSign : state === "signed" ? t.signed : t.toRead}
                    </span>
                  </div>
                  {sig && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {t.signedBy(sig.name, formatWhen(sig.signedAt, client.lang))}
                      {!providerSigned(doc.id) && <span className="text-amber-700 dark:text-amber-300"> · {t.waitingForMe}</span>}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {state === "sign" && (
                      <a href={`${base}/sign/${doc.id}`} className={primary}>
                        <PenLine className="h-4 w-4" strokeWidth={2.25} />
                        {t.sign}
                      </a>
                    )}
                    {state === "signed" ? (
                      <a href={`${base}/documents/${doc.id}/signed`} target="_blank" rel="noopener" className={primary}>
                        <Download className="h-4 w-4" strokeWidth={2.25} />
                        {t.downloadSigned}
                      </a>
                    ) : (
                      <a href={`${base}/documents/${doc.id}`} target="_blank" rel="noopener" className={secondary}>
                        <FileText className="h-4 w-4" strokeWidth={2.25} />
                        {t.open}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{t.questions}</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-[#2B44C7] dark:hover:text-indigo-300">
            <Mail className="h-4 w-4" strokeWidth={2} />
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.tel}`} className="inline-flex items-center gap-2 hover:text-[#2B44C7] dark:hover:text-indigo-300">
            <Phone className="h-4 w-4" strokeWidth={2} />
            {CONTACT.phone}
          </a>
        </div>
        <p className="mt-6 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
          {t.privateNote}
        </p>
      </footer>
    </div>
  );
}
