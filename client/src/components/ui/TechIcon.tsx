import { techIcons } from "@/content/icons";

/**
 * Brand logo for a skill name (see content/icons.ts). Uses the current text
 * colour, or the brand colour with `brand`. Falls back to initials.
 */
export default function TechIcon({ name, size = 18, brand = false, className }: { name: string; size?: number; brand?: boolean; className?: string }) {
  const icon = techIcons[name.toLowerCase()];
  if (!icon) {
    return (
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-[4px] border border-current font-mono font-semibold ${className ?? ""}`}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
      >
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
      </span>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} className={`shrink-0 ${className ?? ""}`} fill={brand ? `#${icon.hex}` : "currentColor"}>
      <path d={icon.path} />
    </svg>
  );
}
