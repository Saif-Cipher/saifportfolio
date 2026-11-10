"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Aurora from "@/components/ui/aurora";

const portfolioRoutes = new Set(["/", "/work", "/about"]);

export function PortfolioKineticBackground() {
  const pathname = usePathname();
  return portfolioRoutes.has(pathname) ? <KineticCanvas /> : null;
}

function KineticCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;

    const surface = element;
    const ctx = context;
    const interactive = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointer = { x: 0, y: 0 };
    let strength = 0;
    let hovering = false;
    let ripple: { x: number; y: number; start: number } | null = null;

    function draw(now: number) {
      frame = 0;
      strength += ((hovering ? 1 : 0) - strength) * .2;
      const age = ripple ? now - ripple.start : Infinity;
      if (age >= 760) ripple = null;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#b1cee147";
      ctx.beginPath();

      for (let y = 12; y < height + 12; y += 28) {
        for (let x = 12; x < width + 12; x += 28) {
          let drawX = x;
          let drawY = y;
          if (strength > .01) {
            const distance = Math.hypot(pointer.x - x, pointer.y - y);
            const pull = Math.max(0, 1 - distance / 150) ** 2 * strength * .32;
            drawX += (pointer.x - x) * pull;
            drawY += (pointer.y - y) * pull;
          }
          if (ripple) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const band = distance - age * .52;
            const wave = Math.max(0, 1 - Math.abs(band) / 55) * (1 - age / 760) * 13;
            drawX += dx / Math.max(1, distance) * wave;
            drawY += dy / Math.max(1, distance) * wave;
          }
          ctx.moveTo(drawX + 1, drawY);
          ctx.arc(drawX, drawY, 1, 0, Math.PI * 2);
        }
      }

      ctx.fill();
      if (ripple || Math.abs(strength - Number(hovering)) > .01) schedule();
    }

    function schedule() {
      if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
    }

    function resize() {
      width = surface.clientWidth;
      height = surface.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    }

    function move(event: PointerEvent) {
      if (!interactive.matches || event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      hovering = true;
      schedule();
    }

    function pulse(event: PointerEvent) {
      if (!interactive.matches || event.pointerType !== "mouse" || event.button !== 0) return;
      ripple = { x: event.clientX, y: event.clientY, start: performance.now() };
      schedule();
    }

    function leave() {
      hovering = false;
      schedule();
    }

    function resetMotion() {
      hovering = false;
      strength = 0;
      ripple = null;
      schedule();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", pulse, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", resetMotion);
    interactive.addEventListener("change", resetMotion);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pulse);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", resetMotion);
      interactive.removeEventListener("change", resetMotion);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <Aurora className="h-full w-full" colors={["#ff5a1f", "#31a8ff", "#FB3640"]} intensity={0.14} duration={24} />
      </div>
      <canvas className="portfolio-kinetic-grid" ref={canvas} aria-hidden="true" />
    </>
  );
}
