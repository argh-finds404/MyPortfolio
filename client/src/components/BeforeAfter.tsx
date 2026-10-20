"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

const ba = site.beforeAfter;

function Tags({ items, tone }: { items: string[]; tone: "bad" | "good" }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className={`rounded-full border px-3.5 py-1.5 text-sm ${
            tone === "bad" ? "border-bad/30 text-bad" : "border-good/30 text-good"
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ── "Before" props: deliberately messy little artefacts ── */
function ErrorTerminal() {
  const t = ba.before.terminal;
  return (
    <div className="ba-before w-full max-w-[360px] overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e] font-mono text-[12px] text-[#d9d9e0] shadow-2xl lg:absolute lg:top-[4%] lg:left-[2%] lg:-rotate-3">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-white/45">{t.title}</span>
      </div>
      <div className="space-y-2 p-3.5 leading-relaxed">
        {t.lines.map((l, i) => (
          <p key={l} className={i === t.lines.length - 1 ? "text-[#febc2e]" : "text-[#ff7b72]"}>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}

function Tabs() {
  const t = ba.before.tabs;
  return (
    <div className="ba-before w-full max-w-[310px] rounded-xl border border-line bg-raise p-4 shadow-2xl lg:absolute lg:top-[8%] lg:right-[4%] lg:rotate-2">
      <div className="mb-3 flex items-center justify-between text-xs text-mute">
        <span>{t.title}</span>
        <span className="rounded-full bg-bad/15 px-2 py-0.5 text-bad">
          {t.count} {t.countLabel}
        </span>
      </div>
      {t.items.map((s, i) => (
        <div key={s} className="flex items-center gap-3 border-t border-line py-2.5 text-sm">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper/10 text-[10px] text-mute">You</span>
          <span className={i === 0 ? "font-medium" : "text-paper/60"}>{s}</span>
        </div>
      ))}
    </div>
  );
}

function Checklist() {
  const c = ba.before.checklist;
  return (
    <div className="ba-before w-full max-w-[250px] bg-[#f5e47a] p-4 text-[#3a3410] shadow-2xl lg:absolute lg:bottom-[6%] lg:left-[10%] lg:rotate-2">
      <p className="mb-2 font-mono text-xs font-semibold">{c.title}</p>
      <ul className="space-y-1.5 text-sm">
        {c.items.map((item, i) => (
          <li key={item} className="flex items-center gap-2">
            <span className={`grid h-3.5 w-3.5 place-items-center border border-[#3a3410]/60 text-[10px] ${i === 0 ? "bg-[#3a3410]/80 text-[#f5e47a]" : ""}`}>{i === 0 ? "✓" : ""}</span>
            <span className={i === 0 ? "line-through opacity-60" : ""}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Files() {
  const f = ba.before.files;
  return (
    <div className="ba-before w-full max-w-[280px] rounded-xl border border-line bg-surface p-4 font-mono shadow-2xl lg:absolute lg:right-[10%] lg:bottom-[8%] lg:-rotate-2">
      <p className="mb-3 text-xs text-mute">{f.title}</p>
      <ul className="space-y-2 text-[13px]">
        {f.items.map((name) => (
          <li key={name} className="flex items-center gap-2.5 text-paper/75">
            <svg width="14" height="12" viewBox="0 0 14 12" className="text-mute" fill="currentColor" aria-hidden>
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h3.4l1.4 1.6h6.2A1.5 1.5 0 0 1 14 3.1v7.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 0 10.5Z" />
            </svg>
            {name}/
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── "After": a clean live dashboard ── */
function Dashboard() {
  return (
    <div className="ba-after mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_120px_-20px_var(--glow-soft)] lg:absolute lg:inset-x-0 lg:inset-y-0 lg:my-auto lg:h-fit">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/15" />
        <span className="ml-3 text-sm text-paper/70">{ba.after.appName}</span>
        <span className="ml-auto flex items-center gap-2 text-xs text-good">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#3ccf7a]" /> Live
        </span>
      </div>
      <div className="grid md:grid-cols-[170px_1fr]">
        <ul className="hidden space-y-1 border-r border-line p-3 text-sm md:block">
          {ba.after.nav.map((n, i) => (
            <li key={n} className={`rounded-lg px-3 py-2 ${i === 0 ? "bg-raise text-paper" : "text-paper/50"}`}>
              {n}
            </li>
          ))}
        </ul>
        <div className="space-y-4 p-4 md:p-5">
          <div className="grid grid-cols-3 gap-3">
            {ba.after.kpis.map((k) => (
              <div key={k.label} className="ba-kpi rounded-xl border border-line bg-raise p-3 md:p-4">
                <p className="text-xs text-mute">{k.label}</p>
                <p className="mt-1 font-display text-xl font-medium md:text-3xl">{k.value}</p>
                <p className="mt-1 text-xs text-good">{k.delta}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-line bg-raise p-4">
              <p className="mb-3 text-xs text-mute">{ba.after.chartLabel}</p>
              <svg viewBox="0 0 300 90" className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="ba-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 70 L40 62 L80 66 L120 44 L160 50 L200 30 L240 34 L300 12 L300 90 L0 90 Z" fill="url(#ba-fill)" className="ba-area" />
                <path
                  d="M0 70 L40 62 L80 66 L120 44 L160 50 L200 30 L240 34 L300 12"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  pathLength={1}
                  className="ba-line"
                  style={{ strokeDasharray: 1 }}
                />
              </svg>
            </div>
            <ul className="space-y-2 rounded-xl border border-line bg-raise p-4 text-sm">
              <li className="mb-1 text-xs text-mute">Activity</li>
              {ba.after.feed.map((f) => (
                <li key={f} className="ba-feed flex items-center gap-2 text-paper/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3ccf7a]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const scatter = [
          { x: -260, y: -160, rotation: -14 },
          { x: 260, y: -140, rotation: 12 },
          { x: -220, y: 180, rotation: 10 },
          { x: 260, y: 170, rotation: -12 },
          { x: 0, y: 40, rotation: 0 },
        ];
        gsap.set(".ba-after", { autoAlpha: 0, yPercent: 14, scale: 0.92 });
        gsap.set(".ba-kpi, .ba-feed", { autoAlpha: 0, y: 16 });
        gsap.set(".ba-line", { strokeDashoffset: 1 });
        gsap.set(".ba-area", { opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: { trigger: ".ba-pin", start: "top top", end: "+=170%", pin: true, scrub: 0.8 },
          })
          .to(".ba-before", { x: (i) => scatter[i].x, y: (i) => scatter[i].y, rotation: (i) => scatter[i].rotation, autoAlpha: 0, scale: 0.85, stagger: 0.04, duration: 1 })
          .to(".ba-labels", { yPercent: -50, duration: 0.5 }, 0.3)
          .to(".ba-tags-before", { autoAlpha: 0, y: -10, duration: 0.3 }, 0.3)
          .from(".ba-tags-after", { autoAlpha: 0, y: 10, duration: 0.3 }, 0.55)
          .to(".ba-after", { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1, ease: "expo.out" }, 0.55)
          .to(".ba-kpi", { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.9)
          .to(".ba-line", { strokeDashoffset: 0, duration: 0.8 }, 0.95)
          .to(".ba-area", { opacity: 1, duration: 0.5 }, 1.2)
          .to(".ba-feed", { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.4 }, 1.1)
          .to({}, { duration: 0.3 });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.from(".ba-before", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ".ba-stage", start: "top 80%", once: true } });
        gsap.from(".ba-after", { y: 50, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".ba-after", start: "top 85%", once: true } });
        gsap.fromTo(".ba-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: ".ba-after", start: "top 70%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative border-t border-line">
      <div className="ba-pin flex flex-col overflow-hidden py-24 lg:h-dvh lg:py-0 lg:pt-[88px] lg:pb-10">
        {/* Swapping heading (desktop) */}
        <div className="container-x hidden items-end justify-between gap-6 lg:flex">
          <div className="display h-[1.1em] overflow-hidden text-[clamp(3rem,6vw,5.5rem)]">
            <div className="ba-labels">
              <p className="h-[1.1em] leading-[1.1em]">
                <span className="mr-4 align-top font-mono text-sm text-mute">01</span>
                {ba.before.title}
              </p>
              <p className="h-[1.1em] leading-[1.1em]">
                <span className="mr-4 align-top font-mono text-sm text-mute">02</span>
                {ba.after.title}
              </p>
            </div>
          </div>
          <div className="relative min-h-10 min-w-80">
            <div className="ba-tags-before absolute right-0 bottom-0 text-right">
              <p className="mb-2 text-sm text-mute">{ba.before.caption}</p>
              <Tags items={ba.before.tags} tone="bad" />
            </div>
            <div className="ba-tags-after absolute right-0 bottom-0 text-right">
              <p className="mb-2 text-sm text-mute">{ba.after.caption}</p>
              <Tags items={ba.after.tags} tone="good" />
            </div>
          </div>
        </div>

        <div className="ba-stage container-x relative mt-6 flex-1 space-y-16 lg:space-y-0">
          {/* Before */}
          <div className="space-y-6 lg:contents">
            <div className="lg:hidden">
              <h2 className="display text-5xl">
                <span className="mr-3 align-top font-mono text-sm text-mute">01</span>
                {ba.before.title}
              </h2>
              <p className="mt-3 mb-4 text-mute">{ba.before.caption}</p>
              <Tags items={ba.before.tags} tone="bad" />
            </div>
            <div className="grid justify-items-center gap-5 sm:grid-cols-2 lg:contents">
              <ErrorTerminal />
              <Tabs />
              <Checklist />
              <Files />
              <p className="ba-before order-first max-w-[16ch] text-center font-display text-3xl font-medium text-paper/35 sm:col-span-2 lg:absolute lg:inset-x-0 lg:top-1/2 lg:mx-auto lg:max-w-[14ch] lg:-translate-y-1/2 lg:text-5xl">
                {ba.before.cost}
              </p>
            </div>
          </div>

          {/* After */}
          <div className="space-y-6 lg:contents">
            <div className="lg:hidden">
              <h2 className="display text-5xl">
                <span className="mr-3 align-top font-mono text-sm text-mute">02</span>
                {ba.after.title}
              </h2>
              <p className="mt-3 mb-4 text-mute">{ba.after.caption}</p>
              <Tags items={ba.after.tags} tone="good" />
            </div>
            <Dashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
