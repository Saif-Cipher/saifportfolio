"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { projectHref, projects, type Project, type ProjectCategory } from "@/data/projects";
import styles from "./selected-works.module.css";

const categories = {
  automation: { filter: "Automations", action: "View case study" },
  website: { filter: "Websites", action: "Visit website" },
  "enterprise-app": { filter: "Enterprise app", action: "View application" },
};

type Filter = "all" | ProjectCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All work" },
  { value: "automation", label: categories.automation.filter },
  { value: "website", label: categories.website.filter },
  { value: "enterprise-app", label: categories["enterprise-app"].filter },
];

// The site map lists Sumeri first. The homepage keeps its existing inventory order.
const displayNumber: Record<string, string> = { sumeri: "07", "time-and-tide": "08" };
const displayTitle: Record<string, string> = { sumeri: "Sumeri", "bulk-email": "Bulk Email Automation" };

const orderedProjects = [...projects].sort((a, b) =>
  (displayNumber[a.id] ?? a.number).localeCompare(displayNumber[b.id] ?? b.number),
);
const groups = Object.fromEntries(filters.map(({ value }) => [
  value, orderedProjects.filter((project) => value === "all" || project.category === value),
]));

function ProjectDetails({ project }: { project: Project }) {
  const { action } = categories[project.category];
  const title = displayTitle[project.id] ?? project.title;
  const href = projectHref(project);
  const external = Boolean(project.externalUrl);
  const actionLabel = `${action} for ${title}`;
  const actionContent = <>{action} <span aria-hidden="true">{external ? "↗" : "→"}</span></>;

  return (
      <div className={styles.cardBody}>
        <h2 id="work-preview-title">{title}</h2>
        <p className={styles.summary}>{project.summary}</p>
        {project.tools.length > 0 && (
          <ul className={styles.tools} aria-label="Technologies">
            {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
          </ul>
        )}
        {href && (external ? (
          <a className={styles.action} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${actionLabel} (opens in a new tab)`}>
            {actionContent}
          </a>
        ) : (
          <Link className={styles.action} href={href} aria-label={actionLabel}>{actionContent}</Link>
        ))}
      </div>
  );
}

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = groups[filter];
  const [selected, setSelected] = useState<Project | null>(null);
  const preview = useRef<HTMLDialogElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter projects">
          <LayoutGroup>
          {filters.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={value === filter} aria-controls="work-results" onClick={() => setFilter(value)}>
              {value === filter && (
                <motion.span className={styles.selection} layoutId="work-filter" aria-hidden="true"
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 33 }} />
              )}
              <span>{label}</span> <span className={styles.count}>{String(groups[value].length).padStart(2, "0")}</span>
            </button>
          ))}
          </LayoutGroup>
        </div>
        <p className="signal-meta" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
      </div>
      <ul className={styles.gallery} id="work-results" aria-label="Selected projects">
        {visible.map((project) => (
          <li key={project.id}>
            <button className={styles.tile} type="button" aria-haspopup="dialog" onClick={() => {
              setSelected(project);
              preview.current?.showModal();
            }}>
              <span className={styles.tileArt} aria-hidden="true">
                {project.coverImage && <Image src={project.coverImage} alt="" fill sizes="(min-width: 768px) 65vw, 90vw" />}
              </span>
              <span className={styles.tileCaption}>{displayTitle[project.id] ?? project.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={preview} className={styles.projectPreview} aria-labelledby="work-preview-title"
        onClose={() => setSelected(null)}
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}>
        <button className={styles.closePreview} type="button" onClick={() => preview.current?.close()}>Close ×</button>
        {selected && (
          <div className={styles.previewPanel}>
            {selected.coverImage && (
              <div className={styles.preview}>
                <Image src={selected.coverImage} alt="" fill sizes="(min-width: 900px) 820px, 94vw" />
              </div>
            )}
            <ProjectDetails project={selected} />
          </div>
        )}
      </dialog>
    </>
  );
}
