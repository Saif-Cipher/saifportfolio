"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { TextGlitch } from "@/components/ui/text-glitch";
import type { Project } from "@/data/projects";
import { BorderBeam } from "@/components/ui/border-beam";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { LiquidButton } from "@/components/ui/liquid-button";

interface ImageAutoSliderProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  speed?: number; // duration in seconds for one full loop
}

export function ImageAutoSlider({
  projects,
  onSelectProject,
  speed = 40,
}: ImageAutoSliderProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Ensure enough items to create seamless looping even when filtered
  const repeatedProjects = useCallback(() => {
    if (!projects || projects.length === 0) return [];
    let list = [...projects];
    // Repeat until we have at least 8 items
    while (list.length < 8) {
      list = [...list, ...projects];
    }
    // Duplicate once more for the 50% translation infinite loop
    return [...list, ...list];
  }, [projects])();

  // Scroll manually via buttons
  const handleScrollBy = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.clientWidth * 0.75;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const isActuallyPaused = isPaused || manualPause || reducedMotion;

  return (
    <div
      className="relative w-full py-4 group/slider select-none"
      aria-label="Portfolio Projects Carousel"
    >
      {/* Masked viewport */}
      <div
        ref={containerRef}
        className="slider-mask-container w-full overflow-hidden focus:outline-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-live={isActuallyPaused ? "polite" : "off"}
      >
        <div
          ref={trackRef}
          className="slider-scroll-track py-3"
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: isActuallyPaused ? "paused" : undefined,
          }}
        >
          {repeatedProjects.map((project, idx) => (
            <article
              key={`${project.id}-${idx}`}
              className="relative flex-shrink-0 w-[290px] sm:w-[360px] md:w-[420px] rounded-2xl overflow-hidden bg-[#F8F7F2] border border-[#22577A]/25 hover:border-[#FB3640] shadow-xl transition-all duration-300 hover:shadow-[0_12px_32px_rgba(34,87,122,0.28)] hover:-translate-y-1.5 cursor-pointer flex flex-col group/card"
              onClick={() => onSelectProject(project)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectProject(project);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${project.title}`}
            >
              {/* Refined Selective Border Beam on Featured Card */}
              {(project.featured || idx % projects.length === 0) && (
                <BorderBeam
                  size={240}
                  duration={11}
                  borderWidth={1.5}
                  colorFrom="#FB3640"
                  colorTo="#22577A"
                />
              )}

              {/* Visual Thumbnail */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#133044]">
                <Image
                  src={project.coverImage}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 640px) 290px, (max-width: 1024px) 360px, 420px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover/card:scale-105"
                  priority={idx < 4}
                />

                {/* Dark Burgundy Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F2]/90 via-transparent to-black/30 opacity-70 group-hover/card:opacity-30 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <span className="px-2 py-0.5 rounded bg-[#133044]/90 border border-[#22577A]/60 font-mono text-xs font-bold text-[#F8F7F2] tracking-wider backdrop-blur-md">
                    {project.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#133044]/90 border border-[#22577A]/60 font-mono text-[10px] font-bold text-[#F8F7F2] uppercase tracking-widest backdrop-blur-md">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Bottom subtitle overlay on thumbnail */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-[#F8F7F2]/90 font-mono z-10 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                  <span className="truncate mr-2"><TextGlitch text={project.subtitle} trigger="hover" /></span>
                  <span className="text-[#FB3640] font-bold text-sm">↗</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#F8F7F2]">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[#FB3640] font-mono text-sm font-semibold">
                      /{project.number}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#133044] group-hover/card:text-[#FB3640] transition-colors line-clamp-1">
                      <TextGlitch text={project.title} trigger="hover" />
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#133044]/80 line-clamp-2 mt-1 mb-3 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                {/* Tools Tags & Action Bar */}
                <div className="pt-3 border-t border-[#22577A]/20 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAE6DC] text-[#133044] font-medium border border-[#22577A]/20"
                      >
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#133044]/60">
                        +{project.tools.length - 3}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#FB3640] group-hover/card:text-[#133044] transition-colors shrink-0">
                    <RandomLetterSwap text="INSPECT ↗" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Slider Controls Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-2 sm:px-4">
        {/* Status / Pause Note */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#F8F7F2]/80">
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isActuallyPaused
                ? "bg-[#FB3640] animate-pulse"
                : "bg-[#FB3640]"
            }`}
          />
          <span>
            {reducedMotion
              ? "REDUCED MOTION: STATIC"
              : isActuallyPaused
              ? "PAUSED (HOVER / TOGGLE)"
              : "AUTO-SLIDING • HOVER TO PAUSE"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <LiquidButton
            variant="secondary"
            onClick={() => handleScrollBy("left")}
            className="px-3.5 py-1.5 text-xs"
            aria-label="Scroll left"
          >
            ← PREV
          </LiquidButton>

          <LiquidButton
            variant={manualPause ? "primary" : "secondary"}
            onClick={() => setManualPause(!manualPause)}
            className="px-3.5 py-1.5 text-xs"
            aria-label={manualPause ? "Resume auto-sliding" : "Pause auto-sliding"}
          >
            {manualPause ? "▶ RESUME" : "❚❚ PAUSE"}
          </LiquidButton>

          <LiquidButton
            variant="secondary"
            onClick={() => handleScrollBy("right")}
            className="px-3.5 py-1.5 text-xs"
            aria-label="Scroll right"
          >
            NEXT →
          </LiquidButton>
        </div>
      </div>
    </div>
  );
}