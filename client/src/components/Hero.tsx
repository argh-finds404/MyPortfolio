"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import Button from "@/components/ui/Button";
import Year from "@/components/ui/Year";
import Terminal from "@/components/ui/Terminal";
import TechIcon from "@/components/ui/TechIcon";

import CircuitCore from "@/components/hero/CircuitCore";

const SCRAMBLE_CHARS = "01<>/{}[]#$%&*+=";

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time || "--:--"}</span>;
}

// Where the floating logos sit around the network (percent of the stage)
const CHIP_SPOTS = [
  { left: "8%", top: "16%", bob: "5s" },
  { left: "74%", top: "8%", bob: "6s" },
  { left: "84%", top: "46%", bob: "4.6s" },
  { left: "2%", top: "58%", bob: "5.4s" },
  { left: "14%", top: "84%", bob: "6.4s" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      if (prefersReducedMotion()) {
        gsap.set(".hero-line", { autoAlpha: 1 });
        return;
      }

      // Cursor spotlight + logo parallax (transform-only, so it stays cheap)
      let offMove = () => {};
      if (window.matchMedia("(pointer: fine)").matches) {
        const sx = gsap.quickTo(spot.current, "x", { duration: 0.8, ease: "power3" });
        const sy = gsap.quickTo(spot.current, "y", { duration: 0.8, ease: "power3" });
        const layers = gsap.utils.toArray<HTMLElement>(".hero-parallax").map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
          depth: Number(el.dataset.depth ?? 1),
        }));
        const onMove = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          sx(e.clientX - r.left);
          sy(e.clientY - r.top);
          const nx = e.clientX / innerWidth - 0.5;
          const ny = e.clientY / innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * 30 * l.depth);
            l.y(ny * 30 * l.depth);
          });
        };
        const el = root.current!;
        el.addEventListener("pointermove", onMove, { passive: true });
        offMove = () => el.removeEventListener("pointermove", onMove);
      }

      // Decode the role line through each role, forever
      const roles = site.hero.roles;
      const roleTl = gsap.timeline({ repeat: -1, paused: true });
      roles.forEach((_, i) => {
        roleTl.to(".hero-role", {
          duration: 1.1,
          delay: 2.2,
          scrambleText: { text: roles[(i + 1) % roles.length], chars: SCRAMBLE_CHARS, speed: 0.6 },
        });
      });

      gsap.set([".hero-fade", ".hero-scene", ".hero-chip"], { autoAlpha: 0 });
      const split = SplitText.create(".hero-line", { type: "chars", charsClass: "hero-char inline-block" });
      gsap.set(split.chars, { yPercent: 120, rotate: 8 });
      gsap.set(".hero-line", { autoAlpha: 1 });

      const play = contextSafe!(() => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(split.chars, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.028 })
          .fromTo(".hero-scene", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 2.2 }, 0)
          .fromTo(".hero-fade", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.45)
          .fromTo(".hero-chip", { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: "back.out(2)" }, 0.8)
          .from(".hero-role", { duration: 1, scrambleText: { text: " ", chars: SCRAMBLE_CHARS } }, 0.7)
          .add(() => {
            if (roles.length > 1) roleTl.play();
          });
      });
      const off = onIntroDone(play);

      // Hovering a headline line re-decodes it: a small "glitch" moment
      const hovers = gsap.utils.toArray<HTMLElement>(".hero-line").map((line) => {
        const chars = [...line.querySelectorAll<HTMLElement>(".hero-char")];
        const enter = contextSafe!(() => {
          if (chars.some((c) => gsap.isTweening(c))) return;
          chars.forEach((c, i) => {
            const original = c.dataset.ch ?? (c.dataset.ch = c.textContent ?? "");
            gsap.to(c, { duration: 0.45, delay: i * 0.03, scrambleText: { text: original, chars: SCRAMBLE_CHARS } });
          });
        });
        line.addEventListener("pointerenter", enter);
        return () => line.removeEventListener("pointerenter", enter);
      });

      // Copy drifts up and fades as you scroll away
      gsap.to(".hero-copy", {
        yPercent: -14,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        off();
        offMove();
        hovers.forEach((h) => h());
        roleTl.kill();
        split.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-dvh flex-col overflow-hidden pt-[72px]">
      {/* Background: grid, scan beam, cursor spotlight */}
      <div aria-hidden className="grid-lines absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="scan-beam h-28 w-full bg-gradient-to-b from-transparent via-accent/[0.08] to-transparent" />
      </div>
      <div
        ref={spot}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -mt-[300px] -ml-[300px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_65%)] opacity-[0.1]"
      />

      {/* Live circuit + floating logos */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[50%] opacity-50 md:inset-0 md:left-[40%] md:h-auto md:opacity-100">
        <div className="hero-parallax h-full w-full" data-depth="-0.4">
          <div className="hero-scene h-full w-full">
            <CircuitCore />
          </div>
        </div>
        <div className="hero-parallax absolute inset-0 hidden md:block" data-depth="1">
          {site.hero.floatingTech.map((t, i) => {
            const s = CHIP_SPOTS[i % CHIP_SPOTS.length];
            return (
              <div key={t} className="hero-chip absolute" style={{ left: s.left, top: s.top }}>
                <div
                  className="bob flex items-center gap-2 rounded-full border border-line bg-raise/80 px-3 py-1.5 text-xs text-paper/85 shadow-lg backdrop-blur"
                  style={{ ["--bob" as string]: s.bob }}
                >
                  <TechIcon name={t} size={14} />
                  {t}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hero-copy container-x relative flex flex-1 flex-col justify-center gap-7 py-8 md:gap-8">
        <div className="hero-fade flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-b border-line pb-4 font-mono text-xs text-mute">
          <span className="text-paper/80">{site.hero.meta.folio}</span>
          <span>{site.hero.meta.volume}</span>
          <span className="hidden sm:inline">
            {site.location} · <Year />
          </span>
          <span className="hidden sm:inline">{site.hero.meta.issue}</span>
        </div>

        <a
          href="#contact"
          aria-label={`${site.hero.booking.join(", ")}. Go to contact`}
          className="hero-fade neon-pill group inline-flex w-fit items-center gap-2 rounded-full bg-surface/80 py-1 pr-1 pl-3 font-mono text-[11px] tracking-wide transition-transform duration-300 hover:scale-[1.03]"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
          </span>
          <span aria-hidden className="relative w-52 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <span className="marquee-track neon-text flex w-max gap-5 whitespace-nowrap [--marquee-speed:14s]">
              {[...site.hero.booking, ...site.hero.booking].map((b, i) => (
                <span key={i}>{b} ·</span>
              ))}
            </span>
          </span>
          <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent transition-transform duration-300 group-hover:translate-x-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>

        <div>
          <h1 className="display text-[clamp(3.4rem,min(9vw,15vh),9.5rem)] leading-[0.88]">
            {site.hero.headline.map((line) => (
              <span key={line} className="split-line block">
                <span className="hero-line invisible inline-block cursor-default">{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-5 flex items-center gap-3 font-mono text-sm text-paper/80 md:text-base">
            <span className="text-accent">&gt;</span>
            <span className="text-mute">currently:</span>
            <span className="hero-role text-paper">{site.hero.roles[0]}</span>
            <span className="inline-block h-[1.1em] w-[0.5em] animate-[blink_1s_steps(1)_infinite] bg-accent" />
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-7">
            <p className="hero-fade text-lg leading-relaxed text-paper/70">{site.hero.intro}</p>
            <div className="hero-fade flex flex-wrap gap-3">
              <Button href={site.hero.primaryCta.href}>{site.hero.primaryCta.label}</Button>
              <Button href={site.hero.secondaryCta.href} variant="ghost">
                {site.hero.secondaryCta.label}
              </Button>
            </div>
          </div>
          <div className="hero-fade hidden w-[380px] translate-y-10 lg:block">
            <Terminal lines={site.hero.terminal} />
          </div>
        </div>
      </div>

      <div className="hero-fade container-x relative flex items-center justify-between border-t border-line py-5 text-sm text-mute">
        <span>{site.role}</span>
        <span className="hidden sm:inline">
          {site.location} · <LocalTime />
        </span>
        <span className="flex items-center gap-2">
          Scroll
          <span className="relative block h-6 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-paper" />
          </span>
        </span>
      </div>
    </section>
  );
}
