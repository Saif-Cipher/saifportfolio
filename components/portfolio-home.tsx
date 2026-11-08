import { WorkLaunch } from "@/components/work-launch";
import { Hero } from "@/components/hero";
import { HomepageDetails, HomepageFooter, HomepageOrigin } from "@/components/homepage-details";
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
      <HomepageFooter />
      <WorkLaunch />
    </div>
  );
}
