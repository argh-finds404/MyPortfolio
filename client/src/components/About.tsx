"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Words are split even with reduced motion: each one glows neon on hover (see .about-word)
      const split = SplitText.create(".about-statement", { type: "words", wordsClass: "about-word" });
      if (prefersReducedMotion()) return () => split.revert();
      // Statement lights up word by word as you scroll through it
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".about-statement", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      // Portrait parallax + unmask
      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(18% 12% 18% 12% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: ".about-photo", start: "top 90%", end: "center 55%", scrub: true },
        },
      );
      gsap.fromTo(".about-photo img", { yPercent: -4, scale: 1.08 }, {
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: ".about-photo", start: "top bottom", end: "bottom top", scrub: true },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="container-x py-28 md:py-40">
      <p className="mb-10 text-sm text-mute">{site.sections.about.label}</p>
      <p className="about-statement display max-w-[22ch] text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.02]">
        {site.about.statement}
      </p>

      <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-8">
        <div className="about-photo relative aspect-[4/5] overflow-hidden rounded-3xl bg-raise md:col-span-5">
          <Image src={site.about.portrait} alt={`Portrait of ${site.name}`} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-[50%_30%]" unoptimized={site.about.portrait.endsWith(".svg")} />
        </div>

        <div className="flex flex-col justify-between gap-12 md:col-span-6 md:col-start-7">
          <div className="space-y-6">
            <RevealText as="h3" className="display text-4xl md:text-5xl">
              Hi, I&apos;m {site.name}.
            </RevealText>
            {site.about.paragraphs.map((p) => (
              <p key={p} className="max-w-[60ch] text-lg leading-relaxed text-paper/70">
                {p}
              </p>
            ))}
          </div>

          <dl className="grid grid-cols-2 border-t border-line">
            {site.about.facts.map((f, i) => (
              <div key={f.label} className={`border-b border-line py-5 ${i % 2 === 0 ? "pr-4" : "border-l pl-5"}`}>
                <dt className="text-sm text-mute">{f.label}</dt>
                <dd className="mt-1 font-display text-2xl font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
