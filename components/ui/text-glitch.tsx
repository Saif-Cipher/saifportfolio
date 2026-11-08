"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface TextGlitchProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  trigger?: "inView" | "hover" | "both";
  delay?: number; // in seconds (e.g. 0.1)
  speed?: number; // ms per frame (default: 32)
  duration?: number; // total decode duration ms (default: 550)
  hoverGlitch?: boolean;
  preserveSpacing?: boolean;
}

const DEFAULT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!<>_/~[]{}*#";

export function TextGlitch({
  text,
  className = "",
  as: Component = "span",
  trigger = "both",
  delay = 0,
  speed = 30,
  duration = 550,
  hoverGlitch = true,
}: TextGlitchProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-8% 0px" });
  const reduceMotion = useReducedMotion();

  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const hasTriggeredInView = useRef<boolean>(false);
  const frameRef = useRef<number | null>(null);

  const startGlitch = useCallback(
    (customDuration = duration) => {
      if (reduceMotion || !text) {
        setDisplayText(text);
        return;
      }

      setIsAnimating(true);
      const totalFrames = Math.max(10, Math.floor(customDuration / speed));
      let currentFrame = 0;

      if (frameRef.current) {
        clearInterval(frameRef.current);
      }

      frameRef.current = window.setInterval(() => {
        currentFrame++;
        const progress = currentFrame / totalFrames;

        const scrambled = text
          .split("")
          .map((char, index) => {
            // Preserve spaces and special structural breaks so layout never shifts
            if (char === " " || char === "\n" || char === "\t") return char;

            // Lock character into place as progress advances across the string length
            const charProgress = index / text.length;
            if (progress >= 1 || (progress > 0.45 && charProgress <= progress - 0.15)) {
              return char;
            }

            // Pick random scramble character
            const randomIndex = Math.floor(Math.random() * DEFAULT_CHARS.length);
            const scrambleChar = DEFAULT_CHARS[randomIndex];
            return char === char.toLowerCase() ? scrambleChar.toLowerCase() : scrambleChar;
          })
          .join("");

        setDisplayText(scrambled);

        if (currentFrame >= totalFrames) {
          if (frameRef.current) clearInterval(frameRef.current);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, speed);
    },
    [text, duration, speed, reduceMotion]
  );

  // InView Trigger on Scroll
  useEffect(() => {
    if (isInView && !hasTriggeredInView.current && (trigger === "inView" || trigger === "both")) {
      hasTriggeredInView.current = true;
      const timeoutId = setTimeout(() => {
        startGlitch(duration);
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId);
        if (frameRef.current) clearInterval(frameRef.current);
      };
    }
  }, [isInView, delay, duration, startGlitch, trigger]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverGlitch && !isAnimating && (trigger === "hover" || trigger === "both")) {
      startGlitch(Math.min(380, duration));
    }
  };

  const handleFocus = () => {
    if (hoverGlitch && !isAnimating && (trigger === "hover" || trigger === "both")) {
      startGlitch(Math.min(380, duration));
    }
  };

  return (
    <Component
      ref={containerRef}
      className={`inline-block select-text ${className}`}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      aria-label={text}
    >
      {displayText}
    </Component>
  );
}
