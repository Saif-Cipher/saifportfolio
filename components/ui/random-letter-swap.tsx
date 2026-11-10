"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";

interface RandomLetterSwapProps {
  text: string;
  className?: string;
  isTriggered?: boolean;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export function RandomLetterSwap({
  text,
  className = "",
  isTriggered = false,
}: RandomLetterSwapProps) {
  // null means "show the real text"; a string is the current scramble frame.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const animatingRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  const startScramble = useCallback(() => {
    if (reduceMotion || animatingRef.current) return;
    animatingRef.current = true;

    const chars = text.split("");
    const length = chars.length;
    let iteration = 0;
    const maxIterations = 9;

    const tick = () => {
      iteration++;
      const resolvedCount = Math.floor((iteration / maxIterations) * length);

      const next = chars
        .map((char, index) => {
          if (char === " " || char === "↗" || char === "↘" || char === "•" || char === "/" || char === "›") {
            return char;
          }
          if (index < resolvedCount) {
            return char;
          }
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setScrambled(next);

      if (iteration < maxIterations) {
        frameRef.current = window.setTimeout(tick, 35);
      } else {
        setScrambled(null);
        animatingRef.current = false;
      }
    };

    tick();
  }, [text, reduceMotion]);

  useEffect(() => {
    if (!isTriggered) return;
    startScramble();
    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
      animatingRef.current = false;
      setScrambled(null);
    };
  }, [isTriggered, startScramble]);

  return (
    <span
      className={`inline-block whitespace-nowrap font-mono tabular-nums ${className}`}
      aria-label={text}
    >
      {scrambled ?? text}
    </span>
  );
}
