"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Web fonts change text heights, so re-measure pinned sections once they load
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Lenis can only be created in the browser, so it is published to context after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    // Smooth-scroll same-page anchor links (#work, /#contact …)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
