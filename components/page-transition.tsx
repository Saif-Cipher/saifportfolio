"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./page-transition.module.css";

/** Site order: moving to a later page launches the rocket up, moving back sends it down. */
const routes: Record<string, { index: number; label: string }> = {
  "/": { index: 0, label: "Home" },
  "/work": { index: 1, label: "Works" },
  "/about": { index: 2, label: "About" },
  "/contact": { index: 3, label: "Contact" },
};

const coverDelay = 950;
const failsafeDelay = 4000;

function routeFor(pathname: string) {
  if (pathname.startsWith("/work/automations/")) return { index: 1, label: "Case study" };
  return routes[pathname] ?? null;
}

type Launch = { direction: "up" | "down"; label: string; phase: "cover" | "reveal" };

/**
 * Rocket launch between site pages. Link clicks launch a rocket that covers the screen,
 * then the new page is revealed as the curtain lifts away. Browser Back/Forward is not
 * intercepted. Reduced motion, modified clicks and unknown routes use normal navigation.
 * If the transition stalls, a timer falls back to a full navigation so nothing is blocked.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const pending = useRef<{ href: string; path: string } | null>(null);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  useEffect(() => clearTimers, []);

  useEffect(() => {
    const target = pending.current;
    if (!target || pathname !== target.path) return;
    pending.current = null;
    clearTimers();
    setLaunch((current) => (current ? { ...current, phase: "reveal" } : current));
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      const destination = routeFor(url.pathname);
      if (!destination) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      if (pending.current) return;

      const from = routeFor(window.location.pathname)?.index ?? 0;
      const href = url.pathname + url.search + url.hash;
      pending.current = { href, path: url.pathname };
      try {
        router.prefetch(href);
      } catch {
        // Prefetch is an optimisation; navigation continues without it.
      }
      setLaunch({ direction: destination.index >= from ? "up" : "down", label: destination.label, phase: "cover" });

      const go = () => {
        const target = pending.current;
        if (!target) return;
        try {
          router.push(target.href);
        } catch {
          window.location.assign(target.href);
        }
      };
      timers.current.push(window.setTimeout(go, coverDelay));
      timers.current.push(window.setTimeout(() => {
        const target = pending.current;
        if (!target) return;
        pending.current = null;
        window.location.assign(target.href);
      }, failsafeDelay));
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  if (!launch) return null;

  const up = launch.direction === "up";
  const covering = launch.phase === "cover";

  return (
    <motion.div
      className={styles.overlay}
      initial={{ y: up ? "100%" : "-100%" }}
      animate={{ y: covering ? "0%" : up ? "-100%" : "100%" }}
      transition={{ duration: covering ? 0.42 : 0.62, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!covering) setLaunch(null);
      }}
    >
      <p className={styles.status} role="status">Opening {launch.label}</p>
      <motion.div
        className={styles.rocket}
        aria-hidden="true"
        initial={{ y: up ? "38vh" : "-38vh", rotate: up ? 0 : 180 }}
        animate={{ y: up ? "-78vh" : "78vh", rotate: up ? 0 : 180 }}
        transition={{ delay: 0.32, duration: 0.7, ease: [0.55, 0, 0.85, 0.35] }}
      >
        <svg viewBox="-60 -150 120 220" width="100%" height="100%">
          <defs>
            <linearGradient id="rocket-steel" x1="0" x2="1">
              <stop stopColor="#5e6c7d" />
              <stop offset=".46" stopColor="#edf1f6" />
              <stop offset="1" stopColor="#7b899a" />
            </linearGradient>
            <linearGradient id="rocket-flame" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#fff1c9" />
              <stop offset=".4" stopColor="#ff5a1f" />
              <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className={styles.flame} d="M-14 12Q-20 38 0 105Q20 38 14 12Z" fill="url(#rocket-flame)" />
          <path d="M-23-43Q-52-24-51 10L-22-4M23-43Q52-24 51 10L22-4" fill="#ff5a1f" stroke="#10141c" strokeWidth="3" />
          <path d="M-15-5h30l-3 18h-24Z" fill="#313e50" stroke="#91a2b6" strokeWidth="2" />
          <path d="M0-144C29-120 35-65 20-7H-20C-35-65-29-120 0-144Z" fill="url(#rocket-steel)" stroke="#10141c" strokeWidth="3" />
          <path d="M0-144Q14-132 20-113H-20Q-14-132 0-144Z" fill="#ff5a1f" />
          <circle cy="-77" r="14" fill="#10141c" stroke="#546d86" strokeWidth="3" />
          <circle cy="-77" r="8" fill="#65baff" />
        </svg>
      </motion.div>
      <span className={styles.label} aria-hidden="true">{launch.label}</span>
    </motion.div>
  );
}
