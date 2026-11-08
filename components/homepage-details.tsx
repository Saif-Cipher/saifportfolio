import Link from "next/link";
import { LiquidMetalContact, OriginScrub, PowerProfile, SignalHeadline } from "@/components/homepage-detail-interactions";
import { approachSteps, contactEmail, sectionLinks } from "@/data/homepage-details";
import { projectHref, projects } from "@/data/projects";
import styles from "./homepage-details.module.css";

export function HomepageOrigin() {
  return (
    <section className={styles.section} id="approach" aria-labelledby="approach-title">
      <OriginScrub />
      <div className={`${styles.inner} ${styles.processInner}`}>
          <ol className={styles.steps}>
            {approachSteps.map(({ title, description }, index) => (
              <li key={title}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
      </div>
    </section>
  );
}

export function HomepageDetails() {
  return (
    <>
      <section className={styles.section} id="about" aria-labelledby="about-title">
        <div className={styles.inner}>
          <div className={styles.sectionTop}>
            <p className={styles.kicker}>04 / Power profile</p>
            <p className={styles.index}>About Saif</p>
          </div>
          <div className={styles.aboutIntro}>
            <h2 id="about-title" className={styles.title}>Systems, workflows <em>&amp; the web.</em></h2>
            <p>I build AI workflows and digital products. My work spans automation, AI integrations, and responsive websites.</p>
          </div>
          <PowerProfile />
        </div>
      </section>

      <section className={`${styles.section} ${styles.signal}`} id="contact" aria-labelledby="contact-title">
        <div className={styles.inner}>
          <div className={styles.sectionTop}>
            <p className={styles.kicker}>05 / Signal</p>
            <p className={styles.index}>Contact</p>
          </div>
          <div className={styles.contactBody}>
            <SignalHeadline />
            <p>Have a workflow to improve or a product to build?</p>
            <LiquidMetalContact href={`mailto:${contactEmail}`} label="Start a conversation" />
          </div>
        </div>
      </section>

    </>
  );
}

export function HomepageFooter() {
  const automationProjects = projects.filter((project) => project.caseStudySlug);
  const liveProjects = projects.filter((project) => project.externalUrl);

  return (
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.footerGrid}>
            <div>
              <a className={styles.footerName} href="#home">Saif Hossain</a>
              <p>AI automation, AI systems, and web development.</p>
              <a className={styles.footerEmail} href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <nav aria-label="Footer sections">
              <h2>Navigate</h2>
              <ul>{sectionLinks.map(({ label, href }) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
            </nav>
            <nav aria-label="Automation case studies">
              <h2>Case studies</h2>
              <ul>{automationProjects.map((project) => <li key={project.id}><Link href={projectHref(project) ?? "#work"}>{project.title}</Link></li>)}</ul>
            </nav>
            <nav aria-label="Live projects">
              <h2>Live projects</h2>
              <ul>{liveProjects.map(({ id, title, externalUrl }) => <li key={id}><a href={externalUrl}>{title} <span aria-hidden="true">↗</span></a></li>)}</ul>
            </nav>
          </div>
        </div>
      </footer>
  );
}



