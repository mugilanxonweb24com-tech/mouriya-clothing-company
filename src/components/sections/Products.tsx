"use client";

import { useLayoutEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";

type ProductCategory = (typeof siteConfig.productCategories)[number];

function GarmentPlaceholder({ category, assetPath }: { category: ProductCategory; assetPath: string }) {
  if (assetPath) {
    return <div className="product-image" style={{ backgroundImage: `url(${assetPath})` }} aria-label={`${category.name} client image`} />;
  }

  return (
    <svg className={`garment-silhouette garment-${category.id}`} viewBox="0 0 320 420" role="img" aria-label={`${category.name} placeholder silhouette`}>
      <defs>
        <linearGradient id={`garment-${category.id}-tone`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f1ece1" />
          <stop offset="0.65" stopColor="#c7c0b3" />
          <stop offset="1" stopColor="#99958f" />
        </linearGradient>
        <pattern id={`garment-${category.id}-weave`} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0L8 8M8 0L0 8" stroke="#11162c" strokeOpacity=".08" strokeWidth=".7" />
        </pattern>
      </defs>
      <path className="garment-shadow" d="M64 390C94 410 226 410 256 390" />
      <path className="garment-body" d={category.id === "hoodie" ? "M105 104L55 138L78 206L109 188V350H211V188L242 206L265 138L215 104C198 90 122 90 105 104Z" : "M105 92L50 126L74 198L108 177V350H212V177L246 198L270 126L215 92C198 77 122 77 105 92Z"} fill={`url(#garment-${category.id}-tone)`} />
      <path className="garment-weave" d={category.id === "hoodie" ? "M105 104L55 138L78 206L109 188V350H211V188L242 206L265 138L215 104C198 90 122 90 105 104Z" : "M105 92L50 126L74 198L108 177V350H212V177L246 198L270 126L215 92C198 77 122 77 105 92Z"} fill={`url(#garment-${category.id}-weave)`} />
      {category.id === "polo" ? <path className="garment-detail" d="M133 86L160 129L187 86M160 129V160" /> : null}
      {category.id === "hoodie" ? <path className="garment-detail" d="M128 99C128 132 192 132 192 99M160 132V162" /> : null}
      {category.id === "sportswear" ? <path className="garment-detail garment-stripe" d="M107 175H213M107 193H213" /> : null}
      {category.id === "tshirts" ? <path className="garment-detail" d="M137 82C140 112 180 112 183 82" /> : null}
    </svg>
  );
}

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const productRefs = useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const descriptionRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const summaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const products = productRefs.current.filter((item): item is HTMLDivElement => item !== null);
    const titles = titleRefs.current.filter((item): item is HTMLHeadingElement => item !== null);
    const descriptions = descriptionRefs.current.filter((item): item is HTMLParagraphElement => item !== null);
    const markers = markerRefs.current.filter((item): item is HTMLSpanElement => item !== null);
    const summary = summaryRef.current;
    if (!section || !stage || products.length !== 4 || titles.length !== 4 || descriptions.length !== 4 || !summary) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      const setActive = (index: number) => {
        products.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
        titles.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
        descriptions.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
        markers.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
      };

      if (reducedMotion) {
        gsap.set(stage, { clearProps: "all" });
        products.forEach((item) => gsap.set(item, { clearProps: "all" }));
        titles.forEach((item) => gsap.set(item, { clearProps: "all" }));
        descriptions.forEach((item) => gsap.set(item, { clearProps: "all" }));
        gsap.set(summary, { clearProps: "all" });
        return;
      }

      gsap.set(products.slice(1), { opacity: 0, x: 120, rotateY: 5 });
      gsap.set(products[0], { opacity: 1, x: 0, rotateY: 0 });
      gsap.set(titles.slice(1), { opacity: 0, y: 22 });
      gsap.set(descriptions.slice(1), { opacity: 0, y: 18 });
      gsap.set(summary, { opacity: 0, y: 18 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: (self) => {
            setActive(Math.min(3, Math.floor(self.progress * 4)));
          },
        },
      });

      timeline.to(stage, { opacity: 1, duration: 0.08 }, 0);
      for (let index = 1; index < products.length; index += 1) {
        const start = 0.2 * index;
        timeline
          .to(products[index - 1], { opacity: 0, x: -100, rotateY: -5, duration: 0.08, ease: "power2.in" }, start)
          .to(products[index], { opacity: 1, x: 0, rotateY: 0, duration: 0.1, ease: "power2.out" }, start + 0.02)
          .to(titles[index - 1], { opacity: 0, y: -16, duration: 0.06 }, start)
          .to(titles[index], { opacity: 1, y: 0, duration: 0.08 }, start + 0.03)
          .to(descriptions[index - 1], { opacity: 0, y: -12, duration: 0.05 }, start)
          .to(descriptions[index], { opacity: 1, y: 0, duration: 0.08 }, start + 0.03);
      }
      timeline.to(products[3], { scale: 0.82, y: -12, duration: 0.08 }, 0.82).to(summary, { opacity: 1, y: 0, duration: 0.1 }, 0.86);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="products-section">
      <div ref={stageRef} className="products-stage">
        <div className="container products-layout">
          <div className="products-copy">
            <p className="eyebrow">05 / Products</p>
            <h2>Made To Be<br />Worn.</h2>
            <p className="products-intro">From everyday apparel to performance-led garments, Mouriya&apos;s production capabilities support a range of finished clothing categories.</p>
            <div className="product-copy-stage">
              {siteConfig.productCategories.map((category, index) => (
                <div key={category.id} className="product-copy-item">
                  <span>{category.index}</span>
                  <h3 ref={(element) => { titleRefs.current[index] = element; }}>{category.name}</h3>
                  <p ref={(element) => { descriptionRefs.current[index] = element; }}>{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="product-visual-stage" aria-label="Product category placeholders">
            {siteConfig.productCategories.map((category, index) => (
              <div
                key={category.id}
                ref={(element) => { productRefs.current[index] = element; }}
                className={`product-visual product-visual-${category.id}${index === 0 ? " is-active" : ""}`}
              >
                <GarmentPlaceholder category={category} assetPath={assets.products[category.assetKey as keyof typeof assets.products]} />
                <span className="product-visual-label">{category.index} / Collection</span>
              </div>
            ))}
          </div>

          <div className="product-progress" aria-label="Product categories">
            {siteConfig.productCategories.map((category, index) => (
              <span key={category.id} ref={(element) => { markerRefs.current[index] = element; }} className={index === 0 ? "is-active" : ""}>
                {category.index} <b>{category.name}</b>
              </span>
            ))}
          </div>

          <div ref={summaryRef} className="products-summary" aria-hidden="true">T-Shirts / Polo / Sweatshirts / Sportswear</div>
        </div>
      </div>
    </section>
  );
}
