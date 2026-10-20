"use client";

import { toggleTheme, useTheme } from "@/lib/theme";

/** Sun/moon switch. The icon morphs; the page change is a circular reveal from the button. */
export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-paper transition-colors hover:border-paper/40 ${className ?? ""}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
        <mask id="moon-cut">
          <rect width="24" height="24" fill="#fff" />
          <circle
            cx={dark ? 17 : 30}
            cy={dark ? 7 : -6}
            r="6"
            fill="#000"
            className="transition-all duration-500 ease-out-expo"
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r={dark ? 8 : 5}
          fill="currentColor"
          stroke="none"
          mask="url(#moon-cut)"
          className="transition-all duration-500 ease-out-expo"
        />
        <g className={`origin-center transition-all duration-500 ease-out-expo ${dark ? "scale-50 rotate-45 opacity-0" : "scale-100 rotate-0 opacity-100"}`}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2" x2="12" y2="4" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
