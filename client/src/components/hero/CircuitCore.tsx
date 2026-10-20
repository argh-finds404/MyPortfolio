"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * A living circuit board: a central chip wired to labelled modules.
 * Pulses of "power" race along the traces, modules flash when hit,
 * the chip fires a surge every few seconds and sparks jump between pads.
 * Pointer near a trace sends extra pulses; a click fires a surge.
 *
 * Drawn on a 2D canvas: static traces are cached on an offscreen layer,
 * only the moving parts are redrawn each frame. Pauses when off-screen.
 */

type Pt = { x: number; y: number };
type Trace = { pts: Pt[]; seg: number[]; len: number; end: Pt; label?: string; flash: number; side: number };
// t runs 0 → 1 over `dur` seconds; position along the trace is eased (see easeInOut)
type Pulse = { trace: Trace; t: number; dur: number; dir: 1 | -1; size: number; phase: number };

const easeInOut = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

const LABELS = ["API", "DB", "AUTH", "AI", "UI", "WS", "CACHE", "JWT", "CDN", "GIT", "CI", "LOG"];

const COLORS = {
  dark: { trace: "rgba(110,165,255,0.16)", via: "rgba(150,195,255,0.35)", pulse: [77, 168, 255], core: "#e9f4ff", chip: "#0b1220", chipLine: "rgba(120,175,255,0.45)", label: "rgba(170,200,255,0.45)", glowOp: "lighter" as GlobalCompositeOperation },
  light: { trace: "rgba(20,70,170,0.16)", via: "rgba(20,70,170,0.35)", pulse: [10, 92, 255], core: "#ffffff", chip: "#0d1626", chipLine: "rgba(90,150,255,0.6)", label: "rgba(20,50,120,0.5)", glowOp: "source-over" as GlobalCompositeOperation },
};

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build PCB-style traces (straight, 45° bend, straight) from pins on every side of the chip. */
function buildTraces(w: number, h: number, cx: number, cy: number, half: number) {
  const rand = seeded(42);
  const traces: Trace[] = [];
  const perSide = w < 500 ? 5 : 8;
  const sides = [
    { dir: { x: 1, y: 0 }, perp: { x: 0, y: 1 } },
    { dir: { x: -1, y: 0 }, perp: { x: 0, y: 1 } },
    { dir: { x: 0, y: 1 }, perp: { x: 1, y: 0 } },
    { dir: { x: 0, y: -1 }, perp: { x: 1, y: 0 } },
  ];
  let labelIndex = 0;
  sides.forEach((s, si) => {
    for (let i = 0; i < perSide; i++) {
      const off = ((i + 0.5) / perSide - 0.5) * half * 1.7;
      const start = { x: cx + s.dir.x * half + s.perp.x * off, y: cy + s.dir.y * half + s.perp.y * off };
      const a = 14 + rand() * 40;
      const bend = (off >= 0 ? 1 : -1) * (rand() < 0.75 ? 1 : -1);
      const b = 20 + rand() * 70;
      const p1 = { x: start.x + s.dir.x * a, y: start.y + s.dir.y * a };
      const p2 = { x: p1.x + (s.dir.x + s.perp.x * bend) * b * 0.7, y: p1.y + (s.dir.y + s.perp.y * bend) * b * 0.7 };
      // Keep clear of the edges (the top holds the nav and the banner labels),
      // and end each trace at a different depth so the pads don't pile up
      const padX = 40;
      const top = Math.min(130, h * 0.16);
      const bottom = h - 30;
      const room =
        s.dir.x > 0 ? w - padX - p2.x : s.dir.x < 0 ? p2.x - padX : s.dir.y > 0 ? bottom - p2.y : p2.y - top;
      const reach = Math.max(10, room) * (0.3 + rand() * 0.65);
      const p3 = { x: p2.x + s.dir.x * reach, y: p2.y + s.dir.y * reach };
      p2.x = Math.min(w - padX, Math.max(padX, p2.x));
      p2.y = Math.min(bottom, Math.max(top, p2.y));
      p3.x = Math.min(w - padX, Math.max(padX, p3.x));
      p3.y = Math.min(bottom, Math.max(top, p3.y));
      const pts = [start, p1, p2, p3];
      const seg = [0];
      for (let k = 1; k < pts.length; k++) seg.push(seg[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
      const t: Trace = { pts, seg, len: seg[seg.length - 1], end: p3, flash: 0, side: si };
      if (i % 2 === 1 && labelIndex < LABELS.length) t.label = LABELS[labelIndex++];
      traces.push(t);
    }
  });
  return traces;
}

function pointAt(t: Trace, d: number): Pt {
  d = Math.max(0, Math.min(t.len, d));
  for (let k = 1; k < t.pts.length; k++) {
    if (d <= t.seg[k]) {
      const f = (d - t.seg[k - 1]) / (t.seg[k] - t.seg[k - 1] || 1);
      const a = t.pts[k - 1];
      const b = t.pts[k];
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
    }
  }
  return t.end;
}

/** Draw a trace from distance 0 up to `upTo`. */
function strokePartial(ctx: CanvasRenderingContext2D, t: Trace, upTo: number) {
  ctx.beginPath();
  ctx.moveTo(t.pts[0].x, t.pts[0].y);
  for (let k = 1; k < t.pts.length; k++) {
    if (upTo >= t.seg[k]) ctx.lineTo(t.pts[k].x, t.pts[k].y);
    else {
      const p = pointAt(t, upTo);
      ctx.lineTo(p.x, p.y);
      break;
    }
  }
  ctx.stroke();
}

/** Pre-rendered soft glow sprite, tinted to the pulse colour. */
function makeGlow(rgb: number[]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export default function CircuitCore({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = prefersReducedMotion();
    const C = COLORS[theme];
    const glow = makeGlow(C.pulse);
    const rgb = C.pulse.join(",");
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-jet") || "monospace";
    const display = getComputedStyle(document.documentElement).getPropertyValue("--font-clash") || "sans-serif";

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, half = 0;
    let traces: Trace[] = [];
    let staticLayer: HTMLCanvasElement | null = null;
    const pulses: Pulse[] = [];
    let raf = 0, last = 0, visible = true, intro = reduce ? 1 : 0;
    let surge = 0, nextSurge = 3, sparkTimer = 1.2;
    let spark: { a: Pt; b: Pt; life: number } | null = null;
    const pointer = { x: -9999, y: -9999, active: false };
    const rand = Math.random;

    function layout() {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cx = w * 0.52;
      cy = h * 0.46;
      half = Math.min(w, h) * (w < 500 ? 0.12 : 0.1);
      traces = buildTraces(w, h, cx, cy, half);
      buildStatic();
    }

    function drawChip(g: CanvasRenderingContext2D, energy: number) {
      const s = half;
      // pins
      g.strokeStyle = C.chipLine;
      g.lineWidth = 1.5;
      // body
      g.fillStyle = C.chip;
      g.beginPath();
      g.roundRect(cx - s, cy - s, s * 2, s * 2, s * 0.18);
      g.fill();
      g.stroke();
      g.beginPath();
      g.roundRect(cx - s * 0.72, cy - s * 0.72, s * 1.44, s * 1.44, s * 0.1);
      g.strokeStyle = `rgba(${rgb},${0.35 + energy * 0.5})`;
      g.stroke();
      // die grid
      g.strokeStyle = `rgba(${rgb},0.12)`;
      g.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        const o = -s * 0.72 + (s * 1.44 * i) / 6;
        g.beginPath();
        g.moveTo(cx + o, cy - s * 0.72);
        g.lineTo(cx + o, cy + s * 0.72);
        g.moveTo(cx - s * 0.72, cy + o);
        g.lineTo(cx + s * 0.72, cy + o);
        g.stroke();
      }
    }

    function buildStatic() {
      staticLayer = document.createElement("canvas");
      staticLayer.width = canvas.width;
      staticLayer.height = canvas.height;
      const g = staticLayer.getContext("2d")!;
      g.scale(dpr, dpr);
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = C.trace;
      g.lineWidth = 1.4;
      traces.forEach((t) => strokePartial(g, t, t.len));
      traces.forEach((t) => {
        g.beginPath();
        g.arc(t.end.x, t.end.y, t.label ? 4.5 : 3, 0, Math.PI * 2);
        g.strokeStyle = C.via;
        g.stroke();
      });
    }

    /** Send a pulse down a trace. Duration is in seconds: slow and smooth by design. */
    function spawn(t: Trace, dir: 1 | -1 = 1, dur = 2.6 + rand() * 1.6) {
      if (pulses.length > 70) return;
      pulses.push({ trace: t, t: 0, dur, dir, size: 0.75 + rand() * 0.5, phase: rand() * Math.PI * 2 });
    }

    /** Distance along the trace for a pulse at progress `t`, eased in and out. */
    const distAt = (p: Pulse, t: number) => {
      const e = easeInOut(Math.max(0, Math.min(1, t)));
      return p.dir === 1 ? e * p.trace.len : (1 - e) * p.trace.len;
    };

    function fireSurge() {
      surge = 1;
      // A wave on roughly every other line, staggered so it ripples outward
      traces.forEach((t, i) => {
        if (rand() < 0.5) setTimeout(() => spawn(t, 1, 2.4 + rand() * 0.8), i * 22);
      });
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000 || 0, 0.05);
      last = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Traces: drawn in during the intro, cached afterwards
      if (intro < 1) {
        intro = Math.min(1, intro + dt / 1.6);
        const e = 1 - Math.pow(1 - intro, 3);
        ctx.strokeStyle = C.trace;
        ctx.lineWidth = 1.4;
        traces.forEach((t) => strokePartial(ctx, t, t.len * e));
        ctx.strokeStyle = `rgba(${rgb},0.8)`;
        ctx.lineWidth = 1.6;
        traces.forEach((t) => {
          const p = pointAt(t, t.len * e);
          ctx.drawImage(glow, p.x - 8, p.y - 8, 16, 16);
        });
      } else if (staticLayer) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(staticLayer, 0, 0);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      if (intro >= 1 && !reduce) {
        // Rhythm: ambient pulses, periodic surge, random sparks
        if (rand() < dt * 1.5) spawn(traces[(rand() * traces.length) | 0], rand() < 0.75 ? 1 : -1);
        nextSurge -= dt;
        if (nextSurge <= 0) {
          fireSurge();
          nextSurge = 6 + rand() * 3;
        }
        sparkTimer -= dt;
        if (sparkTimer <= 0) {
          const a = traces[(rand() * traces.length) | 0];
          const b = traces.find((t) => t !== a && Math.hypot(t.end.x - a.end.x, t.end.y - a.end.y) < 120) ?? null;
          if (b) spark = { a: a.end, b: b.end, life: 0.22 };
          sparkTimer = 1.4 + rand() * 2;
        }
        // Pointer energises the nearest trace
        if (pointer.active && rand() < dt * 5) {
          let best: Trace | null = null;
          let bestD = 70;
          for (const t of traces) {
            for (const p of t.pts) {
              const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
              if (d < bestD) {
                bestD = d;
                best = t;
              }
            }
          }
          if (best) spawn(best, rand() < 0.5 ? 1 : -1, 1.6 + rand() * 0.6);
        }
      }

      ctx.globalCompositeOperation = C.glowOp;

      // Pulses with fading trails
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += dt / p.dur;
        if (p.t >= 1) {
          if (p.dir === 1) p.trace.flash = 1;
          else surge = Math.max(surge, 0.35);
          pulses.splice(i, 1);
          continue;
        }
        // Comet tail: sample the eased path a little back in time, so it
        // stretches while the pulse cruises and bunches up as it settles
        ctx.strokeStyle = `rgba(${rgb},0.9)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const steps = 8;
        for (let k = 0; k <= steps; k++) {
          const q = pointAt(p.trace, distAt(p, p.t - (0.14 * k) / steps));
          if (k === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        const head = pointAt(p.trace, distAt(p, p.t));
        const gs = 22 * p.size * (1 + 0.18 * Math.sin(now / 260 + p.phase));
        ctx.drawImage(glow, head.x - gs / 2, head.y - gs / 2, gs, gs);
        ctx.fillStyle = C.core;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 1.6 * p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Module pads flash when a pulse lands
      ctx.font = `500 10px ${font}`;
      ctx.textAlign = "center";
      for (const t of traces) {
        if (t.flash > 0) {
          const s = 26 + t.flash * 26;
          ctx.globalAlpha = t.flash;
          ctx.drawImage(glow, t.end.x - s / 2, t.end.y - s / 2, s, s);
          ctx.globalAlpha = 1;
          t.flash = Math.max(0, t.flash - dt * 1.1);
        }
        if (t.label && intro >= 1) {
          const lx = t.end.x + (t.side === 0 ? 0 : t.side === 1 ? 0 : 0);
          const ly = t.end.y + (t.side === 2 ? 16 : -10);
          ctx.fillStyle = t.flash > 0.05 ? `rgba(${rgb},${0.55 + t.flash * 0.45})` : C.label;
          ctx.fillText(t.label, lx, ly);
        }
      }

      // Spark between two nearby pads
      if (spark) {
        spark.life -= dt;
        if (spark.life <= 0) spark = null;
        else {
          const { a, b } = spark;
          ctx.strokeStyle = `rgba(${rgb},${spark.life * 6})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          const n = 6;
          for (let k = 1; k < n; k++) {
            const f = k / n;
            ctx.lineTo(a.x + (b.x - a.x) * f + (rand() - 0.5) * 14, a.y + (b.y - a.y) * f + (rand() - 0.5) * 14);
          }
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Chip: glow on surge, then body and monogram
      surge = Math.max(0, surge - dt * 0.9);
      const energy = 0.25 + surge * 0.75 + Math.sin(now / 600) * 0.05;
      const gs = half * (3.4 + surge * 2.2);
      ctx.globalAlpha = Math.min(1, energy);
      ctx.drawImage(glow, cx - gs / 2, cy - gs / 2, gs, gs);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      drawChip(ctx, surge);
      ctx.fillStyle = `rgba(${rgb},${0.75 + surge * 0.25})`;
      ctx.shadowColor = `rgba(${rgb},0.9)`;
      ctx.shadowBlur = 12 + surge * 18;
      ctx.font = `600 ${Math.round(half * 0.9)}px ${display}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S.", cx, cy + half * 0.04);
      ctx.shadowBlur = 0;
      ctx.textBaseline = "alphabetic";
      ctx.font = `500 ${Math.max(8, Math.round(half * 0.13))}px ${font}`;
      ctx.fillStyle = `rgba(${rgb},0.55)`;
      ctx.fillText("CORE // 2026", cx, cy + half * 0.58);

      if (reduce) cancelAnimationFrame(raf);
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= w && pointer.y <= h;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) fireSurge();
    };

    layout();
    const ro = new ResizeObserver(() => layout());
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting && !document.hidden));
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    raf = requestAnimationFrame((t) => {
      last = t;
      frame(t);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className ?? ""}`} aria-hidden />;
}
