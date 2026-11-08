"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import styles from "./hero.module.css";

export function Portrait() {
  const [active, setActive] = useState(false);
  const portrait = useRef<HTMLButtonElement>(null);

  function moveReveal(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const style = portrait.current?.style;
    style?.setProperty("--reveal-x", `${event.clientX - bounds.left}px`);
    style?.setProperty("--reveal-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <button
      className={styles.portrait}
      ref={portrait}
      type="button"
      aria-label="Cipher Host portrait for Saif Hossain"
      aria-pressed={active}
      onClick={() => setActive((value) => !value)}
      onPointerMove={moveReveal}
    >
      <Image src="/assets/profile/portraits/saif-hero.webp" alt="Saif Hossain" fill preload sizes="(max-width: 700px) 94vw, 52vw" className={styles.human} />
      <Image src="/assets/profile/portraits/saif-robot.webp" alt="" fill sizes="(max-width: 700px) 94vw, 52vw" className={styles.robot} />
      <span className={styles.portraitHint} aria-hidden="true">↗ CIPHER HOST</span>
    </button>
  );
}
