import { Hero } from "./Hero";
import { AboutPreview } from "./AboutPreview";
import { EventSection } from "./event";
import { LatestArticles } from "./LatestArticles";
import { SCCPSection } from "./SCCPSection";
import { CTASection } from "./CTASection";

export const HomeContainer = () => {
  return (
    <main className="w-full">
      <Hero />
      <AboutPreview />
      <EventSection />
      <SCCPSection />
      <LatestArticles />
      <CTASection />
    </main>
  );
};
