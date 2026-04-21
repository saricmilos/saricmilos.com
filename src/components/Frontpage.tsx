"use client";

import { ArrowRight, Bot, CheckCircle, Code, Server, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import CassiopeiaStars from "./CassiopeiaStars";

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

type PricingCategory = "CHATBOT" | "WEBSITE" | "BACKEND" | "RECOMMENDATION";

const pricingPlans: Record<PricingCategory, PricingPlan[]> = {
  CHATBOT: [
    {
      name: "Starter Bot",
      price: "$299",
      period: "/ month",
      features: [
        "Website chatbot setup",
        "FAQ knowledge base",
        "Lead capture flows",
        "Basic analytics",
        "Responsive UI",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Growth Bot",
      price: "$799",
      period: "/ month",
      features: [
        "Everything in Starter",
        "Custom tone and prompts",
        "CRM handoff",
        "Multistep flows",
        "Priority support",
        "Monthly optimization",
        "Deployment help",
      ],
      popular: true,
    },
    {
      name: "Enterprise Bot",
      price: "Custom",
      period: "",
      features: [
        "Private knowledge sources",
        "Advanced routing",
        "Team permissions",
        "Custom integrations",
        "Security review",
        "Load-tested deployment",
        "Dedicated support",
      ],
      popular: false,
    },
  ],
  WEBSITE: [
    {
      name: "Landing Site",
      price: "$1,499",
      period: "one-time",
      features: [
        "Custom homepage design",
        "Mobile-first responsive build",
        "Fast performance tuning",
        "Basic SEO setup",
        "Contact forms",
        "Launch support",
      ],
      popular: false,
    },
    {
      name: "Business Site",
      price: "$3,999",
      period: "one-time",
      features: [
        "Multi-page marketing site",
        "CMS-ready structure",
        "Animation and polish",
        "Analytics integration",
        "Conversion-focused sections",
        "Performance review",
        "Post-launch updates",
      ],
      popular: true,
    },
    {
      name: "Enterprise Web",
      price: "Custom",
      period: "",
      features: [
        "Design system alignment",
        "Content architecture",
        "Advanced integrations",
        "Scalable component library",
        "Accessibility pass",
        "Technical SEO review",
        "Team handoff",
      ],
      popular: false,
    },
  ],
  BACKEND: [
    {
      name: "API Build",
      price: "$2,499",
      period: "per project",
      features: [
        "REST or RPC API",
        "Database modeling",
        "Auth setup",
        "Validation and error handling",
        "Deployment support",
        "Technical documentation",
      ],
      popular: false,
    },
    {
      name: "Full-Stack Engine",
      price: "$5,999",
      period: "per project",
      features: [
        "Frontend + backend delivery",
        "Admin dashboard",
        "Monitoring setup",
        "Cloud deployment",
        "CI-ready repo",
        "Security basics",
        "Launch checklist",
      ],
      popular: true,
    },
    {
      name: "Enterprise Backend",
      price: "Custom",
      period: "",
      features: [
        "Service architecture",
        "Queue and job workflows",
        "Observability",
        "Scaling strategy",
        "Third-party integrations",
        "Infrastructure guidance",
        "Long-term support",
      ],
      popular: false,
    },
  ],
  RECOMMENDATION: [
    {
      name: "Starter Recs",
      price: "$499",
      period: "/ month",
      features: [
        "Simple recommendation logic",
        "Behavior tracking",
        "Dashboard summary",
        "Product feed support",
        "Weekly reporting",
      ],
      popular: false,
    },
    {
      name: "Pro Recs",
      price: "$1,199",
      period: "/ month",
      features: [
        "Personalized ranking",
        "A/B test support",
        "Signal enrichment",
        "API delivery",
        "Performance review",
        "Optimization loops",
      ],
      popular: true,
    },
    {
      name: "Enterprise Recs",
      price: "Custom",
      period: "",
      features: [
        "Custom ML strategy",
        "Large catalog support",
        "Segmented experiences",
        "Analytics warehouse sync",
        "Infrastructure planning",
        "Dedicated collaboration",
      ],
      popular: false,
    },
  ],
};

const services: Service[] = [
  {
    title: "AI Chatbots",
    icon: Bot,
    desc: "Assist visitors, answer questions, and capture leads around the clock.",
    features: ["Custom knowledge base", "Brand voice alignment", "Lead qualification"],
    gradient: "from-fuchsia-500 to-sky-500",
  },
  {
    title: "Frontend Websites",
    icon: Code,
    desc: "Marketing sites and polished interfaces built for speed and conversion.",
    features: ["Responsive layouts", "Performance focused", "Modern interactions"],
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    title: "Backend Systems",
    icon: Server,
    desc: "Reliable APIs and infrastructure for products that need to scale cleanly.",
    features: ["Secure endpoints", "Database design", "Deployment support"],
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    title: "Recommendation Engines",
    icon: Zap,
    desc: "Turn user behavior into smarter product suggestions and better engagement.",
    features: ["Behavior-driven logic", "Personalized outputs", "Measurable results"],
    gradient: "from-violet-500 to-pink-500",
  },
];

const pricingCategories: PricingCategory[] = ["CHATBOT", "WEBSITE", "BACKEND", "RECOMMENDATION"];

const Frontpage = () => {
  const [pricingCategory, setPricingCategory] = useState<PricingCategory>("CHATBOT");
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "Python",
    "PostgreSQL",
    "Docker",
    "AWS",
    "OpenAI",
    "Vercel",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.15),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,#020617_0%,#020617_35%,#000000_100%)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/15"
            style={{ animation: "heroFloat 24s ease-in-out infinite" }}
          />
          <div
            className="absolute right-0 top-1/4 h-[460px] w-[460px] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-violet-500/15"
            style={{ animation: "heroFloat 24s ease-in-out infinite 8s" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15"
            style={{ animation: "heroFloat 24s ease-in-out infinite 15s" }}
          />
        </div>

        <CassiopeiaStars />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-36 text-center sm:pt-32">
          <div className="mb-8 inline-block opacity-0 animate-fadeIn">
            <span className="rounded-full border border-sky-500/20 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Digital products with real momentum
            </span>
          </div>

          <h1
            className="max-w-5xl text-5xl font-light leading-tight tracking-tight opacity-0 animate-fadeIn md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            Websites and AI systems
            <br />
            <span className="bg-gradient-to-r from-fuchsia-600 via-sky-600 to-cyan-600 bg-clip-text font-medium text-transparent dark:from-fuchsia-400 dark:via-sky-400 dark:to-cyan-300">
              built around the Cassiopeia spark
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 opacity-0 animate-fadeIn dark:text-slate-300"
            style={{ animationDelay: "0.4s" }}
          >
            Launch a polished front page, chatbot experience, or backend foundation that
            feels intentional from day one and is ready to grow with your business.
          </p>

          <div
            className="mt-10 flex flex-col gap-5 opacity-0 animate-fadeIn sm:flex-row"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="#services"
              className="group inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 font-medium text-white shadow-lg shadow-sky-500/20 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Explore services
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/60 px-8 py-4 font-medium text-slate-900 backdrop-blur-sm transition hover:border-slate-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
            >
              Start a project
            </a>
          </div>

          <div
            className="mt-16 flex flex-wrap justify-center gap-3 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.8s" }}
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-300/70 bg-white/75 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fadeIn"
          style={{ animationDelay: "1s" }}
        >
          <div className="h-16 w-px bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500" />
        </div>
      </section>

      <section id="services" className="border-t border-slate-200 px-6 py-28 dark:border-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">
              Services
            </p>
            <h2 className="max-w-3xl text-4xl font-light tracking-tight md:text-5xl">
              A sharp front page is stronger when the product behind it is just as solid.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isHovered = hoveredService === idx;

              return (
                <div
                  key={service.title}
                  className="group relative rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                  onMouseEnter={() => setHoveredService(idx)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-8`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg transition-transform duration-500 ${
                        isHovered ? "scale-110 rotate-3" : ""
                      }`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                      {isHovered ? (
                        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-ping text-white" />
                      ) : null}
                    </div>

                    <h3 className="mb-3 text-2xl font-light tracking-tight">{service.title}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {service.desc}
                    </p>
                    <ul className="space-y-2.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-sky-500 dark:text-sky-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {feature}
                          </span>
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

      <section
        id="pricing"
        className="border-t border-slate-200 bg-slate-50 px-6 py-28 dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">
              Pricing
            </p>
            <h2 className="text-4xl font-light tracking-tight md:text-5xl">
              Flexible packages for launches, upgrades, and bigger product bets.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Pick the category closest to your goal and use it as a starting point for scope.
            </p>
          </div>

          <div className="mb-16 flex flex-wrap gap-3">
            {pricingCategories.map((category) => (
              <button
                key={category}
                onClick={() => setPricingCategory(category)}
                className={`rounded-full px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                  pricingCategory === category
                    ? "bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingPlans[pricingCategory].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "scale-[1.02] bg-slate-950 text-white shadow-2xl shadow-slate-950/10 dark:bg-slate-800"
                    : "border border-slate-200 bg-white text-slate-900 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              >
                {plan.popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-fuchsia-600 via-sky-600 to-cyan-600 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg">
                      Most popular
                    </span>
                  </div>
                ) : null}

                <h3 className="mb-2 text-2xl font-light tracking-tight">{plan.name}</h3>

                <div className="mb-8">
                  <span className="text-4xl font-extralight">{plan.price}</span>
                  {plan.period ? (
                    <span
                      className={`ml-1 text-lg ${
                        plan.popular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {plan.period}
                    </span>
                  ) : null}
                </div>

                <div className="mb-10 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <div
                        className={`mt-3 h-1 w-1 flex-shrink-0 rounded-full ${
                          plan.popular ? "bg-cyan-400" : "bg-sky-500"
                        }`}
                      />
                      <span className={plan.popular ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className={`inline-flex w-full items-center justify-center rounded-full py-3 font-medium transition-all duration-300 ${
                    plan.popular
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  }`}
                >
                  {plan.price === "Custom" ? "Talk about scope" : "Get started"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-slate-200 px-6 py-28 dark:border-slate-800">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-light tracking-tight md:text-5xl">
            Ready to turn the first impression into a full product story?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
            Whether you need a front page, an AI assistant, or the backend behind it,
            let&apos;s shape something clean, fast, and memorable.
          </p>
          <div className="mt-10">
            <a
              href="mailto:contact@cassiopeiai.com"
              className="group inline-flex items-center rounded-full bg-slate-950 px-8 py-4 font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              contact@cassiopeiai.com
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes heroFloat {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.08);
          }
          66% {
            transform: translate(-40px, 30px) scale(0.92);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.9s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default Frontpage;
