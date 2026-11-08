"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Types
export interface FooterLink {
  label: string;
  href: string;
  onClick?: () => void;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface CrewMember {
  kind: "yeti" | "bird" | "mushroom" | "kid" | "ghost" | "cat";
  letter: number; // 0-based index of letter in wordmark
  seat: "front" | "top" | "behind";
  offset?: number;
  scale?: number;
  flip?: boolean;
  name: string;
  says: string;
}

// Doodle icons
function DoodleIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "sparkle":
      return (
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M0 -12 C1 -5 5 -1 12 0 C5 1 1 5 0 12 C-1 5 -5 1 -12 0 C-5 -1 -1 -5 0 -12 Z"
        />
      );
    case "star":
      return (
        <path
          fill="var(--dcf-accent)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M0 -13 L3.5 -4.5 L12.5 -3.5 L6 3 L7.5 12 L0 8 L-7.5 12 L-6 3 L-12.5 -3.5 L-3.5 -4.5 Z"
        />
      );
    case "heart":
      return (
        <path
          fill="var(--dcf-accent)"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M0 11 C-8 4 -12 -2 -10 -7 C-8 -11 -3 -11 0 -6 C3 -11 8 -11 10 -7 C12 -2 8 4 0 11 Z"
        />
      );
    default:
      return (
        <circle cx="0" cy="0" r="6" fill="var(--dcf-accent)" stroke="currentColor" strokeWidth="2" />
      );
  }
}

