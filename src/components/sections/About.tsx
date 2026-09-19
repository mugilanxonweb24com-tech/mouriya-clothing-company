"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { gsap } from "@/lib/gsap";

type VisualLayerProps = {
  className: string;
  label: string;
  assetPath: string;
};

const VisualLayer = forwardRef<HTMLDivElement, VisualLayerProps>(function VisualLayer(
  { className, label, assetPath },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`about-visual ${className}`}
      style={assetPath ? { backgroundImage: `url(${assetPath})` } : undefined}
    >
      <span>{label}</span>
    </div>
  );
});

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const visualStackRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const secondStoryRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const visualStack = visualStackRef.current;
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    const detail = detailRef.current;
    const story = storyRef.current;
    const secondStory = secondStoryRef.current;
    const metadata = metadataRef.current;

    if (!section || !headline || !visualStack || !primary || !secondary || !detail || !story || !secondStory || !metadata) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([headline, primary, secondary, detail, story, secondStory, metadata], { clearProps: "all" });
        return;
      }

      gsap.set(headline, { opacity: 0, y: 42, clipPath: "inset(0 0 100% 0)" });
      gsap.set(primary, { opacity: 0, y: 80 });
      gsap.set(secondary, { opacity: 0, y: 130 });
      gsap.set(detail, { opacity: 0, x: 70 });
      gsap.set([story, secondStory, metadata], { opacity: 0, y: 28 });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
        },
      })
        .to(headline, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.2, ease: "power2.out" }, 0.04)
        .to(primary, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.16)
        .to(secondary, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.2)
        .to(detail, { opacity: 1, x: 0, duration: 0.18, ease: "power2.out" }, 0.25)
        .to(story, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.42)
        .to(secondStory, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.62)
        .to(metadata, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.7)
        .to(primary, { y: -50, duration: 0.25, ease: "none" }, 0.3)
        .to(secondary, { y: -25, duration: 0.25, ease: "none" }, 0.3)
        .to(detail, { y: -10, duration: 0.25, ease: "none" }, 0.3)
        .to(visualStack, { y: -12, duration: 0.2, ease: "power1.out" }, 0.82);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-scroll-section">
      <div className="about-stage section-light">
        <div className="container about-layout">
          <div className="about-copy">
            <p className="eyebrow">02 / About Mouriya</p>
            <h2 ref={headlineRef}>Built Around<br />The Making Of<br />Better Garments.</h2>
            <div ref={storyRef} className="about-story">
              <p>Mouriya Clothing is an apparel manufacturing company based in Tiruppur, built around integrated production, garment expertise and long-term manufacturing relationships.</p>
            </div>
            <div ref={secondStoryRef} className="about-story about-story-secondary">
              <p>From fabric development to finished garments, the focus is on combining production capability, consistency and practical manufacturing experience for apparel requirements.</p>
            </div>
          </div>

          <div ref={visualStackRef} className="about-visual-stack" aria-label="Future factory imagery placeholders">
            <VisualLayer ref={primaryRef} className="about-visual-primary" label="Factory image" assetPath={assets.about.factoryPrimary} />
            <VisualLayer ref={secondaryRef} className="about-visual-secondary" label="Production detail" assetPath={assets.about.factorySecondary} />
            <VisualLayer ref={detailRef} className="about-visual-detail" label="Garment process" assetPath={assets.about.processDetail} />
          </div>

          <div ref={metadataRef} className="about-metadata">
            <span>Tiruppur</span>
            <span>Tamil Nadu</span>
            <span>India</span>
          </div>
        </div>
      </div>
    </section>
  );
}
