// A PDF for the browser to show (or save), never cached by anyone in between.
export function pdfResponse(bytes: Uint8Array, title: string, opts: { suffix?: string; download?: boolean } = {}): Response {
  const name = `${title}${opts.suffix ? ` - ${opts.suffix}` : ""}.pdf`;
  const ascii = name
    .normalize("NFKD")
    .replace(/đ/g, "dj")
    .replace(/Đ/g, "Dj")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/["\\]/g, "");
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(bytes.length),
      "Content-Disposition": `${opts.download ? "attachment" : "inline"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const notFound = () =>
  new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
