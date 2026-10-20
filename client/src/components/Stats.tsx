"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

export default function Stats() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value);
        const decimals = Number(el.dataset.decimals ?? 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = fmt(obj.v, decimals)),
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="container-x grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {site.stats.map((s, i) => (
        <div key={s.label} className={`py-10 pr-4 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "border-l pl-5 lg:pl-8" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} border-line`}>
          <p className="display text-[clamp(2.5rem,4.8vw,4.75rem)]">
            <span className="stat-value tabular-nums" data-value={s.value} data-decimals={s.decimals}>
              {fmt(s.value, s.decimals)}
            </span>
            <span className="text-accent">{s.suffix}</span>
          </p>
          <p className="mt-3 text-mute">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
