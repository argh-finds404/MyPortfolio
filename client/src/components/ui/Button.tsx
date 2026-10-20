"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import clsx from "clsx";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
  download?: boolean;
};

/** Pill button with a magnetic pull and a rolling label on hover. */
export default function Button({ href, children, variant = "solid", className, external, download }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = ref.current!.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });

  const classes = clsx(
    "group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full px-6 text-[15px] font-medium transition-colors duration-300",
    variant === "solid"
      ? "bg-paper text-ink hover:bg-accent"
      : "border border-line text-paper hover:border-paper/40",
    className,
  );

  const inner = (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );

  const shared = { ref, className: classes, onPointerMove: move, onPointerLeave: leave };

  if (external || download || /^(https?:|mailto:|tel:)/.test(href))
    return (
      <a href={href} {...shared} {...(download ? { download: true } : { target: "_blank", rel: "noreferrer" })}>
        {inner}
      </a>
    );
  return (
    <Link href={href} {...shared}>
      {inner}
    </Link>
  );
}
