"use client";

import React, { useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

// The client centre's pages never load Google Analytics: GA records every address it
// sees, and a client's address (/c/<link>) is their key to their documents.
const isPrivate = (path: string | null) =>
  path !== null && (path.startsWith('/c/') || path === '/clients' || path.startsWith('/clients/'));

// This site's own Google Analytics property (Cassiopeia has a separate one).
const GA_ID = 'G-WWS35PRJKF';
const STORAGE_KEY = 'cookie-consent';

type Consent = 'granted' | 'denied';

// The visitor's choice is kept in localStorage and read through
// useSyncExternalStore: the server render shows nothing (no choice is known
// there), and a choice made in another open tab shows up here too.
const listeners = new Set<() => void>();
let fallback: Consent | null = null; // used when storage is blocked

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const readConsent = (): Consent | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return fallback;
  }
};

const writeConsent = (consent: Consent) => {
  fallback = consent;
  try {
    localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // storage blocked: the choice still holds until the page is reloaded
  }
  listeners.forEach((notify) => notify());
};

// GA sets _ga and _ga_<id> on the widest domain it can (.saricmilos.com), so
// each one is expired on every level of the hostname.
const clearAnalyticsCookies = () => {
  const parts = window.location.hostname.split('.');
  const domains = parts.map((_, i) => parts.slice(i).join('.'));
  for (const cookie of document.cookie.split('; ')) {
    const name = cookie.split('=')[0];
    if (!name.startsWith('_ga')) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  }
};

// Consent defaults go in before 'config', so GA only ever has analytics
// storage: no ad cookies, no ad personalization, no user data sent for ads.
const gaInit = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('js', new Date());
gtag('config', '${GA_ID}');
`;

const roundButton = `
  w-11 h-11 rounded-full
  bg-white/70 dark:bg-slate-900/70
  backdrop-blur-sm
  border border-gray-200 dark:border-slate-700
  shadow-lg shadow-black/8 dark:shadow-black/30
  flex items-center justify-center
  text-gray-700 dark:text-slate-200
  transition-all duration-300
  hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20
  hover:border-gray-300 dark:hover:border-slate-600
  active:scale-95
`;

// Accept and Decline look the same on purpose: refusing has to be as easy
// as agreeing.
const choiceButton = `
  flex-1 rounded-full px-4 py-2 font-medium
  border border-gray-200 dark:border-slate-700
  hover:bg-gray-100 dark:hover:bg-slate-800
  transition-colors
`;

const CookieConsent: React.FC = () => {
  // undefined until the browser has read the stored choice, null if there is none
  const consent = useSyncExternalStore<Consent | null | undefined>(
    subscribe,
    readConsent,
    () => undefined,
  );
  const [reopened, setReopened] = useState(false);
  const pathname = usePathname();

  if (isPrivate(pathname)) return null;

  const showBanner = consent === null || (consent !== undefined && reopened);

  const choose = (next: Consent) => {
    const withdrawing = consent === 'granted' && next === 'denied';
    if (withdrawing) {
      // GA's own opt-out switch, so nothing is sent while the page reloads
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    }
    writeConsent(next);
    setReopened(false);
    if (withdrawing) {
      // gtag.js can't be unloaded, so a reload is what actually stops it
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Only production builds report, so local development stays out of the stats. */}
      {consent === 'granted' && process.env.NODE_ENV === 'production' && (
        <>
          <Script id="ga-init">{gaInit}</Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        </>
      )}

      {showBanner && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="
            fixed inset-x-4 bottom-4 z-[70]
            md:inset-x-auto md:left-6 md:bottom-6 md:max-w-sm
            rounded-2xl p-5
            bg-white/90 dark:bg-slate-900/90
            backdrop-blur-sm
            border border-gray-200 dark:border-slate-700
            shadow-lg shadow-black/8 dark:shadow-black/30
            text-sm text-gray-700 dark:text-slate-200
          "
        >
          <p className="leading-6">
            I use Google Analytics to count visits to this site. It only sets
            cookies if you accept, and you can change your mind any time with
            the cookie button in the corner.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => choose('denied')} className={choiceButton}>
              Decline
            </button>
            <button type="button" onClick={() => choose('granted')} className={choiceButton}>
              Accept
            </button>
          </div>
        </div>
      )}

      {consent != null && !showBanner && (
        <button
          type="button"
          onClick={() => setReopened(true)}
          aria-label="Cookie settings"
          title="Cookie settings"
          className={`fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[60] ${roundButton}`}
        >
          <Cookie className="w-5 h-5" strokeWidth={2} />
        </button>
      )}
    </>
  );
};

export default CookieConsent;
