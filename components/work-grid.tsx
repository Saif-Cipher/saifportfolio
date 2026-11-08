"use client";

import { useState } from "react";
import { MissionFlight } from "@/components/mission-flight";
import { projectHref, projects, type Project, type ProjectCategory } from "@/data/projects";
import styles from "./work-grid.module.css";

type Filter = "all" | ProjectCategory;

function ProjectPicker({ items }: { items: Project[] }) {
  const [index, setIndex] = useState(0);
  const selected = items[index];
  const href = projectHref(selected);

  return (
    <div className={styles.projectPicker}>
      <label htmlFor="project-picker">Jump to a project</label>
      <select id="project-picker" value={index} onChange={(event) => setIndex(Number(event.target.value))}>
        {items.map((project, index) => <option key={project.id} value={index}>{project.title}</option>)}
      </select>
      {href && <a href={href}>{selected.externalUrl ? "Visit project" : "Open case study"} ↗</a>}
    </div>
  );
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All Work" },
  { value: "automation", label: "Automations" },
  { value: "website", label: "Websites" },
  { value: "enterprise-app", label: "Enterprise App" },
];

const filterCounts = Object.fromEntries(
  filters.map(({ value }) => [
    value,
    projects.filter((project) => value === "all" || project.category === value).length,
  ])
);

export function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleProjects = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section className={`section work-section ${styles.work}`} id="work" aria-labelledby="work-title">
      <div className="section-inner">
        <div className={styles.intro}>
          <div>
            <h2 className="section-title" id="work-title">Mission files</h2>
          </div>
          <p className="section-intro">
            Browse automation case studies, websites, and an enterprise application.
          </p>
        </div>
        <div className={styles.toolbar} id="project-archive">
          <div className={styles.filters} role="group" aria-label="Filter projects">
            {filters.map(({ value, label }, index) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                  aria-controls="project-results"
                onClick={() => setFilter(value)}
              >
                <span className={styles.dockIcon} aria-hidden="true">{["▦", "⚡︎", "◇", "▤"][index]}</span>
                {label} <span>({String(filterCounts[value]).padStart(2, "0")})</span>
              </button>
            ))}
          </div>
          <p className="signal-meta" role="status">
            {visibleProjects.length} {visibleProjects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <div id="project-results">
          <ProjectPicker key={`picker-${filter}`} items={visibleProjects} />
          <MissionFlight key={`flight-${filter}`} projects={visibleProjects} />
        </div>
      </div>
    </section>
  );
}
