"use client";

import React, { useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LiquidButton } from "@/components/ui/liquid-button";
import { TextGlitch } from "@/components/ui/text-glitch";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "#home" },
      { label: "Work", href: "#work" },
      { label: "Approach", href: "#approach" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Verified Systems",
    links: [
      { label: "Adaptive HITL RAG", href: "#work" },
      { label: "AI Content Publishing", href: "#work" },
      { label: "Enterprise Lead Gen", href: "#work" },
      { label: "Bulk Email Engine", href: "#work" },
    ],
  },
  {
    title: "Live Products",
    links: [
      { label: "Sumeri Platform", href: "https://sumeri.vercel.app/" },
      { label: "Time and Tide", href: "https://t-ime-tide.vercel.app/" },
      { label: "NeoCut Digital", href: "https://neocutdigital.vercel.app/" },
      { label: "SI Enterprise App", href: "https://sienterprise.vercel.app/" },
    ],
  },
];

const SOCIALS: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/saif-hossain" },
  { label: "LinkedIn", href: "https://linkedin.com/in/saif-hossain" },
  { label: "Email", href: "mailto:saifhossain.dev@gmail.com" },
];

export function MotionFooter() {
  const reduceMotion = useReducedMotion();

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer
      className="motion-footer-root relative w-full overflow-hidden text-[#F8F7F2] z-10 backdrop-blur-md"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(11, 30, 43, 0.45) 15%, rgba(11, 30, 43, 0.88) 35%, #0B1E2B 100%)",
      }}
      aria-label="Footer"
    >

      {/* Background Aurora Glows & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Blue Aurora Dome */}
        <div className="absolute -top-[250px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-radial from-[#22577A]/25 via-[#133044]/10 to-transparent blur-3xl" />
        {/* Vivid Red Accent Halo */}
        <div className="absolute bottom-0 right-10 w-[450px] h-[350px] rounded-full bg-radial from-[#FB3640]/12 via-transparent to-transparent blur-3xl" />
        {/* Subtle Geometric Matrix Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#F8F7F2_1px,transparent_1px),linear-gradient(to_bottom,#F8F7F2_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Kinetic Marquee Ribbon */}
      <div
        className="relative w-full border-b border-transparent py-3.5 overflow-hidden bg-[rgba(19,48,68,0.15)] select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        aria-hidden="true"
      >
        <div
          className={`flex whitespace-nowrap text-xs font-mono tracking-widest text-[#F8F7F2]/65 uppercase ${
            reduceMotion ? "" : "animate-marquee"
          }`}
        >
          <span className="inline-block px-4">
            AI AUTOMATION ARCHITECTURE <span className="text-[#FB3640] px-2">•</span> AGENTIC WORKFLOWS <span className="text-[#FB3640] px-2">•</span> RESILIENT LOW-CODE BRIDGES <span className="text-[#FB3640] px-2">•</span> PRODUCTION-READY SYSTEMS <span className="text-[#FB3640] px-2">•</span> CHATTOGRAM, BD <span className="text-[#FB3640] px-2">•</span>
          </span>
          <span className="inline-block px-4">
            AI AUTOMATION ARCHITECTURE <span className="text-[#FB3640] px-2">•</span> AGENTIC WORKFLOWS <span className="text-[#FB3640] px-2">•</span> RESILIENT LOW-CODE BRIDGES <span className="text-[#FB3640] px-2">•</span> PRODUCTION-READY SYSTEMS <span className="text-[#FB3640] px-2">•</span> CHATTOGRAM, BD <span className="text-[#FB3640] px-2">•</span>
          </span>
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-12">
        {/* Top Action Prompt & Callout */}
        <div className="footer-cta mb-16 p-8 sm:p-12 rounded-3xl bg-[rgba(19,48,68,0.28)] border border-[#22577A]/30 backdrop-blur-xl shadow-[0_16px_48px_rgba(11,30,43,0.45)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FB3640] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FB3640] animate-pulse" />
              <TextGlitch text="DIRECT INQUIRY & COLLABORATION" />
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F8F7F2] tracking-tight">
              <TextGlitch text="Have an ambitious system to automate or scale?" delay={0.15} />
            </h2>
            <p className="font-body text-sm sm:text-base text-[#F8F7F2]/75 leading-relaxed">
              <TextGlitch text="Available for enterprise workflow automation, custom AI agent deployments, and high-performance digital products." delay={0.25} />
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <LiquidButton
              variant="primary"
              href="mailto:saifhossain.dev@gmail.com"
              icon={<span>↗</span>}
            >
              START A CONVERSATION
            </LiquidButton>
            <LiquidButton
              variant="secondary"
              href="#contact"
              icon={<span>↘</span>}
            >
              EXPLORE ARCHITECTURE
            </LiquidButton>
          </div>
        </div>

        {/* 4-Column Structured Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-16 border-b border-[#22577A]/30">
          {/* Identity & Description */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full border border-[#FB3640] bg-[#133044] flex items-center justify-center font-mono font-bold text-sm text-[#F8F7F2] shadow-lg">
                SH
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-[#F8F7F2]">
                <span className="responsive-name-full"><TextGlitch text="Saif Hossain" hoverGlitch /></span><span className="responsive-name-short"><TextGlitch text="Saif" hoverGlitch /></span><span className="text-[#FB3640]">.</span>
              </span>
            </div>
            <p className="font-body text-sm text-[#F8F7F2]/80 leading-relaxed max-w-sm">
              <TextGlitch text="AI Automations, System Integrations, and Digital Products engineered with intent and verifiable craft." delay={0.15} />
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#FB3640]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FB3640]" />
              <span><TextGlitch text="CHATTOGRAM, BANGLADESH · UTC+6" delay={0.2} /></span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {DEFAULT_COLUMNS.map((col) => (
              <div key={col.title} className="space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FB3640] pb-2 border-b border-[#22577A]/40 flex items-center justify-between">
                  <span><TextGlitch text={col.title} hoverGlitch /></span>
                  <span className="text-[10px] text-[#F8F7F2]/40 font-normal">
                    0{col.links.length}
                  </span>
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group font-body text-xs sm:text-sm text-[#F8F7F2]/80 hover:text-[#F8F7F2] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        <span className="text-[#22577A] group-hover:text-[#FB3640] transition-colors">
                          ›
                        </span>
                        <span className="group-hover:translate-x-0.5 transition-transform">
                          <TextGlitch text={link.label} hoverGlitch />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized Masked Grand Typography "SAIF HOSSAIN" */}
        <div className="pt-12 pb-6 overflow-hidden select-none text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="block font-display font-black text-[clamp(2.4rem,8.2vw,8.5rem)] tracking-tight leading-none whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-[#F8F7F2] via-[#F8F7F2]/45 to-[#22577A]/15 pointer-events-none drop-shadow-[0_4px_24px_rgba(34,87,122,0.3)]">
              <span className="responsive-name-full"><TextGlitch text="SAIF HOSSAIN" delay={0.1} hoverGlitch /></span>
              <span className="responsive-name-short"><TextGlitch text="SAIF" delay={0.1} hoverGlitch /></span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Legal & Back to Top Bar */}
      <div className="border-t border-transparent bg-transparent px-6 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#F8F7F2]/70">
          <p><TextGlitch text="© 2026 Saif Hossain. All rights reserved." /></p>

          <div className="flex items-center gap-6">
            {SOCIALS.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                className="hover:text-[#FB3640] transition-colors"
                target={soc.href.startsWith("http") ? "_blank" : undefined}
                rel={soc.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <TextGlitch text={soc.label} hoverGlitch />
              </a>
            ))}

            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#22577A]/60 bg-[#133044]/40 hover:border-[#FB3640] hover:text-[#F8F7F2] transition-colors active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
