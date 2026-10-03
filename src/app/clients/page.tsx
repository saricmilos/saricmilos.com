import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";
import Brand from "@/components/clients/Brand";
import { isAdmin } from "@/lib/clients/auth";
import { formatWhen } from "@/lib/clients/i18n";
import { listClients } from "@/lib/clients/store";
import { signOutAction } from "./actions";
import { LoginForm, NewClientForm } from "./ui";

const card =
  "rounded-2xl border border-indigo-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-indigo-400/20 dark:bg-slate-900/60";

export default async function ClientsPage() {
  if (!(await isAdmin())) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-20">
        <Brand caption="Client centre" />
        <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Sign in</h1>
        <LoginForm />
      </div>
    );
  }

  const clients = await listClients();
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-20">
      <div className="flex items-center justify-between gap-4">
        <Brand caption="Client centre" />
        <form action={signOutAction}>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>
        </form>
      </div>

      <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Clients</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Each client gets one private link to their documents, where they read and sign them.
      </p>

      <section className={`${card} mt-8`}>
        <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">New client</h2>
        <NewClientForm />
      </section>

      <ul className="mt-8 grid gap-3">
        {clients.map((c) => (
          <li key={c.id}>
            <Link href={`/clients/${c.id}`} className={`${card} flex items-center gap-4 transition-colors hover:border-indigo-400`}>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {c.name}
                  {c.company && <span className="font-normal text-slate-500 dark:text-slate-400"> · {c.company}</span>}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {c.documents} document{c.documents === 1 ? "" : "s"}
                  {c.toSign > 0 && ` · ${c.signed} of ${c.toSign} fully signed`}
                  {` · link ${c.linkLive ? "on" : "off"}`}
                  {c.lastActivity && ` · last activity ${formatWhen(c.lastActivity, "en")}`}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </Link>
          </li>
        ))}
      </ul>
      {clients.length === 0 && <p className="mt-6 text-slate-600 dark:text-slate-400">No clients yet.</p>}
    </div>
  );
}
