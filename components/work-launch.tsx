"use client";

import { Player, type PlayerRef } from "@remotion/player";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RocketLaunch, launchFrames, launchFps } from "./rocket-launch";
import styles from "./work-launch.module.css";

export function WorkLaunch() {
  const router = useRouter();
  const [launching, setLaunching] = useState(false);
  const pending = useRef(false);
  const player = useRef<PlayerRef>(null);

  useEffect(() => {
    function startLaunch(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href="/work"]');
      if (!link || link.target || link.hasAttribute("download")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      if (pending.current) return;
      pending.current = true;
      router.prefetch("/work");
      setLaunching(true);
    }

    document.addEventListener("click", startLaunch, true);
    return () => document.removeEventListener("click", startLaunch, true);
  }, [router]);

  useEffect(() => {
    if (!launching) return;
    const instance = player.current;

    function openWorks() {
      if (!pending.current) return;
      pending.current = false;
      router.push("/work");
    }

    instance?.addEventListener("ended", openWorks);
    instance?.addEventListener("error", openWorks);
    instance?.play();
    const fallback = window.setTimeout(openWorks, 2000);
    return () => {
      instance?.removeEventListener("ended", openWorks);
      instance?.removeEventListener("error", openWorks);
      window.clearTimeout(fallback);
    };
  }, [launching, router]);

  if (!launching) return null;

  return (
    <div className={styles.overlay}>
      <span className={styles.status} role="status">Opening Selected Works</span>
      <div className={styles.player} aria-hidden="true" inert>
        <Player ref={player} component={RocketLaunch} durationInFrames={launchFrames}
          fps={launchFps} compositionWidth={960} compositionHeight={540}
          controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
