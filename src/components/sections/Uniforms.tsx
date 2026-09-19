"use client";

import { useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

type UniformCategory = (typeof siteConfig.uniformCategories)[number];

function UniformPlaceholder({ category, assetPath }: { category: UniformCategory; assetPath: string }) {
  if (assetPath) {
    return <div className="uniform-image" style={{ backgroundImage: `url(${assetPath})` }} aria-label={`${category.name} client image`} />;
  }

  const shape = category.id === "sports"
    ? "M105 84L52 125L76 192L108 174V350H212V174L244 192L268 125L215 84C197 72 123 72 105 84Z"
    : category.id === "workwear"
      ? "M98 84L42 126L68 200L104 176V350H216V176L252 200L278 126L222 84L190 112H130L98 84Z"
      : "M105 84L51 124L76 193L108 174V350H212V174L244 193L269 124L215 84C198 72 122 72 105 84Z";

  return (
    <svg className={`uniform-silhouette uniform-${category.id}`} viewBox="0 0 320 420" role="img" aria-label={`${category.name} placeholder silhouette`}>
      <defs>
        <linearGradient id={`uniform-${category.id}-tone`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={category.id === "sports" ? "#e5e0d5" : "#d5d2c9"} />
          <stop offset="1" stopColor={category.id === "corporate" ? "#394057" : "#7f8592"} />
        </linearGradient>
        <pattern id={`uniform-${category.id}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 0H10M0 0V10" stroke="#ffffff" strokeOpacity=".09" />
        </pattern>
      </defs>
      <path className="uniform-shadow" d="M63 385C104 405 216 405 257 385" />
      <path className="uniform-body" d={shape} fill={`url(#uniform-${category.id}-tone)`} />
      <path className="uniform-grid" d={shape} fill={`url(#uniform-${category.id}-grid)`} />
      {category.id === "corporate" ? <path className="uniform-detail" d="M132 78L160 125L188 78M160 125V350M111 170H209" /> : null}
      {category.id === "sports" ? <path className="uniform-detail uniform-sport-detail" d="M104 170H216M112 190H208M144 82L160 111L176 82" /> : null}
      {category.id === "school" ? <path className="uniform-detail" d="M132 80L160 123L188 80M160 123V350M111 184H209M160 164V220" /> : null}
      {category.id === "workwear" ? <path className="uniform-detail uniform-pocket-detail" d="M130 83L160 120L190 83M107 202H145V248H107M175 202H213V248H175M160 120V350" /> : null}
    </svg>
  );
}

export default function Uniforms() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const descriptionRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const purposeRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const visuals = visualRefs.current.filter((item): item is HTMLDivElement => item !== null);
    const titles = titleRefs.current.filter((item): item is HTMLHeadingElement => item !== null);
    const descriptions = descriptionRefs.current.filter((item): item is HTMLParagraphElement => item !== null);
    const purposes = purposeRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    const markers = markerRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    const summary = summaryRef.current;
    if (!section || !stage || visuals.length !== 4 || titles.length !== 4 || descriptions.length !== 4 || purposes.length !== 4 || !summary) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([stage, ...visuals, ...titles, ...descriptions, ...purposes, summary], { clearProps: "all" });
        return;
      }

      gsap.set(visuals.slice(1), { opacity: 0, x: 70, rotateY: 4 });
      gsap.set(titles.slice(1), { opacity: 0, y: 22 });
      gsap.set(descriptions.slice(1), { opacity: 0, y: 18 });
      gsap.set(purposes.slice(1), { opacity: 0 });
      gsap.set(summary, { opacity: 0, y: 18 });

      const setActive = (index: number) => {
        markers.forEach((marker, markerIndex) => marker.classList.toggle("is-active", markerIndex === index));
      };

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => setActive(Math.min(3, Math.floor(self.progress * 4))),
        },
      });

      timeline.to(stage, { opacity: 1, duration: 0.08 }, 0);
      for (let index = 1; index < visuals.length; index += 1) {
        const start = 0.2 * index;
        timeline
          .to(visuals[index - 1], { opacity: 0, x: -60, rotateY: -4, duration: 0.08, ease: "power2.in" }, start)
          .to(visuals[index], { opacity: 1, x: 0, rotateY: 0, duration: 0.1, ease: "power2.out" }, start + 0.02)
          .to(titles[index - 1], { opacity: 0, y: -16, duration: 0.06 }, start)
          .to(titles[index], { opacity: 1, y: 0, duration: 0.08 }, start + 0.03)
          .to(descriptions[index - 1], { opacity: 0, y: -12, duration: 0.05 }, start)
          .to(descriptions[index], { opacity: 1, y: 0, duration: 0.08 }, start + 0.03)
          .to(purposes[index - 1], { opacity: 0, duration: 0.05 }, start)
          .to(purposes[index], { opacity: 1, duration: 0.08 }, start + 0.03);
      }
      timeline.to(visuals[3], { scale: 0.84, y: -12, duration: 0.08 }, 0.82).to(summary, { opacity: 1, y: 0, duration: 0.1 }, 0.87);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="uniforms" ref={sectionRef} className="uniforms-section">
      <div ref={stageRef} className="uniforms-stage">
        <div className="container uniforms-layout">
          <div className="uniforms-copy">
            <p className="eyebrow">06 / Uniforms</p>
            <h2>Designed For<br />Purpose.</h2>
            <p className="uniforms-intro">Purpose-built apparel for organizations, institutions, teams and professional environments.</p>
            <div className="uniform-copy-stage">
              {siteConfig.uniformCategories.map((category, index) => (
                <div key={category.id} className="uniform-copy-item">
                  <span className="uniform-index">{category.index}</span>
                  <h3 ref={(element) => { titleRefs.current[index] = element; }}>{category.name}</h3>
                  <p ref={(element) => { descriptionRefs.current[index] = element; }}>{category.description}</p>
                  <span ref={(element) => { purposeRefs.current[index] = element; }} className="uniform-purpose">{category.purpose}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="uniform-visual-stage" aria-label="Uniform category placeholders">
            <span className="uniform-purpose-word">IDENTITY</span>
            {siteConfig.uniformCategories.map((category, index) => (
              <div key={category.id} ref={(element) => { visualRefs.current[index] = element; }} className={`uniform-visual uniform-visual-${category.id}${index === 0 ? " is-active" : ""}`}>
                <UniformPlaceholder category={category} assetPath={assets.uniforms[category.assetKey as keyof typeof assets.uniforms]} />
                <span className="uniform-visual-label">{category.index} / Purpose-built apparel</span>
              </div>
            ))}
          </div>

          <div className="uniform-progress" aria-label="Uniform categories">
            {siteConfig.uniformCategories.map((category, index) => (
              <span key={category.id} ref={(element) => { markerRefs.current[index] = element; }} className={index === 0 ? "is-active" : ""}>{category.index} <b>{category.name}</b></span>
            ))}
          </div>
          <div ref={summaryRef} className="uniforms-summary">Built for purpose. Checked for quality.</div>
        </div>
      </div>
    </section>
  );
}
