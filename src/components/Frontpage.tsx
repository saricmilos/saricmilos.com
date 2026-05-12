"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Cassiopeia Stars Canvas ──────────────────────────────────────────────────
function CassiopeiaStars({ className = "absolute inset-0 h-full w-full" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    type Star = { x: number; y: number; radius: number; opacity: number; twinkleSpeed: number; twinklePhase: number };
    const stars: Star[] = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.4 + 0.3,
        opacity: Math.random() * 0.55 + 0.25,
        twinkleSpeed: Math.random() * 0.018 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const cassiopeia = [
      { x: canvas.width * 0.62, y: canvas.height * 0.14 },
      { x: canvas.width * 0.68, y: canvas.height * 0.21 },
      { x: canvas.width * 0.74, y: canvas.height * 0.15 },
      { x: canvas.width * 0.80, y: canvas.height * 0.24 },
      { x: canvas.width * 0.86, y: canvas.height * 0.17 },
    ];

    const nebulae = [
      { x: canvas.width * 0.12, y: canvas.height * 0.25, r: 200, cA: "99,102,241", cB: "139,92,246" },
      { x: canvas.width * 0.85, y: canvas.height * 0.70, r: 150, cA: "6,182,212", cB: "59,130,246" },
      { x: canvas.width * 0.50, y: canvas.height * 0.88, r: 120, cA: "168,85,247", cB: "236,72,153" },
      { x: canvas.width * 0.30, y: canvas.height * 0.60, r: 100, cA: "14,165,233", cB: "99,102,241" },
    ];

    type ShootingStar = { x: number; y: number; angle: number; speed: number; length: number; life: number; maxLife: number };
    const shootingStars: ShootingStar[] = [];
    let animFrame = 0;
    let time = 0;
    let lastTime = performance.now();
    let spawnTimer = 0;
    let nextSpawn = 1.5;

    const spawnShootingStar = () => {
      const sx = Math.random() * canvas.width * 0.65;
      const sy = Math.random() * canvas.height * 0.35;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.45;
      shootingStars.push({ x: sx, y: sy, angle, speed: 550 + Math.random() * 450, length: 70 + Math.random() * 110, life: 0, maxLife: 1.0 + Math.random() * 0.7 });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      nebulae.forEach(({ x, y, r, cA, cB }) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${cA},0.08)`);
        g.addColorStop(0.5, `rgba(${cB},0.04)`);
        g.addColorStop(1, `rgba(${cB},0)`);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });

      stars.forEach((star) => {
        const tw = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.28 + 0.72;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity * tw})`;
        ctx.fill();
      });

      ctx.strokeStyle = "rgba(147,197,253,0.32)"; ctx.lineWidth = 1.2;
      ctx.beginPath();
      cassiopeia.forEach((s, i) => i === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y));
      ctx.stroke();

      cassiopeia.forEach((star, idx) => {
        const pulse = Math.sin(time * 1.8 + idx * 1.1) * 0.18 + 0.82;
        const g = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 14);
        g.addColorStop(0, `rgba(147,197,253,${0.85 * pulse})`);
        g.addColorStop(0.45, `rgba(147,197,253,${0.3 * pulse})`);
        g.addColorStop(1, "rgba(147,197,253,0)");
        ctx.beginPath(); ctx.arc(star.x, star.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(star.x, star.y, 2.2 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pulse})`; ctx.fill();
      });

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      spawnTimer += dt;
      if (spawnTimer >= nextSpawn) { spawnShootingStar(); spawnTimer = 0; nextSpawn = 2.5 + Math.random() * 4.5; }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += dt;
        if (s.life >= s.maxLife) { shootingStars.splice(i, 1); continue; }
        const progress = s.life / s.maxLife;
        const eased = 1 - (1 - progress) ** 2;
        const dist = s.speed * s.maxLife * eased;
        const hx = s.x + Math.cos(s.angle) * dist;
        const hy = s.y + Math.sin(s.angle) * dist;
        let alpha = progress < 0.15 ? progress / 0.15 : progress < 0.72 ? 1 : 1 - (progress - 0.72) / 0.28;
        alpha = Math.max(0, Math.min(1, alpha));
        const tx = hx - Math.cos(s.angle) * s.length;
        const ty = hy - Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, "rgba(147,197,253,0)");
        grad.addColorStop(0.55, `rgba(186,220,255,${0.45 * alpha})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.95 * alpha})`);
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(hx, hy);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.stroke();
        const gr = 5 + (1 - progress) * 5;
        const gg = ctx.createRadialGradient(hx, hy, 0, hx, hy, gr);
        gg.addColorStop(0, `rgba(220,240,255,${0.9 * alpha})`);
        gg.addColorStop(0.4, `rgba(147,197,253,${0.35 * alpha})`);
        gg.addColorStop(1, "rgba(147,197,253,0)");
        ctx.beginPath(); ctx.arc(hx, hy, gr, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
        ctx.beginPath(); ctx.arc(hx, hy, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => { window.removeEventListener("resize", setCanvasSize); cancelAnimationFrame(animFrame); };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

// ─── Floating orbs ────────────────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute rounded-full blur-3xl" style={{ width: 480, height: 480, left: "-10%", top: "5%", background: "radial-gradient(circle,rgba(99,102,241,0.15) 0%,rgba(139,92,246,0.06) 60%,transparent 100%)", animation: "orbFloat1 18s ease-in-out infinite" }} />
      <div className="absolute rounded-full blur-3xl" style={{ width: 360, height: 360, right: "-8%", bottom: "18%", background: "radial-gradient(circle,rgba(6,182,212,0.14) 0%,rgba(59,130,246,0.06) 60%,transparent 100%)", animation: "orbFloat2 22s ease-in-out infinite" }} />
      <div className="absolute rounded-full blur-2xl" style={{ width: 240, height: 240, left: "38%", bottom: "6%", background: "radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 70%)", animation: "orbFloat3 14s ease-in-out infinite" }} />
    </div>
  );
}

// ─── Social / Link button ─────────────────────────────────────────────────────
function GalaxyLink({
  href,
  label,
  icon,
  accent = "indigo",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  accent?: "indigo" | "cyan" | "purple" | "pink";
}) {
  const [hovered, setHovered] = useState(false);

  const colors: Record<string, { border: [string, string]; bg: [string, string]; text: [string, string]; glow: string }> = {
    indigo: {
      border: ["rgba(99,102,241,0.5)", "rgba(99,102,241,0.22)"],
      bg: ["rgba(99,102,241,0.15)", "rgba(99,102,241,0.07)"],
      text: ["#c7d2fe", "rgba(199,210,254,0.7)"],
      glow: "0 0 22px rgba(99,102,241,0.3), 0 4px 16px rgba(0,0,0,0.45)",
    },
    cyan: {
      border: ["rgba(6,182,212,0.9)", "rgba(6,182,212,0.45)"],
      bg: ["rgba(6,182,212,0.18)", "rgba(6,182,212,0.08)"],
      text: ["#e0f9ff", "rgba(224,249,255,0.8)"],
      glow: "0 0 24px rgba(6,182,212,0.35), 0 4px 16px rgba(0,0,0,0.4)",
    },
    purple: {
      border: ["rgba(139,92,246,0.7)", "rgba(139,92,246,0.3)"],
      bg: ["rgba(139,92,246,0.18)", "rgba(139,92,246,0.07)"],
      text: ["#ddd6fe", "rgba(221,214,254,0.7)"],
      glow: "0 0 22px rgba(139,92,246,0.3), 0 4px 16px rgba(0,0,0,0.45)",
    },
    pink: {
      border: ["rgba(236,72,153,0.7)", "rgba(236,72,153,0.3)"],
      bg: ["rgba(236,72,153,0.15)", "rgba(236,72,153,0.06)"],
      text: ["#fbcfe8", "rgba(251,207,232,0.7)"],
      glow: "0 0 22px rgba(236,72,153,0.3), 0 4px 16px rgba(0,0,0,0.45)",
    },
  };

  const c = colors[accent];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "13px 20px",
        borderRadius: 16,
        border: `1px solid ${hovered ? c.border[0] : c.border[1]}`,
        background: hovered ? c.bg[0] : c.bg[1],
        color: hovered ? c.text[0] : c.text[1],
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.06em",
        cursor: "pointer",
        boxShadow: hovered ? c.glow : "0 2px 12px rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {hovered && (
        <span style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)",
          animation: "shimmer 0.65s ease forwards",
          pointerEvents: "none",
        }} />
      )}
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </a>
  );
}

// ─── Mobile Linktree Link ─────────────────────────────────────────────────────
function MobileLink({
  href,
  label,
  sublabel,
  icon,
  accent = "indigo",
  badge,
  rel = "noopener noreferrer",
}: {
  href: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  accent?: "indigo" | "cyan" | "purple" | "pink";
  badge?: string;
  rel?: string;
}) {
  const [pressed, setPressed] = useState(false);

  const colors: Record<string, { border: string; bg: string; text: string; sub: string; badgeBg: string; badgeBorder: string; badgeText: string; glow: string }> = {
    indigo: {
      border: pressed ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.25)",
      bg: pressed ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.08)",
      text: "#c7d2fe",
      sub: "rgba(199,210,254,0.6)",
      badgeBg: "rgba(99,102,241,0.15)",
      badgeBorder: "rgba(99,102,241,0.35)",
      badgeText: "rgba(199,210,254,0.9)",
      glow: pressed ? "0 0 28px rgba(99,102,241,0.25)" : "0 2px 12px rgba(0,0,0,0.4)",
    },
    cyan: {
      border: pressed ? "rgba(6,182,212,0.8)" : "rgba(6,182,212,0.3)",
      bg: pressed ? "rgba(6,182,212,0.18)" : "rgba(6,182,212,0.08)",
      text: "#e0f9ff",
      sub: "rgba(224,249,255,0.6)",
      badgeBg: "rgba(6,182,212,0.15)",
      badgeBorder: "rgba(6,182,212,0.35)",
      badgeText: "rgba(6,182,212,0.95)",
      glow: pressed ? "0 0 28px rgba(6,182,212,0.25)" : "0 2px 12px rgba(0,0,0,0.4)",
    },
    purple: {
      border: pressed ? "rgba(139,92,246,0.7)" : "rgba(139,92,246,0.25)",
      bg: pressed ? "rgba(139,92,246,0.18)" : "rgba(139,92,246,0.07)",
      text: "#ddd6fe",
      sub: "rgba(221,214,254,0.6)",
      badgeBg: "rgba(139,92,246,0.15)",
      badgeBorder: "rgba(139,92,246,0.35)",
      badgeText: "rgba(167,139,250,0.9)",
      glow: pressed ? "0 0 28px rgba(139,92,246,0.25)" : "0 2px 12px rgba(0,0,0,0.4)",
    },
    pink: {
      border: pressed ? "rgba(236,72,153,0.7)" : "rgba(236,72,153,0.25)",
      bg: pressed ? "rgba(236,72,153,0.16)" : "rgba(236,72,153,0.06)",
      text: "#fbcfe8",
      sub: "rgba(251,207,232,0.6)",
      badgeBg: "rgba(236,72,153,0.15)",
      badgeBorder: "rgba(236,72,153,0.35)",
      badgeText: "rgba(251,207,232,0.9)",
      glow: pressed ? "0 0 28px rgba(236,72,153,0.25)" : "0 2px 12px rgba(0,0,0,0.4)",
    },
  };

  const c = colors[accent];

  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseEnter={() => setPressed(true)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 18,
        border: `1px solid ${c.border}`,
        background: c.bg,
        backdropFilter: "blur(16px)",
        boxShadow: c.glow,
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
        transform: pressed ? "scale(0.98)" : "scale(1)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 12,
        background: c.badgeBg,
        border: `1px solid ${c.badgeBorder}`,
        color: c.text,
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: "block",
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: c.text,
          lineHeight: 1.2,
        }}>{label}</span>
        {sublabel && (
          <span style={{
            display: "block",
            fontSize: 11,
            color: c.sub,
            marginTop: 2,
            lineHeight: 1.3,
          }}>{sublabel}</span>
        )}
      </span>
      {badge && (
        <span style={{
          flexShrink: 0,
          fontSize: 9,
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "3px 8px",
          borderRadius: 8,
          background: c.badgeBg,
          border: `1px solid ${c.badgeBorder}`,
          color: c.badgeText,
        }}>{badge}</span>
      )}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  );
}

// ─── Stack pill ───────────────────────────────────────────────────────────────
function StackPill({ label, emoji }: { label: string; emoji: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 12,
        border: `1px solid ${hovered ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.15)"}`,
        background: hovered ? "rgba(99,102,241,0.12)" : "rgba(15,23,42,0.6)",
        backdropFilter: "blur(12px)",
        transition: "all 0.22s cubic-bezier(0.22,1,0.36,1)",
        cursor: "default",
        boxShadow: hovered ? "0 0 16px rgba(99,102,241,0.2)" : "none",
      }}
    >
      <span style={{ fontSize: 14 }}>{emoji}</span>
      <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: hovered ? "rgba(199,210,254,0.95)" : "rgba(255,255,255,0.85)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.2)" }} />
      <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.2)" }} />
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.81 1.55V6.8a4.85 4.85 0 0 1-1.04-.11z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ThesisIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const RocketIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// ─── Now Section ──────────────────────────────────────────────────────────────
function NowSection() {
  const stats = [
    { value: "2.87M", label: "monthly views", emoji: "👁️" },
    { value: "68.6K", label: "engagements", emoji: "⚡" },
    { value: "6.03%", label: "eng. rate", emoji: "🔥" },
    { value: "43K", label: "shares", emoji: "🚀" },
  ];

  const features = [
    { icon: "🧠", text: "AI/NLP + agentic workflows (OpenAI, Hugging Face, Pinecone/FAISS)" },
    { icon: "📡", text: "Cross-platform intelligence across YouTube & Instagram" },
    { icon: "🏗️", text: "Modular FastAPI backend + React analytics dashboards" },
    { icon: "🔐", text: "Secure auth, encrypted credential storage, background collectors" },
  ];

  return (
    <div style={{
      borderRadius: 24,
      border: "1px solid rgba(6,182,212,0.25)",
      background: "linear-gradient(135deg,rgba(6,182,212,0.06) 0%,rgba(99,102,241,0.08) 50%,rgba(139,92,246,0.06) 100%)",
      backdropFilter: "blur(24px) saturate(1.4)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(6,182,212,0.06)",
      padding: "28px 32px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated pulse dot */}
      <style>{`
        @keyframes liveping { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(2.2);opacity:0} }
        @keyframes nowShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 10, height: 10 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(6,182,212,1)", animation: "liveping 1.8s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(6,182,212,1)" }} />
          </div>
          <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(6,182,212,0.9)" }}>
            Now
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.1em" }}>
            · what I&apos;m actually doing at this moment in time
          </span>
        </div>
        <span style={{
          fontSize: 9,
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          padding: "3px 10px",
          borderRadius: 8,
          background: "rgba(6,182,212,0.12)",
          border: "1px solid rgba(6,182,212,0.3)",
          color: "rgba(6,182,212,0.8)",
        }}>
          Week 3 of rollout
        </span>
      </div>

      {/* Main content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "start" }}>

        {/* Left: project description */}
        <div>
          <h3 style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#f1f5f9",
            marginBottom: 6,
            lineHeight: 1.2,
          }}>
            Creator Operating System
          </h3>
          <p style={{ fontSize: 12, color: "rgba(6,182,212,0.8)", fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 16, textTransform: "uppercase" }}>
            Cross-Platform Content Intelligence
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, minWidth: 260 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "12px 14px",
              borderRadius: 14,
              background: "rgba(15,23,42,0.55)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 17, fontWeight: 800, color: "#f1f5f9", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 3, fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.06em" }}>{s.label}</div>
            </div>
          ))}
          <div style={{
            gridColumn: "1 / -1",
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            textAlign: "center",
            fontSize: 10,
            color: "rgba(199,210,254,0.7)",
            fontFamily: "var(--font-geist-sans), sans-serif",
            letterSpacing: "0.08em",
          }}>
            855 followers · 21,192 likes · 817 comments · 3,524 saves
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Main Frontpage ───────────────────────────────────────────────────────────
const Frontpage = () => {
  const [mounted, setMounted] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const photoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const photo = photoRef.current;
    if (photo?.complete) {
      setPhotoLoaded(true);
    }
  }, []);

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  const stack = [
    { label: "Python", emoji: "🐍" },
    { label: "React", emoji: "⚛️" },
    { label: "PyTorch", emoji: "🔥" },
    { label: "LangChain", emoji: "🔗" },
    { label: "scikit-learn", emoji: "🧠" },
    { label: "Databases", emoji: "🗄️" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        @keyframes orbFloat1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(28px,-38px) scale(1.06); }
          66%      { transform:translate(-18px,18px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform:translate(0,0) scale(1); }
          40%      { transform:translate(-32px,22px) scale(1.08); }
          70%      { transform:translate(14px,-14px) scale(0.97); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform:translate(0,0); }
          50%      { transform:translate(-18px,-28px); }
        }
        @keyframes shimmer {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(100%); }
        }
        @keyframes spinSlow {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes pulseRing {
          0%,100% { transform:scale(0.95); opacity:0.6; }
          50%      { transform:scale(1.05); opacity:0.2; }
        }
        @keyframes glowPulse {
          0%,100% { opacity:0.5; }
          50%      { opacity:0.75; }
        }
        @keyframes photoReveal {
          from { opacity:0; transform:scale(0.93) translateY(12px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes badgeFloat {
          0%,100% { transform:translateY(0px) rotate(-2deg); }
          50%      { transform:translateY(-6px) rotate(-2deg); }
        }
        @keyframes mobileAvatarGlow {
          0%,100% { opacity:0.6; transform:scale(1); }
          50%      { opacity:1; transform:scale(1.02); }
        }
        @keyframes mobileFadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .logo-spin  { animation:spinSlow 20s linear infinite; }
        .logo-pulse { animation:pulseRing 3s ease-in-out infinite; }
        .glow-pulse { animation:glowPulse 6s ease-in-out infinite; }
        .badge-float { animation:badgeFloat 4s ease-in-out infinite; }

        /* ── Desktop only ── */
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }

        /* ── Hide desktop FX on mobile ── */
        @media (max-width: 768px) {
          .desktop-fx { display: none !important; }
        }

        /* ── Mobile purple background ── */
        @media (max-width: 768px) {
          .main-bg {
            background: linear-gradient(160deg, #1a0033 0%, #3b0073 30%, #6b00cc 60%, #9b30ff 85%, #bf5fff 100%) !important;
          }
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
        }

        /* ── Mobile linktree animations ── */
        .mobile-item-1 { animation: mobileFadeUp 0.6s 0.1s both ease; }
        .mobile-item-2 { animation: mobileFadeUp 0.6s 0.2s both ease; }
        .mobile-item-3 { animation: mobileFadeUp 0.6s 0.3s both ease; }
        .mobile-item-4 { animation: mobileFadeUp 0.6s 0.4s both ease; }
        .mobile-item-5 { animation: mobileFadeUp 0.6s 0.5s both ease; }
        .mobile-item-6 { animation: mobileFadeUp 0.6s 0.6s both ease; }
        .mobile-item-7 { animation: mobileFadeUp 0.6s 0.7s both ease; }
        .mobile-item-8 { animation: mobileFadeUp 0.6s 0.8s both ease; }
        .mobile-item-9 { animation: mobileFadeUp 0.6s 0.9s both ease; }
      `}</style>

      <main className="main-bg" style={{ fontFamily: "var(--font-geist-sans), sans-serif", minHeight: "100vh", position: "relative", overflow: "hidden", background: "#020817" }}>

        {/* ── Star canvas ─────────────────────────────────────────────────── */}
        <CassiopeiaStars className="desktop-fx absolute inset-0 h-full w-full" />

        {/* ── Colour orbs ─────────────────────────────────────────────────── */}
        <div className="desktop-fx"><Orbs /></div>

        {/* ── Blueprint grid ──────────────────────────────────────────────── */}
        <div
          className="desktop-fx pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Bottom vignette ─────────────────────────────────────────────── */}
        <div
          className="desktop-fx pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top,rgba(2,8,23,0.92) 0%,rgba(2,8,23,0.5) 35%,transparent 65%)" }}
        />

        {/* ── Breathing center glow ───────────────────────────────────────── */}
        <div
          className="glow-pulse desktop-fx pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 65% 50% at 50% 40%,rgba(99,102,241,0.1),transparent 70%)" }}
        />

        {/* ── Mobile purple top glow ──────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            display: "none",
          }}
        />
        <style>{`
          @media (max-width: 768px) {
            .mobile-top-glow { display: block !important; }
          }
        `}</style>
        <div
          className="mobile-top-glow pointer-events-none absolute inset-0"
          style={{
            display: "none",
            background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(191,95,255,0.35), transparent 70%)",
          }}
        />

        {/* ════════════════════════════════════════════════════════════════════
            DESKTOP LAYOUT (hidden on mobile)
        ════════════════════════════════════════════════════════════════════ */}
        <div
          className="desktop-only"
          style={{ position: "relative", zIndex: 10, flexDirection: "column", minHeight: "100vh", padding: "40px 64px 60px" }}
        >
          {/* ── Hero: full-width layout ──────────────────────────────────────── */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            flex: 1,
            width: "100%",
            paddingTop: 40,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 1.2s 0.2s ${ease}, transform 1.2s 0.2s ${ease}`,
          }}>

            {/* ── TOP HERO: Photo + Identity side by side ─────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 48, alignItems: "stretch" }}>

              {/* Photo — large, rectangular, modern */}
              <div style={{ position: "relative" }}>
                {/* Glow border */}
                <div style={{
                  position: "absolute", inset: -2,
                  borderRadius: 28,
                  background: "linear-gradient(135deg,rgba(6,182,212,0.5),rgba(99,102,241,0.4),rgba(139,92,246,0.5))",
                  filter: "blur(8px)",
                  animation: "glowPulse 4s ease-in-out infinite",
                }} />
                {/* Photo container */}
                <div style={{
                  width: "100%",
                  height: 460,
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "1px solid rgba(6,182,212,0.35)",
                  background: "linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.9))",
                  position: "relative",
                  boxShadow: "0 0 60px rgba(99,102,241,0.18), 0 30px 80px rgba(2,6,23,0.85)",
                }}>
                  {!photoLoaded && (
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column", gap: 8,
                    }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
                        <path d="M4 20a8 8 0 0 1 16 0" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span style={{ fontSize: 9, color: "rgba(99,102,241,0.5)", fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Your photo here</span>
                    </div>
                  )}
                  <Image
                    ref={photoRef}
                    src="/Me.jpg"
                    alt="Milos Saric"
                    priority
                    width={760}
                    height={920}
                    onLoad={() => setPhotoLoaded(true)}
                    onError={() => setPhotoLoaded(true)}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      opacity: photoLoaded ? 1 : 0,
                      transition: "opacity 0.6s ease",
                      animation: photoLoaded ? "photoReveal 0.8s ease forwards" : "none",
                    }}
                  />
                  {/* Subtle bottom fade on photo */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
                    background: "linear-gradient(to top, rgba(2,8,23,0.6), transparent)",
                    pointerEvents: "none",
                  }} />
                </div>
              </div>

              {/* ── RIGHT side: identity + socials ────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28 }}>

                {/* Title block */}
                <div>
                  <h1 style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "clamp(32px,4.5vw,54px)",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: "#f1f5f9",
                    lineHeight: 1.05,
                    marginBottom: 10,
                  }}>
                    Milos Saric
                  </h1>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {["ML / AI Engineer", "Data Scientist"].map((role) => (
                      <span key={role} style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        padding: "5px 14px",
                        borderRadius: 20,
                        background: "rgba(99,102,241,0.12)",
                        border: "1px solid rgba(99,102,241,0.3)",
                        color: "rgba(199,210,254,0.9)",
                      }}>
                        {role}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 440 }}>
                    I teach machines to think, occasionally wonder if they&apos;re judging me back, and ship things that actually work — not just in notebooks.
                  </p>
                </div>

                {/* ── Socials ────────────────────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <SectionLabel>Find me online</SectionLabel>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <GalaxyLink
                  href="https://instagram.com/sariccmilos"
                  label="Instagram"
                  accent="pink"
                  icon={<InstagramIcon />}
                />
                <GalaxyLink
                  href="https://tiktok.com/@sariccmilos"
                  label="TikTok"
                  accent="purple"
                  icon={<TikTokIcon />}
                />
                <GalaxyLink
                  href="https://youtube.com/@saricmilos"
                  label="YouTube"
                  accent="indigo"
                  icon={<YoutubeIcon />}
                />
                <GalaxyLink
                  href="https://github.com/saricmilos"
                  label="GitHub"
                  accent="purple"
                  icon={<GitHubIcon />}
                />
                <GalaxyLink
                  href="mailto:milossaric@outlook.com"
                  label="Email"
                  accent="cyan"
                  icon={<EmailIcon />}
                />

                {/* Thesis link — with extra personality */}
                <a
                  href="https://upcommons.upc.edu/server/api/core/bitstreams/67a5f746-ba7f-4f95-a278-d27986893298/content"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "12px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(6,182,212,0.35)",
                    background: "rgba(6,182,212,0.07)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ThesisIcon />
                    <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(6,182,212,0.9)", textTransform: "uppercase" }}>
                      Master&apos;s Thesis
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, paddingLeft: 24 }}>
                    Proof that I once suffered for science 📄✨
                  </span>
                </a>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(51,65,85,0.5)", margin: "4px 0" }} />

                {/* Project links row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {/* Cassiopeia AI — serious business link */}
                <a
                  href="https://cassiopeiai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "12px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(6,182,212,0.5)",
                    background: "linear-gradient(135deg,rgba(6,182,212,0.12),rgba(99,102,241,0.08))",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    textDecoration: "none",
                    boxShadow: "0 0 20px rgba(6,182,212,0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>🚀</span>
                      <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(6,182,212,0.95)", textTransform: "uppercase" }}>
                        Cassiopeia AI
                      </span>
                    </div>
                    <span style={{ fontSize: 8, fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 6, background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", color: "rgba(6,182,212,0.8)" }}>
                      Business
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, paddingLeft: 23 }}>
                    Where I pretend to be professional 💼✨
                  </span>
                </a>

                {/* Personal site — the real one */}
                <a
                  href="https://milos-saric.com"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "12px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(139,92,246,0.4)",
                    background: "rgba(139,92,246,0.07)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15 }}>🕵️</span>
                      <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(167,139,250,0.95)", textTransform: "uppercase" }}>
                        milos-saric.com
                      </span>
                    </div>
                    <span style={{ fontSize: 8, fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 6, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(167,139,250,0.8)" }}>
                      Private
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, paddingLeft: 23 }}>
                    The unfiltered version. Enter at own risk 👀
                  </span>
                </a>
                </div>
              </div>

            </div>{/* end right column */}
            </div>{/* end top hero grid */}

            {/* ── NOW: Currently building ──────────────────────────────────────── */}
            <NowSection />

            {/* ── BOTTOM: Stack + Quick facts ──────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* ── Stack ──────────────────────────────────────────────────── */}
              <div style={{
                padding: "24px 28px",
                borderRadius: 24,
                background: "linear-gradient(135deg,rgba(15,23,42,0.82) 0%,rgba(15,23,42,0.72) 100%)",
                backdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(99,102,241,0.18)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 30px 80px rgba(2,6,23,0.7), 0 0 60px rgba(99,102,241,0.08)",
              }}>
                <SectionLabel>Tech Stack</SectionLabel>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {stack.map((item) => (
                    <StackPill key={item.label} label={item.label} emoji={item.emoji} />
                  ))}
                </div>

                {/* Fun footnote */}
                <p style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.5 }}>
                  * No models were harmed in the making of this portfolio. A few GPUs might have been.
                </p>
              </div>

              {/* ── Quick facts ────────────────────────────────────────────── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}>
                {[
                  { label: "Models shipped", value: "∞", sub: "give or take" },
                  { label: "Bugs fixed", value: "most", sub: "of them" },
                  { label: "Papers read", value: "too many", sub: "send help" },
                  { label: "Coffee / model", value: "1:1", sub: "ratio maintained" },
                ].map((fact) => (
                  <div
                    key={fact.label}
                    style={{
                      padding: "16px 18px",
                      borderRadius: 18,
                      background: "rgba(15,23,42,0.6)",
                      border: "1px solid rgba(51,65,85,0.5)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 20, fontWeight: 800, color: "#f1f5f9", lineHeight: 1 }}>{fact.value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{fact.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(99,102,241,0.6)", marginTop: 2, fontStyle: "italic" }}>{fact.sub}</div>
                  </div>
                ))}
              </div>

            </div>{/* end bottom section */}

          </div>{/* end outer flex column */}

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <div style={{
            marginTop: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: mounted ? 1 : 0,
            transition: `opacity 1.4s 0.8s ${ease}`,
          }}>
            <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
            {["Python > pseudocode", "ML > magic", "Sleep < deadlines"].map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(6,182,212,0.7)" }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
            <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            MOBILE LINKTREE (hidden on desktop)
        ════════════════════════════════════════════════════════════════════ */}
        <div
          className="mobile-only"
          style={{
            position: "relative",
            zIndex: 10,
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            padding: "48px 20px 60px",
            width: "100%",
          }}
        >
          <div style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}>

            {/* ── Avatar ─────────────────────────────────────────────────── */}
            <div className="mobile-item-1" style={{ position: "relative", marginBottom: 20 }}>
              {/* Outer glow ring */}
              <div style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                background: "linear-gradient(135deg,rgba(6,182,212,0.6),rgba(99,102,241,0.5),rgba(139,92,246,0.6))",
                filter: "blur(10px)",
                animation: "mobileAvatarGlow 4s ease-in-out infinite",
              }} />
              {/* Border ring */}
              <div style={{
                position: "absolute",
                inset: -2,
                borderRadius: "50%",
                background: "linear-gradient(135deg,rgba(6,182,212,0.8),rgba(99,102,241,0.6),rgba(139,92,246,0.8))",
                padding: 2,
              }} />
              {/* Photo circle */}
              <div style={{
                width: 112,
                height: 112,
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                border: "2px solid rgba(6,182,212,0.4)",
                background: "rgba(15,23,42,0.9)",
              }}>
                <Image
                  src="/Me.jpg"
                  alt="Milos Saric"
                  priority
                  width={224}
                  height={224}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
              </div>
            </div>

            {/* ── Name ───────────────────────────────────────────────────── */}
            <h1 className="mobile-item-2" style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#f1f5f9",
              lineHeight: 1.1,
              textAlign: "center",
              marginBottom: 10,
            }}>
              Milos Saric
            </h1>

            {/* ── Role badges ────────────────────────────────────────────── */}
            <div className="mobile-item-3" style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 14 }}>
              {["ML / AI Engineer", "Data Scientist"].map((role) => (
                <span key={role} style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "rgba(199,210,254,0.9)",
                }}>
                  {role}
                </span>
              ))}
            </div>

            {/* ── Bio ────────────────────────────────────────────────────── */}
            <p className="mobile-item-4" style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.65,
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 320,
            }}>
              I teach machines to think, occasionally wonder if they&apos;re judging me back, and ship things that actually work.
            </p>

            {/* ── Links ──────────────────────────────────────────────────── */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Socials section */}
              <div className="mobile-item-5" style={{ marginBottom: 4 }}>
                <SectionLabel>Find me online</SectionLabel>
              </div>

              <div className="mobile-item-5">
                <MobileLink
                  href="https://instagram.com/sariccmilos"
                  label="Instagram"
                  sublabel="@sariccmilos"
                  icon={<InstagramIcon />}
                  accent="pink"
                />
              </div>

              <div className="mobile-item-6">
                <MobileLink
                  href="https://tiktok.com/@sariccmilos"
                  label="TikTok"
                  sublabel="@sariccmilos"
                  icon={<TikTokIcon />}
                  accent="purple"
                />
              </div>

              <div className="mobile-item-7">
                <MobileLink
                  href="https://youtube.com/@saricmilos"
                  label="YouTube"
                  sublabel="@saricmilos"
                  icon={<YoutubeIcon />}
                  accent="indigo"
                />
              </div>

              <div className="mobile-item-8">
                <MobileLink
                  href="https://github.com/saricmilos"
                  label="GitHub"
                  sublabel="@saricmilos"
                  icon={<GitHubIcon />}
                  accent="purple"
                />
              </div>

              <div className="mobile-item-8">
                <MobileLink
                  href="mailto:milossaric@outlook.com"
                  label="Email"
                  sublabel="milossaric@outlook.com"
                  icon={<EmailIcon />}
                  accent="cyan"
                />
              </div>

              <div className="mobile-item-8">
                <MobileLink
                  href="https://upcommons.upc.edu/server/api/core/bitstreams/67a5f746-ba7f-4f95-a278-d27986893298/content"
                  label="Master's Thesis"
                  sublabel="Proof I once suffered for science 📄"
                  icon={<ThesisIcon />}
                  accent="cyan"
                  badge="PDF"
                />
              </div>

              {/* Projects section */}
              <div style={{ height: 8 }} />
              <div className="mobile-item-8" style={{ marginBottom: 4 }}>
                <SectionLabel>Projects</SectionLabel>
              </div>

              <div className="mobile-item-8">
                <MobileLink
                  href="https://cassiopeiai.com/"
                  label="Cassiopeia AI"
                  sublabel="Where I pretend to be professional 💼"
                  icon={<RocketIcon />}
                  accent="cyan"
                  badge="Business"
                />
              </div>

              <div className="mobile-item-9">
                <MobileLink
                  href="https://milos-saric.com"
                  label="milos-saric.com"
                  sublabel="The unfiltered version. Enter at own risk 👀"
                  icon={<GlobeIcon />}
                  accent="purple"
                  badge="Personal"
                  rel="nofollow noopener noreferrer"
                />
              </div>

              {/* Now section — mobile */}
              <div style={{ height: 8 }} />
              <div className="mobile-item-9" style={{ marginBottom: 4 }}>
                <SectionLabel>Now</SectionLabel>
              </div>

              <div className="mobile-item-9" style={{
                width: "100%",
                padding: "18px 18px",
                borderRadius: 18,
                border: "1px solid rgba(6,182,212,0.25)",
                background: "linear-gradient(135deg,rgba(6,182,212,0.07) 0%,rgba(99,102,241,0.09) 100%)",
                backdropFilter: "blur(16px)",
              }}>
                {/* Live indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(6,182,212,1)", animation: "liveping 1.8s ease-in-out infinite" }} />
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(6,182,212,1)" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(6,182,212,0.9)" }}>
                    Currently building
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 8, fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 6, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", color: "rgba(6,182,212,0.75)" }}>
                    Week 3
                  </span>
                </div>

                <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 14, fontWeight: 800, color: "#f1f5f9", marginBottom: 3, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  Creator Operating System
                </div>
                <div style={{ fontSize: 10, color: "rgba(6,182,212,0.8)", fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  Cross-Platform Content Intelligence
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
                  {[
                    { icon: "🧠", text: "AI/NLP + agentic workflows with OpenAI & Pinecone" },
                    { icon: "📡", text: "YouTube & Instagram intelligence unified" },
                    { icon: "🏗️", text: "FastAPI backend + React analytics dashboards" },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* Mini stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[
                    { value: "2.87M", label: "monthly views", emoji: "👁️" },
                    { value: "6.03%", label: "eng. rate", emoji: "🔥" },
                    { value: "43K", label: "shares", emoji: "🚀" },
                    { value: "68.6K", label: "engagements", emoji: "⚡" },
                  ].map((s, i) => (
                    <div key={i} style={{
                      padding: "9px 10px",
                      borderRadius: 10,
                      background: "rgba(15,23,42,0.5)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 12, marginBottom: 2 }}>{s.emoji}</div>
                      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 14, fontWeight: 800, color: "#f1f5f9", lineHeight: 1, letterSpacing: "-0.01em" }}>{s.value}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2, fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.05em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack chips */}
              <div style={{ height: 8 }} />
              <div className="mobile-item-9" style={{ marginBottom: 4 }}>
                <SectionLabel>Tech Stack</SectionLabel>
              </div>

              <div className="mobile-item-9" style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                {stack.map((item) => (
                  <StackPill key={item.label} label={item.label} emoji={item.emoji} />
                ))}
              </div>

            </div>

            {/* ── Mobile footer ──────────────────────────────────────────── */}
            <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(6,182,212,0.6)" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.1em" }}>
                Sleep &lt; Deadlines
              </span>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(99,102,241,0.6)" }} />
            </div>

          </div>
        </div>

      </main>
    </>
  );
};

export default Frontpage;
