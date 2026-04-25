"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

interface ModernHeaderProps {
  toggleTheme: () => void;
  theme: string;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ toggleTheme, theme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[1000] px-4 py-3 md:px-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "border-slate-200/60 bg-white/80 px-5 py-3 shadow-[0_8px_32px_rgba(8,16,30,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "border-slate-200/40 bg-white/50 px-5 py-3.5 backdrop-blur-md dark:border-white/8 dark:bg-slate-950/30"
        }`}
      >
        {/* ── Logo ─────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl transition-transform duration-200 hover:scale-[1.02]"
        >
          {/* Constellation mark */}
          <div className="relative flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: isDark
                  ? "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
                animation: "logoPulse 3s ease-in-out infinite",
              }}
            />
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {/* Cassiopeia W shape */}
              <polyline
                points="4,22 8,10 13,20 18,10 23,20 28,10"
                stroke={isDark ? "rgba(6,182,212,0.9)" : "rgba(99,102,241,0.85)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots on stars */}
              {[
                [4, 22], [8, 10], [13, 20], [18, 10], [23, 20], [28, 10],
              ].map(([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="1.8"
                  fill={isDark ? "rgba(6,182,212,0.95)" : "rgba(99,102,241,0.9)"}
                />
              ))}
            </svg>
          </div>

          {/* Wordmark */}
          <div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                background: isDark
                  ? "linear-gradient(135deg, #e2e8f0 0%, rgba(6,182,212,0.9) 100%)"
                  : "linear-gradient(135deg, #0f172a 0%, rgba(99,102,241,0.9) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Cassiopeia AI
            </span>
          </div>
        </Link>

        {/* ── Quote ────────────────────────────────────────────────────── */}
        <div className="hidden flex-1 items-center justify-center px-8 md:flex">
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "0.01em",
              lineHeight: 1.5,
              textAlign: "center",
              maxWidth: 480,
            }}
            className="text-slate-500 dark:text-slate-400"
          >
            <span
              style={{
                color: isDark ? "rgba(6,182,212,0.7)" : "rgba(99,102,241,0.7)",
                marginRight: 6,
                fontSize: 16,
                fontStyle: "normal",
              }}
            >
              "
            </span>
            My next chapter is already prepared and I am ready to step into it
            <span
              style={{
                color: isDark ? "rgba(6,182,212,0.7)" : "rgba(99,102,241,0.7)",
                marginLeft: 6,
                fontSize: 16,
                fontStyle: "normal",
              }}
            >
              "
            </span>
          </p>
        </div>

        {/* ── Theme toggle ─────────────────────────────────────────────── */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(15,23,42,0.15)",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
            flexShrink: 0,
          }}
          className="hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/8"
        >
          {isDark
            ? <Sun className="h-4 w-4 text-amber-400" />
            : <Moon className="h-4 w-4 text-slate-600" />
          }
        </button>
      </div>

      {/* ── Mobile quote ─────────────────────────────────────────────────── */}
      <div
        className={`mx-auto mt-2 w-full overflow-hidden rounded-2xl border px-5 py-3 backdrop-blur-xl transition-all duration-500 md:hidden ${
          scrolled ? "opacity-0 pointer-events-none max-h-0 py-0 mt-0" : "opacity-100 max-h-20"
        } border-slate-200/40 bg-white/60 dark:border-white/8 dark:bg-slate-950/50`}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11.5,
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.01em",
            lineHeight: 1.5,
            textAlign: "center",
          }}
          className="text-slate-500 dark:text-slate-400"
        >
          <span style={{ color: isDark ? "rgba(6,182,212,0.7)" : "rgba(99,102,241,0.7)", marginRight: 4 }}>"</span>
          My next chapter is already prepared and I am ready to step into it
          <span style={{ color: isDark ? "rgba(6,182,212,0.7)" : "rgba(99,102,241,0.7)", marginLeft: 4 }}>"</span>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300;1,9..40,400&display=swap');
        @keyframes logoPulse {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </header>
  );
};

export default ModernHeader;