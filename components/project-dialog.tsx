"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { BorderBeam } from "@/components/ui/border-beam";
import { LiquidButton } from "@/components/ui/liquid-button";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previousFocus.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previousFocus.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#102B3E]/85 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#22577A]/30 bg-[#F8F7F2] text-[#133044] shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
          >
            {/* Refined Border Beam */}
            <BorderBeam
              size={320}
              duration={14}
              borderWidth={1.5}
              colorFrom="#FB3640"
              colorTo="#22577A"
            />

            {/* Top Toolbar */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#22577A]/25 bg-[#F8F7F2]/95 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg text-vivid-red">
                  /{project.number}
                </span>
                <span className="font-mono text-xs font-bold tracking-widest text-[#22577A] uppercase">
                  {project.categoryLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center border border-[#22577A]/25 text-[#133044] transition-colors hover:border-vivid-red hover:bg-vivid-red hover:text-[#133044] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vivid-red"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#102B3E]">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover preview`}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 900px"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F2] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 text-[#133044] pointer-events-none">
                <span className="font-mono text-xs font-semibold tracking-wider text-[#133044] uppercase">
                  {project.subtitle}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              {/* Title & One-line Summary */}
              <div>
                <h2
                  id="dialog-title"
                  className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#133044] leading-tight"
                >
                  {project.title}
                </h2>
                <p className="mt-3 text-base sm:text-lg text-[#22577A] leading-relaxed max-w-2xl">
                  {project.summary}
                </p>
              </div>

              {/* Context / Problem */}
              <div className="border-t border-[#22577A]/25 pt-6">
                <h3 className="font-mono text-xs font-bold tracking-widest text-vivid-red uppercase">
                  01 / Context & Challenge
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#133044]/80 leading-relaxed">
                  {project.context}
                </p>
              </div>

              {/* Workflow Architecture */}
              <div className="border-t border-[#22577A]/25 pt-6">
                <h3 className="font-mono text-xs font-bold tracking-widest text-vivid-red uppercase">
                  02 / Workflow Architecture
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#133044]/80 leading-relaxed">
                  {project.workflowOverview}
                </p>

                {/* Key Stages */}
                {project.keyStages && project.keyStages.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.keyStages.map((stage, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-[#EAE6DC] border border-[#22577A]/25"
                      >
                        <span className="font-mono text-xs font-bold text-vivid-red">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#133044]">
                          {stage}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified Stack / Tools */}
              {project.tools && project.tools.length > 0 && (
                <div className="border-t border-[#22577A]/25 pt-6">
                  <h3 className="font-mono text-xs font-bold tracking-widest text-vivid-red uppercase">
                    03 / Verified Stack & Integrations
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 bg-[#EAE6DC] text-[#133044] rounded font-mono text-xs tracking-wider uppercase border border-[#22577A]/25"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="border-t border-[#22577A]/25 pt-6 flex flex-wrap items-center justify-between gap-4">
                {project.externalUrl ? (
                  <LiquidButton
                    variant="primary"
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    icon={<span>↗</span>}
                  >
                    OPEN LIVE DEPLOYMENT
                  </LiquidButton>
                ) : (
                  <span className="font-mono text-xs text-[#22577A] font-semibold">
                    Automated Workflow System · Verified Implementation
                  </span>
                )}
                <LiquidButton
                  variant="secondary"
                  onClick={onClose}
                >
                  CLOSE WINDOW
                </LiquidButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
