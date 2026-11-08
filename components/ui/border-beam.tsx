"use client";

import React from "react";
import { useReducedMotion } from "motion/react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className = "",
  size = 280,
  duration = 12,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#FB3640",
  colorTo = "#22577A",
  delay = 0,
}: BorderBeamProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-[#FB3640]/30 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={`border-beam-mesh ${className}`}
    />
  );
}

