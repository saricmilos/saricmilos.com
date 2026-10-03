"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";

// A box to sign in with a finger, a pen or a mouse. It hands back a PNG of just the
// signature (cropped, on a transparent background), or null while the box is empty.
// The box stays white in dark mode too: a signature is ink on paper.

type Props = {
  onChange: (png: string | null) => void;
  clearLabel: string;
  ariaLabel: string;
};

const INK = "#141a4a";

export default function SignaturePad({ onChange, clearLabel, ariaLabel }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [empty, setEmpty] = useState(true);

  // Size the drawing surface to the box and the screen's pixel density.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      const { width, height } = c.getBoundingClientRect();
      // Resizing clears the canvas, so only resize while it is still empty.
      if (strokes.current > 0 && c.width) return;
      c.width = Math.round(width * ratio);
      c.height = Math.round(height * ratio);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId); // keep the stroke when the finger leaves the box
    } catch {
      // a pointer that is already gone can't be captured; drawing goes on without it
    }
    drawing.current = true;
    last.current = point(e);
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = last.current;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
    ctx.fillStyle = INK;
    ctx.fill();
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    const mid = { x: (last.current.x + p.x) / 2, y: (last.current.y + p.y) / 2 };
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.quadraticCurveTo(last.current.x, last.current.y, mid.x, mid.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    strokes.current += 1;
    setEmpty(false);
    onChange(cropped());
  };

  // The signature's own bounds, with a margin, scaled to at most 900 × 300 px.
  const cropped = (): string | null => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return null;
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    let x0 = width, y0 = height, x1 = -1, y1 = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 0) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    const pad = 12;
    x0 = Math.max(0, x0 - pad);
    y0 = Math.max(0, y0 - pad);
    x1 = Math.min(width - 1, x1 + pad);
    y1 = Math.min(height - 1, y1 + pad);
    const w = x1 - x0 + 1;
    const h = y1 - y0 + 1;
    const scale = Math.min(1, 900 / w, 300 / h);
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(w * scale));
    out.height = Math.max(1, Math.round(h * scale));
    out.getContext("2d")?.drawImage(c, x0, y0, w, h, 0, 0, out.width, out.height);
    return out.toDataURL("image/png");
  };

  const clear = () => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    strokes.current = 0;
    setEmpty(true);
    onChange(null);
  };

  return (
    <div>
      <div className="relative rounded-2xl border border-slate-300 bg-white shadow-inner dark:border-slate-600">
        <canvas
          ref={canvas}
          aria-label={ariaLabel}
          role="img"
          className="block h-44 w-full touch-none rounded-2xl"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onPointerLeave={up}
        />
        <div className="pointer-events-none absolute inset-x-6 bottom-9 border-b border-dashed border-slate-300" />
        <span className="pointer-events-none absolute bottom-3 left-6 text-xs text-slate-400">✕</span>
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={empty}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Eraser className="h-4 w-4" strokeWidth={2} />
        {clearLabel}
      </button>
    </div>
  );
}
