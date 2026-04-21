"use client";

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Zap, Code, Bot, Server, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CassiopeiaStars from './CassiopeiaStars';

// --- Interfaces ---
interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}

interface Service {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  features: string[];
  gradient: string;
}

type PricingCategory = 'CHATBOT' | 'WEBSITE' | 'BACKEND' | 'RECOMMENDATION';

// --- Main Component ---
const Frontpage: React.FC = () => {
  const t = useTranslations('frontpage');
  const [pricingCategory, setPricingCategory] = useState<PricingCategory>('CHATBOT');
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const pricingPlans: Record<PricingCategory, PricingPlan[]> = {
    CHATBOT: [
      {
        name: t('pricing.chatbot.starter.name'),
        price: '$299',
        period: t('pricing.period.month'),
        features: [
          t('pricing.chatbot.starter.f1'),
          t('pricing.chatbot.starter.f2'),
          t('pricing.chatbot.starter.f3'),
          t('pricing.chatbot.starter.f4'),
          t('pricing.chatbot.starter.f5'),
          t('pricing.chatbot.starter.f6'),
        ],
        popular: false,
      },
      {
        name: t('pricing.chatbot.pro.name'),
        price: '$799',
        period: t('pricing.period.month'),
        features: [
          t('pricing.chatbot.pro.f1'),
          t('pricing.chatbot.pro.f2'),
          t('pricing.chatbot.pro.f3'),
          t('pricing.chatbot.pro.f4'),
          t('pricing.chatbot.pro.f5'),
          t('pricing.chatbot.pro.f6'),
          t('pricing.chatbot.pro.f7'),
        ],
        popular: true,
      },
      {
        name: t('pricing.chatbot.enterprise.name'),
        price: t('pricing.custom'),
        period: '',
        features: [
          t('pricing.chatbot.enterprise.f1'),
          t('pricing.chatbot.enterprise.f2'),
          t('pricing.chatbot.enterprise.f3'),
          t('pricing.chatbot.enterprise.f4'),
          t('pricing.chatbot.enterprise.f5'),
          t('pricing.chatbot.enterprise.f6'),
          t('pricing.chatbot.enterprise.f7'),
        ],
        popular: false,
      },
    ],
    WEBSITE: [
      {
        name: t('pricing.website.landing.name'),
        price: '$1,499',
        period: t('pricing.period.oneTime'),
        features: [
          t('pricing.website.landing.f1'),
          t('pricing.website.landing.f2'),
          t('pricing.website.landing.f3'),
          t('pricing.website.landing.f4'),
          t('pricing.website.landing.f5'),
          t('pricing.website.landing.f6'),
        ],
        popular: false,
      },
      {
        name: t('pricing.website.business.name'),
        price: '$3,999',
        period: t('pricing.period.oneTime'),
        features: [
          t('pricing.website.business.f1'),
          t('pricing.website.business.f2'),
          t('pricing.website.business.f3'),
          t('pricing.website.business.f4'),
          t('pricing.website.business.f5'),
          t('pricing.website.business.f6'),
          t('pricing.website.business.f7'),
        ],
        popular: true,
      },
      {
        name: t('pricing.website.enterprise.name'),
        price: t('pricing.custom'),
        period: '',
        features: [
          t('pricing.website.enterprise.f1'),
          t('pricing.website.enterprise.f2'),
          t('pricing.website.enterprise.f3'),
          t('pricing.website.enterprise.f4'),
          t('pricing.website.enterprise.f5'),
          t('pricing.website.enterprise.f6'),
          t('pricing.website.enterprise.f7'),
        ],
        popular: false,
      },
    ],
    BACKEND: [
      {
        name: t('pricing.backend.api.name'),
        price: '$2,499',
        period: t('pricing.period.project'),
        features: [
          t('pricing.backend.api.f1'),
          t('pricing.backend.api.f2'),
          t('pricing.backend.api.f3'),
          t('pricing.backend.api.f4'),
          t('pricing.backend.api.f5'),
          t('pricing.backend.api.f6'),
        ],
        popular: false,
      },
      {
        name: t('pricing.backend.fullstack.name'),
        price: '$5,999',
        period: t('pricing.period.project'),
        features: [
          t('pricing.backend.fullstack.f1'),
          t('pricing.backend.fullstack.f2'),
          t('pricing.backend.fullstack.f3'),
          t('pricing.backend.fullstack.f4'),
          t('pricing.backend.fullstack.f5'),
          t('pricing.backend.fullstack.f6'),
          t('pricing.backend.fullstack.f7'),
        ],
        popular: true,
      },
      {
        name: t('pricing.backend.enterprise.name'),
        price: t('pricing.custom'),
        period: '',
        features: [
          t('pricing.backend.enterprise.f1'),
          t('pricing.backend.enterprise.f2'),
          t('pricing.backend.enterprise.f3'),
          t('pricing.backend.enterprise.f4'),
          t('pricing.backend.enterprise.f5'),
          t('pricing.backend.enterprise.f6'),
          t('pricing.backend.enterprise.f7'),
        ],
        popular: false,
      },
    ],
    RECOMMENDATION: [
      {
        name: t('pricing.recsys.starter.name'),
        price: '$499',
        period: t('pricing.period.month'),
        features: [
          t('pricing.recsys.starter.f1'),
          t('pricing.recsys.starter.f2'),
          t('pricing.recsys.starter.f3'),
          t('pricing.recsys.starter.f4'),
          t('pricing.recsys.starter.f5'),
        ],
        popular: false,
      },
      {
        name: t('pricing.recsys.pro.name'),
        price: '$1,199',
        period: t('pricing.period.month'),
        features: [
          t('pricing.recsys.pro.f1'),
          t('pricing.recsys.pro.f2'),
          t('pricing.recsys.pro.f3'),
          t('pricing.recsys.pro.f4'),
          t('pricing.recsys.pro.f5'),
          t('pricing.recsys.pro.f6'),
        ],
        popular: true,
      },
      {
        name: t('pricing.recsys.enterprise.name'),
        price: t('pricing.custom'),
        period: '',
        features: [
          t('pricing.recsys.enterprise.f1'),
          t('pricing.recsys.enterprise.f2'),
          t('pricing.recsys.enterprise.f3'),
          t('pricing.recsys.enterprise.f4'),
          t('pricing.recsys.enterprise.f5'),
          t('pricing.recsys.enterprise.f6'),
        ],
        popular: false,
      },
    ],
  };

  const services: Service[] = [
    {
      title: t('services.chatbots.title'),
      icon: Bot,
      desc: t('services.chatbots.desc'),
      features: [
        t('services.chatbots.f1'),
        t('services.chatbots.f2'),
        t('services.chatbots.f3'),
      ],
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      title: t('services.websites.title'),
      icon: Code,
      desc: t('services.websites.desc'),
      features: [
        t('services.websites.f1'),
        t('services.websites.f2'),
        t('services.websites.f3'),
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: t('services.backend.title'),
      icon: Server,
      desc: t('services.backend.desc'),
      features: [
        t('services.backend.f1'),
        t('services.backend.f2'),
        t('services.backend.f3'),
      ],
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      title: t('services.recsys.title'),
      icon: Zap,
      desc: t('services.recsys.desc'),
      features: [
        t('services.recsys.f1'),
        t('services.recsys.f2'),
        t('services.recsys.f3'),
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const techStack = [
    'React', 'Next.js', 'TypeScript', 'Python', 'FastAPI',
    'TensorFlow', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans antialiased">

      {/* ── Hero ── full-screen with Cassiopeia stars ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-black dark:to-slate-950">

        {/* Animated gradient orbs – same effect as Footer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-48 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 dark:opacity-10 bg-blue-400 dark:bg-blue-600"
            style={{ animation: 'heroFloat 25s ease-in-out infinite' }}
          />
          <div
            className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 dark:opacity-10 bg-purple-400 dark:bg-purple-600"
            style={{ animation: 'heroFloat 25s ease-in-out infinite 8s' }}
          />
          <div
            className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 dark:opacity-10 bg-cyan-400 dark:bg-cyan-600"
            style={{ animation: 'heroFloat 25s ease-in-out infinite 16s' }}
          />
        </div>

        <CassiopeiaStars />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 sm:pt-0">
          {/* badge */}
          <div className="inline-block mb-8 opacity-0 animate-fadeIn">
            <span className="text-sm font-medium tracking-[0.3em] uppercase text-gray-600 dark:text-slate-300">
              {t('hero.badge')}
            </span>
          </div>

          {/* headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-light mb-6 tracking-tight leading-tight opacity-0 animate-fadeIn text-gray-900 dark:text-white"
            style={{ animationDelay: '0.2s' }}
          >
            {t('hero.headline1')}<br />
            <span className="font-normal bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {t('hero.headline2')}
            </span>
          </h1>

          {/* sub-copy */}
          <p
            className="text-base md:text-lg font-light text-gray-700 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fadeIn"
            style={{ animationDelay: '0.4s' }}
          >
            {t('hero.subCopy')}
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center opacity-0 animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            <a
              href="#services"
              className="group px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-slate-100 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              {t('hero.ctaExplore')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-gray-400 dark:border-slate-300 text-gray-900 dark:text-white font-medium rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-500 dark:hover:border-slate-200 backdrop-blur-sm"
            >
              {t('hero.ctaContact')}
            </a>
          </div>

          {/* tech-stack pills */}
          <div
            className="mt-16 flex flex-wrap justify-center gap-3 opacity-0 animate-fadeIn"
            style={{ animationDelay: '0.8s' }}
          >
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full text-sm font-light border border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeIn" style={{ animationDelay: '1s' }}>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gray-400 dark:from-slate-400 to-transparent" />
        </div>
      </section>

      {/* ── Services ── compact 4-col grid ── */}
      <section id="services" className="relative py-32 px-6 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="text-sm font-medium tracking-[0.3em] uppercase text-gray-500 dark:text-slate-500 mb-6">
              {t('services.eyebrow')}
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isHovered = hoveredService === idx;

              return (
                <div
                  key={idx}
                  className="group relative p-8 rounded-2xl transition-all duration-500 bg-white border border-gray-200 dark:bg-slate-900 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-lg"
                  onMouseEnter={() => setHoveredService(idx)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* subtle gradient wash on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 transition-all duration-500 shadow-lg ${isHovered ? 'scale-110 rotate-3' : ''}`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                      {isHovered && (
                        <Sparkles size={12} className="absolute -top-1 -right-1 text-white animate-ping" />
                      )}
                    </div>

                    <h3 className="text-xl font-light tracking-tight mb-3 text-gray-900 dark:text-slate-100">
                      {service.title}
                    </h3>
                    <p className="mb-5 text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                      {service.desc}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-slate-400">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative py-32 px-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          {/* header */}
          <div className="mb-12">
            <div className="text-sm font-medium tracking-[0.3em] uppercase text-gray-500 dark:text-slate-500 mb-6">
              {t('pricing.eyebrow')}
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            </h2>
            <p className="text-base text-gray-600 dark:text-slate-400 mt-4">
              {t('pricing.subCopy')}
            </p>
          </div>

          {/* category tabs ── styled as subtle pills */}
          <div className="flex flex-wrap gap-3 mb-16">
            {(['CHATBOT', 'WEBSITE', 'BACKEND', 'RECOMMENDATION'] as PricingCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setPricingCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 ${
                  pricingCategory === cat
                    ? 'bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* pricing cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans[pricingCategory].map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gray-900 dark:bg-slate-800 text-white dark:text-slate-100 shadow-2xl shadow-black/10 dark:shadow-black/30 scale-105'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-5 py-1.5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white text-xs font-medium tracking-[0.2em] uppercase rounded-full shadow-lg">
                      {t('pricing.mostPopular')}
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-light tracking-tight mb-2">
                  {plan.name}
                </h3>

                <div className="mb-8">
                  <span
                    className={`text-4xl font-extralight ${
                      plan.popular
                        ? 'text-white dark:text-slate-100'
                        : 'text-gray-900 dark:text-slate-100'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`ml-1 text-lg ${plan.popular ? 'text-gray-300 dark:text-slate-400' : 'text-gray-500 dark:text-slate-500'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div
                        className={`w-1 h-1 rounded-full mt-3 flex-shrink-0 ${
                          plan.popular ? 'bg-cyan-400' : 'bg-blue-500 dark:bg-blue-400'
                        }`}
                      />
                      <span className={`${plan.popular ? 'text-gray-300 dark:text-slate-300' : 'text-gray-700 dark:text-slate-300'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-gray-900 hover:bg-slate-100'
                      : 'bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-gray-800 dark:hover:bg-white'
                  }`}
                >
                  {plan.price === t('pricing.custom') ? t('pricing.contactSales') : t('pricing.getStarted')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="relative py-32 px-6 border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">
            {t('cta.headline')}
          </h2>
          <p className="text-base text-gray-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
            {t('cta.subCopy')}
          </p>
          <div>
            <a
              href="mailto:contact@cassiopeiai.com"
              className="inline-flex items-center px-8 py-4 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium rounded-full transition-all duration-300 hover:bg-gray-800 dark:hover:bg-white group"
            >
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <p className="text-gray-500 dark:text-slate-500">contact@cassiopeiai.com</p>
        </div>
      </section>

      {/* ── Shared animations ── */}
      <style jsx>{`
        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.9); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Frontpage;

