"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { heroProgress } from "@/lib/heroProgress";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const textileRef = useRef<HTMLDivElement>(null);
  const garmentRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const intro = introRef.current;
    const cue = cueRef.current;
    const thread = threadRef.current;
    const textile = textileRef.current;
    const garment = garmentRef.current;
    const detail = detailRef.current;

    if (!hero || !intro || !cue || !thread || !textile || !garment || !detail) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reducedMotion) {
        heroProgress.value = 1;
        gsap.set([intro, cue, textile, garment, detail], { clearProps: "all" });
        gsap.set(thread, { strokeDashoffset: 0 });
        return;
      }

      gsap.set(intro, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" });
      gsap.set(cue, { opacity: 0, y: 20 });
      gsap.set(textile, { opacity: 0.42, scale: 0.96, y: 8 });
      gsap.set(garment, { opacity: 1, scale: 0.96, y: 8, rotateY: -2 });
      gsap.set(detail, { opacity: 0.45, y: 6 });

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          heroProgress.value = self.progress;
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      })
        .to(intro, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.18, ease: "power2.out" }, 0.3)
        .to(cue, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.56)
        .to(intro, { opacity: 0.92, y: -8, duration: 0.18, ease: "power2.in" }, 0.9)
        .to(cue, { opacity: 0, duration: 0.12, ease: "power2.in" }, 0.92)
        .to(thread, { strokeDashoffset: 0, duration: 0.25, ease: "power1.inOut" }, 0.12)
        .to(textile, { opacity: 1, scale: 1, y: 0, duration: 0.24, ease: "power2.out" }, 0.24)
        .to(garment, { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 0.25, ease: "power3.out" }, 0.4)
        .to(detail, { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.58)
        .to(garment, { y: -8, duration: 0.18, ease: "power1.inOut" }, 0.72)
        .to([textile, garment], { opacity: 0.72, y: -18, duration: 0.16, ease: "power2.in" }, 0.9);
    }, hero);

    return () => {
      context.revert();
      heroProgress.value = 0;
    };
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-scroll-section">
      <div className="hero-stage section-hero">
        <div className="container section-inner hero-inner">
          <div ref={introRef} className="hero-intro">
            <p className="eyebrow">Integrated Apparel Manufacturing</p>
            <h1>Crafted From Thread.<br />Built For The World.</h1>
            <p className="section-description">Apparel manufacturing from Tiruppur, India, built around production capability, quality and garment expertise.</p>
            <p className="hero-location">Tiruppur · Tamil Nadu · India</p>
            <a ref={cueRef} className="text-link hero-cue" href="#about">
              Scroll to explore <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-visual" aria-label="Abstract textile becoming a finished garment">
            <div className="hero-visual-panel" />
            <svg className="hero-thread" viewBox="0 0 520 620" aria-hidden="true">
              <path ref={threadRef} d="M40 552C126 510 82 418 190 390C280 366 238 276 322 238C382 211 414 146 478 76" />
            </svg>
            <div ref={textileRef} className="hero-textile-field" aria-hidden="true" />
            <div ref={garmentRef} className="hero-garment" aria-hidden="true">
              <svg viewBox="0 0 320 430">
                <defs>
                  <linearGradient id="hero-garment-tone" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#f3ede3" />
                    <stop offset="0.62" stopColor="#d7cec2" />
                    <stop offset="1" stopColor="#aaa196" />
                  </linearGradient>
                  <pattern id="hero-garment-weave" width="9" height="9" patternUnits="userSpaceOnUse">
                    <path d="M0 0L9 9M9 0L0 9" stroke="#101626" strokeOpacity=".055" strokeWidth=".7" />
                  </pattern>
                </defs>
                <path className="hero-garment-shadow" d="M54 395C108 414 218 414 270 395" />
                <path className="hero-garment-body" d="M105 78L48 120L74 194L108 172V352H212V172L246 194L272 120L215 78C198 66 122 66 105 78Z" fill="url(#hero-garment-tone)" />
                <path className="hero-garment-weave" d="M105 78L48 120L74 194L108 172V352H212V172L246 194L272 120L215 78C198 66 122 66 105 78Z" fill="url(#hero-garment-weave)" />
                <path className="hero-garment-neck" d="M132 72C136 112 184 112 188 72" />
                <path className="hero-garment-seam" d="M108 172V352M212 172V352" />
              </svg>
            </div>
            <div ref={detailRef} className="hero-visual-detail">From textile to finished apparel</div>
          </div>
        </div>
      </div>
    </section>
  );
}
