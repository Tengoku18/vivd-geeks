"use client";
import { useState, useMemo } from "react";
import {
  SECTIONS_CONFIG,
  HERO_CONFIG,
  MARQUEE_CONFIG,
  STATS_SECTION_ID,
  CONTACT_CONFIG,
  FAQ_CONFIG,
  FOOTER_CONFIG,
} from "@/config/sections";
import { distributeScrollRanges, getOverlayRange } from "@/lib/scrollUtils";
import { useLenis } from "@/hooks/useLenis";

import Loader from "@/components/organisms/Loader/Loader";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import HeroSection from "@/components/organisms/HeroSection/HeroSection";
import CanvasScene from "@/components/organisms/CanvasScene/CanvasScene";
import DarkOverlay from "@/components/organisms/DarkOverlay/DarkOverlay";
import GlassOverlay from "@/components/organisms/GlassOverlay/GlassOverlay";
import MarqueeText from "@/components/organisms/MarqueeText/MarqueeText";
import ScrollSection from "@/components/organisms/ScrollSection/ScrollSection";
import StatsSection from "@/components/organisms/StatsSection/StatsSection";
import CtaSection from "@/components/organisms/CtaSection/CtaSection";
import ContactSection from "@/components/organisms/ContactSection/ContactSection";
import FAQSection from "@/components/organisms/FAQSection/FAQSection";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  useLenis();

  const sections = useMemo(() => distributeScrollRanges(SECTIONS_CONFIG), []);
  const overlayRange = useMemo(
    () => getOverlayRange(sections, STATS_SECTION_ID),
    [sections],
  );

  return (
    <>
      <Loader progress={loadProgress} />
      <SiteHeader />
      <HeroSection config={HERO_CONFIG} />
      <CanvasScene onLoadProgress={setLoadProgress} />
      <GlassOverlay enter={18} leave={100} />
      <DarkOverlay enter={overlayRange.enter} leave={overlayRange.leave} />
      {/* MarqueeText is a fixed overlay — it is NOT part of SECTIONS_CONFIG */}
      <MarqueeText
        text={MARQUEE_CONFIG.text}
        speed={MARQUEE_CONFIG.speed}
        enterAt={MARQUEE_CONFIG.enterAt}
        leaveAt={MARQUEE_CONFIG.leaveAt}
      />

      <div
        id="scroll-container"
        className="relative"
        style={{ height: "var(--scroll-height)" }}
      >
        {sections.map((section) => {
          switch (section.type) {
            case "content":
              return <ScrollSection key={section.id} section={section} />;
            case "stats":
              return <StatsSection key={section.id} section={section} />;
            case "cta":
              return <CtaSection key={section.id} section={section} />;
          }
        })}
      </div>

      {/* Post-scroll content: normal document flow, solid backgrounds so
          they sit above the fixed canvas/overlays once the animation ends. */}
      <ContactSection config={CONTACT_CONFIG} />
      <FAQSection config={FAQ_CONFIG} />
      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
