import { TextReveal } from "@/components/ui/text-reveal";
import { ApproachCarousel, LiquidMetalContact, OriginScrub, PowerProfile, SignalHeadline } from "@/components/homepage-detail-interactions";
import styles from "./homepage-details.module.css";

export function HomepageOrigin() {
  return (
    <section className={styles.section} id="approach" aria-labelledby="approach-title">
      <OriginScrub />
      <div className={`${styles.inner} ${styles.processInner}`}>
        <ApproachCarousel />
      </div>
    </section>
  );
}

export function HomepageDetails() {
  return (
    <>
      <section className={styles.section} id="about" aria-labelledby="about-title">
        <div className={styles.inner}>
          <div className={styles.aboutIntro}>
            <h2 id="about-title" className={styles.title}>Systems, workflows <em>&amp; the web.</em></h2>
            <TextReveal>I build AI workflows and digital products. My work spans automation, AI integrations, and responsive websites.</TextReveal>
          </div>
          <PowerProfile />
        </div>
      </section>

      <section className={`${styles.section} ${styles.signal}`} id="contact" aria-labelledby="contact-title">
        <div className={styles.inner}>
          <div className={styles.contactBody}>
            <SignalHeadline />
            <TextReveal>Have a workflow to improve or a product to build?</TextReveal>
            <LiquidMetalContact href="/contact" label="Start a conversation" />
          </div>
        </div>
      </section>

    </>
  );
}




