"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

interface GradualSpacingProps {
  text: string;
  className?: string;
}

export function GradualSpacing({ text, className = "" }: GradualSpacingProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={`inline-flex items-center select-none ${className}`}
      animate={{
        letterSpacing: ["-0.025em", "0.06em", "-0.025em"],
      }}
      transition={{
        duration: 4.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      {words.map((word, wordIdx) => (
        <span key={`w-${wordIdx}`} className="inline-flex items-center">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={`c-${wordIdx}-${charIdx}`}
              className="inline-block"
              animate={{
                y: [0, -1.2, 0],
                opacity: [0.94, 1, 0.94],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                repeatType: "mirror",
                delay: (wordIdx * word.length + charIdx) * 0.08,
                ease: "easeInOut",
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIdx < words.length - 1 && (
            <span className="inline-block w-[0.3em]">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
