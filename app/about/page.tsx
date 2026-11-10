import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LiquidMetalContact } from "@/components/homepage-detail-interactions";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About | Saif Hossain",
  description: "Meet Saif Hossain, an AI Engineer and Developer who builds intelligent workflows and useful digital products.",
};

const navigation = [
  ["Home", "/#home"], ["Works", "/work"], ["About", "/about"], ["Contact", "/#contact"],
] as const;

const headline = "I turn complex ideas into practical digital systems.";
const technologies = [
  ["AI and workflow automation", [["n8n", "n8n"], ["Make", "make"], ["Airtable", "airtable"], ["Supabase", "supabase"], ["VAPI", "vapi"], ["Twilio", "twilio"]]],
  ["Web development", [["React", "react"], ["Next.js", "nextdotjs"], ["JavaScript", "javascript"]]],
] as const;

const capabilities = [
  ["AI & Workflow Automation", "Designing automated workflows, AI agents, API integrations, lead management systems, and content pipelines.", "M3 3h6v6H3zM15 15h6v6h-6zM9 6h9v9M6 9v9h9"],
  ["AI Engineering", "Connecting language models, external tools, databases, and services to create practical AI-powered solutions.", "M9 9h6v6H9zM12 3v6m0 6v6M3 12h6m6 0h6M5 5l4 4m6 6 4 4m0-14-4 4m-6 6-4 4"],
  ["Web Development", "Building responsive websites, web applications, and digital products using modern frontend technologies.", "M3 4h18v16H3zM3 8h18m-12 3-3 3 3 3m6-6 3 3-3 3"],
  ["AI Content Systems", "Developing AI-assisted video, visual, and content production workflows.", "M3 5h18v14H3zM10 9l5 3-5 3z"],
] as const;

const approach = [
  ["Understand", "Understand the problem."],
  ["Design", "Design the system."],
  ["Build", "Build the solution."],
  ["Test", "Test it."],
  ["Improve", "Keep improving it."],
] as const;

export default function AboutPage() {
  return (
    <div className="signal-site">
      <a className="portfolio-skip" href="#about-main">Skip to content</a>
      <SiteHeader navigation={navigation} contactHref="/#contact" />
      <main id="about-main" tabIndex={-1} className={styles.page}>
        <div className="section-inner">
          <header className={styles.hero}>
            <p className={`signal-meta ${styles.index}`}>03 / About</p>
            <h1 className="section-title">Saif Hossain</h1>
            <p className={styles.role}>AI Engineer &amp; Developer</p>
            <p className={styles.heroLine}>{headline}</p>
            <figure className={styles.portraitTrack}>
              <div className={styles.portrait}>
                <Image src="/assets/profile/portraits/saif-hero.webp" alt="Saif Hossain wearing a dark suit" fill preload
                  sizes="(min-width: 1100px) 920px, 90vw" />
              </div>
            </figure>
          </header>

          <section className={styles.biography} aria-labelledby="about-bio">
            <p className={`signal-meta ${styles.index}`}>About me</p>
            <div>
              <h2 id="about-bio">{headline}</h2>
              <div className={styles.copy}>
                <p>I’m Saif Hossain, an <strong>AI Engineer and Developer</strong> focused on building <strong>intelligent workflows</strong> and useful digital products.</p>
                <p>My work sits at the intersection of <strong>artificial intelligence, automation, and software development</strong>. I design systems that connect tools, data, APIs, and AI models to reduce repetitive work and make processes more efficient. I also build websites and digital experiences that combine thoughtful functionality with clean, purposeful design.</p>
                <p>From developing AI-powered automation workflows with n8n, Make, Airtable, and Supabase to building <strong>voice AI systems</strong> with VAPI and Twilio, I enjoy taking ideas from concept to implementation. I also work with modern web technologies, including React, Next.js, and JavaScript, to turn concepts into functional digital products.</p>
                <p>I believe technology should solve real problems, not simply look impressive in a demo. That is why I focus on <strong>understanding the problem first</strong>, choosing the right tools, building the system, and refining it until it works as intended.</p>
                <p>I’m particularly interested in agentic AI, intelligent automation, AI-powered applications, and the future of <strong>human–AI collaboration</strong>.</p>
              </div>
            </div>
          </section>

          <section className={styles.block} aria-labelledby="about-tools">
            <h2 id="about-tools">Tools &amp; technologies</h2>
            {technologies.map(([category, tools]) => (
              <div key={category} className={styles.toolGroup}>
                <h3 className={`signal-meta ${styles.index}`}>{category}</h3>
                <ul className={styles.tools} aria-label={category}>
                  {tools.map(([name, icon]) => (
                    <li key={icon}>
                      <Image src={`/assets/about/${icon}.${icon === "vapi" ? "ico" : "svg"}`} alt="" width={36} height={36} unoptimized />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className={styles.block} aria-labelledby="about-capabilities">
            <h2 id="about-capabilities">What I work on</h2>
            <ol className={styles.capabilities}>
              {capabilities.map(([title, description, path], index) => (
                <li key={title}>
                  <div className={styles.cardTop}>
                    <span className="signal-meta">0{index + 1}</span>
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                      <path d={path} />
                    </svg>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.block} aria-labelledby="about-approach">
            <h2 id="about-approach">My approach</h2>
            <p className={styles.support}>Understand the problem. Design the system. Build the solution. Test it. Keep improving it.</p>
            <label className={styles.marqueeControl}>
              <input type="checkbox" /> Pause approach animation
            </label>
            <div className={styles.stageMarquee} tabIndex={0} role="region" aria-label="Approach cards">
              <div className={styles.stageTrack}>
                {[false, true].map((duplicate) => (
                  <ol key={String(duplicate)} className={styles.stages} aria-hidden={duplicate || undefined}>
                    {approach.map(([stage, description], index) => (
                      <li key={stage}>
                        <div className={styles.stageHeading}>
                          <span className={styles.stageNumber}>0{index + 1}</span>
                          <h3>{stage}</h3>
                        </div>
                        <p>{description}</p>
                      </li>
                    ))}
                  </ol>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.closing} aria-labelledby="about-signature">
            <h2 id="about-signature">I don’t just experiment with AI. <em>I build with it.</em></h2>
            <div className={styles.actions}>
              <LiquidMetalContact href="/work" label="Explore my works" icon="↗" compact accent />
              <LiquidMetalContact href="/#contact" label="Get in touch" compact />
            </div>
          </section>
        </div>
      </main>
      <footer className={styles.footer}>
        <div className="section-inner"><Link href="/#home">Saif Hossain</Link><Link href="/#contact">Contact ↗</Link></div>
      </footer>
    </div>
  );
}
