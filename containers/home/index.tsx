import { Hero } from "./Hero";
import { AboutPreview } from "./AboutPreview";
import { EventSection } from "./event";
import { LatestArticles } from "./LatestArticles";
import { ICCPSection } from "./ICCPSection";
import { CTASection } from "./CTASection";

export const HomeContainer = () => {
    return (
        <main className="w-full">
            <Hero />
            <AboutPreview />
            <EventSection />
            <ICCPSection />
            <LatestArticles />
            <CTASection />
        </main>
    );
};
