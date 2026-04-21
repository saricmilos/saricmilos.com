"use client";

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Youtube, Sparkles, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

// --- Interfaces ---
interface SocialLink {
  // Added 'youtube' to the allowed IDs
  id: 'linkedin' | 'github' | 'youtube'; 
  href: string;
  icon: LucideIcon;
  label: string;
  colorClass: string;
  hoverColor: string;
  glowColor: string;
}

const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };
    const interval = setInterval(updateYear, 3600000);
    return () => clearInterval(interval);
  }, []);

  const socialLinks: SocialLink[] = [
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/milos-saric-753772237/',
      icon: Linkedin,
      label: 'LinkedIn',
      colorClass: 'from-blue-600 to-blue-500',
      hoverColor: 'group-hover:text-blue-500',
      glowColor: 'group-hover:shadow-blue-500/50'
    },
    {
      id: 'github',
      href: 'https://github.com/saricmilos',
      icon: Github,
      label: 'GitHub',
      colorClass: 'from-purple-600 to-violet-500',
      hoverColor: 'group-hover:text-purple-500',
      glowColor: 'group-hover:shadow-purple-500/50'
    },
    {
      id: 'youtube',
      href: 'https://www.youtube.com/@saricmilos',
      icon: Youtube,
      label: 'YouTube',
      colorClass: 'from-red-600 to-red-500',
      hoverColor: 'group-hover:text-red-500',
      glowColor: 'group-hover:shadow-red-500/50'
    }
  ];

  return (
    <footer className="relative overflow-hidden transition-colors duration-300 bg-slate-50 border-t border-slate-200 dark:bg-slate-950 dark:border-white/5">
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-48 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 dark:opacity-10 bg-blue-600 animate-pulse" 
          style={{ animation: 'float 25s ease-in-out infinite' }} 
        />
        <div 
          className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 dark:opacity-10 bg-purple-600 animate-pulse"
          style={{ animation: 'float 25s ease-in-out infinite 12s' }} 
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 dark:via-purple-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          
          {/* Social Links */}
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
                  <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500 ease-out backdrop-blur-sm 
                    bg-white border border-slate-200 shadow-sm 
                    dark:bg-white/5 dark:border-white/10 dark:shadow-none
                    ${isHovered ? 'scale-110 -translate-y-1' : ''} 
                    group-hover:shadow-lg ${social.glowColor}`}
                  >
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${social.colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <Icon 
                      size={22} 
                      className={`relative z-10 transition-all duration-500 text-slate-400 dark:text-slate-500
                        ${social.hoverColor} ${isHovered ? 'rotate-[-6deg] scale-110' : ''}`}
                      strokeWidth={2}
                    />
                    
                    {isHovered && (
                      <>
                        <Sparkles 
                          size={12} 
                          className="absolute -top-1 -right-1 text-red-500 dark:text-white animate-ping"
                        />
                        <Sparkles 
                          size={10} 
                          className="absolute -bottom-1 -left-1 text-blue-500 dark:text-white animate-ping"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </>
                    )}
                  </div>

                  <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-300 pointer-events-none
                    bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl
                    ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
                  >
                    {social.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                  </span>
                </a>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 transition-colors duration-300">
              {t('copyright', { year: currentYear })}
              <span className="block sm:inline sm:ml-1 opacity-70">{t('allRightsReserved')}</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
