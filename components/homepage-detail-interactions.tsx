"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { approachSteps, capabilities } from "@/data/homepage-details";
import styles from "./homepage-details.module.css";

const originOpening = "I design and build AI systems that connect tools, automate repetitive work, and";
const originClosing = "keep people in control.";
const originWords = [...originOpening.split(" "), ...originClosing.split(" ")];
const radarShapes = [
  "80,20 128,64 105,116 52,120 24,61",
  "80,41 144,60 93,96 41,133 49,71",
  "80,16 110,70 119,132 62,102 17,60",
];

export function OriginScrub() {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start 65%", "end 35%"] });
  useEffect(() => {
    function updateProgress(progress: number) {
      section.current?.style.setProperty("--origin-progress", String(progress));
    }
    updateProgress(scrollYProgress.get());
    return scrollYProgress.on("change", updateProgress);
  }, [scrollYProgress]);

  return (
    <div className={styles.originTrack} ref={section}>
      <div className={styles.originStage}>
        <h2 id="approach-title" className={styles.originTitle} aria-label={`${originOpening} ${originClosing}`}>
          {originWords.map((word, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={index >= originOpening.split(" ").length ? styles.originAccent : undefined}
              style={{ "--word": index, "--words": originWords.length } as CSSProperties}
            >
              {word}{" "}
            </span>
          ))}
        </h2>
      </div>
    </div>
  );
}

export function ApproachCarousel() {
  const reduceMotion = useReducedMotion();
  const deck = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: deck, offset: ["start start", "end end"] });

  return (
    <div ref={deck} className={styles.stack} role="list" aria-label="AI engineering process">
      {approachSteps.map(({ title, description }, index) => (
        <StackCard
          key={title}
          index={index}
          total={approachSteps.length}
          title={title}
          description={description}
          progress={scrollYProgress}
          reduceMotion={reduceMotion === true}
        />
      ))}
    </div>
  );
}

function StackCard({ index, total, title, description, progress, reduceMotion }: {
  index: number;
  total: number;
  title: string;
  description: string;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  // Earlier cards shrink slightly as later cards stack over them.
  const targetScale = 1 - (total - index - 1) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div role="listitem" className={styles.stackSlot} style={{ "--i": index, zIndex: index + 1 } as CSSProperties}>
      <motion.article className={styles.stackCard} style={{ scale: reduceMotion ? 1 : scale }}>
        <div className={styles.stackArt} aria-hidden="true" style={{ backgroundImage: `url(/assets/approach/${title.toLowerCase()}.webp)` }} />
        <div className={styles.stackCopy}>
          <p className={styles.kicker}>Step {index + 1} / {total}</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </motion.article>
    </div>
  );
}

export function PowerProfile() {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 112px", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (window.matchMedia("(max-width: 52rem), (prefers-reduced-motion: reduce)").matches) return;
    setActive(Math.min(capabilities.length - 1, Math.floor(progress * capabilities.length)));
  });
  const capability = capabilities[active];

  return (
    <div ref={track} className={styles.profileTrack}>
    <div className={styles.profile}>
      <div role="group" aria-label="Capabilities" className={styles.profileControls}>
        {capabilities.map((item, index) => (
          <button key={item.title} type="button" aria-pressed={active === index} aria-controls="power-profile" onClick={() => setActive(index)}>
            <span aria-hidden="true">PWR / 0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className={styles.profilePanel} id="power-profile">
        <svg viewBox="0 0 160 160" className={styles.scope} aria-hidden="true">
          <polygon points="80,12 145,59 120,135 40,135 15,59" />
          <polygon points="80,35 123,66 106,116 54,116 37,66" />
          <polygon points="80,57 102,73 93,98 67,98 58,73" />
          <path d="M80 12v68l65-21M80 80l40 55M80 80l-40 55M80 80L15 59" />
          <motion.polygon
            className={styles.radarShape}
            initial={false}
            animate={{ points: radarShapes[active] }}
            transition={{ duration: reduceMotion ? 0 : .65, ease: [.2, .75, .2, 1] }}
          />
          <circle cx="80" cy="80" r="3" />
        </svg>
        <div>
          <p className={styles.kicker}>Profile / 0{active + 1}</p>
          <h3>{capability.title}</h3>
          <p>{capability.description}</p>
          <p className={styles.evidence}>{capability.evidence}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

export function SignalHeadline() {
  const filterId = useId();

  function moveDistortion(event: PointerEvent<HTMLHeadingElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const heading = event.currentTarget;
    const bounds = heading.getBoundingClientRect();
    heading.style.setProperty("--signal-pointer-x", `${event.clientX - bounds.left}px`);
    heading.style.setProperty("--signal-pointer-y", `${event.clientY - bounds.top}px`);
    heading.dataset.distort = "true";
  }

  return (
    <h2
      id="contact-title"
      className={styles.signalTitle}
      onPointerMove={moveDistortion}
      onPointerLeave={(event) => { delete event.currentTarget.dataset.distort; }}
    >
      <span>Send the</span> <span>signal.</span>
      <span className={styles.signalDistortion} aria-hidden="true">
        <span style={{ filter: `url(#${filterId})` }}>Send the</span>
        <span style={{ filter: `url(#${filterId})` }}>signal.</span>
      </span>
      <svg width="0" height="0" className={styles.signalFilter} aria-hidden="true">
        <filter id={filterId} x="-25%" y="-30%" width="150%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency=".025 .05" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="28" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </h2>
  );
}

export function moveMetalHighlight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--metal-x", `${event.clientX - bounds.left}px`);
    button.style.setProperty("--metal-y", `${event.clientY - bounds.top}px`);
  }

export function LiquidMetalContact({ href, label, icon = "↗", compact = false, accent = false }: {
  href: string;
  label: string;
  icon?: string;
  compact?: boolean;
  accent?: boolean;
}) {
  return (
    <a className={`liquid-morph-container ${styles.liquidMetal} ${compact ? styles.compactMetal : ""} ${accent ? styles.accentMetal : ""}`} href={href} onPointerMove={moveMetalHighlight}>
      <span className={`liquid-morph-element ${styles.morphElement}`} aria-hidden="true" />
      <span className={styles.metalIcon} aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
