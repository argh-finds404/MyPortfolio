"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { techIcons } from "@/content/icons";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import RevealText from "@/components/ui/RevealText";
import TechIcon from "@/components/ui/TechIcon";

const all = site.stack.flatMap((g) => g.items);
const half = Math.ceil(all.length / 2);
const rows = [all.slice(0, half), all.slice(half)];

/** Brand colour for hover, or the text colour when the brand is too dark to see on dark mode. */
function brandColor(name: string) {
  const hex = techIcons[name.toLowerCase()]?.hex;
  if (!hex) return "var(--accent)";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.18 ? "var(--paper)" : `#${hex}`;
}

/** Two rows of logos drifting in opposite directions. */
function LogoRail({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className={`marquee-track flex w-max gap-3 py-1.5 ${reverse ? "[animation-direction:reverse]" : ""}`}
        style={{ ["--marquee-speed" as string]: `${items.length * 3.2}s` }}
      >
        {loop.map((name, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex items-center gap-2.5 rounded-2xl border border-line bg-raise px-4 py-3 text-paper/80">
            <TechIcon name={name} size={22} />
            <span className="text-sm whitespace-nowrap">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One skill: monochrome logo that lights up in its brand colour on hover. */
function Tile({ name }: { name: string }) {
  return (
    <li
      className="skill-tile group/tile relative flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl border border-line bg-ink/40 p-2 text-center transition-[transform,border-color,box-shadow] duration-300 ease-out-expo hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[0_10px_30px_-10px_var(--brand)]"
      style={{ ["--brand" as string]: brandColor(name) }}
    >
      <TechIcon name={name} size={30} className="text-paper/70 transition-[color,transform] duration-300 group-hover/tile:scale-110 group-hover/tile:text-[var(--brand)]" />
      <span className="text-[12px] leading-tight text-paper/70 transition-colors group-hover/tile:text-paper">{name}</span>
    </li>
  );
}

/** Card with a soft glow that follows the cursor. */
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      onPointerMove={onMove}
      className={`skill-card group relative overflow-hidden rounded-3xl border border-line bg-raise/60 p-6 md:p-7 ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--glow-soft), transparent 65%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

function CardHead({ index, title, blurb, count }: { index: number; title: string; blurb?: string; count?: number }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-xs text-mute">{String(index).padStart(2, "0")}</p>
        <h3 className="mt-2 font-display text-2xl font-medium md:text-3xl">{title}</h3>
        {blurb && <p className="mt-1.5 text-sm text-paper/60">{blurb}</p>}
      </div>
      {count !== undefined && (
        <span className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-mute">{count} skills</span>
      )}
    </div>
  );
}

// Bento placement: Frontend runs full width, the rest pair up (the learning card pairs with the last group)
const SPANS = ["md:col-span-2"];

export default function Stack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".skill-tile", { autoAlpha: 0, y: 24, scale: 0.85 });
      ScrollTrigger.batch(".skill-tile", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.035, ease: "back.out(1.6)" }),
      });
      gsap.utils.toArray<HTMLElement>(".learn-bar").forEach((bar) => {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: Number(bar.dataset.progress) / 100, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: bar, start: "top 92%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section id="stack" ref={root} className="border-y border-line bg-surface">
      <div className="container-x pt-28 md:pt-36">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <RevealText className="display text-[clamp(2.75rem,6vw,5.5rem)]">{site.sections.stack.title}</RevealText>
          <p className="max-w-sm text-paper/70">{site.sections.stack.intro}</p>
        </div>
      </div>

      <div className="space-y-3">
        <LogoRail items={rows[0]} />
        <LogoRail items={rows[1]} reverse />
      </div>

      <div className="container-x pt-16 pb-28 md:pb-36">
        <div className="grid gap-4 md:grid-cols-2">
          {site.stack.map((group, gi) => (
            <Card key={group.group} className={SPANS[gi] ?? ""}>
              <CardHead index={gi + 1} title={group.group} blurb={group.blurb} count={group.items.length} />
              <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))]">
                {group.items.map((item) => (
                  <Tile key={item} name={item} />
                ))}
              </ul>
            </Card>
          ))}

          <Card className={site.stack.length % 2 === 0 ? "" : "md:col-span-2"}>
            <CardHead index={site.stack.length + 1} title="Currently learning" blurb="What I'm practising right now" />
            <ul className="grid gap-x-10 gap-y-5">
              {site.learning.map((l) => (
                <li key={l.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2.5">
                      <TechIcon name={l.name} size={18} className="text-paper/75" />
                      {l.name}
                    </span>
                    <span className="font-mono text-xs text-mute">{l.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="learn-bar h-full origin-left rounded-full bg-gradient-to-r from-accent/60 to-accent"
                      data-progress={l.progress}
                      style={{ transform: `scaleX(${l.progress / 100})` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
