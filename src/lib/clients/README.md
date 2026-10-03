# Client centre

Private pages where a client reads their documents and signs the ones that need signing.

| Address | Who | What |
| --- | --- | --- |
| `/clients` | Milos | Sign in, add a client |
| `/clients/<id>` | Milos | The client's private link (copy, e-mail, WhatsApp, new, switch off), documents (upload, order, settings, sign as provider, signed PDF), details, activity |
| `/c/<link>` | the client | Their documents, each to read or to sign |
| `/c/<link>/sign/<doc>` | the client | Read, tick the confirmations, write remarks, type the name, draw the signature |
| `/c/<link>/documents/<doc>` | the client | The PDF as uploaded |
| `/c/<link>/documents/<doc>/signed` | the client | The PDF with the signature certificate after its last page |

**Where things live.** Documents (as PDF bytes), signatures (a PNG each), links and an activity log are in
Neon Postgres (`DATABASE_URL`, the `saricmilos-clients` database in Frankfurt, connected to the Vercel
project for Production and Preview). Nothing of a client's is ever in this repository, which is public.
In `npm run dev` without `DATABASE_URL` the same tables live in PGlite under `.data/clients` (ignored by git).

**Signing in.** `CLIENTS_PASSWORD` in the Vercel project's environment variables; locally it is `local`.
Ten wrong tries from one address lock it for 15 minutes. Changing the password signs every device out.

**A client's link** is 32 random bytes, the only key to their page: one live link per client, a new one
switches the old one off. Their pages are `noindex`, `no-referrer`, `no-store`, never framed by another
site, and Google Analytics never loads on them (`CookieConsent.tsx`), because GA records addresses.

**A signature** records the name typed, the drawn signature, the time, IP address, device, what was
ticked, the remarks and the SHA-256 of the PDF as it was signed. The signed PDF is the original, untouched,
with a certificate page added (`certificate.ts`, in Geist, the site's font, whose OFL licence is in
`fonts/`). A document's settings can't change while it carries signatures; "Clear signatures" starts over.

**The documents** come from the `client-agreements` repository (LaTeX). For signing online use the `-esign`
builds (`01-ugovor-esign.pdf`, `05-primopredaja-esign.pdf`): they point to the certificate instead of
having lines to sign on.
