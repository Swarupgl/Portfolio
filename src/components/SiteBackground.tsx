"use client";

import HybridInteractiveBackground from "@/components/HybridInteractiveBackground";

export default function SiteBackground() {
  return (
    <div className="bg-dynamic pointer-events-none fixed inset-0 z-0">
      <HybridInteractiveBackground />
    </div>
  );
}
