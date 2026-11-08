"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export function OriginStory({ text, steps }: { text: string; steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setProgress);
  const words = text.split(" ");

  return (
    <div className="origin-story" ref={ref}>
      <div className="origin-stage">
        <p className="signal-meta">{"// APPROACH / "}<span aria-hidden="true">{String(Math.round(progress * 100)).padStart(3, "0")}%</span></p>
        <p className="origin-manifesto">{words.map((word, index) => (
          <span key={index} data-lit={progress >= index / words.length}>{word}{" "}</span>
        ))}</p>
        <div className="origin-line" aria-hidden="true"><i style={{ scale: `${progress} 1` }} /></div>
        <ol className="origin-steps signal-meta" aria-hidden="true">
          {steps.map((step, index) => <li key={step} data-lit={progress >= index / steps.length}>{step}</li>)}
        </ol>
      </div>
    </div>
  );
}
