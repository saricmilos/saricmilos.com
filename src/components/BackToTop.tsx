"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      setShow(scrolled > 400);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── progress ring maths ──
  const R = 18;
  const C = 2 * Math.PI * R;          // circumference
  const filled = C * (progress / 100); // how much of the ring to draw

  return (
    <div
      className={`
        fixed bottom-8 right-8 z-[60]
        transition-all duration-500 ease-out
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="
          group relative
          w-14 h-14 rounded-full
          bg-white/70 dark:bg-slate-900/70
          backdrop-blur-sm
          border border-gray-200 dark:border-slate-700
          shadow-lg shadow-black/8 dark:shadow-black/30
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-xl hover:shadow-blue-500/20
          hover:border-gray-300 dark:hover:border-slate-600
          active:scale-95
        "
      >
        {/* ── progress ring ── */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 56 56"
        >
          {/* track (empty ring) */}
          <circle
            cx="28" cy="28" r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-gray-200 dark:text-slate-800"
          />

          {/* filled arc – drawn as two segments so the gradient
              always covers the visible portion cleanly */}
          <defs>
            <linearGradient id="btg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#a855f7" /> {/* purple-500 */}
              <stop offset="50%"  stopColor="#3b82f6" /> {/* blue-500  */}
              <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500  */}
            </linearGradient>
          </defs>

          <circle
            cx="28" cy="28" r={R}
            fill="none"
            stroke="url(#btg)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${C - filled}`}
            style={{ transition: 'stroke-dasharray 0.15s linear' }}
          />
        </svg>

        {/* ── arrow icon ── */}
        <ArrowUp
          className="
            relative z-10
            w-5 h-5
            text-gray-700 dark:text-slate-200
            transition-transform duration-300
            group-hover:-translate-y-1
          "
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default BackToTop;