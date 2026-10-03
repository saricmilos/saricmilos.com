// The sender's mark at the top of every client-centre page: the same monogram and blue
// as the documents themselves (client-agreements' clientdoc class), so the page and the
// PDFs read as one set.
export default function Brand({ caption }: { caption: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#2B44C7] text-sm font-bold tracking-wide text-white shadow-sm">
        MS
      </span>
      <div className="leading-tight">
        <p className="text-base font-bold text-slate-900 dark:text-slate-100">Miloš Sarić</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{caption}</p>
      </div>
    </div>
  );
}
