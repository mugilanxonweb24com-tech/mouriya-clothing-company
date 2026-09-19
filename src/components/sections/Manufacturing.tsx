"use client";

import { useLayoutEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { manufacturingProgress } from "@/lib/manufacturingProgress";

export default function Manufacturing() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const markersRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    if (!section || !stage || !number || !title || !description) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const setProgress = (value: number, active: boolean) => {
        manufacturingProgress.value = value;
        manufacturingProgress.active = active;
      };

      if (reducedMotion) {
        setProgress(0.88, true);
        gsap.set([number, title, description, stage], { clearProps: "all" });
        number.textContent = siteConfig.manufacturingStages[6].index;
        title.textContent = siteConfig.manufacturingStages[6].title;
        description.textContent = siteConfig.manufacturingStages[6].description;
        return;
      }

      gsap.set(stage, { opacity: 1 });
      gsap.set([number, title, description], { opacity: 1, y: 0 });

      let activeIndex = 0;
      const updateStage = (index: number) => {
        if (index === activeIndex) return;
        activeIndex = index;
        const nextStage = siteConfig.manufacturingStages[index];
        gsap.to([number, title, description], {
          opacity: 0,
          y: -14,
          duration: 0.12,
          ease: "power2.in",
          onComplete: () => {
            number.textContent = nextStage.index;
            title.textContent = nextStage.title;
            description.textContent = nextStage.description;
            gsap.fromTo([number, title, description], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" });
          },
        });
        markersRef.current.forEach((marker, markerIndex) => marker.classList.toggle("is-active", markerIndex === index));
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onEnter: () => setProgress(0, true),
        onEnterBack: () => setProgress(0.99, true),
        onLeave: () => setProgress(1, false),
        onLeaveBack: () => setProgress(0, false),
        onUpdate: (self) => {
          setProgress(self.progress, true);
          updateStage(Math.min(siteConfig.manufacturingStages.length - 1, Math.floor(self.progress * siteConfig.manufacturingStages.length)));
        },
      });

      return () => {
        trigger.kill();
        setProgress(0, false);
      };
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="manufacturing" ref={sectionRef} className="manufacturing-section">
      <div ref={stageRef} className="manufacturing-stage">
        <div className="container manufacturing-layout">
          <div className="manufacturing-copy">
            <p className="eyebrow">04 / How It&apos;s Made</p>
            <h2>From Thread<br />To Finished Garment.</h2>
            <p className="manufacturing-stage-total">01 — 07 / PRODUCTION LINE</p>
            <p className="manufacturing-stage-number" ref={numberRef}>01</p>
            <h3 ref={titleRef}>Raw Thread</h3>
            <p className="manufacturing-description" ref={descriptionRef}>The material journey begins with yarn prepared for fabric production.</p>
            <p className="manufacturing-cue">Scroll through the process</p>
          </div>
          <div className="manufacturing-progress" aria-label="Manufacturing process stages">
            {siteConfig.manufacturingStages.map((stage, index) => (
              <span
                key={stage.id}
                ref={(element) => { if (element) markersRef.current[index] = element; }}
                className={index === 0 ? "is-active" : ""}
                aria-label={`${stage.index} ${stage.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
