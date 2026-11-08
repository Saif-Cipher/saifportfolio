"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, type MotionStyle } from "motion/react";
import Image from "next/image";
import styles from "./hero.module.css";

export function Portrait() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 280, damping: 35 });
  const smoothY = useSpring(y, { stiffness: 280, damping: 35 });
  const revealX = useMotionTemplate`${smoothX}px`;
  const revealY = useMotionTemplate`${smoothY}px`;

  function moveReveal(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
    if (event.type === "pointerenter") {
      smoothX.jump(x.get());
      smoothY.jump(y.get());
    }
  }

  return (
    <motion.button
      className={styles.portrait}
      style={{ "--reveal-x": revealX, "--reveal-y": revealY } as MotionStyle}
      onPointerEnter={moveReveal}
      type="button"
      aria-label="Cipher Host portrait for Saif Hossain"
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
      onPointerMove={moveReveal}
    >
      <Image src="/assets/profile/portraits/saif-hero.webp" alt="Saif Hossain" fill preload sizes="(max-width: 700px) 94vw, 74vw" className={styles.human} />
      <Image src="/assets/profile/portraits/saif-robot.webp" alt="" fill sizes="(max-width: 700px) 94vw, 74vw" className={styles.robot} />
      <span className={styles.portraitHint} aria-hidden="true">↗ CIPHER HOST</span>
    </motion.button>
  );
}
