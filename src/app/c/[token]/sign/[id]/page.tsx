import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Brand from "@/components/clients/Brand";
import { formatWhen, strings } from "@/lib/clients/i18n";
import { clientByToken, getDocument, signaturesFor } from "@/lib/clients/store";
import SignForm from "./SignForm";

type Props = { params: Promise<{ token: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await clientByToken((await params).token);
  const t = strings(found?.client.lang ?? "sr");
  return { title: { absolute: `${t.signingTitle} · Miloš Sarić` } };
}

export default async function SignPage({ params }: Props) {
  const { token, id } = await params;
  const found = await clientByToken(token);
  if (!found) notFound();
  const { client } = found;
  const t = strings(client.lang);
  const doc = await getDocument(Number(id));
  if (!doc || doc.clientId !== client.id || !doc.needsSignature) notFound();
  const signed = (await signaturesFor([doc.id])).find((s) => s.role === "client");
  const base = `/c/${token}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-10 pb-20 md:pt-14">
      <Brand caption={client.company ? `${t.centre} · ${client.company}` : t.centre} />
      <a
        href={base}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 dark:text-indigo-300 dark:hover:text-indigo-100"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
        {t.back}
      </a>

      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{t.signingTitle}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">{doc.title}</h1>

      {signed ? (
        <p className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" strokeWidth={2.25} />
          {t.alreadySigned} {t.signedBy(signed.name, formatWhen(signed.signedAt, client.lang))}
        </p>
      ) : (
        <SignForm
          token={token}
          lang={client.lang}
          doc={{ id: doc.id, confirmations: doc.confirmations, remarks: doc.remarks }}
          pdfUrl={`${base}/documents/${doc.id}`}
          defaultName={client.name}
        />
      )}
    </div>
  );
}
