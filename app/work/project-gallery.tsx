"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projectHref, projects, type Project, type ProjectCategory } from "@/data/projects";
import styles from "./selected-works.module.css";

const categories = {
  automation: { name: "Automation", filter: "Automations", action: "View case study" },
  website: { name: "Website", filter: "Websites", action: "Visit website" },
  "enterprise-app": { name: "Enterprise app", filter: "Enterprise app", action: "View application" },
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

function ProjectCard({ project }: { project: Project }) {
  const { name, action } = categories[project.category];
  const title = displayTitle[project.id] ?? project.title;
  const href = projectHref(project);
  const external = Boolean(project.externalUrl);
  const cover = project.coverImage;
  const actionLabel = `${action} for ${title}`;
  const actionContent = <>{action} <span aria-hidden="true">{external ? "↗" : "→"}</span></>;

  return (
    <article className={styles.card}>
      <div className={styles.preview}>
        {cover ? (
          <Image src={cover} alt={`Project cover for ${title}`} fill
            sizes="(min-width: 1450px) 650px, (min-width: 768px) 45vw, 90vw" />
        ) : (
          <p className="signal-meta">Preview pending approval</p>
        )}
      </div>
      <div className={styles.cardBody}>
        <p className={`signal-meta ${styles.accent}`}>{displayNumber[project.id] ?? project.number} / {name}</p>
        <h2>{title}</h2>
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
    </article>
  );
}

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = groups[filter];

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter projects">
          {filters.map(({ value, label }) => (
            <button key={value} type="button" aria-pressed={value === filter} aria-controls="work-results" onClick={() => setFilter(value)}>
              {label} <span className={styles.count}>{String(groups[value].length).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <p className="signal-meta" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"}</p>
      </div>
      <ul className={styles.gallery} id="work-results" aria-label="Selected projects">
        {visible.map((project) => <li key={project.id}><ProjectCard project={project} /></li>)}
      </ul>
    </>
  );
}
