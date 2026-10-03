import { headers } from "next/headers";

export type Visitor = { ip: string; ua: string; bot: boolean };

// Link previews: a chat app fetches a link to draw its card. Those fetches are not the
// client opening the page, so they are not logged as visits.
const BOTS = /bot|crawler|spider|preview|facebookexternalhit|whatsapp|viber|telegram|slack|discord|skype|linkedin/i;

export function visitorFrom(h: Headers): Visitor {
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "";
  const ua = (h.get("user-agent") ?? "").slice(0, 300);
  return { ip, ua, bot: BOTS.test(ua) };
}

export async function visitor(): Promise<Visitor> {
  return visitorFrom(await headers());
}

/** "Chrome on Windows", "Safari on iPhone": the device as the signature certificate names it. */
export function deviceName(ua: string): string {
  const os = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Windows/.test(ua)
          ? "Windows"
          : /Mac OS X/.test(ua)
            ? "macOS"
            : /Linux/.test(ua)
              ? "Linux"
              : "";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "";
  return [browser, os].filter(Boolean).join(" · ") || ua.slice(0, 60) || "—";
}
