"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { sendContact, wakeApi } from "@/lib/api";
import RevealText from "@/components/ui/RevealText";
import SocialLink, { SocialIcon } from "@/components/ui/SocialLink";

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-paper placeholder:text-mute/70 transition-colors focus:border-accent focus:outline-none";

export default function Contact() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [type, setType] = useState(site.contact.projectTypes[0]);
  const [copied, setCopied] = useState(false);

  // Wake the (possibly sleeping) API early so the first message goes through quickly
  useEffect(() => wakeApi(), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ state: "sending" });
    try {
      await sendContact({
        name: String(data.get("name")),
        email: String(data.get("email")),
        budget: String(data.get("budget")),
        message: String(data.get("message")),
        company: String(data.get("company") ?? ""),
        projectType: type,
      });
      form.reset();
      setStatus({ state: "sent" });
    } catch (err) {
      setStatus({ state: "error", message: (err as Error).message });
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${site.contact.email}`;
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x relative py-28 md:py-40">
        <RevealText className="display max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)]">{site.sections.contact.title}</RevealText>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-12 lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-paper/70">{site.sections.contact.intro}</p>

            <dl className="space-y-6">
              <div>
                <dt className="text-sm text-mute">Email</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-3">
                  <a href={`mailto:${site.contact.email}`} className="font-display text-2xl font-medium break-all hover:text-accent md:text-3xl">
                    {site.contact.email}
                  </a>
                  <button type="button" onClick={copyEmail} className="rounded-full border border-line px-3 py-1 text-xs text-paper/70 hover:text-paper">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-mute">Phone / WhatsApp</dt>
                <dd className="mt-2 flex flex-wrap items-center gap-3">
                  <a href={`tel:${site.contact.phone.replace(/[^\d+]/g, "")}`} className="text-xl">
                    {site.contact.phone}
                  </a>
                  <a
                    href={site.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-medium text-[#062b14] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <SocialIcon icon="whatsapp" size={16} />
                    Message me on WhatsApp
                  </a>
                </dd>
              </div>
            </dl>

            <ul className="grid grid-cols-2 gap-3" aria-label="Social profiles">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <SocialLink
                    social={s}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[var(--brand)]"
                  >
                    {({ copied }) => (
                      <>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-raise text-paper/80 transition-colors duration-300 group-hover:text-[var(--brand)]">
                          <SocialIcon icon={s.icon} size={19} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium">{s.label}</span>
                          <span className="block truncate text-xs text-mute">{copied ? "Username copied" : s.handle}</span>
                        </span>
                      </>
                    )}
                  </SocialLink>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="space-y-6 lg:col-span-6 lg:col-start-7" noValidate={false}>
            <fieldset>
              <legend className="mb-3 text-sm text-mute">{site.sections.contact.typeLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {site.contact.projectTypes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${type === t ? "border-paper bg-paper text-ink" : "border-line text-paper/70 hover:text-paper"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-mute">Your name</span>
                <input name="name" required minLength={2} autoComplete="name" className={field} placeholder="Jane Doe" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-mute">Email</span>
                <input name="email" type="email" required autoComplete="email" className={field} placeholder="jane@company.com" />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-mute">{site.sections.contact.secondLabel}</span>
              <select name="budget" className={field} defaultValue={site.contact.budgets[0]}>
                {site.contact.budgets.map((b) => (
                  <option key={b} className="bg-surface">
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-mute">Message</span>
              <textarea
                name="message"
                required
                minLength={10}
                rows={6}
                className={`${field} resize-none`}
                placeholder={site.sections.contact.messagePlaceholder}
                data-lenis-prevent
              />
            </label>

            {/* Honeypot: hidden from people, filled by bots */}
            <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="submit"
                disabled={status.state === "sending"}
                className="inline-flex h-14 items-center gap-3 rounded-full bg-paper px-8 font-medium text-ink transition-colors hover:bg-accent disabled:opacity-60"
              >
                {status.state === "sending" ? "Sending… (can take a moment)" : "Send message"}
              </button>
              <p role="status" aria-live="polite" className={`text-sm ${status.state === "error" ? "text-bad" : "text-paper/70"}`}>
                {status.state === "sent" && site.sections.contact.sent}
                {status.state === "error" && status.message}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
