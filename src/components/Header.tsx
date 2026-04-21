"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Menu, Moon, Sun, X } from "lucide-react";
import CassiopeiaLogo from "@/assets/Logo/CassiopeiaLogo";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface ModernHeaderProps {
  toggleTheme: () => void;
  theme: string;
}

type Language = "EN" | "ES" | "SR";

const LANGUAGES: { code: Language; name: string }[] = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Espanol" },
  { code: "SR", name: "Srpski" },
];

const normalizePath = (path: string) => {
  if (!path) return "/";
  const cleaned = path.replace(/\/$/, "");
  return cleaned === "" ? "/" : cleaned;
};

const ModernHeader: React.FC<ModernHeaderProps> = ({ toggleTheme, theme }) => {
  const t = useTranslations("header");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const lang = locale.toUpperCase() as Language;

  const navLinks = useMemo(
    () => [
      { name: t("nav.aboutUs"), href: "/about-us/" },
      { name: t("nav.recommendationSystems"), href: "/recommendation-systems/" },
      { name: t("nav.chatbots"), href: "/retrieval-augmented-generation/" },
      { name: t("nav.frontEnd"), href: "/front-end/" },
      { name: t("nav.bookDemo"), href: "/book-a-demo/" },
    ],
    [t]
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const selectLang = (code: Language) => {
    const newLocale = code.toLowerCase();
    const newPath = pathname.replace(/^\/(en|sr|es)(?=\/|$)/, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
    setLangOpen(false);
  };

  const isActiveLink = (href: string) => {
    const currentPath = normalizePath(pathname);
    const localizedHref = `/${locale}${href}`;
    return currentPath === normalizePath(localizedHref);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] px-4 py-3 md:px-6">
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-white/35 bg-white/72 px-4 py-2.5 shadow-[0_14px_46px_rgba(8,16,30,0.14)] backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/60"
            : "border-white/20 bg-white/50 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/35"
        }`}
      >
        <Link
          href="/"
          className="flex items-center rounded-xl px-1 py-1 transition-transform duration-200 hover:scale-[1.02]"
        >
          <CassiopeiaLogo isDarkMode={isDark} width={152} height={36} className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                isActiveLink(link.href)
                  ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                  : "text-slate-700 hover:bg-slate-900/6 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <div ref={langRef} className="relative hidden md:block">
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 px-3 py-2 text-xs font-semibold tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
              aria-expanded={langOpen}
              aria-label="Change language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{lang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => selectLang(item.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                      item.code === lang
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs opacity-70">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
          >
            {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <div
        className={`mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-white/35 bg-white/90 shadow-[0_18px_44px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-300 md:hidden dark:border-white/10 dark:bg-slate-950/90 ${
          mobileOpen ? "max-h-[85vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-3">
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3.5 py-3 text-base font-medium transition ${
                  isActiveLink(link.href)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="my-4 h-px bg-slate-200 dark:bg-slate-800" />

          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {t("mobile.language")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  selectLang(item.code);
                  setMobileOpen(false);
                }}
                className={`rounded-xl border px-2 py-2 text-sm font-medium transition ${
                  item.code === lang
                    ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
