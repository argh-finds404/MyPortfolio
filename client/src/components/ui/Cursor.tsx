"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A soft follower dot. Grows over links/buttons and shows a label
 * over any element with data-cursor="View" (or any text).
 * Colours come from CSS state classes so they follow the theme.
 * Hidden on touch devices.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let state = "";

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      if (el.style.opacity !== "1") gsap.to(el, { opacity: 1, duration: 0.3 });
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, input, textarea, select, label");
      const next = labelled ? "label" : interactive ? "hover" : "";
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      label.current!.textContent = labelled?.dataset.cursor ?? "";
      const size = next === "label" ? 96 : next === "hover" ? 44 : 10;
      gsap.to(el, { width: size, height: size, duration: 0.35, ease: "power3.out" });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden h-2.5 w-2.5 items-center justify-center rounded-full bg-paper transition-colors duration-300 data-[state=hover]:bg-paper/15 data-[state=label]:bg-accent [@media(pointer:fine)]:flex"
    >
      <span ref={label} className="font-mono text-[11px] text-accent-ink opacity-0 transition-opacity duration-200 [[data-state=label]>&]:opacity-100" />
    </div>
  );
}
