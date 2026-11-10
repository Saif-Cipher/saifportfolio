import Link from "next/link";
import { contactEmail } from "@/data/homepage-details";
import styles from "./site-footer.module.css";

const navigation = [
  ["Home", "/"],
  ["Works", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

/**
 * Shared site footer. Navigation is plain links, so it never depends on the torn-edge styling.
 * Only the contact address already published on the site is listed; no social links are shown.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.pin} aria-hidden="true" />
      <span className={`${styles.pin} ${styles.pinRight}`} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.name}>Saif Hossain</p>
          <p className={styles.roles}>AI Engineer · AI Automation Specialist · Web Developer</p>
        </div>
        <nav className={styles.nav} aria-label="Footer navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <div className={styles.contact}>
          <p className={styles.label}>Contact</p>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} Saif Hossain. All rights reserved.</p>
    </footer>
  );
}
