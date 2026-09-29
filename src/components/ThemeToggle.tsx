"use client";

import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

// The theme lives on <html data-theme>, set before paint by the script in
// app/layout.tsx from the saved choice (light when there is none). The icon is
// picked by CSS (dark: variant), so nothing here reads the theme during render.
const toggleTheme = () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    // storage blocked: the choice still holds until the page is reloaded
  }
};

const ThemeToggle: React.FC = () => {
  // A choice made in another open tab applies here too, without a reload.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        document.documentElement.dataset.theme = e.newValue;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch between light and dark mode"
      title="Switch between light and dark mode"
      className="
        fixed top-4 right-4 md:top-6 md:right-6 z-[60]
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
      "
    >
      <Sun className="hidden dark:block w-5 h-5" strokeWidth={2} />
      <Moon className="block dark:hidden w-5 h-5" strokeWidth={2} />
    </button>
  );
};

export default ThemeToggle;
