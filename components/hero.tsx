"use client";

import { useId, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { LiquidMetalContact } from "./homepage-detail-interactions";
import { Portrait } from "@/components/portrait";
import styles from "./hero.module.css";

const projectCounts = [["Automations", "06"], ["Websites", "03"], ["Enterprise app", "01"]];
const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>_";

function scramble(before: string, after: string, frame: number, offset: number) {
  if (frame < 4) return before;
  if (frame >= 31) return after;
  const resolved = Math.floor((frame - 10) / 4);
  return Array.from({ length: Math.max(before.length, after.length) }, (_, index) => {
    if (index < resolved) return after[index] ?? "";
    if (index > frame - 4 && frame < 12) return before[index] ?? "";
    return glyphs[(frame * 11 + index * 19 + offset) % glyphs.length];
  }).join("");
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const mesh = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const burnFilter = useId();
  const [frame, setFrame] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const scan = useTransform(scrollYProgress, [0.06, 0.76], ["-16%", "116%"]);
  const scanOpacity = useTransform(scrollYProgress, [0.05, 0.14, 0.69, 0.77], [0, 1, 1, 0]);
  const burnY = useTransform(scrollYProgress, [0.81, 0.98], ["108%", "73%"]);
  const burnOpacity = useTransform(scrollYProgress, [0.91, 1], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!reduceMotion) setFrame(Math.floor(progress * 40));
  });
  const animationFrame = reduceMotion ? 0 : frame;
  const titleFrame = Math.floor((animationFrame - 13) * 31 / 20);

  return (
    <section
      className={styles.heroTrack}
      id="home"
      ref={section}
      aria-labelledby="hero-title"
      onPointerMove={(event) => {
        if (reduceMotion || event.pointerType !== "mouse") return;
        const bounds = mesh.current?.parentElement?.getBoundingClientRect();
        if (!bounds) return;
        mesh.current?.style.setProperty("--mesh-x", `${(event.clientX - bounds.left) / bounds.width * 100}%`);
        mesh.current?.style.setProperty("--mesh-y", `${(event.clientY - bounds.top) / bounds.height * 100}%`);
      }}
      onPointerLeave={() => {
        mesh.current?.style.removeProperty("--mesh-x");
        mesh.current?.style.removeProperty("--mesh-y");
      }}
    >
      <motion.div className={styles.hero} style={{ "--suit-scan": scan } as MotionStyle}>
        <div ref={mesh} className={styles.mesh} aria-hidden="true" />
        <div className={styles.frame} aria-hidden="true" />
        <div className={styles.stage}>
          <h1 id="hero-title" className={styles.title} aria-label="Saif Hossain">
            <span aria-hidden="true">{scramble("SAIF", "CIPHER", titleFrame, 0)}</span>
            <span aria-hidden="true">{scramble("HOSSAIN", "HOST", titleFrame, 7)}</span>
          </h1>
          <Portrait />
          <motion.svg className={styles.scan} viewBox="0 0 1200 16" preserveAspectRatio="none" aria-hidden="true" style={{ top: scan, opacity: scanOpacity }}>
            <path d="M0 8H270l24 1 19-2 22 1 16-2 9 3 14-1 10 2 12-3 12 1 8-3 7 4 11-2 8 3 10-5 12 3 8-2 10 4 8-5 6 3 7-1 9 4 8-6 11 4 10-5 5 4 10 1 6-4 8 5 11-3 10 2 7-4 9 6 12-5 9 3 10-2 12 3 11-3 13 2 18-1 12 1 26-2 25 1 23-1H1200" />
          </motion.svg>
        </div>
        <div className={styles.info}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>AI AUTOMATION SPECIALIST<br />AI ENGINEER / WEB DEVELOPER</p>
            <p>I build practical AI workflows and digital products that connect ideas to execution.</p>
            <div className={styles.actions}>
              <LiquidMetalContact href="/work" label="Explore selected work" icon="↘" compact accent />
              <LiquidMetalContact href="#contact" label="Get in touch" compact />
            </div>
          </div>
          <dl className={styles.counts} aria-label="Portfolio project counts">
            {projectCounts.map(([name, count]) => <div key={name}><dt>{name}</dt><dd>{count}</dd></div>)}
          </dl>
        </div>
        <motion.svg className={styles.burn} viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true" style={{ y: burnY, opacity: burnOpacity }}>
          <defs>
            <filter id={burnFilter} x="-8%" y="-20%" width="116%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency=".012 .023" numOctaves="3" seed="5" />
              <feDisplacementMap in="SourceGraphic" scale="37" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path d="M-60 64 Q 52 38 140 62 T 320 60 T 490 48 T 680 72 T 860 48 T 1040 73 T 1260 55 V 900 H -60 Z" filter={`url(#${burnFilter})`} />
        </motion.svg>
      </motion.div>
    </section>
  );
}
