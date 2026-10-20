"use client";

/** Tiny signal so the hero waits for the preloader before its entrance. */
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroDone(fn: () => void) {
  if (done) fn();
  else listeners.add(fn);
  return () => listeners.delete(fn);
}
