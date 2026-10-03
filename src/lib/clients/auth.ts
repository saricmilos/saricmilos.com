import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, int } from "./db";

// The client centre's admin (only Milos) signs in with one password, CLIENTS_PASSWORD,
// set in the Vercel project's environment variables. The session is a signed cookie;
// its key comes from the password, so changing the password signs every device out.
// In `npm run dev` without the variable, the password is "local".

const COOKIE = "cc_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MAX_FAILURES = 10; // per IP address in 15 minutes

function password(): string | undefined {
  const set = process.env.CLIENTS_PASSWORD;
  if (set) return set;
  return process.env.NODE_ENV === "production" ? undefined : "local";
}

export const adminConfigured = (): boolean => password() !== undefined;

const key = (pw: string) => createHash("sha256").update(`saricmilos.com/clients:${pw}`).digest();
const mac = (pw: string, payload: string) => createHmac("sha256", key(pw)).update(payload).digest("base64url");

function same(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

export async function isAdmin(): Promise<boolean> {
  // The cookie is read first, always: that is what tells Next.js the page depends on the
  // request. Checking the password first let a build without it prerender /clients as a
  // static sign-in form that no sign-in could ever get past.
  const value = (await cookies()).get(COOKIE)?.value;
  const pw = password();
  if (!pw) return false;
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot < 0) return false;
  const payload = value.slice(0, dot);
  const [who, expires] = payload.split(".");
  if (who !== "admin" || !(Number(expires) > Date.now() / 1000)) return false;
  return same(value.slice(dot + 1), mac(pw, payload));
}

/** Every admin action and admin-only file starts with this. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not signed in");
}

/** Checks the password, with at most MAX_FAILURES wrong tries per address in 15 minutes. */
export async function signIn(input: string, ip: string): Promise<"ok" | "wrong" | "locked" | "off"> {
  const pw = password();
  if (!pw) return "off";
  const d = await db();
  await d.query(`DELETE FROM cc_login_attempts WHERE at < now() - interval '1 day'`);
  const [row] = await d.query<{ n: unknown }>(
    `SELECT count(*) AS n FROM cc_login_attempts WHERE ip = $1 AND at > now() - interval '15 minutes'`,
    [ip],
  );
  if (int(row?.n) >= MAX_FAILURES) return "locked";
  if (!same(input, pw)) {
    await d.query(`INSERT INTO cc_login_attempts (ip) VALUES ($1)`, [ip]);
    return "wrong";
  }
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${expires}`;
  (await cookies()).set(COOKIE, `${payload}.${mac(pw, payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return "ok";
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
