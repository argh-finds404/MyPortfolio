"use client";

import { useState } from "react";
import { techIcons } from "@/content/icons";

type Social = { label: string; icon: string; href?: string; copy?: string; handle: string };

/** Brand logo for a social icon key; "email" gets an envelope. */
export function SocialIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  if (icon === "email") {
    return (
      <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
      </svg>
    );
  }
  const data = techIcons[icon];
  if (!data) return null;
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={data.path} />
    </svg>
  );
}

/** Brand colours used on hover. Dark brands (GitHub, X) fall back to the text colour. */
const HOVER: Record<string, string> = {
  discord: "#5865F2",
  facebook: "#0866FF",
  whatsapp: "#25D366",
  email: "#EA4335",
};

/**
 * A social link: real link, or copy-to-clipboard when `copy` is set (Discord).
 * Render-prop children receive the "copied" state so each layout can show it.
 */
export default function SocialLink({
  social,
  className,
  children,
}: {
  social: Social;
  className?: string;
  children: (state: { copied: boolean }) => React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const style = { ["--brand" as string]: HOVER[social.icon] ?? "var(--paper)" };

  if (social.copy) {
    return (
      <button
        type="button"
        aria-label={`Copy ${social.label} username ${social.copy}`}
        title={`Copy ${social.label}: ${social.copy}`}
        className={className}
        style={style}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(social.copy!);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {}
        }}
      >
        {children({ copied })}
      </button>
    );
  }

  const external = social.href?.startsWith("http");
  return (
    <a
      href={social.href}
      aria-label={social.label}
      title={`${social.label}: ${social.handle}`}
      className={className}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children({ copied })}
    </a>
  );
}
