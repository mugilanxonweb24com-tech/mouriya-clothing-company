"use client";

import { useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

export default function Quality() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const checkpointRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const visual = visualRef.current;
    const scan = scanRef.current;
    const checkpoints = checkpointRefs.current.filter((item): item is HTMLDivElement => item !== null);
    const markers = markerRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    const summary = summaryRef.current;
    if (!section || !stage || !visual || !scan || checkpoints.length !== 4 || !summary) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const setActive = (index: number) => markers.forEach((marker, markerIndex) => marker.classList.toggle("is-active", markerIndex === index));

      if (reducedMotion) {
        gsap.set([stage, visual, scan, ...checkpoints, summary], { clearProps: "all" });
        return;
      }

      gsap.set(stage, { opacity: 0 });
      gsap.set(visual, { opacity: 0, scale: 1.08, x: 20 });
      gsap.set(scan, { opacity: 0, y: "-110%" });
      gsap.set(checkpoints.slice(1), { opacity: 0, y: 24 });
      gsap.set(summary, { opacity: 0, y: 18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
        },
      });

      timeline
        .to(stage, { opacity: 1, duration: 0.08 }, 0)
        .to(visual, { opacity: 1, scale: 1, x: 0, duration: 0.24, ease: "power2.out" }, 0.04)
        .to(scan, { opacity: 0.8, y: "110%", duration: 0.18, ease: "none" }, 0.14)
        .to(checkpoints[0], { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.14)
        .to(checkpoints[0], { opacity: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.29)
        .to(checkpoints[1], { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" }, 0.31)
        .to(visual, { x: -18, scale: 1.035, duration: 0.16, ease: "none" }, 0.32)
        .to(checkpoints[1], { opacity: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.47)
        .to(checkpoints[2], { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" }, 0.49)
        .to(visual, { x: 14, scale: 1.02, duration: 0.16, ease: "none" }, 0.5)
        .to(checkpoints[2], { opacity: 0, y: -20, duration: 0.07, ease: "power2.in" }, 0.65)
        .to(checkpoints[3], { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" }, 0.67)
        .to(visual, { x: 0, scale: 0.98, duration: 0.16, ease: "none" }, 0.7)
        .to(checkpoints[3], { opacity: 0, y: -16, duration: 0.08 }, 0.87)
        .to(summary, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.88)
        .to(scan, { opacity: 0, duration: 0.06 }, 0.88);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="quality" ref={sectionRef} className="quality-section">
      <div ref={stageRef} className="quality-stage">
        <div className="container quality-layout">
          <div className="quality-copy">
            <p className="eyebrow">07 / Quality</p>
            <h2>Built Into<br />Every Stage.</h2>
            <p className="quality-intro">Quality is maintained through controlled production, process checks and careful finishing across the manufacturing journey.</p>
            <div className="quality-checkpoints">
              {siteConfig.qualityCheckpoints.map((checkpoint, index) => (
                <div key={checkpoint.id} ref={(element) => { checkpointRefs.current[index] = element; }} className="quality-checkpoint">
                  <span>{checkpoint.index}</span>
                  <h3>{checkpoint.title}</h3>
                  <p>{checkpoint.description}</p>
                </div>
              ))}
            </div>
            <p className="quality-detail">From material handling to finished garment inspection, consistency depends on attention at every stage.</p>
          </div>

          <div ref={visualRef} className="quality-visual" style={assets.quality.macroFabric ? { backgroundImage: `url(${assets.quality.macroFabric})` } : undefined} aria-label="Abstract macro textile inspection visual">
            <div className="quality-weave" />
            <div className="quality-frame" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="quality-ruler quality-ruler-horizontal" aria-hidden="true" />
            <div className="quality-ruler quality-ruler-vertical" aria-hidden="true" />
            <div ref={scanRef} className="quality-scan-line" aria-hidden="true" />
            {assets.quality.inspectionDetail ? <div className="quality-detail-image" style={{ backgroundImage: `url(${assets.quality.inspectionDetail})` }} /> : null}
          </div>

          <div className="quality-progress" aria-label="Quality checkpoints">
            {siteConfig.qualityCheckpoints.map((checkpoint, index) => (
              <span key={checkpoint.id} ref={(element) => { markerRefs.current[index] = element; }} className={index === 0 ? "is-active" : ""}>{checkpoint.index}</span>
            ))}
          </div>
          <div ref={summaryRef} className="quality-summary">Quality is not a final step. It is part of the process.</div>
        </div>
      </div>
    </section>
  );
}
