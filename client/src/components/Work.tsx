"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";
import { SocialIcon } from "@/components/ui/SocialLink";

/**
 * Selected work. On desktop the cards ride a pinned horizontal track
 * driven by vertical scroll; on mobile they stack.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".work-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".work-pin", start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        // Each image counter-drifts inside its frame
        gsap.utils.toArray<HTMLElement>(".work-img").forEach((img) => {
          gsap.fromTo(img, { xPercent: -3 }, {
            xPercent: 3,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
          gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%", once: true } });
        });
      });
      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="relative">
      {/* pt clears the fixed navbar; cards are sized by height too so short laptop screens never clip the heading */}
      <div className="work-pin flex flex-col justify-center overflow-hidden py-28 lg:h-dvh lg:pt-20 lg:pb-6">
        <div className="container-x mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-14">
          <RevealText className="display text-[clamp(2.75rem,7vw,6.5rem)]">{site.sections.work.title}</RevealText>
          <p className="max-w-sm text-paper/70">{site.sections.work.intro}</p>
        </div>

        <div ref={track} className="flex flex-col gap-14 px-[clamp(1rem,4vw,3.5rem)] lg:w-max lg:flex-row lg:gap-8">
          {site.projects.map((p, i) => (
            <article key={p.slug} className="work-card lg:w-[min(46vw,720px,calc((100dvh-28rem)*1.6))]">
            <Link href={`/projects/${p.slug}`} data-cursor="View" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-raise">
                <Image
                  src={p.cover}
                  alt={`${p.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="work-img scale-[1.07] object-cover object-top transition-transform duration-1000 ease-out-expo group-hover:scale-[1.1]"
                  unoptimized={p.cover.endsWith(".svg")}
                />
                <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-xs backdrop-blur">
                  {String(i + 1).padStart(2, "0")} / {String(site.projects.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <h3 className="display text-3xl md:text-4xl">{p.title}</h3>
                  <p className="mt-2 text-mute">
                    {p.category}, {p.year}
                  </p>
                </div>
                <ul className="hidden flex-wrap justify-end gap-2 sm:flex">
                  {p.stack.slice(0, 3).map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-paper/70">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
            {/* Quick links: live site first (what recruiters click), code second */}
            <div className="mt-4 flex flex-wrap gap-2">
              {p.live && (
                <a
                  href={p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-accent-ink"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#3ccf7a] opacity-70" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-[#3ccf7a]" />
                  </span>
                  Live site
                </a>
              )}
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper/85 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  <SocialIcon icon="github" size={15} />
                  Code
                </a>
              )}
            </div>
            </article>
          ))}
          <div className="hidden w-[20vw] shrink-0 items-center lg:flex">
            <a
              href={site.sections.work.endCard.href}
              target="_blank"
              rel="noreferrer"
              className="display text-5xl leading-none text-paper/40 transition-colors hover:text-paper"
            >
              {site.sections.work.endCard.label} ↗
            </a>
          </div>
        </div>

        <div className="container-x mt-12 hidden lg:block">
          <div className="h-px w-full bg-line">
            <div className="work-progress h-full origin-left scale-x-0 bg-paper" />
          </div>
        </div>
      </div>
    </section>
  );
}
