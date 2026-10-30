"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { finishIntro, isIntroDone } from "@/lib/intro";
import { useLenis } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";

/**
 * Idea 2 — Hybrid: Upward-Sliding 16:10 Project Screenshots + Live Terminal Status Bar.
 * Combines the classic upward clip-path shutter slide with a widescreen terminal frame
 * that updates the active project route, title, and stack in sync with each slide.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const lenis = useLenis();
  const projects = site.projects;

  // Keep the page locked while the intro plays
  useEffect(() => {
    if (gone) lenis?.start();
    else lenis?.stop();
  }, [gone, lenis]);

  useGSAP(
    () => {
      if (isIntroDone() || prefersReducedMotion()) {
        setGone(true);
        finishIntro();
        return;
      }
      window.scrollTo(0, 0);

      const count = { v: 0 };
      const frames = gsap.utils.toArray<HTMLElement>(".pre-frame");
      const countEl = root.current?.querySelector(".pre-count");
      const statusTextEl = root.current?.querySelector(".pre-status-text");

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: () => {
          setGone(true);
        },
      });

      tl.from(".pre-name span", { yPercent: 110, duration: 0.85, stagger: 0.035, ease: "expo.out" }, 0)
        .fromTo(
          ".pre-card-shell",
          { y: 28, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" },
          0.05,
        )
        .to(
          count,
          {
            v: 100,
            duration: 2.35,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countEl) countEl.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0,
        )
        .to(".pre-bar", { scaleX: 1, duration: 2.35, ease: "power2.inOut" }, 0);

      // Upward shutter slide for each 16:10 project screenshot, synced with terminal metadata
      frames.forEach((f, i) => {
        const startAt = 0.18 + i * (1.95 / frames.length);
        tl.call(() => setActiveIdx(i), [], startAt);
        tl.fromTo(
          f,
          { clipPath: "inset(100% 0 0 0)", scale: 1.18 },
          { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.55, ease: "expo.out" },
          startAt,
        );
      });

      // Lock onto READY state briefly, then lift the curtain cleanly
      tl.add(() => {
        if (statusTextEl) statusTextEl.textContent = "READY";
      }, 2.28)
        .to(
          ".pre-status-dot",
          { backgroundColor: "#3ccf7a", boxShadow: "0 0 10px #3ccf7a", duration: 0.2 },
          2.28,
        )
        .to(
          ".pre-card-shell",
          { y: -24, opacity: 0, scale: 0.96, duration: 0.5, ease: "power3.in" },
          "+=0.15",
        )
        .to([".pre-name", ".pre-meta"], { opacity: 0, duration: 0.38, ease: "power2.out" }, "<")
        .add(finishIntro, "-=0.25")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.28");
    },
    { scope: root },
  );

  if (gone) return null;

  const active = projects[activeIdx] ?? projects[0];

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-ink" aria-hidden>
      {/* Subtle background grid + radial accent glow matching Hero */}
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-65" />
      <div className="pointer-events-none absolute h-[460px] w-[560px] rounded-full bg-[radial-gradient(ellipse,var(--accent)_0%,transparent_68%)] opacity-[0.12]" />

      {/* Top wordmark */}
      <div className="pre-name absolute top-8 left-1/2 flex -translate-x-1/2 overflow-hidden font-display text-xl font-semibold tracking-tight">
        {site.shortName.split("").map((c, i) => (
          <span key={i} className="inline-block">
            {c}
          </span>
        ))}
        <span className="inline-block text-accent">.</span>
      </div>

      {/* Hybrid Center Card: Terminal Header + 16:10 Upward Sliding Image Stack + Live Telemetry Bar */}
      <div className="pre-card-shell relative w-[min(88vw,500px)] overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-2xl backdrop-blur-md">
        {/* Top Terminal Chrome */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-2 truncate text-mute">
              ~/projects/<span className="text-paper/90">{active.slug}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] tracking-wider text-paper/75 uppercase">
            <span className="pre-status-dot h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
            <span className="pre-status-text">INDEXING</span>
          </div>
        </div>

        {/* 16:10 Widescreen Sliding Screenshot Stack */}
        <div className="pre-stack relative aspect-[16/10] w-full overflow-hidden bg-raise">
          {projects.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.slug}
              src={p.cover}
              alt=""
              className="pre-frame absolute inset-0 h-full w-full object-cover object-top will-change-transform"
              style={{ zIndex: i }}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
          <span className="pointer-events-none absolute top-3 left-3 z-20 rounded-full border border-white/10 bg-ink/75 px-2.5 py-0.5 font-mono text-[10px] text-accent backdrop-blur-md">
            {String(activeIdx + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom Live Project Telemetry Strip */}
        <div className="space-y-2.5 border-t border-line bg-surface/95 px-4 py-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 truncate">
              <span className="text-accent">&gt;</span>
              <span className="font-sans text-sm font-medium text-paper">{active.title}</span>
              <span className="truncate text-[11px] text-mute">· {active.category}</span>
            </div>
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
              {active.stack.slice(0, 2).map((t) => (
                <span key={t} className="rounded border border-line bg-raise px-1.5 py-0.5 text-[10px] text-paper/80">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="h-1 w-full overflow-hidden rounded-full bg-raise">
            <div className="pre-bar h-full origin-left scale-x-0 bg-accent shadow-[0_0_10px_var(--accent)]" />
          </div>
        </div>
      </div>

      {/* Bottom counter + role */}
      <div className="pre-meta container-x absolute inset-x-0 bottom-8 flex items-end justify-between">
        <p className="max-w-48 text-sm text-mute">
          {site.role}, {site.location}
        </p>
        <p className="pre-count display text-7xl tabular-nums sm:text-9xl">000</p>
      </div>
      <div className="pre-meta absolute inset-x-0 bottom-0 h-px bg-line">
        <div className="pre-bar h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
