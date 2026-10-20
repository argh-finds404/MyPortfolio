"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "scroll" animates when scrolled into view, "load" plays immediately */
  trigger?: "scroll" | "load";
};

/** Masked line-by-line reveal, the signature heading animation. */
export default function RevealText({ as: Tag = "h2", children, className, delay = 0, trigger = "scroll" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create(ref.current!, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.09,
            delay,
            ease: "expo.out",
            scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 85%", once: true } : undefined,
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
