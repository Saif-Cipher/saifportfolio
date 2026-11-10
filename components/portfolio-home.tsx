import { Hero } from "@/components/hero";
import { HomepageDetails, HomepageOrigin } from "@/components/homepage-details";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkGrid } from "@/components/work-grid";

export function PortfolioHome() {
  return (
    <div className="signal-site">
      <a className="portfolio-skip" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HomepageOrigin />
        <WorkGrid />
        <HomepageDetails />
      </main>
      <SiteFooter />
    </div>
  );
}
