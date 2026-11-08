import Image from "next/image";
import Link from "next/link";
import { projectHref, type Project } from "@/data/projects";
import styles from "./work-grid.module.css";

export function MissionTunnel({ projects }: { projects: Project[] }) {
  return (
    <ul className={styles.archive} id="project-results" aria-label="Project files">
      {projects.map((project) => {
        const href = projectHref(project);
        const linkLabel = project.externalUrl ? "Visit project" : "Open case study";
        const linkContents = <>{linkLabel} <span aria-hidden="true">↗</span></>;
        return (
          <li className={styles.file} key={project.id}>
            <article className={styles.card}>
              <div className={styles.media}>
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                  />
                ) : (
                  <span className={styles.placeholder} aria-hidden="true">{project.number}</span>
                )}
                <span className={`signal-meta ${styles.badge}`}>FILE / {project.number}</span>
              </div>
              <div className={styles.cardBody}>
                <p className={`signal-meta ${styles.category}`}>{project.categoryLabel}</p>
                <h3>{project.title}</h3>
                <p className={styles.summary}>{project.summary}</p>
                {project.externalUrl ? (
                  <a className={styles.action} href={project.externalUrl} aria-label={`${linkLabel}: ${project.title}`}>
                    {linkContents}
                  </a>
                ) : href && (
                  <Link className={styles.action} href={href} prefetch={false} aria-label={`${linkLabel}: ${project.title}`}>
                    {linkContents}
                  </Link>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
