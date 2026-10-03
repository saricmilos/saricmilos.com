"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Check, Copy, LogIn, PenLine, Plus } from "lucide-react";
import SignaturePad from "@/components/clients/SignaturePad";
import { createClientAction, signAsProviderAction, signInAction, type FormState } from "./actions";

// The admin pages' interactive pieces. Everything else on them is rendered on the server.

export const field =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";
export const label = "block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";
export const primary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B44C7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2338a6] disabled:opacity-50";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
      <AlertCircle className="h-4 w-4 flex-shrink-0" strokeWidth={2.25} />
      {message}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signInAction, {});
  return (
    <form action={action} className="mt-8 max-w-sm">
      <label htmlFor="password" className={label}>
        Password
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className={field} />
      <button type="submit" disabled={pending} className={`${primary} mt-4`}>
        <LogIn className="h-4 w-4" strokeWidth={2.25} />
        Sign in
      </button>
      <ErrorText message={state.error} />
    </form>
  );
}

export function NewClientForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createClientAction, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className={label}>
          Name
        </label>
        <input id="name" name="name" required className={field} placeholder="Danijela Burlica" />
      </div>
      <div>
        <label htmlFor="company" className={label}>
          Company / project
        </label>
        <input id="company" name="company" className={field} placeholder="MateMAGIJA" />
      </div>
      <div>
        <label htmlFor="email" className={label}>
          E-mail
        </label>
        <input id="email" name="email" type="email" className={field} />
      </div>
      <div>
        <label htmlFor="phone" className={label}>
          Phone
        </label>
        <input id="phone" name="phone" className={field} placeholder="+381 …" />
      </div>
      <div>
        <label htmlFor="lang" className={label}>
          Language of their page
        </label>
        <select id="lang" name="lang" defaultValue="sr" className={field}>
          <option value="sr">Srpski (latinica)</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" disabled={pending} className={primary}>
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          Add client
        </button>
      </div>
      <div className="sm:col-span-2">
        <ErrorText message={state.error} />
      </div>
    </form>
  );
}

export function CopyButton({ value, children }: { value: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={primary}
    >
      {copied ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2.25} />}
      {copied ? "Copied" : children ?? "Copy link"}
    </button>
  );
}

/** A submit button that asks first: for deleting, switching off, clearing. */
export function ConfirmSubmit({ question, className, children }: { question: string; className: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(question)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function ProviderSignForm({ documentId }: { documentId: number }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signAsProviderAction, {});
  const [signature, setSignature] = useState<string | null>(null);
  return (
    <form action={action} className="mt-3 grid gap-3">
      <input type="hidden" name="id" value={documentId} />
      <input type="hidden" name="signature" value={signature ?? ""} />
      <div>
        <label className={label} htmlFor={`pname-${documentId}`}>
          Your name, as it goes on the certificate
        </label>
        <input id={`pname-${documentId}`} name="name" defaultValue="Miloš Sarić" required className={field} />
      </div>
      <SignaturePad onChange={setSignature} clearLabel="Clear" ariaLabel="Your signature" />
      <div>
        <button type="submit" disabled={pending || !signature} className={primary}>
          <PenLine className="h-4 w-4" strokeWidth={2.25} />
          {pending ? "Signing…" : "Sign as provider"}
        </button>
      </div>
      <ErrorText message={state.error} />
    </form>
  );
}
