"use client";

import { useLayoutEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

const workstationUnits = Array.from({ length: 12 }, (_, index) => index);

export default function FactoryScale() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cueRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const floor = floorRef.current;
    const path = pathRef.current;
    const cue = cueRef.current;
    const metrics = metricRefs.current.filter((metric): metric is HTMLDivElement => metric !== null);

    if (!section || !heading || !floor || !path || !cue || metrics.length !== siteConfig.factoryStats.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([heading, floor, path, ...metrics, cue], { clearProps: "all" });
        gsap.set(metrics, { opacity: 0, y: 0 });
        gsap.set(metrics[0], { opacity: 1 });
        return;
      }

      gsap.set(heading, { opacity: 0, y: 28 });
      gsap.set(floor, { opacity: 0.32, y: 40, scale: 0.94 });
      gsap.set(path, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(metrics, { opacity: 0, y: 30 });
      gsap.set(cue, { opacity: 0, y: 18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      timeline
        .to(heading, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.02)
        .to(floor, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }, 0.08)
        .to(metrics[0], { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.12)
        .to(metrics[0], { opacity: 0, y: -28, duration: 0.08, ease: "power2.in" }, 0.25)
        .to(path, { scaleX: 1, duration: 0.26, ease: "power1.inOut" }, 0.2)
        .to(metrics[1], { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.3)
        .to(metrics[1], { opacity: 0, y: -28, duration: 0.08, ease: "power2.in" }, 0.42)
        .to(metrics[2], { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.48)
        .to(metrics[2], { opacity: 0, y: -28, duration: 0.08, ease: "power2.in" }, 0.62)
        .to(floor, { y: -18, scale: 1.03, duration: 0.22, ease: "none" }, 0.55)
        .to(metrics[3], { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.68)
        .to(cue, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.86);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="factory" ref={sectionRef} className="factory-scale-section">
      <div className="factory-scale-stage">
        <div className="container factory-scale-layout">
          <div ref={headingRef} className="factory-scale-heading">
            <p className="eyebrow">03 / Scale &amp; Capability</p>
            <h2>Built For<br />Production.</h2>
            <p className="factory-scale-description">A manufacturing setup designed to handle garment production with consistency, capacity and operational control.</p>
            <p className="factory-scale-location">Tiruppur · Tamil Nadu · India</p>
          </div>

          <div ref={floorRef} className="factory-floor" aria-label="Abstract factory floor visualization">
            <div className="factory-floor-grid" aria-hidden="true" />
            <div className="factory-lane factory-lane-input"><span>Input</span></div>
            <div className="factory-lane factory-lane-sewing"><span>Sewing Line</span></div>
            <div className="factory-lane factory-lane-processing"><span>Processing</span></div>
            <div className="factory-lane factory-lane-output"><span>Output</span></div>
            <div className="factory-structure factory-structure-left" aria-hidden="true" />
            <div className="factory-structure factory-structure-right" aria-hidden="true" />
            <div className="machine-grid" aria-hidden="true">
              {workstationUnits.map((unit) => <span key={unit} className="machine-unit" />)}
            </div>
            <div ref={pathRef} className="production-path" aria-hidden="true" />
            <div className="factory-boundary" aria-hidden="true" />
          </div>

          <div className="factory-metrics" aria-label="Factory scale statistics">
            {siteConfig.factoryStats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(element) => { metricRefs.current[index] = element; }}
                className={`factory-metric factory-metric-${index + 1}`}
              >
                <p className="factory-metric-value">{stat.value.toLocaleString()}{stat.suffix}</p>
                <p className="factory-metric-label">{stat.label}</p>
              </div>
            ))}
          </div>

          <p ref={cueRef} className="factory-next-cue">Next / How it&apos;s made <span aria-hidden="true">-&gt;</span></p>
        </div>
      </div>
    </section>
  );
}
