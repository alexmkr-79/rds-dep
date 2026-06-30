import { useEffect, useRef } from "react";
import heroVideoSrc from "@/assets/cnc-hero.mp4";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={ref}
        src={heroVideoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.014_50)/0.55] via-[oklch(0.10_0.014_50)/0.35] to-[oklch(0.10_0.014_50)/0.85]" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
      />
    </div>
  );
}
