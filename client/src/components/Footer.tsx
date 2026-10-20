"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";
import Year from "@/components/ui/Year";
import SocialLink, { SocialIcon } from "@/components/ui/SocialLink";

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: site.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time || "--:--:--"}</span>;
}

/** Social icons circling a round "Say hello" button. Pauses on hover. */
function SocialOrbit() {
  const n = site.socials.length;
  return (
    <div className="orbit relative mx-auto aspect-square w-[300px] sm:w-[340px]">
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-[16%] rounded-full border border-dashed border-line" />
      <a
        href={`mailto:${site.contact.email}`}
        className="group absolute inset-[27%] grid place-items-center rounded-full bg-paper text-ink transition-transform duration-500 ease-out-expo hover:scale-105"
      >
        <span className="text-center">
          <span className="block font-display text-xl font-semibold">{site.sections.footer.ctaButton}</span>
          <svg className="mx-auto mt-1 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </a>
      <div className="orbit-ring absolute inset-0 [--orbit-speed:30s]">
        {site.socials.map((s, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <div
              key={s.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
            >
              <SocialLink
                social={s}
                className="relative grid h-14 w-14 place-items-center rounded-full border border-line bg-raise text-paper/85 shadow-lg transition-[color,border-color,transform] duration-300 hover:scale-110 hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {({ copied }) => (
                  <>
                    <SocialIcon icon={s.icon} size={22} />
                    {copied && (
                      <span className="absolute -top-8 rounded-full bg-paper px-2 py-0.5 text-[11px] whitespace-nowrap text-ink">Copied</span>
                    )}
                  </>
                )}
              </SocialLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".ft-cta-line > span", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ft-cta", start: "top 80%", once: true },
      });
      // The wordmark sits at the very bottom of the page, where scroll-position
      // triggers can fall past the max scroll; an IntersectionObserver is reliable here.
      const letters = gsap.utils.toArray<HTMLElement>(".ft-letter");
      gsap.set(letters, { yPercent: 100 });
      const word = root.current!.querySelector(".ft-word")!;
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          gsap.to(letters, { yPercent: 0, duration: 1.3, stagger: 0.06, ease: "expo.out" });
          io.disconnect();
        },
        { threshold: 0.25 },
      );
      io.observe(word);
      return () => io.disconnect();
    },
    { scope: root },
  );

  // Feed the cursor position to the glowing grid (one style write per frame at most)
  const frame = useRef(0);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    });
  };

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.8 }) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer ref={root} onPointerMove={onMove} className="group/ft relative overflow-hidden border-t border-line bg-surface">
      <div aria-hidden className="footer-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="footer-grid-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/ft:opacity-100" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />

      {/* CTA */}
      <div className="ft-cta container-x relative grid items-center gap-14 py-24 md:py-32 lg:grid-cols-[1.3fr_1fr]">
        <h2 className="display text-[clamp(3.25rem,9vw,8.5rem)]">
          {site.sections.footer.cta.map((line, i) => (
            <span key={line} className="ft-cta-line split-line block">
              <span className={`block ${i === 1 ? "text-accent" : ""}`}>{line}</span>
            </span>
          ))}
        </h2>
        <SocialOrbit />
      </div>

      {/* Columns */}
      <div className="container-x relative grid gap-12 border-t border-line py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-display text-2xl font-semibold">
            {site.shortName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-paper/65">{site.role}</p>
          <div className="mt-6 max-w-sm rounded-2xl border border-line bg-raise p-4">
            <p className="flex items-center gap-2.5 text-sm font-medium">
              <span className={`pulse-dot h-2 w-2 rounded-full ${site.availability.open ? "bg-[#3ccf7a]" : "bg-mute"}`} />
              {site.availability.label}
            </p>
            <p className="mt-2 text-sm text-paper/65">{site.availability.note}</p>
            <p className="mt-3 border-t border-line pt-3 font-mono text-xs text-mute">
              Local time · <LocalTime />
            </p>
          </div>
        </div>

        <nav className="lg:col-span-2 lg:col-start-6" aria-label="Footer">
          <p className="mb-4 font-mono text-xs text-mute">Navigate</p>
          <ul className="space-y-2.5">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="group inline-flex items-center gap-2 hover:text-accent">
                  <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="mb-4 font-mono text-xs text-mute">{site.sections.footer.servicesTitle}</p>
          <ul className="space-y-2.5 text-paper/80">
            {site.services.slice(0, 4).map((s) => (
              <li key={s.title}>{s.title}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="mb-4 font-mono text-xs text-mute">Contact</p>
          <ul className="space-y-3">
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 break-all hover:text-accent">
                <SocialIcon icon="email" size={16} /> {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-[#25D366]">
                <SocialIcon icon="whatsapp" size={16} /> {site.contact.phone}
              </a>
            </li>
            <li className="flex flex-wrap gap-2 pt-1">
              {site.socials
                .filter((s) => s.icon !== "email" && s.icon !== "whatsapp")
                .map((s) => (
                  <SocialLink
                    key={s.label}
                    social={s}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-paper/75 transition-colors duration-300 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                  >
                    {() => <SocialIcon icon={s.icon} size={17} />}
                  </SocialLink>
                ))}
            </li>
          </ul>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="ft-word container-x relative select-none" aria-hidden>
        <p className="display flex justify-center overflow-hidden pb-[2vw] text-[19.5vw] leading-[0.82]">
          {site.shortName.split("").map((c, i) => (
            <span
              key={i}
              className="ft-letter inline-block bg-gradient-to-b from-paper via-paper/60 to-paper/0 bg-clip-text text-transparent"
            >
              {c}
            </span>
          ))}
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-line">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-mute">
          <p>
            © <Year /> {site.name}. Built with Next.js, GSAP & a lot of coffee.
          </p>
          <p className="hidden md:block">{site.sections.footer.note}</p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
          >
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
