/**
 * Small animated icons for the "How I build" steps. Strokes draw in when the
 * step becomes active (.is-active on an ancestor), then a gentle loop plays.
 * All motion lives in globals.css under "Process step icons".
 */
export default function StepIcon({ name }: { name: string }) {
  const common = { pathLength: 1, className: "pi-draw" };
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {name === "search" && (
        <g className="pi-scan">
          <circle cx="10" cy="10" r="6" {...common} />
          <path d="M14.5 14.5 20 20" {...common} />
          <path d="M7.5 8.5a3 3 0 0 1 2.5-1.5" {...common} />
        </g>
      )}
      {name === "plan" && (
        <>
          <rect x="5" y="3" width="14" height="18" rx="2" {...common} />
          <path className="pi-draw pi-write" pathLength={1} d="M8.5 8h7" style={{ animationDelay: "0s" }} />
          <path className="pi-draw pi-write" pathLength={1} d="M8.5 12h7" style={{ animationDelay: "0.35s" }} />
          <path className="pi-draw pi-write" pathLength={1} d="M8.5 16h4" style={{ animationDelay: "0.7s" }} />
        </>
      )}
      {name === "code" && (
        <>
          <path className="pi-draw pi-left" pathLength={1} d="M8.5 7 3.5 12l5 5" />
          <path className="pi-draw pi-right" pathLength={1} d="m15.5 7 5 5-5 5" />
          <path className="pi-draw pi-blink" pathLength={1} d="M13.5 5.5 10.5 18.5" />
        </>
      )}
      {name === "check" && (
        <>
          <circle cx="12" cy="12" r="8.5" {...common} />
          <path className="pi-draw pi-recheck" pathLength={1} d="m8 12.5 3 3 5.5-6" />
        </>
      )}
      {name === "deploy" && (
        <>
          <g className="pi-launch">
            <path d="M12 16V5" {...common} />
            <path d="M7.5 9.5 12 5l4.5 4.5" {...common} />
          </g>
          <path d="M5 19.5h14" {...common} />
          <circle className="pi-spark" cx="9" cy="17" r="0.6" fill="currentColor" />
          <circle className="pi-spark" cx="15" cy="17" r="0.6" fill="currentColor" style={{ animationDelay: "0.4s" }} />
        </>
      )}
    </svg>
  );
}
