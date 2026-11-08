"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { projectHref, type Project } from "@/data/projects";
import styles from "./work-grid.module.css";

const depthFrames = Array.from({ length: 9 }, (_, index) => index);
const glyphs = "A7W9#/U5XQ2";

function TunnelFrame({ index, position }: { index: number; position: MotionValue<number> }) {
  const depth = useTransform(position, (value) => ((index + value * 2.4) % depthFrames.length) / depthFrames.length);
  const scale = useTransform(depth, [0, 1], [.22, 1.3]);
  const opacity = useTransform(depth, [0, .14, .68, 1], [0, .65, 1, 0]);

  return (
    <motion.rect
      x={25} y={20} width={1150} height={610}
      style={{ scale, opacity, transformOrigin: "600px 325px" }}
    />
  );
}

function scrambleTitle(title: string, index: number, position: number) {
  if (index === 0) return title;
  const settle = Math.max(0, Math.min(1, (position - index + .25) / .23));
  const tick = Math.floor(settle * 8);
  return Array.from(title, (character, offset) => {
    if (character === " " || offset / title.length <= settle) return character;
    return glyphs[(offset * 7 + tick * 3 + index) % glyphs.length];
  }).join("");
}

function MissionPlane({
  project, index, position,
}: {
  project: Project;
  index: number;
  position: MotionValue<number>;
}) {
  const direction = index % 2 === 0 ? 1 : -1;
  const distance = useTransform(position, (progress) => index - progress);
  const x = useTransform(distance, [-1, 0, 1, 2], [36, 18, 17, 10].map((offset) => `${direction * offset}vw`));
  const z = useTransform(distance, [-1, 0, 1, 2, 3], [650, 0, -830, -1570, -2220]);
  const rotateY = useTransform(distance, [-1, 0, 2], [direction * -12, direction * -5, 0]);
  const opacity = useTransform(distance, [-1, -.7, -.35, 0, 1, 2.3], [0, 0, 1, 1, .48, 0]);
  const zIndex = useTransform(distance, (offset) => 30 - Math.floor(offset));

  return (
    <motion.div className={styles.flightPlane} style={{ x, z, rotateY, opacity, zIndex }}>
      {project.coverImage ? (
        <Image src={project.coverImage} alt="" fill sizes="53vw" />
      ) : (
        <span className={styles.placeholder}>{project.number}</span>
      )}
    </motion.div>
  );
}

export function MissionFlight({ projects }: { projects: Project[] }) {
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runway,
    offset: ["start 72px", "end end"],
  });
  const position = useTransform(scrollYProgress, [0, 1], [0, projects.length - 1]);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(position, "change", (value) => {
    setActiveIndex(Math.min(projects.length - 1, Math.floor(value + .25)));
  });

  const active = projects[activeIndex] ?? projects[0];
  const href = projectHref(active);
  const action = active.externalUrl ? "Visit project" : "Open case study";
  const displayTitle = useTransform(position, (value) => scrambleTitle(active.title, activeIndex, value));

  return (
    <div className={styles.flightRunway} ref={runway} style={{ height: `calc(100svh + ${projects.length - 1} * 34svh - 72px)` }}>
      <div className={styles.flightStage}>
        <svg className={styles.flightWire} viewBox="0 0 1200 650" preserveAspectRatio="none" aria-hidden="true">
          {depthFrames.map((index) => <TunnelFrame key={index} index={index} position={position} />)}
          <path d="M25 20 416 227 M1175 20 784 227 M25 630 416 423 M1175 630 784 423 M600 20v207 M600 423v207" />
        </svg>
        <div className={styles.flightPlanes} aria-hidden="true">
          {projects.map((project, index) => (
            <MissionPlane key={project.id} project={project} index={index} position={position} />
          ))}
        </div>
        <div className={`signal-meta ${styles.flightIndex}`}>
          MISSION FILES <span aria-hidden="true">/</span> {String(projects.length).padStart(2, "0")} RECORDS
        </div>
        <div className={styles.flightCaption} data-side={activeIndex % 2 ? "right" : "left"}>
          <span aria-hidden="true" className={styles.flightNumber}>{active.number}</span>
          <p className={styles.flightTitle}>
            <span className="sr-only">{active.title}</span>
            <motion.span aria-hidden="true">{displayTitle}</motion.span>
          </p>
          <p className={`signal-meta ${styles.category}`}>{active.categoryLabel}</p>
          {href && (
            <Link href={href} className={styles.action} prefetch={false} aria-label={`${action}: ${active.title}`}>
              {action} <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
