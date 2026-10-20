"use client";

import { useState } from "react";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";

/** Experience and education, switchable with tabs. */
export default function Journey() {
  const [tab, setTab] = useState<"experience" | "education">("education");

  const rows =
    tab === "experience"
      ? site.experience.map((e) => ({
          key: e.company + e.period,
          period: e.period,
          title: e.role,
          org: e.company,
          badge: e.type,
          minor: false,
          body: (
            <ul className="space-y-2">
              {e.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          ),
        }))
      : site.education.map((e) => ({
          key: e.school + e.period,
          period: e.period,
          title: e.degree,
          org: e.school,
          badge: null,
          minor: e.minor,
          body: <p>{e.note}</p>,
        }));

  return (
    <section id="journey" className="container-x py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
        <RevealText className="display text-[clamp(2.75rem,6vw,5.5rem)]">{site.sections.journey.title}</RevealText>
        <div role="tablist" className="flex rounded-full border border-line p-1">
          {(["education", "experience"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm capitalize transition-colors duration-300 ${tab === t ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ul key={tab} className="border-t border-line">
        {rows.map((r) =>
          r.minor ? (
            // Quieter row for school results
            <li key={r.key} className="grid gap-1 border-b border-line py-4 text-sm text-mute animate-[rise_.7s_cubic-bezier(.16,1,.3,1)_both] md:grid-cols-12 md:gap-8">
              <p className="font-mono md:col-span-3">{r.period}</p>
              <p className="md:col-span-4">
                <span className="text-paper/75">{r.title}</span> · {r.org}
              </p>
              <div className="md:col-span-5">{r.body}</div>
            </li>
          ) : (
          <li key={r.key} className="grid gap-4 border-b border-line py-9 animate-[rise_.7s_cubic-bezier(.16,1,.3,1)_both] md:grid-cols-12 md:gap-8">
            <p className="font-mono text-sm text-mute md:col-span-3">{r.period}</p>
            <div className="md:col-span-4">
              <h3 className="display text-2xl md:text-3xl">{r.title}</h3>
              <p className="mt-2 flex items-center gap-3 text-paper/70">
                {r.org}
                {r.badge && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-mute">{r.badge}</span>}
              </p>
            </div>
            <div className="leading-relaxed text-paper/70 md:col-span-5">{r.body}</div>
          </li>
          ),
        )}
      </ul>
    </section>
  );
}
