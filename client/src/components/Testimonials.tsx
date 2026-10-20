import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Testimonials. Quotes with `approved: false` are drafts: they show on your
 * local preview with a badge and are left out of the live site, so nothing
 * is published in someone's name until they've signed off on it.
 */
export default function Testimonials() {
  const items = site.testimonials.filter((t) => t.approved || isDev);
  if (!items.length) return null;

  return (
    <section className="container-x py-28 md:py-36">
      <RevealText className="display mb-10 max-w-[16ch] text-[clamp(2.25rem,4.5vw,4rem)]">{site.sections.testimonials.title}</RevealText>
      <div className={`grid gap-5 ${items.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}>
        {items.map((t) => {
          const initials = t.name
            .replace(/^(Dr|Prof|Mr|Ms|Mrs)\.?\s+/i, "")
            .split(/\s+/)
            .filter((w) => /^[A-Z]/.test(w))
            .map((w) => w[0])
            .join("")
            .slice(0, 2);
          return (
            <figure key={t.name} className="relative overflow-hidden rounded-2xl border border-line bg-surface p-7 md:p-9">
              {!t.approved && (
                <span className="mb-5 inline-block rounded-full border border-bad/40 px-2.5 py-0.5 font-mono text-[10px] text-bad md:absolute md:top-5 md:right-5 md:mb-0">
                  Draft · hidden on the live site until approved
                </span>
              )}
              <svg aria-hidden width="30" height="24" viewBox="0 0 56 44" className="mb-5 block text-accent" fill="currentColor">
                <path d="M0 44V27.6C0 11.8 8.3 2.6 23.6 0l2.6 6.4C17.6 9 13.4 14 13 21.6h11.2V44H0Zm30.4 0V27.6C30.4 11.8 38.7 2.6 54 0l2 6.4C47.6 9 43.6 14 43.2 21.6h11.2V44H30.4Z" />
              </svg>
              <blockquote className="max-w-[54ch] text-lg leading-relaxed text-paper/85 md:text-xl">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3.5 border-t border-line pt-5">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/15 text-sm font-semibold text-accent">{initials}</span>
                )}
                <span>
                  <span className="block font-medium">{t.name}</span>
                  <span className="block text-sm text-mute">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
