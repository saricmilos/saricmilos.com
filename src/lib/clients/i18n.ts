import type { Lang } from "./store";

// What a client reads, in the client's language (set on the client in the admin).
// Serbian is Latin script. The admin pages are in English and don't come through here.

const sr = {
  centre: "Klijentski centar",
  greeting: (first: string) => `Dobro došli, ${first}.`,
  intro:
    "Ovde su svi dokumenti za Vaš projekat. Dokumente označene sa „Za potpis“ pročitajte i potpišite ovde, na telefonu ili računaru.",
  progress: (done: number, all: number) => `Potpisano ${done} od ${all}`,
  documents: "Dokumenti",
  noDocuments: "Dokumenti još nisu postavljeni.",
  toSign: "Za potpis",
  toRead: "Za čitanje",
  waitingForMe: "Čeka moj potpis",
  signed: "Potpisano",
  open: "Otvori PDF",
  sign: "Potpiši",
  downloadSigned: "Preuzmi potpisan PDF",
  signedBy: (name: string, when: string) => `Potpisao/la ${name}, ${when}`,
  thanks: "Hvala! Dokument je potpisan.",
  questions: "Pitanja?",
  privateNote: "Ova stranica je privatna i otvara se samo preko ovog linka. Molim Vas da ga ne prosleđujete.",
  // signing
  back: "Nazad na dokumente",
  signingTitle: "Potpisivanje",
  step1: "Pročitajte dokument",
  step1Hint: "Otvorite ga i pročitajte do kraja pre potpisivanja.",
  confirmationsTitle: "Potvrdite",
  confirmationsHint: "Označite ono što važi. Šta ste označili biće navedeno na potvrdi o potpisu.",
  remarksTitle: "Primedbe",
  remarksHint: "Nije obavezno. Ako ih ima, upišite ih ovde.",
  nameTitle: "Ime i prezime",
  signatureTitle: "Potpis",
  signatureHint: "Potpišite se prstom ili mišem u polju ispod.",
  clear: "Obriši",
  consent: "Pročitao/la sam dokument i potpisujem ga elektronski.",
  submit: "Potpiši dokument",
  submitting: "Potpisujem…",
  recorded:
    "Uz potpis se beleže datum i vreme, IP adresa, uređaj i otisak (SHA-256) dokumenta. Sve to se ispisuje na potvrdi o potpisu, koja se dodaje na kraj dokumenta.",
  alreadySigned: "Ovaj dokument ste već potpisali.",
  errName: "Upišite ime i prezime.",
  errSignature: "Potpišite se u polju za potpis.",
  errConsent: "Označite da ste pročitali dokument.",
  errGone: "Ovaj link više ne važi.",
  errFailed: "Potpis nije sačuvan. Pokušajte ponovo.",
  // the certificate
  certTitle: "Potvrda o elektronskom potpisivanju",
  certDocument: "Dokument",
  certFile: "Fajl",
  certPages: "Broj strana dokumenta",
  certHash: "Otisak dokumenta (SHA-256)",
  certSignatures: "Potpisi",
  certProvider: "Izvršilac",
  certClient: "Naručilac",
  certSignedAt: "Potpisano",
  certIp: "IP adresa",
  certDevice: "Uređaj",
  certConfirmed: "Potvrđeno",
  certRemarks: "Primedbe",
  certNoRemarks: "bez primedbi",
  certNotYet: "još nije potpisano",
  certTrail: "Tok",
  certNote:
    "Ova potvrda je sastavni deo dokumenta iznad nje. Otisak SHA-256 izračunat je iz originalnog PDF-a pre potpisivanja: svaka izmena dokumenta daje drugačiji otisak. Potpisi su dati preko privatnog linka na saricmilos.com.",
  certAt: "u",
  trail: {
    link_created: "Link za klijenta napravljen",
    viewed: "Dokument otvoren",
    signed_provider: "Potpisao izvršilac",
    signed_client: "Potpisao naručilac",
  } as Record<string, string>,
};

const en: typeof sr = {
  centre: "Client centre",
  greeting: (first) => `Welcome, ${first}.`,
  intro:
    "Here are all the documents for your project. Read the ones marked “To sign” and sign them right here, on your phone or computer.",
  progress: (done, all) => `${done} of ${all} signed`,
  documents: "Documents",
  noDocuments: "No documents yet.",
  toSign: "To sign",
  toRead: "To read",
  waitingForMe: "Waiting for my signature",
  signed: "Signed",
  open: "Open PDF",
  sign: "Sign",
  downloadSigned: "Download signed PDF",
  signedBy: (name, when) => `Signed by ${name}, ${when}`,
  thanks: "Thank you! The document is signed.",
  questions: "Questions?",
  privateNote: "This page is private and opens only through this link. Please don't forward it.",
  back: "Back to documents",
  signingTitle: "Signing",
  step1: "Read the document",
  step1Hint: "Open it and read it to the end before you sign.",
  confirmationsTitle: "Confirm",
  confirmationsHint: "Tick what applies. What you tick is listed on the signature certificate.",
  remarksTitle: "Remarks",
  remarksHint: "Optional. If you have any, write them here.",
  nameTitle: "Full name",
  signatureTitle: "Signature",
  signatureHint: "Sign with your finger or mouse in the box below.",
  clear: "Clear",
  consent: "I have read the document and I sign it electronically.",
  submit: "Sign document",
  submitting: "Signing…",
  recorded:
    "The signature is recorded with the date and time, IP address, device and the document's fingerprint (SHA-256). All of it is printed on the signature certificate added to the end of the document.",
  alreadySigned: "You have already signed this document.",
  errName: "Enter your full name.",
  errSignature: "Sign in the signature box.",
  errConsent: "Tick that you have read the document.",
  errGone: "This link no longer works.",
  errFailed: "The signature wasn't saved. Please try again.",
  certTitle: "Electronic signature certificate",
  certDocument: "Document",
  certFile: "File",
  certPages: "Pages in the document",
  certHash: "Document fingerprint (SHA-256)",
  certSignatures: "Signatures",
  certProvider: "Provider",
  certClient: "Client",
  certSignedAt: "Signed",
  certIp: "IP address",
  certDevice: "Device",
  certConfirmed: "Confirmed",
  certRemarks: "Remarks",
  certNoRemarks: "none",
  certNotYet: "not signed yet",
  certTrail: "Trail",
  certNote:
    "This certificate is part of the document above it. The SHA-256 fingerprint was computed from the original PDF before signing: any change to the document gives a different fingerprint. The signatures were given through a private link on saricmilos.com.",
  certAt: "at",
  trail: {
    link_created: "Client link created",
    viewed: "Document opened",
    signed_provider: "Signed by the provider",
    signed_client: "Signed by the client",
  },
};

export const strings = (lang: Lang) => (lang === "en" ? en : sr);
export type Strings = typeof sr;

const SR_MONTHS = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** „3. oktobra 2026. u 14:05“ / “3 October 2026 at 14:05”, on Belgrade's clock. */
export function formatWhen(isoText: string, lang: Lang, withTime = true): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Belgrade",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(isoText))
      .map((p) => [p.type, p.value]),
  );
  const m = Number(parts.month) - 1;
  const day = Number(parts.day);
  const time = `${parts.hour}:${parts.minute}`;
  if (lang === "en") return `${day} ${EN_MONTHS[m]} ${parts.year}${withTime ? ` at ${time}` : ""}`;
  return `${day}. ${SR_MONTHS[m]} ${parts.year}.${withTime ? ` u ${time}` : ""}`;
}

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;
