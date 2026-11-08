"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LiquidButton } from "@/components/ui/liquid-button";
import { TextGlitch } from "@/components/ui/text-glitch";

interface NavLinkItem {
  number: string;
  label: string;
  href: string;
  tagline: string;
  shapeId: number;
}

const NAV_ITEMS: NavLinkItem[] = [
  {
    number: "01",
    label: "Work",
    href: "#work",
    tagline: "Selected AI automations & digital systems",
    shapeId: 1,
  },
  {
    number: "02",
    label: "Approach",
    href: "#approach",
    tagline: "Five-stage systematic automation architecture",
    shapeId: 2,
  },
  {
    number: "03",
    label: "About",
    href: "#about",
    tagline: "Background, verified toolchain & engineering craft",
    shapeId: 3,
  },
  {
    number: "04",
    label: "Contact",
    href: "#contact",
    tagline: "Start a workflow project or direct inquiry",
    shapeId: 4,
  },
  {
    number: "05",
    label: "Let's Talk",
    href: "#contact",
    tagline: "Available for Q1 2026 client engagements",
    shapeId: 5,
  },
];

export function SterlingGateKineticNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeShape, setActiveShape] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setActiveShape(null);
  }, []);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<any>, href: string) => {
      closeMenu();
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      }
    },
    [closeMenu]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="sterling-gate-root">
      {/* Floating Glass Controls (Detached, Top-Right) */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 flex items-center gap-2.5 sm:gap-3 pointer-events-auto select-none">
        <LiquidButton
          variant="floating-glass"
          href="#contact"
          onClick={(e) => handleLinkClick(e, "#contact")}
          icon={<span className="text-[#FB3640]">↗</span>}
          className="shadow-2xl text-[11px] sm:text-xs px-4 py-2 sm:px-5 sm:py-2.5 border-[#F8F7F2]/25"
        >
          LET'S TALK
        </LiquidButton>

        <LiquidButton
          variant="floating-glass"
          onClick={toggleMenu}
          icon={
            <span
              className="text-[#FB3640] inline-block transition-transform duration-300"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {isOpen ? "✕" : "☰"}
            </span>
          }
          iconPosition="left"
          className="shadow-2xl text-[11px] sm:text-xs px-4 py-2 sm:px-5 sm:py-2.5 border-[#F8F7F2]/25"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </LiquidButton>
      </div>

      {/* Kinetic Gate Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="sg-overlay-root fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Full screen kinetic navigation menu"
          >
            {/* Dark Backdrop */}
            <motion.div
              className="fixed inset-0 bg-[#0B1E2B]/80 backdrop-blur-md cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Kinetic Gate Sliding Panels */}
            <div className="relative z-10 w-full max-w-[620px] h-full flex flex-col pointer-events-auto">
              {/* Layer 1: Vivid Red Gate */}
              <motion.div
                className="sg-gate-layer sg-gate-layer-1"
                initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                transition={{ duration: 0.5, ease: [0.65, 0.01, 0.05, 0.99] }}
              />

              {/* Layer 2: Deep Red Gate */}
              <motion.div
                className="sg-gate-layer sg-gate-layer-2"
                initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.65, 0.01, 0.05, 0.99] }}
              />

              {/* Layer 3: Dark Burgundy Main Stage */}
              <motion.div
                className="sg-gate-stage relative z-10 w-full h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden p-8 sm:p-12 md:p-16"
                initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.65, 0.01, 0.05, 0.99] }}
              >
                {/* Ambient Reactive Background Shapes */}
                <div className="sg-ambient-shapes" aria-hidden="true">
                  {/* Shape 1: Orbit Nodes */}
                  <svg
                    className={`sg-shape sg-shape-1 ${activeShape === 1 ? "active" : ""}`}
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <circle cx="80" cy="120" r="45" fill="rgba(251,54,64,0.18)" />
                    <circle cx="320" cy="80" r="65" fill="rgba(34,87,122,0.35)" />
                    <circle cx="220" cy="300" r="85" fill="rgba(248,247,242,0.15)" />
                  </svg>

                  {/* Shape 2: Flow Wave Curves */}
                  <svg
                    className={`sg-shape sg-shape-2 ${activeShape === 2 ? "active" : ""}`}
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <path
                      d="M0 180 Q100 80, 200 180 T 400 180"
                      stroke="rgba(251,54,64,0.25)"
                      strokeWidth="50"
                    />
                    <path
                      d="M0 260 Q100 160, 200 260 T 400 260"
                      stroke="rgba(34,87,122,0.25)"
                      strokeWidth="35"
                    />
                  </svg>

                  {/* Shape 3: Geometric Matrix Grid */}
                  <svg
                    className={`sg-shape sg-shape-3 ${activeShape === 3 ? "active" : ""}`}
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    {[50, 150, 250, 350].map((cx) =>
                      [60, 160, 260, 360].map((cy) => (
                        <circle
                          key={`${cx}-${cy}`}
                          cx={cx}
                          cy={cy}
                          r="6"
                          fill="rgba(248,247,242,0.25)"
                        />
                      ))
                    )}
                  </svg>

                  {/* Shape 4: Dual Flow Ribbons */}
                  <svg
                    className={`sg-shape sg-shape-4 ${activeShape === 4 ? "active" : ""}`}
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <path
                      d="M80 80 Q140 40, 200 90 Q260 140, 200 200 Q140 260, 80 200 Z"
                      fill="rgba(251,54,64,0.18)"
                    />
                    <path
                      d="M240 180 Q300 140, 360 190 Q400 240, 340 300 Q280 340, 240 280 Z"
                      fill="rgba(34,87,122,0.25)"
                    />
                  </svg>

                  {/* Shape 5: Diagonal Kinetic Beams */}
                  <svg
                    className={`sg-shape sg-shape-5 ${activeShape === 5 ? "active" : ""}`}
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    <line
                      x1="0"
                      y1="80"
                      x2="320"
                      y2="400"
                      stroke="rgba(251,54,64,0.25)"
                      strokeWidth="24"
                    />
                    <line
                      x1="120"
                      y1="0"
                      x2="400"
                      y2="280"
                      stroke="rgba(248,247,242,0.2)"
                      strokeWidth="18"
                    />
                  </svg>
                </div>

                {/* Stage Header */}
                <div className="flex items-center justify-between border-b border-line pb-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-vivid-red">
                      STERLING GATE
                    </span>
                    <span className="block font-mono text-[10px] tracking-wider text-peach-soft mt-1"><TextGlitch text="KINETIC INTERFACE · SAIF HOSSAIN" /></span>
                  </div>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="p-2 border border-line text-peach hover:text-text-main hover:border-vivid-red hover:bg-vivid-red/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Kinetic Typography Nav List */}
                <ul className="sg-menu-list my-auto py-8 space-y-4">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.li
                      key={item.label}
                      className="sg-menu-item relative overflow-hidden"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: 10 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.2 + index * 0.06,
                        ease: [0.2, 0.8, 0.2, 1] as const,
                      }}
                      onMouseEnter={() => setActiveShape(item.shapeId)}
                      onMouseLeave={() => setActiveShape(null)}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className="sg-gate-link group block py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
                      >
                        {/* Hover sliding backdrop */}
                        <div className="sg-link-hover-glow" />

                        <div className="relative z-10 flex items-baseline justify-between">
                          <div className="flex items-baseline gap-4 sm:gap-6">
                            <span className="font-mono text-xs sm:text-sm font-bold text-vivid-red group-hover:text-peach transition-colors">
                              {item.number}
                            </span>
                            <span className="sg-kinetic-title font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-text-main group-hover:text-peach group-hover:translate-x-2 transition-all duration-300">
                              <TextGlitch text={item.label} trigger="both" delay={0.2 + index * 0.05} hoverGlitch />
                            </span>
                          </div>
                          <span className="font-mono text-sm text-vivid-red group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                            ↗
                          </span>
                        </div>

                        <span className="block font-mono text-[11px] text-text-muted mt-1 pl-8 sm:pl-10 group-hover:text-peach-soft transition-colors">
                          <TextGlitch text={item.tagline} delay={0.25 + index * 0.05} />
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Stage Footer Meta */}
                <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-mono text-[10px] tracking-widest text-text-muted uppercase">
                      LOCATION & STATUS
                    </span>
                    <span className="font-mono text-xs text-peach">
                      Chattogram, BD · Open for Select Projects
                    </span>
                  </div>
                  <a
                    href="#contact"
                    onClick={(e) => handleLinkClick(e, "#contact")}
                    className="inline-flex items-center gap-2 bg-vivid-red px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-text-main hover:bg-deep-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach"
                  >
                    Quick Inquiry <span>↗</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
