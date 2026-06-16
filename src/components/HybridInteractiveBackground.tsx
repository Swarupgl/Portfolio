"use client";

import { useEffect, useMemo, useRef } from "react";

type Vec2 = { x: number; y: number };
type Pulse = { x: number; y: number; t0: number; strength: number };

/**
 * HELPER FUNCTIONS
 * ========================================
 * clamp: Keeps a value strictly between a minimum and maximum bound.
 * prng01: A deterministic Pseudo-Random Number Generator based on sine waves.
 *         It guarantees the same sequence of "random" numbers every time.
 */
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function prng01(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function hexPolygon(cx: number, cy: number, r: number) {
  const pts: Vec2[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return pts;
}

function smoothstep(t: number) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

type PortraitDot = {
  ox: number; oy: number;
  tx: number; ty: number;
  vx: number; vy: number;
  delay: number;
};

export default function HybridInteractiveBackground() {
  /**
   * REACT HOOKS
   * ========================================
   * useRef: Stores mutable values that do not trigger a component re-render when changed.
   * - canvasRef: Holds a direct reference to the raw HTML <canvas> element.
   * - rafRef: Holds the ID of the current RequestAnimationFrame loop so we can cancel it.
   * - portraitDataRef: Stores the sampled pixels of your face.
   */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const portraitDataRef = useRef<{
    samples: { nx: number; ny: number }[];
    aspect: number;
  } | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const debug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("bgdebug") === "1";
    // Helpful for verifying the component actually mounts/renders on the user's machine.
    // (This is intentionally only enabled via query param.)

    const mouse: Vec2 = { x: 0.5, y: 0.5 };
    const mouseVel: Vec2 = { x: 0, y: 0 };
    let lastMouse: Vec2 = { x: 0.5, y: 0.5 };
    const pulses: Pulse[] = [];

    let drawOnceRaf: number | null = null;
    let lastDrawMs = 0;

    const setFromClient = (clientX: number, clientY: number) => {
      const nx = clientX / window.innerWidth;
      const ny = clientY / window.innerHeight;
      mouseVel.x = nx - lastMouse.x;
      mouseVel.y = ny - lastMouse.y;
      mouse.x = nx;
      mouse.y = ny;
      lastMouse = { x: nx, y: ny };
    };

    const onMove = (e: PointerEvent) => setFromClient(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      setFromClient(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onDown = (e: PointerEvent) => {
      setFromClient(e.clientX, e.clientY);
      pulses.push({
        x: mouse.x,
        y: mouse.y,
        t0: performance.now(),
        strength: 0.55,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const state = {
      w: 0,
      h: 0,
      dpr: 1,
      scale: 1,
      nodes: [] as { x: number; y: number; vx: number; vy: number }[],
      hex: [] as { x: number; y: number; r: number; m: number }[],
      portraitDots: [] as PortraitDot[],
      portraitReady: false,
      morphStartT: 0,
    };

    const rebuild = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      state.dpr = dpr;

      const w = Math.floor(window.innerWidth * dpr * state.scale);
      const h = Math.floor(window.innerHeight * dpr * state.scale);
      state.w = w;
      state.h = h;

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      
      const area = (w * h) / (900 * 900);
      const count = Math.floor(clamp(96 * area, 80, 160));
      state.nodes = Array.from({ length: count }, (_, i) => {
        const x = prng01(i * 11.1 + 0.1);
        const y = prng01(i * 17.7 + 0.2);
        const a = prng01(i * 3.3 + 0.4) * Math.PI * 2;
        return {
          x,
          y,
          vx: Math.cos(a) * 0.0006,
          vy: Math.sin(a) * 0.0006,
        };
      });

      state.hex = [];
      const cell = clamp(Math.min(w, h) / 14, 40, 92);
      const r = cell * 0.42;
      const dx = cell * 0.86;
      const dy = cell * 0.75;
      let row = 0;
      for (let y = -cell; y < h + cell; y += dy) {
        const offset = row % 2 === 0 ? 0 : dx / 2;
        let col = 0;
        for (let x = -cell; x < w + cell; x += dx) {
          const m = prng01(row * 101 + col * 17 + 0.33) > 0.28 ? 1 : 0;
          state.hex.push({ x: x + offset, y, r, m });
          col++;
        }
        row++;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
    };

    rebuild();
    const onResize = () => rebuild();
    window.addEventListener("resize", onResize);

    /**
     * THE DRAW LOOP
     * ========================================
     * This function is called ~60 times per second by requestAnimationFrame.
     * Everything you see moving on the screen is erased and redrawn here in milliseconds.
     */
    const draw = (tMs: number) => {
      const t = tMs * 0.001;
      const { w, h, nodes, hex } = state;
      const px = state.dpr * state.scale;

      lastDrawMs = tMs;

      // Base depth wash
      ctx.globalCompositeOperation = "source-over";
      const gx = 0.5 + (mouse.x - 0.5) * 0.08;
      const gy = 0.5 + (mouse.y - 0.5) * 0.08;
      const grad = ctx.createRadialGradient(
        w * gx,
        h * gy,
        0,
        w * gx,
        h * gy,
        Math.hypot(w, h) * 0.7
      );
      grad.addColorStop(0, "rgba(59, 130, 246, 0.06)");
      grad.addColorStop(0.42, "rgba(148, 163, 184, 0.06)");
      grad.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fade (fluid motion trails)
      ctx.globalCompositeOperation = "source-over";
      // Slightly stronger fade prevents additive layers from building into a white blob.
      ctx.fillStyle = "rgba(10, 36, 49, 0.10)";
      ctx.fillRect(0, 0, w, h);

      const mx = mouse.x * w;
      const my = mouse.y * h;

      // Pulses (click/touch ripples)
      const now = tMs;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const age = (now - pulses[i].t0) * 0.001;
        if (age > 1.4) pulses.splice(i, 1);
      }

      // Tunnel depth (subtle)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const cx = w * (0.5 + (mouse.x - 0.5) * 0.06);
      const cy = h * (0.5 + (mouse.y - 0.5) * 0.06);
      const maxR = Math.hypot(w, h) * 0.52;
      for (let i = 0; i < 18; i++) {
        const k = i / 18;
        const r = maxR * (0.14 + k) * (0.86 + 0.04 * Math.sin(t * 0.8));
        const wobble = 0.006 * Math.sin(t * 1.2 + i);
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * (0.86 + wobble), 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.018 * (1 - k)})`;
        ctx.lineWidth = Math.max(1, 1.05 * px);
        ctx.stroke();
      }
      ctx.restore();

      // Hex touch-grid overlay (inspired by the hex interaction image)
      ctx.save();
      // Use non-additive compositing to avoid "burn in" hotspots.
      ctx.globalCompositeOperation = "source-over";
      const ripple = (Math.abs(mouseVel.x) + Math.abs(mouseVel.y)) * 600;
      for (let i = 0; i < hex.length; i++) {
        const c = hex[i];
        if (c.m === 0) continue;
        const dx = c.x - mx;
        const dy = c.y - my;
        const d = Math.hypot(dx, dy);
        const influence = Math.exp(-(d * d) / (2 * Math.pow(Math.min(w, h) * 0.12, 2)));
        const wave = Math.sin(t * 3.2 - d * 0.02) * 0.5 + 0.5;
        let pulseBoost = 0;
        for (const p of pulses) {
          const px = p.x * w;
          const py = p.y * h;
          const pd = Math.hypot(c.x - px, c.y - py);
          const age = (now - p.t0) * 0.001;
          const ring = Math.exp(-Math.pow((pd - age * Math.min(w, h) * 0.28) / (Math.min(w, h) * 0.05), 2));
          pulseBoost += ring * (0.55 - age * 0.28) * p.strength;
        }
        const boost = clamp(
          influence * (0.32 + 0.58 * wave) + ripple * 0.00004 + pulseBoost * 0.22,
          0,
          1
        );

        const pts = hexPolygon(c.x, c.y, c.r);
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
        ctx.closePath();

        // Ensure a faint always-on grid; boost adds interaction.
        ctx.strokeStyle = `rgba(226, 232, 240, ${0.030 + 0.090 * boost})`;
        ctx.lineWidth = Math.max(1, 1.05 * px);
        ctx.stroke();

        if (boost > 0.45) {
          ctx.fillStyle = `rgba(59, 130, 246, ${0.012 + 0.030 * boost})`;
          ctx.fill();
        }
      }
      ctx.restore();

      // Neural/IoT mesh nodes + connections (inspired by the network image)
      ctx.save();
      // Non-additive compositing avoids overbright clusters when trails overlap.
      ctx.globalCompositeOperation = "source-over";

      const linkDist = Math.min(w, h) * 0.155;
      for (const n of nodes) {
        // Flow-field like motion (fluid-ish)
        const fx =
          Math.sin((n.y * 2.0 + t * 0.18) * Math.PI * 2) +
          Math.cos((n.x * 1.6 - t * 0.14) * Math.PI * 2);
        const fy =
          Math.cos((n.x * 2.2 + t * 0.16) * Math.PI * 2) +
          Math.sin((n.y * 1.4 - t * 0.12) * Math.PI * 2);

        // Gentle attraction to cursor (only slightly)
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const md = Math.hypot(dx, dy);
        let att = Math.exp(-md * 6) * 0.0009;
        for (const p of pulses) {
          const pd = Math.hypot(p.x - n.x, p.y - n.y);
          const age = (now - p.t0) * 0.001;
          const ring = Math.exp(-Math.pow((pd - age * 0.45) / 0.10, 2));
          att += ring * 0.0008;
        }

        n.vx += fx * 0.00003 + dx * att;
        n.vy += fy * 0.00003 + dy * att;
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;

        // Wrap
        if (n.x < -0.05) n.x = 1.05;
        if (n.x > 1.05) n.x = -0.05;
        if (n.y < -0.05) n.y = 1.05;
        if (n.y > 1.05) n.y = -0.05;
      }

      // Extra faint "macro" strands (adds the busy web look without hotspots)
      // Deterministic index links: cheap, stable, and doesn't require O(n^2) neighbor search.
      const nCount = nodes.length;
      let lineBudget = Math.floor(nCount * 2.2);
      const maxMacro = Math.min(w, h) * 0.78;
      const offsets = [19, 47] as const;
      for (let i = 0; i < nCount && lineBudget > 0; i++) {
        const a = nodes[i];
        const ax = a.x * w;
        const ay = a.y * h;
        for (let k = 0; k < offsets.length && lineBudget > 0; k++) {
          const j = (i + offsets[k]) % nCount;
          const b = nodes[j];
          const bx = b.x * w;
          const by = b.y * h;
          const d = Math.hypot(bx - ax, by - ay);
          if (d > maxMacro) continue;
          const alpha = clamp((1 - d / maxMacro) * 0.055, 0, 0.04);
          if (alpha <= 0) continue;
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = Math.max(1, 0.9 * px);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
          lineBudget--;
        }
      }

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x * w;
        const ay = a.y * h;
        for (let j = i + 1; j < nodes.length; j++) {
          if (lineBudget <= 0) break;
          const b = nodes[j];
          const bx = b.x * w;
          const by = b.y * h;
          const dx = bx - ax;
          const dy = by - ay;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          // Keep it busy like the reference, but probabilistically skip some longer links.
          const keep = prng01(i * 131 + j * 17 + 0.3) > 0.34;
          if (!keep) continue;
          const alpha = (1 - d / linkDist) * 0.19;
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
          ctx.lineWidth = Math.max(1, 1.0 * px);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
          lineBudget--;
        }
      }

      // Nodes
      for (const n of nodes) {
        const x = n.x * w;
        const y = n.y * h;
        const d = Math.hypot(x - mx, y - my);
        const glow = Math.exp(-(d * d) / (2 * Math.pow(Math.min(w, h) * 0.10, 2)));
        let pulseGlow = 0;
        for (const p of pulses) {
          const px = p.x * w;
          const py = p.y * h;
          const pd = Math.hypot(x - px, y - py);
          const age = (now - p.t0) * 0.001;
          pulseGlow +=
            Math.exp(-(pd * pd) / (2 * Math.pow(Math.min(w, h) * 0.10, 2))) *
            (0.45 - age * 0.24) *
            p.strength;
        }
        // Keep nodes visible but avoid a "white hotspot" around the cursor.
        const a = clamp(0.12 + 0.18 * glow + 0.10 * pulseGlow, 0, 0.48);
        ctx.fillStyle = `rgba(148, 163, 184, ${a})`;
        ctx.beginPath();
        ctx.arc(x, y, (1.45 + glow * 1.25) * px, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Vignette for contrast (keeps content readable)
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.hypot(w, h) * 0.65);
      vg.addColorStop(0, "rgba(2, 6, 23, 0)");
      vg.addColorStop(1, "rgba(2, 6, 23, 0.45)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      if (debug) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.font = "600 14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        const pad = 10;
        const msg1 = "BG ACTIVE";
        const msg2 = `${Math.round(w)}x${Math.round(h)} px | dpr ${state.dpr.toFixed(2)} | pulses ${pulses.length}`;
        const tw = Math.max(ctx.measureText(msg1).width, ctx.measureText(msg2).width);
        const bw = tw + pad * 2;
        const bh = 44;
        ctx.fillStyle = "rgba(2, 6, 23, 0.65)";
        ctx.fillRect(12, 12, bw, bh);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
        ctx.lineWidth = 1;
        ctx.strokeRect(12, 12, bw, bh);
        ctx.fillStyle = "rgba(226, 232, 240, 0.95)";
        ctx.fillText(msg1, 12 + pad, 30);
        ctx.fillStyle = "rgba(148, 163, 184, 0.95)";
        ctx.fillText(msg2, 12 + pad, 48);
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        rafRef.current = window.requestAnimationFrame(draw);
      }
    };

    const requestDrawOnce = () => {
      if (!prefersReducedMotion) return;
      if (drawOnceRaf) return;
      // Throttle to ~30fps when driven by input
      const now = performance.now();
      if (now - lastDrawMs < 32) return;
      drawOnceRaf = window.requestAnimationFrame((ms) => {
        drawOnceRaf = null;
        draw(ms);
      });
    };

    // Render once for reduced motion; animate otherwise.
    if (prefersReducedMotion) {
      draw(performance.now());
      // Still respond interactively on input
      const onReducedMove = () => requestDrawOnce();
      window.addEventListener("pointermove", onReducedMove, { passive: true });
      window.addEventListener("pointerdown", onReducedMove, { passive: true });
      window.addEventListener("touchmove", onReducedMove, { passive: true });

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("touchmove", onTouch);
        window.removeEventListener("pointermove", onReducedMove);
        window.removeEventListener("pointerdown", onReducedMove);
        window.removeEventListener("touchmove", onReducedMove);
        window.removeEventListener("resize", onResize);
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        if (drawOnceRaf) window.cancelAnimationFrame(drawOnceRaf);
      };
    }

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (drawOnceRaf) window.cancelAnimationFrame(drawOnceRaf);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-100"
      aria-hidden="true"
    />
  );
}
