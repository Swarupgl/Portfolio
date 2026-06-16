"use client";

import Image from "next/image";
import { useId, useState } from "react";

export default function ImageCompareSlider({
  left,
  right,
  initial = 55,
}: {
  left: { src: string; alt: string };
  right: { src: string; alt: string };
  initial?: number;
}) {
  const [value, setValue] = useState(initial);
  const id = useId();

  return (
    <div className="relative h-full w-full select-none">
      <div className="absolute inset-0">
        <Image
          src={left.src}
          alt={left.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80vw, 260px"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        <Image
          src={right.src}
          alt={right.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80vw, 260px"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${value}%` }}
      >
        <div className="h-full w-px bg-white/50" />
        <div className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/60 backdrop-blur">
          <div className="h-3 w-3 rounded-sm border border-white/30" />
        </div>
      </div>

      <label className="absolute inset-x-3 bottom-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-2 backdrop-blur">
        <span className="sr-only">{`Compare images ${id}`}</span>
        <input
          aria-label="Compare slider"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-slate-200"
        />
      </label>
    </div>
  );
}
