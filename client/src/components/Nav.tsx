"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import { useLenis } from "@/components/providers/SmoothScroll";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);
  const lenis = useLenis();

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 200 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
        .from(".menu-link", { yPercent: 120, duration: 0.9, stagger: 0.06, ease: "expo.out" }, "-=0.35")
        .from(".menu-meta", { opacity: 0, y: 12, duration: 0.5, stagger: 0.05 }, "-=0.6");
    },
    { scope: menu },
  );

  useEffect(() => {
    if (open) {
      tl.current?.timeScale(1).play();
      lenis?.stop();
    } else {
      tl.current?.timeScale(1.6).reverse();
      lenis?.start();
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ease-out-expo ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "bg-ink/70 backdrop-blur-xl" : ""}`}
      >
        <nav className="container-x flex h-[72px] items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
            {site.shortName}
            <span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex md:translate-x-14">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group relative text-[15px] text-paper/75 transition-colors hover:text-paper">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              {site.resume ? (
                <Button href={site.resume} download className="h-10 px-5 text-sm">
                  Download resume
                </Button>
              ) : (
                <Button href="/#contact" className="h-10 px-5 text-sm">
                  Hire me
                </Button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-10 items-center gap-3 rounded-full border border-line px-4 text-sm md:hidden"
            >
              {open ? "Close" : "Menu"}
              <span className="relative block h-2.5 w-4">
                <span className={`absolute left-0 h-px w-full bg-paper transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-paper transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "top-full"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="site-menu"
        ref={menu}
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-surface pt-28 pb-10"
        aria-hidden={!open}
      >
        <ul className="container-x">
          {site.nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="menu-link flex items-baseline gap-4 py-4"
              >
                <span className="font-mono text-xs text-mute">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[13vw] sm:text-7xl">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div className="menu-meta space-y-1">
            <p className="text-sm text-mute">Say hello</p>
            <a href={`mailto:${site.contact.email}`} className="text-lg" tabIndex={open ? 0 : -1}>
              {site.contact.email}
            </a>
          </div>
          {site.resume ? (
            <Button href={site.resume} download className="menu-meta">
              Download resume
            </Button>
          ) : (
            <Button href={site.contact.whatsapp} className="menu-meta">
              Message on WhatsApp
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
