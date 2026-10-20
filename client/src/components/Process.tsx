"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";
import StepIcon from "@/components/ui/StepIcon";

/** How a project progresses. The rail fills as you scroll and each step lights up when reached. */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".process-fill", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".process-list", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
        gsap.fromTo(step, { opacity: 0.3 }, {
          opacity: 1,
          duration: 0.4,
          scrollTrigger: { trigger: step, start: "top 60%", toggleActions: "play none none reverse" },
        });
        // Colour comes from CSS (.is-active) so it follows the theme
        // .is-active on the step lights the dot and plays its icon animation
        ScrollTrigger.create({ trigger: step, start: "top 60%", toggleClass: { targets: [step, step.querySelector(".process-dot")!], className: "is-active" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="container-x grid gap-16 py-28 md:grid-cols-12 md:py-40">
      <div className="md:col-span-5">
        <div className="md:sticky md:top-32">
          <RevealText className="display text-[clamp(2.75rem,6vw,5.5rem)]">{site.sections.process.title}</RevealText>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-paper/70">{site.sections.process.intro}</p>
        </div>
      </div>

      <ol className="process-list relative md:col-span-6 md:col-start-7">
        <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-line">
          <span className="process-fill block h-full w-full origin-top bg-accent" />
        </span>
        {site.process.map((step, i) => (
          <li key={step.title} className="process-step relative pb-16 pl-14 last:pb-0">
            <span aria-hidden className="process-dot absolute top-1.5 left-0 h-[23px] w-[23px] rounded-full border border-line bg-ink transition-all duration-300 [&.is-active]:scale-125 [&.is-active]:border-accent [&.is-active]:bg-accent" />
            <p className="flex items-center gap-3 text-sm text-mute">
              <span className="font-mono">Step {i + 1}</span>
              <span className="h-px w-6 bg-line" />
              {step.duration}
            </p>
            <div className="mt-3 flex items-start justify-between gap-6">
              <div>
                <h3 className="display text-3xl md:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-paper/70">{step.text}</p>
              </div>
              <span className="step-icon grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-mute transition-[color,border-color,box-shadow,background-color] duration-500">
                <StepIcon name={step.icon} />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
