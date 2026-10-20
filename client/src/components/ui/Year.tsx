"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year, read on the client so the static page never shows a stale one. */
export default function Year() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
  return <>{year}</>;
}
