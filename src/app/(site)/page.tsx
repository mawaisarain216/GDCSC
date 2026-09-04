import { getContent, getHomepageSections, getSlides } from "@/lib/repo";
import HeroSlider from "@/components/site/sections/HeroSlider";
import QuickLinksSection from "@/components/site/sections/QuickLinksSection";
import AboutSection from "@/components/site/sections/AboutSection";
import WhyChooseUsSection from "@/components/site/sections/WhyChooseUsSection";
import PrincipalSection from "@/components/site/sections/PrincipalSection";
import ProgramsSection from "@/components/site/sections/ProgramsSection";
import AchievementsSection from "@/components/site/sections/AchievementsSection";
import NewsAnnouncementsSection from "@/components/site/sections/NewsAnnouncementsSection";
import GallerySection from "@/components/site/sections/GallerySection";
import CtaSection from "@/components/site/sections/CtaSection";

const SECTION_MAP: Record<string, React.ComponentType> = {
  quickLinks: QuickLinksSection,
  about: AboutSection,
  whyChooseUs: WhyChooseUsSection,
  principal: PrincipalSection,
  programs: ProgramsSection,
  achievements: AchievementsSection,
  newsAnnouncements: NewsAnnouncementsSection,
  gallery: GallerySection,
  cta: CtaSection,
};

export default async function HomePage() {
  const sections = await getHomepageSections();
  const slides = await getSlides(true);
  const heroVisible = sections.find((s) => s.key === "hero")?.visible ?? true;

  return (
    <>
      {heroVisible && (
        <HeroSlider
          slides={slides}
          eyebrow={await getContent("home.hero.eyebrow", "Government of Sindh")}
          fallbackTitle={await getContent("home.hero.title", "Govt. Boys Degree College Shahpur Chakar")}
          fallbackSubtitle={await getContent("home.hero.subtitle", "")}
        />
      )}
      {sections
        .filter((s) => s.key !== "hero" && s.visible)
        .map((s) => {
          const Cmp = SECTION_MAP[s.key];
          if (!Cmp) return null;
          return <Cmp key={s.key} />;
        })}
    </>
  );
}
