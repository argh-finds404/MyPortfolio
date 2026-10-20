import { site } from "@/content/site";
import TechIcon from "@/components/ui/TechIcon";

/** Endless ticker under the hero. Duplicated once so the loop is seamless. */
export default function Marquee() {
  const items = [...site.marquee, ...site.marquee];
  return (
    <div className="relative overflow-hidden border-y border-line bg-surface py-6" aria-label={site.marquee.join(", ")}>
      <div className="marquee-track flex w-max items-center gap-12" aria-hidden>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="flex items-center gap-4">
              <TechIcon name={item} size={36} className="text-paper/60" />
              <span className="display text-4xl text-paper/90 sm:text-6xl">{item}</span>
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-accent" fill="currentColor">
              <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
