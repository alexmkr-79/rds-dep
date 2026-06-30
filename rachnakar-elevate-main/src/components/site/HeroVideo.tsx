import { useEffect, useRef } from "react";

const heroVideoSrc =
  "/__l5e/assets-v1/0666484b-d937-43e0-bc23-7d52294e6fb1/cnc-hero.mp4";

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
        preload="metadata"
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
