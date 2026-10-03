import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatWhen, strings } from "./i18n";
import { deviceName } from "./request";
import type { Client, Doc, Event, Signature } from "./store";

// The signed PDF: the original document, untouched, with a signature certificate added
// after its last page. The certificate shows both signatures, when and from where each
// was given, what the client confirmed, and the original's SHA-256 fingerprint.
// Geist (the site's own font, OFL) is embedded because PDF's built-in fonts have no č, ć, đ.

const FONT = path.join(process.cwd(), "src/lib/clients/fonts/Geist-Regular.ttf");

const INK = rgb(0.08, 0.09, 0.13);
const TEXT = rgb(0.17, 0.18, 0.23);
const MUTED = rgb(0.4, 0.42, 0.48);
const LINE = rgb(0.88, 0.89, 0.92);
const TINT = rgb(0.96, 0.965, 0.98);
const ACCENT = rgb(0.169, 0.267, 0.78); // the documents' own accent, #2B44C7

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 56;
const BOTTOM = 64;

function wrap(font: PDFFont, text: string, size: number, width: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) {
        line = next;
        continue;
      }
      if (line) out.push(line);
      // A word wider than the line (a fingerprint) is cut where it overflows.
      let rest = word;
      while (font.widthOfTextAtSize(rest, size) > width) {
        let cut = rest.length;
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut--;
        out.push(rest.slice(0, cut));
        rest = rest.slice(cut);
      }
      line = rest;
    }
    out.push(line);
  }
  return out;
}

class Writer {
  page!: PDFPage;
  y = 0;
  constructor(
    private pdf: PDFDocument,
    private font: PDFFont,
    private header: string,
  ) {
    this.newPage();
  }

  newPage() {
    this.page = this.pdf.addPage(A4);
    const [w, h] = A4;
    this.page.drawRectangle({ x: 0, y: h - 3.2, width: w, height: 3.2, color: ACCENT });
    this.page.drawText(this.header, { x: MARGIN, y: h - 40, size: 8, font: this.font, color: MUTED });
    this.y = h - 72;
  }

  room(height: number) {
    if (this.y - height < BOTTOM) this.newPage();
  }

  text(content: string, opts: { size?: number; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number } = {}) {
    const size = opts.size ?? 9.5;
    const x = opts.x ?? MARGIN;
    const width = opts.width ?? A4[0] - MARGIN - x;
    const leading = size * 1.42;
    for (const line of wrap(this.font, content, size, width)) {
      this.room(leading);
      this.y -= leading;
      this.page.drawText(line, { x, y: this.y + size * 0.28, size, font: this.font, color: opts.color ?? TEXT });
    }
    this.y -= opts.gap ?? 0;
  }

  label(content: string) {
    this.room(28);
    this.y -= 10;
    this.text(content.toUpperCase(), { size: 7.5, color: MUTED, gap: 3 });
  }

  rule() {
    this.room(14);
    this.y -= 7;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: A4[0] - MARGIN, y: this.y },
      thickness: 0.6,
      color: LINE,
    });
    this.y -= 7;
  }
}

async function pngBytes(dataUrl: string): Promise<Uint8Array> {
  return Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
}

export async function signedPdf(input: {
  original: Buffer;
  doc: Doc;
  client: Client;
  signatures: Signature[];
  trail: Event[];
}): Promise<Uint8Array> {
  const { doc, client } = input;
  const t = strings(client.lang);
  const pdf = await PDFDocument.load(input.original, { updateMetadata: false });
  const pages = pdf.getPageCount();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await readFile(FONT), { subset: true });

  const w = new Writer(pdf, font, `Miloš Sarić · saricmilos.com · ${doc.title}`);

  w.text(t.certTitle, { size: 20, color: INK, gap: 4 });
  w.text(`${client.company ? `${client.company} · ` : ""}${client.name}`, { size: 10.5, color: MUTED, gap: 8 });

  w.label(t.certDocument);
  w.text(doc.title, { size: 11.5, color: INK });
  w.text(`${t.certFile}: ${doc.filename} · ${t.certPages}: ${pages}`, { size: 9, color: MUTED });
  w.label(t.certHash);
  w.text(doc.sha256, { size: 9, color: INK, gap: 4 });

  w.label(t.certSignatures);
  for (const role of ["provider", "client"] as const) {
    const sig = input.signatures.find((s) => s.role === role);
    w.rule();
    w.room(96);
    const top = w.y;
    const boxW = 190;
    const boxH = 72;
    w.page.drawRectangle({ x: MARGIN, y: top - boxH, width: boxW, height: boxH, color: TINT });
    if (sig) {
      const image = await pdf.embedPng(await pngBytes(sig.image));
      const scale = Math.min((boxW - 16) / image.width, (boxH - 12) / image.height);
      const iw = image.width * scale;
      const ih = image.height * scale;
      w.page.drawImage(image, { x: MARGIN + (boxW - iw) / 2, y: top - boxH + (boxH - ih) / 2, width: iw, height: ih });
    }
    // Details beside the box.
    const x = MARGIN + boxW + 18;
    w.y = top + 4;
    w.text((role === "provider" ? t.certProvider : t.certClient).toUpperCase(), { x, size: 7.5, color: MUTED });
    if (!sig) {
      w.text(t.certNotYet, { x, size: 10.5, color: MUTED });
      w.y = Math.min(w.y, top - boxH) - 4;
      continue;
    }
    w.text(sig.name, { x, size: 12, color: INK, gap: 2 });
    w.text(`${t.certSignedAt}: ${formatWhen(sig.signedAt, client.lang)} (Europe/Belgrade)`, { x, size: 9 });
    w.text(`${t.certIp}: ${sig.ip || "—"}`, { x, size: 9 });
    w.text(`${t.certDevice}: ${deviceName(sig.userAgent)}`, { x, size: 9 });
    w.text(`${t.certHash}: ${sig.docSha256 === doc.sha256 ? doc.sha256.slice(0, 16) + "…" : sig.docSha256}`, { x, size: 8, color: MUTED });
    w.y = Math.min(w.y, top - boxH) - 6;
    if (sig.confirmations.length) {
      w.text(`${t.certConfirmed}:`, { size: 9, color: MUTED });
      for (const line of sig.confirmations) w.text(`•  ${line}`, { size: 9, x: MARGIN + 10 });
    }
    if (doc.remarks || sig.remarks) {
      w.text(`${t.certRemarks}: ${sig.remarks || t.certNoRemarks}`, { size: 9, gap: 2 });
    }
  }

  const trail = input.trail.filter((e) => t.trail[e.kind === "signed" ? `signed_${e.detail}` : e.kind]);
  if (trail.length) {
    w.rule();
    w.label(t.certTrail);
    for (const e of trail.slice(-24)) {
      const what = t.trail[e.kind === "signed" ? `signed_${e.detail}` : e.kind];
      const where = [e.ip, e.userAgent ? deviceName(e.userAgent) : ""].filter(Boolean).join(" · ");
      w.text(`${formatWhen(e.at, client.lang)}  —  ${what}${where ? `  (${where})` : ""}`, { size: 8.5 });
    }
  }

  w.rule();
  w.text(t.certNote, { size: 8, color: MUTED });

  pdf.setTitle(`${doc.title} (${client.lang === "en" ? "signed" : "potpisano"})`);
  pdf.setAuthor("Miloš Sarić");
  pdf.setProducer("saricmilos.com");
  pdf.setModificationDate(new Date());
  return pdf.save();
}
