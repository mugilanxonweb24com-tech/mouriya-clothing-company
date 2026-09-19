"use client";

import { useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

const routePaths = [
  "M116 292 C210 248 245 210 330 198 C408 188 460 156 548 128",
  "M116 292 C205 298 264 326 350 306 C438 286 486 248 578 242",
  "M116 292 C230 330 300 382 390 390 C468 397 520 370 592 350",
  "M116 292 C194 226 230 128 326 100 C422 72 488 84 562 58",
];

export default function GlobalExport() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const routeRefs = useRef<Array<SVGPathElement | null>>([]);
  const markerRefs = useRef<Array<SVGCircleElement | null>>([]);
  const copyRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const progressRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const origin = originRef.current;
    const copy = copyRef.current;
    const summary = summaryRef.current;
    const routes = routeRefs.current.filter((route): route is SVGPathElement => route !== null);
    const markers = markerRefs.current.filter((marker): marker is SVGCircleElement => marker !== null);
    const progressItems = progressRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    if (!section || !stage || !origin || !copy || !summary || routes.length !== routePaths.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const routeLengths = routes.map((route) => route.getTotalLength());
      gsap.set(routes, { strokeDasharray: (index) => routeLengths[index], strokeDashoffset: (index) => routeLengths[index] });
      gsap.set(markers, { opacity: 0 });
      gsap.set(origin, { opacity: 0, scale: 0.85 });
      gsap.set(copy, { opacity: 0, y: 24 });
      gsap.set(summary, { opacity: 0, y: 18 });

      if (reducedMotion) {
        gsap.set([stage, origin, copy, summary, ...routes, ...markers], { clearProps: "all" });
        return;
      }

      gsap.set(stage, { opacity: 0 });
      const setProgress = (index: number) => progressItems.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
      const moveMarkers = (progress: number) => {
        markers.forEach((marker, index) => {
          const route = routes[index];
          const point = route.getPointAtLength(routeLengths[index] * Math.min(1, Math.max(0, (progress - 0.48) / 0.42 + index * 0.04)));
          marker.setAttribute("cx", point.x.toFixed(2));
          marker.setAttribute("cy", point.y.toFixed(2));
        });
      };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            setProgress(Math.min(3, Math.floor(self.progress * 4)));
            moveMarkers(self.progress);
          },
        },
      });

      timeline
        .to(stage, { opacity: 1, duration: 0.08 }, 0)
        .to(copy, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.03)
        .to(origin, { opacity: 1, scale: 1, duration: 0.12, ease: "power2.out" }, 0.12)
        .to(routes[0], { strokeDashoffset: 0, duration: 0.14, ease: "power1.inOut" }, 0.24)
        .to(routes[1], { strokeDashoffset: 0, duration: 0.14, ease: "power1.inOut" }, 0.32)
        .to(routes[2], { strokeDashoffset: 0, duration: 0.14, ease: "power1.inOut" }, 0.4)
        .to(routes[3], { strokeDashoffset: 0, duration: 0.14, ease: "power1.inOut" }, 0.48)
        .to(markers, { opacity: 0.9, stagger: 0.04, duration: 0.08 }, 0.52)
        .to(summary, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.72)
        .to(stage, { opacity: 0.86, duration: 0.1 }, 0.9);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="global-export" ref={sectionRef} className="global-reach-section">
      <div ref={stageRef} className="global-reach-stage">
        <div className="container global-reach-layout">
          <div ref={copyRef} className="global-reach-copy">
            <p className="eyebrow">09 / Global Reach</p>
            <h2>Made In Tiruppur.<br />Ready To Go Further.</h2>
            <p className="global-reach-intro">Mouriya&apos;s manufacturing base in Tiruppur connects apparel production with the broader demands of modern garment supply.</p>
            <p className="global-reach-detail">From finished garment to dispatch-ready product, the journey continues beyond the factory floor.</p>
          </div>

          <div className="global-route-visual" style={assets.globalReach.mapVisual ? { backgroundImage: `url(${assets.globalReach.mapVisual})` } : undefined} aria-label="Abstract outward route system from Tiruppur">
            <div className="global-grid" aria-hidden="true" />
            <svg className="global-route-svg" viewBox="0 0 640 460" role="img" aria-label="Abstract routes extending from Tiruppur">
              <path className="global-geography" d="M198 92C248 48 332 34 410 66C476 92 540 126 572 188C594 232 560 284 514 316C456 356 386 402 302 390C224 378 146 340 116 280C88 226 128 154 198 92Z" />
              {routePaths.map((path, index) => <path key={path} ref={(element) => { routeRefs.current[index] = element; }} className={`global-route global-route-${index + 1}`} d={path} />)}
              <circle className="global-origin-ring" cx="116" cy="292" r="18" />
              <circle className="global-origin-dot" cx="116" cy="292" r="5" />
              {routePaths.map((path, index) => <circle key={`marker-${path}`} ref={(element) => { markerRefs.current[index] = element; }} className={`global-package-marker global-package-marker-${index + 1}`} cx={116} cy={292} r="5" />)}
            </svg>
            <div ref={originRef} className="global-origin-label"><strong>Tiruppur</strong><span>Tamil Nadu · India</span></div>
            {assets.globalReach.packaging ? <div className="global-packaging-image" style={{ backgroundImage: `url(${assets.globalReach.packaging})` }} /> : null}
            <span className="global-route-note global-route-note-1">Route 01</span>
            <span className="global-route-note global-route-note-2">Movement</span>
          </div>

          <div className="global-reach-progress" aria-label="Global reach stages">
            {siteConfig.globalReachStages.map((stage, index) => <span key={stage.id} ref={(element) => { progressRefs.current[index] = element; }} className={index === 0 ? "is-active" : ""}>{stage.index} {stage.label}</span>)}
          </div>
          <div ref={summaryRef} className="global-reach-summary">From production to possibility.</div>
          <div className="global-reach-cue">Let&apos;s build what moves next <span aria-hidden="true">-&gt;</span></div>
        </div>
      </div>
    </section>
  );
}
