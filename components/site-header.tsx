"use client";

import { useId, useRef, useState } from "react";
import { LiquidMetalContact, moveMetalHighlight } from "./homepage-detail-interactions";
import metal from "./homepage-details.module.css";
import styles from "./hero.module.css";

const links = [
  ["Work", "#work"],
  ["Approach", "#approach"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export function SiteHeader() {
  const [expanded, setExpanded] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const linksId = useId();

  return (
    <header
      className={styles.header}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          setExpanded(false);
          menu.current?.focus();
        }
      }}
    >
      <div className={styles.headerActions}>
        <div className={styles.menu} data-open={expanded}>
          <button ref={menu} type="button" className={`${metal.liquidMetal} ${metal.compactMetal} ${styles.menuButton}`} aria-expanded={expanded} aria-controls={linksId} onClick={() => setExpanded(!expanded)} onPointerMove={moveMetalHighlight}>
            <span className={metal.metalIcon} aria-hidden="true">{expanded ? "−" : "+"}</span> MENU
          </button>
          <nav id={linksId} aria-label="Main navigation" className={styles.menuPanel} inert={!expanded}>
            <div>
              {links.map(([label, href], index) => (
                <a href={href} key={href} onClick={() => setExpanded(false)}>
                  <small aria-hidden="true">0{index + 1}</small>{label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
        <LiquidMetalContact href="#contact" label="Let’s talk" compact accent />
      </div>
    </header>
  );
}