// Crew character vector artwork
const CREW_ART = {
  yeti: {
    k: 1,
    box: { l: -72, r: 60, t: -140, b: 6 },
    seat: "front" as const,
    eyes: [
      { x: -15, y: -86, r: 8, pupil: 3.6 },
      { x: 13, y: -88, r: 8, pupil: 3.6 },
    ],
    body: (accent: string) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="54" ry="5" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" fill={accent} stroke="none" />
        <path className="n" d="M-67 -64 C-58 -59 -50 -59 -43 -64" />
        <path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z" />
        <path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z" />
        <path className="n" d="M-38 -124 L-28 -119 M39 -125 L33 -116" />
        <path d="M-44 -2 C-54 -28 -54 -66 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -64 58 -28 48 -2 C30 4 -26 4 -44 -2 Z" />
        <path d="M40 -96 C54 -66 54 -30 46 -4 C40 -2 34 -1 30 0 C40 -30 42 -64 33 -101 Z" fill={accent} stroke="none" />
        <path className="n" d="M-7 -117 C-5 -126 1 -128 3 -120 C5 -127 11 -126 11 -116" />
        <path className="n thin" d="M-14 -24 l-3 4 M8 -40 l3 4 M14 -46 l3 3 M20 -30 l3 3" />
        <path className="n" d="M-10 -70 C-4 -64 4 -64 10 -70" />
      </>
    ),
  },
  bird: {
    k: 1.22,
    box: { l: -34, r: 30, t: -62, b: 2 },
    seat: "top" as const,
    eyes: [
      { x: 3, y: -30, r: 4.6, pupil: 2.3 },
      { x: 12, y: -31, r: 4.6, pupil: 2.3 },
    ],
    idle: "dcf-peck",
    body: (accent: string) => (
      <>
        <path className="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0" />
        <path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z" />
        <path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z" />
        <path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill={accent} />
        <path className="o" d="M19 -30 L29 -27 L19 -23 Z" />
        <path className="a" d="M-3 -38 L4 -59 L12 -37 Z" />
        <path className="n thin" d="M-1 -44 L10 -46 M1 -51 L8 -52" />
        <circle cx="4" cy="-60" r="2.8" />
      </>
    ),
  },
  mushroom: {
    k: 1.12,
    box: { l: -27, r: 27, t: -56, b: 4 },
    seat: "front" as const,
    eyes: [
      { x: -4.5, y: -16, r: 0, pupil: 1.9 },
      { x: 4.5, y: -16, r: 0, pupil: 1.9 },
    ],
    idle: "dcf-sway",
    body: (accent: string) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="18" ry="3" />
        <path className="n" d="M-10 -15 L-17 -9 M10 -15 L17 -11" />
        <path d="M-10 0 C-12 -10 -10 -22 -8 -28 L8 -28 C10 -22 12 -10 10 0 C4 2 -4 2 -10 0 Z" />
        <path d="M5 -27 C9 -20 11 -10 10 0 C8 1 6 1.5 4 1.5 C6 -8 6 -18 2 -27 Z" fill={accent} stroke="none" />
        <path className="r" d="M-25 -28 C-27 -45 -12 -55 0 -55 C12 -55 27 -45 25 -28 C14 -23 -14 -23 -25 -28 Z" />
        <circle cx="-12" cy="-40" r="4.2" />
        <circle cx="6" cy="-46" r="3.4" />
        <circle cx="15" cy="-34" r="3" />
        <circle cx="-2" cy="-33" r="2.4" />
        <path className="n" d="M-2 -10 C-1 -8 1 -8 2 -10" />
      </>
    ),
  },
  kid: {
    k: 1.28,
    box: { l: -30, r: 30, t: -88, b: 42 },
    seat: "top" as const,
    eyes: [
      { x: -6, y: -58, r: 0, pupil: 2.5 },
      { x: 6.5, y: -58, r: 0, pupil: 2.5 },
    ],
    body: (accent: string) => (
      <>
        <path d="M-15 -6 L-3 -6 C-3 8 -5 20 -6 30 L-15 30 C-15 18 -16 6 -15 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" fill={accent} stroke="none" />
        <path className="k" d="M-17 30 C-20 34 -20 40 -14 41 L-2 41 C2 40 0 34 -5 30 Z" />
        <path className="k" d="M11 29 C8 34 10 40 16 40 L26 38 C29 36 27 30 22 27 Z" />
        <path d="M-20 -4 C-22 -20 -18 -38 -10 -44 L10 -44 C18 -38 22 -20 20 -4 Z" />
        <path className="n thick" d="M-19.5 -14 L19.5 -14 M-18.5 -26 L18.5 -26 M-14 -36 L14 -36" />
        <path className="n" d="M-18 -36 C-28 -28 -30 -14 -26 -5" />
        <circle cx="-26" cy="-3" r="4" />
        <path className="n" d="M18 -36 C27 -30 30 -18 28 -7" />
        <circle cx="28" cy="-4" r="4" />
        <circle cx="-17" cy="-58" r="4" />
        <circle cx="17" cy="-58" r="4" />
        <circle cx="0" cy="-60" r="17" />
        <path className="n thin" d="M-11 -52 l2 -2 M-8 -52 l2 -2 M8 -52 l2 -2 M11 -52 l2 -2" />
        <path className="a" d="M-16 -66 C-14 -82 0 -84 0 -84 C0 -84 14 -82 16 -66 Z" />
        <circle cx="0" cy="-86" r="4" />
        <path className="n" d="M-4 -49 C-2 -46 2 -46 4 -49" />
      </>
    ),
  },
  ghost: {
    k: 1.3,
    box: { l: -26, r: 26, t: -70, b: 0 },
    seat: "behind" as const,
    eyes: [
      { x: -8, y: -44, r: 6.5, pupil: 3.2 },
      { x: 9, y: -44, r: 6.5, pupil: 3.2 },
    ],
    idle: "dcf-bob",
    body: (accent: string) => (
      <>
        <path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z" />
        <path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill={accent} stroke="none" />
        <path className="n thin" d="M-16 -56 C-12 -61 -6 -63 -2 -63" />
        <path className="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z" />
        <path className="n thin" d="M-17 -35 l3 -2 M-14 -34 l3 -2 M14 -35 l3 -2 M17 -34 l3 -2" />
      </>
    ),
    front: () => (
      <>
        <path d="M-25 -32 C-27 -38 -21 -42 -17 -38 C-15 -42 -10 -41 -10 -36 L-11 -30 C-15 -28 -22 -28 -25 -32 Z" />
        <path d="M25 -32 C27 -38 21 -42 17 -38 C15 -42 10 -41 10 -36 L11 -30 C15 -28 22 -28 25 -32 Z" />
      </>
    ),
  },
  cat: {
    k: 1.06,
    box: { l: -30, r: 52, t: -110, b: 4 },
    seat: "front" as const,
    eyes: [
      { x: 10, y: -76, r: 6, pupil: 2.8 },
    ],
    body: (accent: string) => (
      <>
        <ellipse className="dcf-shadow" cx="4" cy="2" rx="32" ry="4" />
        <g className="dcf-tail">
          <path d="M18 -4 C42 -4 52 -24 46 -44 C44 -51 36 -53 34 -46 C40 -30 34 -16 16 -14 Z" />
          <path className="n thin" d="M40 -16 l5 4 M45 -30 l6 1 M43 -42 l6 -3" />
        </g>
        <path d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z" />
        <path d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z" fill={accent} stroke="none" />
        <path className="n" d="M-8 -30 L-9 -1 M8 -30 L9 -1" />
        <path d="M-16 1 C-16 -5 -3 -5 -3 1 Z M3 1 C3 -5 16 -5 16 1 Z" />
        <path className="a" d="M-18 -55 C-6 -49 6 -49 18 -55 L17 -46 C6 -40 -6 -40 -17 -46 Z" />
        <path className="a" d="M9 -45 L18 -32 L6 -37 Z" />
        <path d="M-22 -86 L-25 -107 L-7 -96 Z" />
        <path d="M8 -96 L23 -108 L22 -86 Z" />
        <path className="n thin" d="M-20 -92 L-21 -101 M18 -101 L18 -92" />
        <path d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z" />
        <circle cx="-10" cy="-76" r="7" />
        <path className="k" d="M-17 -76 L-3 -76 L-10 -70 Z" />
        <path className="n" d="M-4 -64 L0 -67 L4 -64" />
        <path className="n thin" d="M-12 -62 L-24 -64 M-12 -58 L-22 -56 M12 -62 L24 -64 M12 -58 L22 -56" />
      </>
    ),
  },
};

