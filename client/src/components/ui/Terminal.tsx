"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Line = { cmd: string; out: string };

/**
 * A small terminal that types commands and prints their output on a loop.
 * Pauses itself when scrolled out of view.
 */
export default function Terminal({ lines, className }: { lines: Line[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<{ cmd: string; out?: string }[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = window.setTimeout(() => setShown(lines), 0);
      return () => clearTimeout(t);
    }
    let visible = true;
    let timer = 0;
    let step = 0; // which line
    let char = 0; // typed characters of that line's command
    let phase: "type" | "out" | "hold" | "clear" = "type";
    let history: { cmd: string; out?: string }[] = [];

    const tick = () => {
      if (!visible) return (timer = window.setTimeout(tick, 400));
      const line = lines[step];
      let delay = 45 + Math.random() * 55;

      if (phase === "type") {
        char++;
        setShown([...history, { cmd: line.cmd.slice(0, char) }]);
        if (char >= line.cmd.length) {
          phase = "out";
          delay = 380;
        }
      } else if (phase === "out") {
        history = [...history, { cmd: line.cmd, out: line.out }];
        setShown(history);
        step++;
        char = 0;
        phase = step >= lines.length ? "hold" : "type";
        delay = phase === "hold" ? 2600 : 520;
      } else if (phase === "hold") {
        phase = "clear";
        delay = 10;
      } else {
        history = [];
        step = 0;
        setShown([]);
        phase = "type";
        delay = 500;
      }
      timer = window.setTimeout(tick, delay);
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(ref.current!);
    timer = window.setTimeout(tick, 1200);
    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, [lines]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-xl border border-line bg-[#0b0b0e]/90 font-mono text-[12.5px] text-[#d9d9e0] shadow-2xl backdrop-blur-md ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-white/45">~/shoumik — zsh</span>
      </div>
      <div className="h-[184px] space-y-1.5 p-4 leading-relaxed">
        {shown.map((l, i) => (
          <div key={i}>
            <p>
              <span className="text-[#7fe0a0]">➜</span> <span className="text-[#8fb8ff]">~</span> {l.cmd}
              {l.out === undefined && <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-[#d9d9e0]" />}
            </p>
            {l.out !== undefined && <p className="text-white/55">{l.out}</p>}
          </div>
        ))}
        {shown.length === 0 || shown[shown.length - 1].out !== undefined ? (
          <p>
            <span className="text-[#7fe0a0]">➜</span> <span className="text-[#8fb8ff]">~</span>{" "}
            <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-[blink_1s_steps(1)_infinite] bg-[#d9d9e0]" />
          </p>
        ) : null}
      </div>
    </div>
  );
}
