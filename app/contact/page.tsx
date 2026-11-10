import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TextReveal } from "@/components/ui/text-reveal";
import { contactIntro } from "@/data/contact";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | Saif Hossain",
  description: "Send Saif Hossain a short brief about an AI workflow, website or digital product.",
};

const navigation = [
  ["Home", "/#home"],
  ["Works", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export default function ContactPage() {
  return (
    <div className="signal-site">
      <a className="portfolio-skip" href="#contact-main">Skip to content</a>
      <SiteHeader navigation={navigation} contactHref="/contact" />
      <main id="contact-main" tabIndex={-1} className={styles.page}>
        <div className="section-inner">
          <header className={styles.intro}>
            <p className={`signal-meta ${styles.label}`}>04 / CONTACT</p>
            <TextReveal as="h1" className="section-title">LET&apos;S BUILD SOMETHING USEFUL.</TextReveal>
            <TextReveal as="p" className={styles.copy}>{contactIntro}</TextReveal>
          </header>
          <section aria-label="Send a message" className={styles.panel}>
            <ContactForm />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
