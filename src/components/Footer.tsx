"use client";

import {
  BriefcaseBusiness,
  GitBranch,
  Sparkles,
  TvMinimalPlay,
} from "lucide-react";
import { useEffect, useState } from "react";

const socialLinks = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/milos-saric-753772237/",
    label: "LinkedIn",
    icon: BriefcaseBusiness,
    colorClass: "from-blue-600 to-sky-500",
    hoverColor: "group-hover:text-blue-500",
    glowColor: "group-hover:shadow-blue-500/40",
  },
  {
    id: "github",
    href: "https://github.com/saricmilos",
    label: "GitHub",
    icon: GitBranch,
    colorClass: "from-violet-600 to-fuchsia-500",
    hoverColor: "group-hover:text-violet-500",
    glowColor: "group-hover:shadow-violet-500/40",
  },
  {
    id: "youtube",
    href: "https://www.youtube.com/@saricmilos",
    label: "YouTube",
    icon: TvMinimalPlay,
    colorClass: "from-rose-600 to-red-500",
    hoverColor: "group-hover:text-red-500",
    glowColor: "group-hover:shadow-red-500/40",
  },
];

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 3_600_000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50 transition-colors duration-300 dark:border-white/5 dark:bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -left-32 -top-40 h-96 w-96 rounded-full bg-sky-600/20 blur-3xl dark:bg-sky-600/10"
          style={{ animation: "footerFloat 25s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl dark:bg-violet-600/10"
          style={{ animation: "footerFloat 25s ease-in-out infinite 12s" }}
        />
      </div>

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent dark:via-violet-500/40" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              const isHovered = hoveredSocial === social.id;

              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  onMouseEnter={() => setHoveredSocial(social.id)}
                  onMouseLeave={() => setHoveredSocial(null)}
                >
                  <div
                    className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm backdrop-blur-sm transition-all duration-500 dark:border-white/10 dark:bg-white/5 dark:shadow-none ${
                      isHovered ? "scale-110 -translate-y-1" : ""
                    } group-hover:shadow-lg ${social.glowColor}`}
                  >
                    <div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.colorClass} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                    />

                    <Icon
                      size={22}
                      className={`relative z-10 text-slate-400 transition-all duration-500 dark:text-slate-500 ${social.hoverColor} ${
                        isHovered ? "rotate-[-6deg] scale-110" : ""
                      }`}
                      strokeWidth={2}
                    />

                    {isHovered ? (
                      <>
                        <Sparkles
                          size={12}
                          className="absolute -right-1 -top-1 animate-ping text-red-500 dark:text-white"
                        />
                        <Sparkles
                          size={10}
                          className="absolute -bottom-1 -left-1 animate-ping text-sky-500 dark:text-white"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </>
                    ) : null}
                  </div>

                  <span
                    className={`pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-xl transition-all duration-300 dark:bg-white dark:text-slate-900 ${
                      isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                    }`}
                  >
                    {social.label}
                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                  </span>
                </a>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
              (c) {currentYear} Cassiopeia AI. Crafted to make the first impression count.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes footerFloat {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -40px) scale(1.08);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.92);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
