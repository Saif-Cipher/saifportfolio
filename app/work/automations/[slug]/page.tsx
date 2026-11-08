import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectHref, reviewedProjectCover, type Project } from "@/data/projects";
import styles from "./case-study.module.css";

type Props = { params: Promise<{ slug: string }> };

const caseStudies = projects.filter((project) => project.caseStudySlug);

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ caseStudySlug }) => ({ slug: caseStudySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudies.find((item) => item.caseStudySlug === slug);
  if (!project) notFound();

  return {
    title: `${project.title} | Saif Hossain`,
    description: project.summary,
  };
}

function AdjacentCaseStudy({ project, direction }: { project?: Project; direction: string }) {
  const href = project && projectHref(project);
  if (!project || !href) return null;

  return (
    <Link className={styles.link} href={href}>
      <span className="signal-meta">{direction} case study</span>
      <span>{project.title}</span>
    </Link>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = caseStudies.findIndex((item) => item.caseStudySlug === slug);
  const project = caseStudies[index];
  if (!project) notFound();
  const cover = reviewedProjectCover(project);

  return (
    <main className="signal-site">
      <article className={styles.study}>
        <Link className={styles.link} href="/work">← Selected Works</Link>
        <header className={styles.header}>
          <p className="signal-meta signal-kicker">{"// CASE FILE / "}{project.number}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </header>
        {cover && (
          <Image
            className={styles.cover}
            src={cover}
            alt=""
            width={1200}
            height={900}
            sizes="(max-width: 850px) 92vw, 800px"
          />
        )}
        <section className={styles.section}>
          <h2>Context</h2>
          <p>{project.context}</p>
        </section>
        <section className={styles.section}>
          <h2>Workflow overview</h2>
          <p>{project.workflowOverview}</p>
          <ol>{project.keyStages.map((stage) => <li key={stage}>{stage}</li>)}</ol>
        </section>
        <section className={styles.section}>
          <h2>Tools and integrations</h2>
          <ul className={styles.tools}>{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
        </section>
        <nav className={styles.navigation} aria-label="Case study navigation">
          <AdjacentCaseStudy project={caseStudies[index - 1]} direction="Previous" />
          <AdjacentCaseStudy project={caseStudies[index + 1]} direction="Next" />
        </nav>
      </article>
    </main>
  );
}
