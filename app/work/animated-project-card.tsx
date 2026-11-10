"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import styles from "./selected-works.module.css";

/** Maximum tilt in degrees, reached when the pointer is at the card edge. */
const MAX_TILT = 5;
/** Share of the remaining distance covered each frame. Lower is slower and softer. */
const DAMPING = 0.12;
const SETTLE_EPSILON = 0.01;

type Tilt = { x: number; y: number };

/**
 * Wraps a project tile with a restrained, pointer-driven 3D tilt.
 * The tilt is written straight to the element's transform inside a
 * requestAnimationFrame loop, so pointer movement never causes React renders.
 * Only mouse and pen pointers tilt; touch input and reduced motion get the flat card.
 */
export function AnimatedProjectCard({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const reduceRef = useRef(reduceMotion);
  const target = useRef<Tilt>({ x: 0, y: 0 });
  const current = useRef<Tilt>({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    reduceRef.current = reduceMotion;
    if (reduceMotion) {
      target.current = { x: 0, y: 0 };
      current.current = { x: 0, y: 0 };
      if (element.current) element.current.style.transform = "";
    }
  }, [reduceMotion]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function tick() {
    frame.current = null;
    const el = element.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * DAMPING;
    c.y += (t.y - c.y) * DAMPING;
    const settled = Math.abs(t.x - c.x) < SETTLE_EPSILON && Math.abs(t.y - c.y) < SETTLE_EPSILON;
    if (settled) {
      c.x = t.x;
      c.y = t.y;
    }
    el.style.transform = c.x === 0 && c.y === 0
      ? ""
      : `perspective(900px) rotateX(${c.y.toFixed(3)}deg) rotateY(${c.x.toFixed(3)}deg)`;
    if (!settled) frame.current = requestAnimationFrame(tick);
  }

  function aim(next: Tilt) {
    target.current = next;
    if (frame.current === null) frame.current = requestAnimationFrame(tick);
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceRef.current || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    aim({ x: px * 2 * MAX_TILT, y: -py * 2 * MAX_TILT });
  }

  function handleLeave() {
    aim({ x: 0, y: 0 });
  }

  return (
    <div ref={element} className={styles.tilt} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      {children}
    </div>
  );
}
