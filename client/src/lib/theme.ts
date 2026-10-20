"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

/** Runs before paint (inlined in <head>) so the page never flashes the wrong theme. */
export const themeInitScript = `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}`;

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Current theme, kept in sync with the data-theme attribute on <html>. */
export function useTheme() {
  return useSyncExternalStore(subscribe, read, () => "dark" as Theme);
}

/** Switches theme with a circular reveal from (x, y) where the View Transitions API exists. */
export function toggleTheme(x = innerWidth / 2, y = 0) {
  const next: Theme = read() === "dark" ? "light" : "dark";
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) return apply();

  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
