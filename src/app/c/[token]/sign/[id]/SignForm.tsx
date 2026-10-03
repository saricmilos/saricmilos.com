"use client";

import { useActionState, useState } from "react";
import { AlertCircle, FileText, Info, PenLine } from "lucide-react";
import SignaturePad from "@/components/clients/SignaturePad";
import { strings } from "@/lib/clients/i18n";
import type { Lang } from "@/lib/clients/store";
import { signAsClient, type SignState } from "../../../actions";

type Props = {
  token: string;
  lang: Lang;
  doc: { id: number; confirmations: string[]; remarks: boolean };
  pdfUrl: string;
  defaultName: string;
};

const step = "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2B44C7] text-sm font-bold text-white";
const card =
  "rounded-2xl border border-indigo-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-slate-900/60";
const field =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

export default function SignForm({ token, lang, doc, pdfUrl, defaultName }: Props) {
  const t = strings(lang);
  const [state, action, pending] = useActionState<SignState, FormData>(signAsClient, {});
  const [signature, setSignature] = useState<string | null>(null);
  let n = 1;

  return (
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="doc" value={doc.id} />
      <input type="hidden" name="signature" value={signature ?? ""} />

      <section className={card}>
        <div className="flex items-start gap-3">
          <span className={step}>{n++}</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-slate-900 dark:text-slate-100">{t.step1}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.step1Hint}</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <FileText className="h-4 w-4" strokeWidth={2.25} />
              {t.open}
            </a>
          </div>
        </div>
        {/* Phones show only a PDF's first page in a frame, so there the button is the way in. */}
        <iframe src={pdfUrl} title={t.step1} className="mt-4 hidden h-[70vh] w-full rounded-xl border border-slate-200 bg-white md:block dark:border-slate-700" />
      </section>

      {doc.confirmations.length > 0 && (
        <section className={card}>
          <div className="flex items-start gap-3">
            <span className={step}>{n++}</span>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">{t.confirmationsTitle}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.confirmationsHint}</p>
              <div className="mt-3 grid gap-2">
                {doc.confirmations.map((line, i) => (
                  <label key={i} className="flex items-start gap-3 rounded-xl px-2 py-1.5 text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60">
                    <input type="checkbox" name={`c${i}`} className="mt-1 h-4 w-4 accent-[#2B44C7]" />
                    <span>{line}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {doc.remarks && (
        <section className={card}>
          <div className="flex items-start gap-3">
            <span className={step}>{n++}</span>
            <div className="min-w-0 flex-1">
              <label htmlFor="remarks" className="font-bold text-slate-900 dark:text-slate-100">
                {t.remarksTitle}
              </label>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.remarksHint}</p>
              <textarea id="remarks" name="remarks" rows={3} maxLength={2000} className={field} />
            </div>
          </div>
        </section>
      )}

      <section className={card}>
        <div className="flex items-start gap-3">
          <span className={step}>{n++}</span>
          <div className="min-w-0 flex-1">
            <label htmlFor="name" className="font-bold text-slate-900 dark:text-slate-100">
              {t.nameTitle}
            </label>
            <input id="name" name="name" defaultValue={defaultName} autoComplete="name" maxLength={120} required className={field} />

            <p className="mt-6 font-bold text-slate-900 dark:text-slate-100">{t.signatureTitle}</p>
            <p className="mt-1 mb-3 text-sm text-slate-600 dark:text-slate-400">{t.signatureHint}</p>
            <SignaturePad onChange={setSignature} clearLabel={t.clear} ariaLabel={t.signatureTitle} />

            <label className="mt-6 flex items-start gap-3 text-slate-800 dark:text-slate-200">
              <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[#2B44C7]" />
              <span className="font-medium">{t.consent}</span>
            </label>
          </div>
        </div>
      </section>

      {state.error && (
        <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900 dark:bg-red-400/10 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" strokeWidth={2.25} />
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending || !signature}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B44C7] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#2338a6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PenLine className="h-5 w-5" strokeWidth={2.25} />
          {pending ? t.submitting : t.submit}
        </button>
      </div>
      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={2} />
        {t.recorded}
      </p>
    </form>
  );
}
