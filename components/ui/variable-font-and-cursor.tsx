"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useMousePosition, useMousePositionRef } from "@/components/hooks/use-mouse-position";

export interface FontVariationAxis {
  name: string;
  min: number;
  max: number;
}

export interface FontVariationMapping {
  x?: FontVariationAxis;
  y?: FontVariationAxis;
}

export interface VariableFontAndCursorProps {
  label: string;
  className?: string;
  fontVariationMapping?: FontVariationMapping;
  containerRef?: React.RefObject<HTMLElement | null>;
  onClick?: () => void;
}

/**
 * VariableFontAndCursor
 * Dynamic typography component that shifts font variation settings based on cursor movement.
 */
export function VariableFontAndCursor({
  label,
  className = "",
  fontVariationMapping = {
    y: { name: "wght", min: 400, max: 900 },
    x: { name: "slnt", min: 0, max: -10 },
  },
  containerRef,
  onClick,
  ...rest
}: VariableFontAndCursorProps) {
  const mouseRef = useMousePositionRef(containerRef);
  const spanRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const calculateSettings = useCallback(
    (x: number, y: number) => {
      const el = containerRef?.current || (typeof document !== "undefined" ? document.body : null);
      if (!el) return "";
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      const normX = Math.min(Math.max(x / w, 0), 1);
      const normY = Math.min(Math.max(y / h, 0), 1);

      const parts: string[] = [];
      if (fontVariationMapping.x) {
        const valX =
          fontVariationMapping.x.min +
          (fontVariationMapping.x.max - fontVariationMapping.x.min) * normX;
        parts.push(`'${fontVariationMapping.x.name}' ${Math.round(valX)}`);
      }
      if (fontVariationMapping.y) {
        const valY =
          fontVariationMapping.y.min +
          (fontVariationMapping.y.max - fontVariationMapping.y.min) * normY;
        parts.push(`'${fontVariationMapping.y.name}' ${Math.round(valY)}`);
      }

      return parts.join(", ");
    },
    [containerRef, fontVariationMapping]
  );

  useEffect(() => {
    if (reduceMotion) return;
    let animId: number;
    const loop = () => {
      if (mouseRef.current.isVisible) {
        const settings = calculateSettings(mouseRef.current.x, mouseRef.current.y);
        if (spanRef.current && settings) {
          spanRef.current.style.fontVariationSettings = settings;
        }
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [calculateSettings, mouseRef, reduceMotion]);

  return (
    <span
      ref={spanRef}
      className={`inline-block ${className}`}
      onClick={onClick}
      {...rest}
    >
      {label}
    </span>
  );
}

export interface CustomCursorProps {
  showCrosshairs?: boolean;
  showCoordinates?: boolean;
  color?: string;
}

/**
 * PrecisionCrosshairCursor
 * Fullscreen precision variable cursor with crosshairs and interactive element detection.
 * Adheres strictly to Chili Spice palette and non-blocking pointer events.
 */
export function PrecisionCrosshairCursor({
  showCrosshairs = true,
  showCoordinates = true,
  color = "var(--vivid-red)",
}: CustomCursorProps) {
  const { x, y, isVisible } = useMousePosition();
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    // Detect hovering over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, [role='button'], input, textarea, select, .project-card");
      setIsHovered(!!interactive);
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  if (isTouchDevice || !isVisible || reduceMotion) {
    return null;
  }

  return (
    <div
      className="vfc-cursor-root pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Horizontal Crosshair Line */}
      {showCrosshairs && (
        <div
          className="vfc-line-x pointer-events-none fixed left-0 w-screen h-px bg-[rgba(248,247,242,0.18)] -translate-y-1/2 transition-opacity duration-200"
          style={{ top: `${y}px` }}
        />
      )}

      {/* Vertical Crosshair Line */}
      {showCrosshairs && (
        <div
          className="vfc-line-y pointer-events-none fixed top-0 w-px h-screen bg-[rgba(248,247,242,0.18)] -translate-x-1/2 transition-opacity duration-200"
          style={{ left: `${x}px` }}
        />
      )}

      {/* Central Precision Target Dot / Active Ring */}
      <motion.div
        className="vfc-dot pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-vivid-red shadow-[0_0_12px_rgba(251,54,64,0.4)]"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
        animate={{
          width: isHovered ? 28 : 8,
          height: isHovered ? 28 : 8,
          backgroundColor: isHovered ? "rgba(251, 54, 64, 0.16)" : "var(--vivid-red)",
          borderColor: isHovered ? "var(--peach)" : "var(--vivid-red)",
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
      />

      {/* Trailing Micro Dot for Kinetic Weight */}
      <div
        className="vfc-micro-dot pointer-events-none fixed w-1.5 h-1.5 bg-peach -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{
          top: `${y}px`,
          left: `${x}px`,
        }}
      />

      {/* Monospace Precision Coordinates Badge */}
      {showCoordinates && (
        <div className="vfc-coords pointer-events-none fixed bottom-6 left-6 font-mono text-[10px] text-peach/75 tracking-wider tabular-nums bg-[#133044]/80 px-2 py-1 border border-line backdrop-blur-sm">
          <span>X: {Math.round(x)}</span> <span className="text-vivid-red ml-1">·</span> <span className="ml-1">Y: {Math.round(y)}</span>
        </div>
      )}
    </div>
  );
}
