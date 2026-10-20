"use client";

import { useState } from "react";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";

/** "What I do" — an index list; each row opens to show details. */
export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section id="services" className="container-x py-28 md:py-40">
      <div className="mb-16 grid gap-6 md:grid-cols-12">
        <RevealText className="display text-[clamp(2.75rem,7vw,6.5rem)] md:col-span-7">{site.sections.services.title}</RevealText>
        <p className="self-end text-lg leading-relaxed text-paper/70 md:col-span-4 md:col-start-9">
          {site.sections.services.intro}
        </p>
      </div>

      <ul className="border-t border-line">
        {site.services.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.title} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setOpen(i)}
                aria-expanded={isOpen}
                className="group flex w-full items-center gap-6 py-7 text-left md:py-9"
              >
                <span className={`display flex-1 text-[clamp(1.75rem,4vw,3.5rem)] transition-[color,transform] duration-500 ease-out-expo ${isOpen ? "translate-x-3 text-paper" : "text-paper/45 group-hover:text-paper/80"}`}>
                  {s.title}
                </span>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo ${isOpen ? "rotate-45 border-accent bg-accent text-accent-ink" : "border-line"}`} aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 0v14M0 7h14" />
                  </svg>
                </span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-700 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-5 pb-9 md:flex-row md:items-end md:justify-between md:pl-3">
                    <p className="max-w-xl text-lg leading-relaxed text-paper/70">{s.text}</p>
                    <ul className="flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-paper/70">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
