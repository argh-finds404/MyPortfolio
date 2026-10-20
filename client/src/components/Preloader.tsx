"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";
import { useLenis } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";

/**
 * Intro sequence: a stack of images flicks through while a counter
 * runs to 100, then the last frame expands and the curtain lifts.
 * Plays once per browser session.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const lenis = useLenis();
  const images = site.hero.preloaderImages;

  // Keep the page locked while the intro plays
  useEffect(() => {
    if (gone) lenis?.start();
    else lenis?.stop();
  }, [gone, lenis]);

  useGSAP(
    () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem("intro-seen") === "1";
      } catch {}
      if (seen || prefersReducedMotion()) {
        setGone(true);
        finishIntro();
        return;
      }
      window.scrollTo(0, 0);

      const count = { v: 0 };
      const frames = gsap.utils.toArray<HTMLElement>(".pre-frame");
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          try {
            sessionStorage.setItem("intro-seen", "1");
          } catch {}
          setGone(true);
        },
      });

      tl.from(".pre-name span", { yPercent: 110, duration: 1, stagger: 0.04, ease: "expo.out" })
        .to(
          count,
          {
            v: 100,
            duration: 2.4,
            ease: "power2.inOut",
            onUpdate: () => {
              const el = root.current?.querySelector(".pre-count");
              if (el) el.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pre-bar", { scaleX: 1, duration: 2.4, ease: "power2.inOut" }, 0);

      frames.forEach((f, i) => {
        tl.fromTo(
          f,
          { clipPath: "inset(100% 0 0 0)", scale: 1.25 },
          { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.55, ease: "expo.out" },
          0.25 + i * (2 / frames.length),
        );
      });

      tl.to(".pre-stack", { width: "100vw", height: "100dvh", borderRadius: 0, duration: 1.1 }, "+=0.1")
        .to([".pre-name", ".pre-meta"], { opacity: 0, duration: 0.4, ease: "power2.out" }, "<")
        .add(finishIntro, "-=0.35")
        .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.3");
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-ink" aria-hidden>
      <div className="pre-stack relative h-[38vh] w-[28vh] overflow-hidden rounded-xl">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" className="pre-frame absolute inset-0 h-full w-full object-cover" style={{ zIndex: i }} />
        ))}
      </div>

      <div className="pre-name absolute top-8 left-1/2 flex -translate-x-1/2 overflow-hidden font-display text-xl font-semibold">
        {(site.shortName + ".").split("").map((c, i) => (
          <span key={i} className="inline-block">
            {c}
          </span>
        ))}
      </div>

      <div className="pre-meta container-x absolute inset-x-0 bottom-8 flex items-end justify-between">
        <p className="max-w-48 text-sm text-mute">{site.role}, {site.location}</p>
        <p className="pre-count display text-7xl tabular-nums sm:text-9xl">000</p>
      </div>
      <div className="pre-meta absolute inset-x-0 bottom-0 h-px bg-line">
        <div className="pre-bar h-full origin-left scale-x-0 bg-paper" />
      </div>
    </div>
  );
}
