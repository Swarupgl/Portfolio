"use client";

import { useEffect, useRef, useMemo } from "react";

// ── types ──────────────────────────────────────────────────────────────────
type Dot = {
  x: number; y: number;      // current canvas-pixel position
  vx: number; vy: number;    // velocity
  tx: number; ty: number;    // target (portrait) position in canvas pixels
  seed: number;              // per-dot random, 0-1
};

// ── helpers ────────────────────────────────────────────────────────────────
function prng(s: number) {
  const x = Math.sin(s + 1) * 43758.5453;
  return x - Math.floor(x);
}
function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

// ── component ──────────────────────────────────────────────────────────────
export default function NavAvatar() {
  const canvasRef      = useRef<HTMLCanvasElement | null>(null);
  const rafRef         = useRef<number | null>(null);
  const dotsRef        = useRef<Dot[]>([]);
  const imageLoadedRef = useRef(false);
  // morphT: 0 = fully scattered, 1 = fully formed
  const morphTRef      = useRef(0);
  // true when mouse has moved recently on the page
  const mouseActiveRef = useRef(false);
  const mouseTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DPR  = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 48 * DPR; // physical pixels

    canvas.width  = SIZE;
    canvas.height = SIZE;
    canvas.style.width  = "48px";
    canvas.style.height = "48px";

    const ctx = canvas.getContext("2d")!;
    const NUM_DOTS = 500;

    // ── helper: scatter dots back to random positions inside the circle ──
    const scatterDots = () => {
      dotsRef.current.forEach((d, i) => {
        const a = prng(i * 3.3) * Math.PI * 2;
        const r = Math.sqrt(prng(i * 7.1)) * SIZE * 0.45;
        d.x  = SIZE / 2 + Math.cos(a) * r;
        d.y  = SIZE / 2 + Math.sin(a) * r;
        d.vx = (prng(i * 2.3) - 0.5) * 0.8;
        d.vy = (prng(i * 4.9) - 0.5) * 0.8;
      });
    };

    // ── Create initial dots right away (so canvas is never blank) ─────────
    dotsRef.current = Array.from({ length: NUM_DOTS }, (_, i) => {
      const a = prng(i * 3.3) * Math.PI * 2;
      const r = Math.sqrt(prng(i * 7.1)) * SIZE * 0.45;
      return {
        x:    SIZE / 2 + Math.cos(a) * r,
        y:    SIZE / 2 + Math.sin(a) * r,
        vx:   (prng(i * 2.3) - 0.5) * 0.8,
        vy:   (prng(i * 4.9) - 0.5) * 0.8,
        tx:   SIZE / 2 + Math.cos(a) * r, // target = same until image loads
        ty:   SIZE / 2 + Math.sin(a) * r,
        seed: prng(i * 1.7),
      };
    });

    // ── Load image and map darkest pixels to dot targets ──────────────────
    const loadImage = async () => {
      try {
        const res     = await fetch("/images/swarup_g_l.jpg");
        const blob    = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          //
          // ── IMPORTANT: We sample only the TOP HALF of the image (face region).
          // A portrait photo has the face in roughly the top 50% of the frame.
          // Sampling only this region gives a clear face silhouette inside the circle.
          //
          const SAMPLE_W = 80;
          // Use top 55% of image height to focus on face/head
          const faceH = Math.round(img.naturalHeight * 0.55);
          const SAMPLE_H = Math.round(SAMPLE_W * (faceH / img.naturalWidth));

          const off = document.createElement("canvas");
          off.width  = SAMPLE_W;
          off.height = SAMPLE_H;
          const oc = off.getContext("2d")!;

          oc.fillStyle = "#fff";
          oc.fillRect(0, 0, SAMPLE_W, SAMPLE_H);
          // Draw only top portion of the image
          oc.drawImage(img, 0, 0, img.naturalWidth, faceH, 0, 0, SAMPLE_W, SAMPLE_H);

          const data = oc.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;

          // Collect all pixels with their luminance
          const all: { nx: number; ny: number; lum: number }[] = [];
          for (let py = 0; py < SAMPLE_H; py++) {
            for (let px2 = 0; px2 < SAMPLE_W; px2++) {
              const i = (py * SAMPLE_W + px2) * 4;
              const lum = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
              all.push({ nx: px2 / SAMPLE_W, ny: py / SAMPLE_H, lum });
            }
          }

          // Sort darkest-first — robust regardless of image exposure
          all.sort((a, b) => a.lum - b.lum);
          const chosen = all.slice(0, NUM_DOTS);

          //
          // ── Map pixel coords into the 48×48 circle canvas.
          // We render the face square-cropped and centered in the circle.
          //
          const PAD   = 3 * DPR;          // inset from circle edge
          const drawW = SIZE - PAD * 2;
          // The sampled region aspect ratio: SAMPLE_W × SAMPLE_H
          const sampledAspect = SAMPLE_H / SAMPLE_W;
          const drawH = drawW * sampledAspect;
          // Center vertically
          const offsetX = PAD;
          const offsetY = (SIZE - drawH) / 2;

          chosen.forEach((p, i) => {
            const dot = dotsRef.current[i];
            if (dot) {
              dot.tx = offsetX + p.nx * drawW;
              dot.ty = offsetY + p.ny * drawH;
            }
          });

          imageLoadedRef.current = true;
          URL.revokeObjectURL(blobUrl);
        };
        img.src = blobUrl;
      } catch (e) {
        console.error("NavAvatar: image load failed", e);
      }
    };

    loadImage();

    // ── Mouse activity listener ────────────────────────────────────────────
    // When the mouse moves anywhere on the page, we consider it "active".
    // We form the portrait while mouse is active, scatter when idle.
    const onMouseMove = () => {
      if (!imageLoadedRef.current) return;
      mouseActiveRef.current = true;
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      // After 1.5s of no movement, scatter again
      mouseTimerRef.current = setTimeout(() => {
        mouseActiveRef.current = false;
      }, 1500);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onMouseMove, { passive: true });

    // ── Draw loop ──────────────────────────────────────────────────────────
    const FORM_SPEED    = 7.0;  // how fast morphT moves toward 1 (per second)
    const SCATTER_SPEED = 2.0;  // how fast morphT moves toward 0 (per second)
    let lastT = performance.now();

    const draw = (tMs: number) => {
      const dt = Math.min((tMs - lastT) / 1000, 0.05); // seconds, capped
      lastT = tMs;
      const t = tMs / 1000;

      // Move morphT smoothly toward target
      const targetMorph = mouseActiveRef.current ? 1 : 0;
      const speed = mouseActiveRef.current ? FORM_SPEED : SCATTER_SPEED;
      morphTRef.current += (targetMorph - morphTRef.current) * speed * dt;
      morphTRef.current = Math.max(0, Math.min(1, morphTRef.current));

      const morphT = smoothstep(morphTRef.current);

      ctx.clearRect(0, 0, SIZE, SIZE);

      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Wander physics when scattered
        if (morphT < 0.98) {
          // Gentle flow-field nudge
          d.vx += (Math.sin((d.y / SIZE * 4 + t * 0.4)) * 0.06) * (1 - morphT);
          d.vy += (Math.cos((d.x / SIZE * 4 + t * 0.3)) * 0.06) * (1 - morphT);
          d.vx *= 0.95;
          d.vy *= 0.95;
          d.x  += d.vx;
          d.y  += d.vy;
          // Keep within circle bounds (soft bounce)
          const cx = SIZE / 2, cy = SIZE / 2, cr = SIZE * 0.48;
          const ddx = d.x - cx, ddy = d.y - cy;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist > cr) {
            const nx = ddx / dist, ny = ddy / dist;
            d.x = cx + nx * cr;
            d.y = cy + ny * cr;
            d.vx -= nx * 0.5;
            d.vy -= ny * 0.5;
          }
        }

        // Per-dot stagger: each dot starts moving at a slightly different morphT
        const stagger = smoothstep(Math.max(0, Math.min(1, (morphT - d.seed * 0.3) / 0.7)));

        const drawX = d.x + (d.tx - d.x) * stagger;
        const drawY = d.y + (d.ty - d.y) * stagger;

        // Subtle breathing animation when fully formed
        const breathX = stagger > 0.92 ? Math.sin(t * 1.4 + d.seed * 6.28) * 0.25 * DPR : 0;
        const breathY = stagger > 0.92 ? Math.cos(t * 1.1 + d.seed * 5.0)  * 0.25 * DPR : 0;

        const alpha  = 0.25 + stagger * 0.75;
        const radius = (0.55 + stagger * 0.55) * DPR;

        ctx.beginPath();
        ctx.arc(drawX + breathX, drawY + breathY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${alpha.toFixed(2)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      // Reduced motion: just draw once in formed state
      morphTRef.current = 0;
      draw(performance.now());
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onMouseMove);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="relative h-12 w-12 flex-shrink-0 rounded-full border border-cyan-500/40 bg-slate-900/80 shadow-[0_0_14px_rgba(6,182,212,0.25)] overflow-hidden"
      title="Move your mouse to form the portrait"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={{ width: "48px", height: "48px" }}
      />
    </div>
  );
}
