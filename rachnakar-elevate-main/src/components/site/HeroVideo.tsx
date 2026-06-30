import { useEffect, useRef, useState } from "react";
import heroVideo from "@/assets/cnc-hero.mp4.asset.json";
import heroFallback from "@/assets/cnc-hero.jpg";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {!failed && (
        <video
          ref={ref}
          src={heroVideo.url}
          poster={heroFallback}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {failed && (
        <img
          src={heroFallback}
          alt="Rachnakar Design Studio CNC carved artwork"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.014_50)/0.55] via-[oklch(0.10_0.014_50)/0.35] to-[oklch(0.10_0.014_50)/0.85]" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
      />
    </div>
  );
}
