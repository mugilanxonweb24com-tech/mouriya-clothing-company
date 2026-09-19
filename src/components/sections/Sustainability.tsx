"use client";

import { useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

export default function Sustainability() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const themeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const line = lineRef.current;
    const visual = visualRef.current;
    const themes = themeRefs.current.filter((item): item is HTMLDivElement => item !== null);
    const markers = markerRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    const summary = summaryRef.current;
    if (!section || !stage || !line || !visual || themes.length !== 4 || !summary) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const lineLength = line.getTotalLength();
      gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength });
      gsap.set(themes.slice(1), { opacity: 0, y: 20 });
      gsap.set(summary, { opacity: 0, y: 18 });

      if (reducedMotion) {
        gsap.set([stage, visual, line, ...themes, summary], { clearProps: "all" });
        return;
      }

      gsap.set(stage, { opacity: 0 });
      gsap.set(visual, { opacity: 0, scale: 0.96, y: 18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            markers.forEach((marker, index) => marker.classList.toggle("is-active", index === Math.min(3, Math.floor(self.progress * 4))));
          },
        },
      });

      timeline
        .to(stage, { opacity: 1, duration: 0.1 }, 0)
        .to(visual, { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.04)
        .to(line, { strokeDashoffset: 0, duration: 0.48, ease: "power1.inOut" }, 0.12)
        .to(themes[0], { opacity: 1, y: 0, duration: 0.1 }, 0.24)
        .to(themes[0], { opacity: 0, y: -15, duration: 0.06 }, 0.42)
        .to(themes[1], { opacity: 1, y: 0, duration: 0.08 }, 0.44)
        .to(themes[1], { opacity: 0, y: -15, duration: 0.06 }, 0.59)
        .to(themes[2], { opacity: 1, y: 0, duration: 0.08 }, 0.61)
        .to(themes[2], { opacity: 0, y: -15, duration: 0.06 }, 0.76)
        .to(themes[3], { opacity: 1, y: 0, duration: 0.08 }, 0.78)
        .to(visual, { scale: 0.98, x: 18, duration: 0.12 }, 0.82)
        .to(themes[3], { opacity: 0, y: -15, duration: 0.06 }, 0.9)
        .to(summary, { opacity: 1, y: 0, duration: 0.1 }, 0.91);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="sustainability" ref={sectionRef} className="sustainability-section">
      <div ref={stageRef} className="sustainability-stage">
        <div className="container sustainability-layout">
          <div className="sustainability-copy">
            <p className="eyebrow">08 / Responsibility</p>
            <h2>Made With<br />Responsibility<br />In Mind.</h2>
            <p className="sustainability-intro">Responsible manufacturing is shaped by thoughtful production practices, careful resource use and a long-term approach to people, process and environment.</p>
            <div className="responsibility-themes">
              {siteConfig.responsibilityThemes.map((theme, index) => (
                <div key={theme.id} ref={(element) => { themeRefs.current[index] = element; }} className="responsibility-theme">
                  <span>{theme.index}</span>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                </div>
              ))}
            </div>
            <p className="sustainability-detail">As the company develops its operations, sustainability and social responsibility remain part of the broader manufacturing journey.</p>
          </div>

          <div ref={visualRef} className="responsibility-visual" style={assets.sustainability.primary ? { backgroundImage: `url(${assets.sustainability.primary})` } : undefined} aria-label="Abstract organic material-flow visual">
            <div className="responsibility-weave" />
            <svg className="responsibility-orbit" viewBox="0 0 600 600" aria-hidden="true">
              <circle className="responsibility-circle" cx="300" cy="300" r="168" />
              <path ref={lineRef} className="responsibility-line" d="M35 340C125 108 225 492 312 280C386 100 438 212 565 168" />
              <path className="responsibility-branch" d="M312 280C370 300 408 352 432 420M312 280C273 238 258 194 270 142" />
              <circle className="responsibility-node" cx="312" cy="280" r="7" />
              <circle className="responsibility-node" cx="432" cy="420" r="6" />
              <circle className="responsibility-node" cx="270" cy="142" r="6" />
            </svg>
            {assets.sustainability.detail ? <div className="responsibility-detail-image" style={{ backgroundImage: `url(${assets.sustainability.detail})` }} /> : null}
            <span className="responsibility-label responsibility-label-material">Material</span>
            <span className="responsibility-label responsibility-label-process">Process</span>
            <span className="responsibility-label responsibility-label-people">People</span>
            <span className="responsibility-label responsibility-label-impact">Impact</span>
          </div>

          <div className="responsibility-progress" aria-label="Responsibility themes">
            {siteConfig.responsibilityThemes.map((theme, index) => (
              <span key={theme.id} ref={(element) => { markerRefs.current[index] = element; }} className={index === 0 ? "is-active" : ""}>{theme.index}</span>
            ))}
          </div>
          <div ref={summaryRef} className="sustainability-summary">Responsibility is a continuous process.</div>
        </div>
      </div>
    </section>
  );
}
