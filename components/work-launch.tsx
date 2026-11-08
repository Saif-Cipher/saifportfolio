"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RocketLaunch, launchFrames, launchFps } from "./rocket-launch";
import styles from "./work-launch.module.css";

export function PortfolioLaunch() {
  const pathname = usePathname();
  return <PageLaunch key={pathname} />;
}

function PageLaunch() {
  const router = useRouter();
  const [viewport, setViewport] = useState<{ width: number; height: number; href: string; destination: string } | null>(null);
  const pending = useRef(false);
  const player = useRef<PlayerRef>(null);

  useEffect(() => {
    function startLaunch(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      const destination = { "/": "Home", "/work": "Selected Works", "/about": "About" }[url.pathname]
        ?? (url.pathname.startsWith("/work/automations/") ? "Case Study" : undefined);
      if (!destination) return;
      const href = url.pathname + url.search + url.hash;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = true;
      router.prefetch(href);
      setViewport({ width: window.innerWidth, height: window.innerHeight, href, destination });
    }

    document.addEventListener("click", startLaunch, true);
    return () => document.removeEventListener("click", startLaunch, true);
  }, [router]);

  useEffect(() => {
    if (!viewport) return;
    const instance = player.current;
    const { href } = viewport;

    function openDestination() {
      if (!pending.current) return;
      pending.current = false;
      router.push(href);
    }

    instance?.addEventListener("ended", openDestination);
    instance?.addEventListener("error", openDestination);
    instance?.play();
    const fallback = window.setTimeout(openDestination, 2000);
    return () => {
      instance?.removeEventListener("ended", openDestination);
      instance?.removeEventListener("error", openDestination);
      window.clearTimeout(fallback);
    };
  }, [viewport, router]);

  if (!viewport) return null;

  return (
    <div className={styles.overlay}>
      <span className={styles.status} role="status">Opening {viewport.destination}</span>
      <div className={styles.player} aria-hidden="true" inert>
        <Player ref={player} component={RocketLaunch} inputProps={{ destination: viewport.destination }} durationInFrames={launchFrames}
          fps={launchFps} compositionWidth={viewport.width} compositionHeight={viewport.height}
          controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
