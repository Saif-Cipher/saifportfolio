"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { LiquidMetalContact, moveMetalHighlight } from "./homepage-detail-interactions";
import metal from "./homepage-details.module.css";
import styles from "./hero.module.css";

const links = [
  ["Home", "/#home"],
  ["Work", "/work"],
  ["About", "#about"],
  ["Contact", "#contact"],
] as const;

export function SiteHeader({ navigation = links, contactHref = "#contact" }: {
  navigation?: readonly (readonly [string, string])[];
  contactHref?: string;
} = {}) {
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const linksId = useId();
  const titleId = useId();

  return (
    <header className={styles.header}>
      <div className={styles.headerActions}>
        <button type="button" className={`${metal.liquidMetal} ${metal.compactMetal} ${styles.menuButton}`}
          aria-haspopup="dialog" aria-expanded={expanded} aria-controls={linksId}
          onPointerMove={moveMetalHighlight} onClick={() => {
            dialog.current?.showModal();
            setExpanded(true);
          }}>
          <span className={metal.metalIcon} aria-hidden="true">+</span> MENU
        </button>
        <LiquidMetalContact href={contactHref} label="Let’s talk" compact accent />
      </div>
      <dialog
        ref={dialog}
        id={linksId}
        className={styles.menuGate}
        aria-labelledby={titleId}
        onClose={() => setExpanded(false)}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        <div className={styles.menuGatePanel}>
          <div className={styles.menuGateHeading}>
            <p id={titleId}>Navigation</p>
            <button type="button" onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button>
          </div>
          <nav aria-label="Main navigation" className={styles.menuGateLinks}>
            {navigation.map(([label, href], index) => (
              <Link href={href} key={href} onClick={() => dialog.current?.close()}>
                <small aria-hidden="true">0{index + 1}</small>
                <span>{label}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