interface DoodleCrewFooterProps {
  wordmark?: string;
  brand?: string;
  blurb?: string;
  tagline?: string;
  actions?: { label: string; href: string; icon?: string; variant?: "solid" | "outline" }[];
  crew?: CrewMember[];
  columns?: FooterColumn[];
  socials?: FooterLink[];
  copyright?: string;
}

export function DoodleCrewFooter({
  wordmark = "SAIF HOSSAIN",
  brand = "Saif Hossain",
  blurb = "AI Automations, System Integrations, and Digital Products engineered with intent and verifiable craft.",
  tagline = "Let's make ideas into working systems.",
  actions = [
    { label: "Start a Conversation", href: "mailto:saifhossain.dev@gmail.com", icon: "sparkle", variant: "solid" },
    { label: "Explore Verified Architecture", href: "#work", icon: "star", variant: "outline" },
  ],
  crew = [
    { kind: "yeti", letter: 0, seat: "front", offset: -0.25, name: "Bruno", says: "AI automations, shipped." },
    { kind: "bird", letter: 1, seat: "top", offset: 0.05, name: "Pip", says: "Need high deliverability?" },
    { kind: "mushroom", letter: 2, seat: "front", offset: 0.1, name: "Morel", says: "Resilient low-code bridges." },
    { kind: "kid", letter: 3, seat: "top", offset: -0.05, name: "Juno", says: "Clean TypeScript & Next.js." },
    { kind: "ghost", letter: 5, seat: "behind", offset: 0, name: "Boo", says: "Zero hallucinations here!" },
    { kind: "cat", letter: 8, seat: "front", offset: 0.35, flip: true, name: "Patch", says: "Let's build together." },
  ],
  columns = [
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
        { label: "Lead Generation", href: "#work" },
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
  ],
  socials = [
    { label: "GitHub", href: "https://github.com/saif-hossain" },
    { label: "LinkedIn", href: "https://linkedin.com/in/saif-hossain" },
    { label: "Email", href: "mailto:saifhossain.dev@gmail.com" },
  ],
  copyright = "© 2026 Saif Hossain. All rights reserved.",
}: DoodleCrewFooterProps) {
  const [activeSpeech, setActiveSpeech] = useState<number | null>(null);
  const [hoppingMember, setHoppingMember] = useState<number | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const speechTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMemberClick = (idx: number) => {
    setHoppingMember(idx);
    setActiveSpeech(idx);
    if (speechTimer.current) clearTimeout(speechTimer.current);
    speechTimer.current = setTimeout(() => {
      setActiveSpeech(null);
      setHoppingMember(null);
    }, 3500);
  };

  const handleBackToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Compute letter positions across a standard viewBox
  const letters = wordmark.split("");
  const totalLetters = letters.length;
  const stageWidth = 1200;
  const stageHeight = 260;
  const letterSpacing = stageWidth / Math.max(totalLetters, 1);
  const baseY = 210;

  return (
    <footer
      ref={footerRef}
      className="dcf relative w-full overflow-hidden bg-[#133044] text-[#F8F7F2] border-t border-[#22577A]/50 select-none z-10"
      aria-label="Site Footer"
      style={{
        ["--dcf-bg" as any]: "#133044",
        ["--dcf-ink" as any]: "#F8F7F2",
        ["--dcf-accent" as any]: "#FB3640",
        ["--dcf-soft" as any]: "#F8F7F2",
        ["--dcf-line" as any]: "rgba(34, 87, 122, 0.45)",
      }}
    >
      {/* Top Brand & Navigation Columns */}
      <div className="dcf-top max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Brand & Blurb */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full border-2 border-[#FB3640] bg-[#102B3E] flex items-center justify-center font-mono font-bold text-sm text-[#F8F7F2] shadow-md">
              SH
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-[#F8F7F2]">
              {brand}<span className="text-[#FB3640]">.</span>
            </span>
          </div>
          <p className="font-body text-sm text-[#F8F7F2]/80 leading-relaxed max-w-sm">
            {blurb}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#FB3640]">
            <span className="w-2 h-2 rounded-full bg-[#FB3640] animate-pulse" />
            <span>AVAILABLE FOR Q1 2026 ENGAGEMENTS</span>
          </div>
        </div>

        {/* Navigation, Verified Systems, Live Products Columns */}
        <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.title} className="space-y-3.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FB3640] pb-2 border-b border-[#22577A]/40 flex items-center justify-between">
                <span>{col.title}</span>
                <span className="text-[10px] text-[#F8F7F2]/40 font-normal">0{col.links.length}</span>
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group font-body text-xs sm:text-sm text-[#F8F7F2]/80 hover:text-[#FB3640] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <span className="text-[#22577A] group-hover:text-[#FB3640] transition-colors">›</span>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Wordmark Stage & Doodle Crew */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 overflow-visible">
        <div className="relative w-full overflow-x-auto overflow-y-visible">
          <svg
            className="w-full h-auto min-w-[700px] max-w-[1200px] mx-auto block overflow-visible"
            viewBox={`0 0 ${stageWidth} ${stageHeight}`}
            role="img"
            aria-label={`${wordmark} crew illustration`}
          >
            {/* Ground Line */}
            <path
              d={`M20 ${baseY} Q${stageWidth / 2} ${baseY + 4} ${stageWidth - 20} ${baseY}`}
              fill="none"
              stroke="#22577A"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />

            {/* Behind Letters Crew */}
            {crew
              .filter((m) => m.seat === "behind")
              .map((m, idx) => {
                const art = CREW_ART[m.kind];
                const charX = m.letter * letterSpacing + letterSpacing * 0.5 + (m.offset || 0) * 80;
                const charY = baseY - 60;
                const isHopping = hoppingMember === idx;

                return (
                  <g
                    key={`behind-${idx}`}
                    transform={`translate(${charX}, ${charY}) scale(${m.scale || 1})`}
                    className={`dcf-art cursor-pointer ${isHopping ? "is-hop" : ""}`}
                    onClick={() => handleMemberClick(idx)}
                  >
                    {art.body("#22577A")}
                  </g>
                );
              })}

            {/* Wordmark Letters */}
            {letters.map((char, idx) => {
              const xPos = idx * letterSpacing + letterSpacing * 0.35;
              return (
                <text
                  key={`letter-${idx}`}
                  x={xPos}
                  y={baseY - 10}
                  className="fill-[#F8F7F2] font-serif font-black select-none pointer-events-none"
                  style={{
                    fontSize: "105px",
                    letterSpacing: "0.08em",
                    fill: "#F8F7F2",
                    stroke: "#133044",
                    strokeWidth: "2px",
                  }}
                >
                  {char}
                </text>
              );
            })}

            {/* Behind front parts (e.g. ghost arms holding letter) */}
            {crew
              .filter((m) => m.seat === "behind")
              .map((m, idx) => {
                const art = CREW_ART[m.kind] as any;
                if (!art.front) return null;
                const charX = m.letter * letterSpacing + letterSpacing * 0.5 + (m.offset || 0) * 80;
                const charY = baseY - 60;

                return (
                  <g
                    key={`behind-front-${idx}`}
                    transform={`translate(${charX}, ${charY}) scale(${m.scale || 1})`}
                    className="dcf-art pointer-events-none"
                  >
                    {art.front()}
                  </g>
                );
              })}

            {/* Front & Top Crew */}
            {crew
              .filter((m) => m.seat !== "behind")
              .map((m, idx) => {
                const art = CREW_ART[m.kind];
                const charX = m.letter * letterSpacing + letterSpacing * 0.48 + (m.offset || 0) * 80;
                const charY = m.seat === "top" ? baseY - 110 : baseY - 10;
                const isHopping = hoppingMember === idx;

                return (
                  <g
                    key={`front-${idx}`}
                    transform={`translate(${charX}, ${charY}) scale(${m.scale || (m.flip ? -1 : 1)}, ${m.scale || 1})`}
                    className={`dcf-art cursor-pointer transition-transform duration-300 hover:scale-105 ${
                      isHopping ? "animate-bounce" : ""
                    }`}
                    onClick={() => handleMemberClick(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${m.name}: ${m.says}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleMemberClick(idx);
                      }
                    }}
                  >
                    {art.body("#22577A")}
                  </g>
                );
              })}
          </svg>

          {/* Speech Bubble Popup */}
          {activeSpeech !== null && crew[activeSpeech] && (
            <div
              className="absolute z-20 px-3.5 py-1.5 rounded-xl bg-[#F8F7F2] text-[#133044] font-mono text-xs font-bold shadow-2xl border-2 border-[#FB3640] pointer-events-none animate-in fade-in zoom-in duration-200"
              style={{
                left: `${Math.min(
                  Math.max(
                    ((crew[activeSpeech].letter * letterSpacing + letterSpacing * 0.48) / stageWidth) * 100,
                    12
                  ),
                  88
                )}%`,
                top: crew[activeSpeech].seat === "top" ? "10%" : "38%",
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[#FB3640]">●</span>
                <span>{crew[activeSpeech].name}:</span>
                <span className="font-semibold text-[#133044]">
                  &ldquo;{crew[activeSpeech].says}&rdquo;
                </span>
              </div>
              {/* Little arrow */}
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#F8F7F2]" />
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-8 text-center space-y-6">
        <p className="font-display text-xl sm:text-2xl font-bold text-[#F8F7F2] tracking-tight">
          {tagline}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {actions.map((act) => (
            <a
              key={act.label}
              href={act.href}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8F7F2] ${
                act.variant === "solid"
                  ? "bg-[#FB3640] text-[#F8F7F2] hover:bg-[#22577A] shadow-[0_0_20px_rgba(251,54,64,0.4)]"
                  : "bg-[#133044] text-[#F8F7F2] border border-[#22577A] hover:border-[#FB3640] hover:text-[#F8F7F2]"
              }`}
            >
              {act.icon && (
                <svg viewBox="-16 -16 32 32" width="16" height="16" aria-hidden="true">
                  <DoodleIcon kind={act.icon} />
                </svg>
              )}
              <span>{act.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Legal & Back to Top Bar */}
      <div className="border-t border-[#22577A]/40 bg-[#102B3E]/70 px-6 sm:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#F8F7F2]/70">
          <p>{copyright}</p>

          <div className="flex items-center gap-6">
            {socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                className="hover:text-[#F8F7F2] transition-colors"
                target={soc.href.startsWith("http") ? "_blank" : undefined}
                rel={soc.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {soc.label}
              </a>
            ))}

            <button
              type="button"
              onClick={handleBackToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#22577A] hover:border-[#FB3640] text-[#F8F7F2] hover:text-[#F8F7F2] transition-colors active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FB3640]"
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
