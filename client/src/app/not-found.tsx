import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-dvh flex-col items-start justify-center gap-8">
      <p className="display text-[clamp(6rem,22vw,18rem)] text-paper/10">404</p>
      <h1 className="display -mt-10 text-5xl">This page doesn&apos;t exist.</h1>
      <p className="max-w-md text-paper/70">The link may be old or mistyped. Head back to the home page to find what you were after.</p>
      <Button href="/">Back to home</Button>
    </main>
  );
}
