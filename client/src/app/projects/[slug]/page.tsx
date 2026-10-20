import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import RevealText from "@/components/ui/RevealText";
import Button from "@/components/ui/Button";

export function generateStaticParams() {
  return site.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = site.projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

// The URL is read inside <Suspense> so the shared page shell stays URL-independent (Next 16)
export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-dvh" />}>
      <ProjectDetails params={params} />
    </Suspense>
  );
}

async function ProjectDetails({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const index = site.projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = site.projects[index];
  const next = site.projects[(index + 1) % site.projects.length];
  const isSvg = (src: string) => src.endsWith(".svg");

  return (
    <main className="pt-32">
      <article>
        <header className="container-x">
          <Link href="/#work" className="text-sm text-mute hover:text-paper">
            ← All work
          </Link>
          <RevealText as="h1" trigger="load" className="display mt-8 text-[clamp(3.2rem,10vw,10rem)]">
            {p.title}
          </RevealText>
          <div className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
            <p className="text-xl leading-relaxed text-paper/80 md:col-span-6">{p.summary}</p>
            <dl className="grid grid-cols-2 gap-6 text-sm md:col-span-5 md:col-start-8">
              <div>
                <dt className="text-mute">Role</dt>
                <dd className="mt-1 text-base">{p.role}</dd>
              </div>
              <div>
                <dt className="text-mute">Year</dt>
                <dd className="mt-1 text-base">{p.year}</dd>
              </div>
              <div>
                <dt className="text-mute">Type</dt>
                <dd className="mt-1 text-base">{p.category}</dd>
              </div>
              <div>
                <dt className="text-mute">Stack</dt>
                <dd className="mt-1 text-base">{p.stack.join(", ")}</dd>
              </div>
            </dl>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.live && <Button href={p.live}>Visit live site</Button>}
            {p.repo && (
              <Button href={p.repo} variant="ghost">
                View source
              </Button>
            )}
          </div>
        </header>

        <div className="container-x mt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-raise">
            <Image src={p.cover} alt={`${p.title} cover`} fill priority sizes="100vw" className="object-cover" unoptimized={isSvg(p.cover)} />
          </div>
        </div>

        <div className="container-x grid grid-cols-1 border-b border-line sm:grid-cols-3">
          {p.metrics.map((m, i) => (
            <div key={m.label} className={`py-10 ${i > 0 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-8" : ""}`}>
              <p className="display text-6xl">{m.value}</p>
              <p className="mt-2 text-mute">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="container-x space-y-20 py-24">
          {[
            { h: "The problem", t: p.problem },
            { h: "What I built", t: p.solution },
            { h: "The outcome", t: p.outcome },
          ].map((s) => (
            <section key={s.h} className="grid gap-6 md:grid-cols-12">
              <h2 className="display text-4xl md:col-span-4">{s.h}</h2>
              <p className="max-w-[62ch] text-lg leading-relaxed text-paper/75 md:col-span-7 md:col-start-6">{s.t}</p>
            </section>
          ))}
        </div>

        {p.gallery.length > 0 && (
          <div className="container-x grid gap-5 pb-24 md:grid-cols-2">
            {p.gallery.map((src, i) => (
              <div key={src + i} className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-raise ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
                <Image src={src} alt={`${p.title} screenshot ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized={isSvg(src)} />
              </div>
            ))}
          </div>
        )}
      </article>

      <Link href={`/projects/${next.slug}`} data-cursor="Next" className="group block border-t border-line">
        <div className="container-x py-24">
          <p className="text-sm text-mute">Next project</p>
          <p className="display mt-4 text-[clamp(3rem,9vw,8rem)] text-paper/50 transition-colors duration-500 group-hover:text-paper">
            {next.title}
          </p>
        </div>
      </Link>
    </main>
  );
}
