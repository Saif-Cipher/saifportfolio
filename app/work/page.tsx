import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TextReveal } from "@/components/ui/text-reveal";
import { ProjectGallery } from "./project-gallery";
import styles from "./selected-works.module.css";

export const metadata: Metadata = {
  title: "Selected Works | Saif Hossain",
};

const navigation = [
  ["Home", "/#home"],
  ["Work", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export default function WorksPage() {
  return (
    <div className="signal-site">
      <a className="portfolio-skip" href="#work">Skip to content</a>
      <SiteHeader navigation={navigation} contactHref="/contact" />
      <main className={styles.page} id="work" tabIndex={-1} aria-labelledby="works-title">
        <div className="section-inner">
          <header className={styles.intro}>
            <TextReveal as="h1" className="section-title" id="works-title">Selected Works</TextReveal>
          </header>
          <ProjectGallery />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
