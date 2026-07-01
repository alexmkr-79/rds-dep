import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import logoAssetSrc from "@/assets/RACHNAKAR LOGO-2.png";

// Devanagari clusters (e.g. क + ा) must stay together. JS string split("")
// breaks code units, separating vowel signs from their consonant. Use
// Intl.Segmenter for proper grapheme clusters with a code-point fallback.
function splitGraphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
  if (Seg) {
    const seg = new Seg("hi", { granularity: "grapheme" });
    return Array.from(seg.segment(s), (x) => x.segment);
  }
  return Array.from(s);
}

/**
 * Cinematic intro:
 *  1. Black/gradient veil
 *  2. Logo scales 0 → 1 with glow + subtle rotate
 *  3. Logo morphs (FLIP) into the header logo position
 *  4. Nav + hero fade in, video starts; veil dissolves
 *
 * Plays on every hard load (no session lock — request from user).
 */

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const tagline = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useIso(() => {
    if (!active) return;
    document.body.classList.add("rk-logo-cloak");
    document.body.style.overflow = "hidden";
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      document.body.classList.remove("rk-logo-cloak");
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("rk:intro-done"));
      setActive(false);
    };

    if (reduce) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const chars = word.current?.querySelectorAll<HTMLElement>("[data-char]") ?? [];
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
        onComplete: finish,
      });

      tl.set(logo.current, { scale: 0.15, opacity: 0, rotate: -14, filter: "blur(20px)" })
        .set(ring.current, { scale: 0.3, opacity: 0, rotate: -45 })
        .set(chars, { yPercent: 110, opacity: 0 })
        .set(tagline.current, { opacity: 0, y: 14, letterSpacing: "0.6em" })
        // Ring carves first — like a CNC bit tracing
        .to(ring.current, {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.0,
          ease: "expo.out",
        })
        // Logo lifts in
        .to(
          logo.current,
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            filter: "blur(0px)",
            duration: 1.0,
            ease: "expo.out",
          },
          "-=0.7",
        )
        .to(
          logo.current,
          {
            boxShadow: "0 0 90px oklch(0.80 0.075 70 / 0.55)",
            duration: 0.45,
          },
          "<+0.2",
        )
        // Devanagari word reveals char-by-char
        .to(
          chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.06,
          },
          "-=0.55",
        )
        // Tagline tracking-in
        .to(
          tagline.current,
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.42em",
            duration: 0.9,
            ease: "expo.out",
          },
          "-=0.5",
        )
        .to({}, { duration: 0.5 })
        .add(() => {
          // FLIP morph into header logo
          const target = document.querySelector<HTMLElement>("[data-header-logo]");
          const src = logo.current;
          if (!target || !src) return;

          const from = src.getBoundingClientRect();
          const to = target.getBoundingClientRect();
          const sx = to.width / from.width;
          const sy = to.height / from.height;
          const dx = to.left + to.width / 2 - (from.left + from.width / 2);
          const dy = to.top + to.height / 2 - (from.top + from.height / 2);

          gsap.to(src, {
            x: dx,
            y: dy,
            scaleX: sx,
            scaleY: sy,
            boxShadow: "0 0 0 oklch(0.80 0.075 70 / 0)",
            duration: 1.0,
            ease: "expo.inOut",
          });
          // Word + ring + tagline fade out as logo morphs
          gsap.to([word.current, ring.current, tagline.current], {
            opacity: 0,
            y: -14,
            filter: "blur(8px)",
            duration: 0.55,
            ease: "power2.in",
          });
          gsap.to(veil.current, {
            autoAlpha: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.45,
          });
          // Reveal the real header logo as the morph completes
          gsap.to(target, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.85,
            onStart: () => document.body.classList.remove("rk-logo-cloak"),
          });
        })
        .to({}, { duration: 1.2 });
    }, root);
    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      document.body.classList.remove("rk-logo-cloak");
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
      aria-hidden
    >
      <div
        ref={veil}
        className="absolute inset-0 bg-[oklch(0.08_0.012_50)]"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      />
      {/* Carving ring — animated CNC bit trace */}
      <div
        ref={ring}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.80 0.075 70 / 0.4) 90deg, oklch(0.62 0.085 55 / 0.6) 180deg, oklch(0.80 0.075 70 / 0.4) 270deg, transparent 360deg)",
          WebkitMask:
            "radial-gradient(circle, transparent 58%, #000 60%, #000 62%, transparent 64%)",
          mask: "radial-gradient(circle, transparent 58%, #000 60%, #000 62%, transparent 64%)",
          filter: "blur(0.5px)",
        }}
      />
      <img
        ref={logo}
        src={logoAssetSrc}
        alt="Rachnakar Design Studio logo"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-52 select-none rounded-2xl"
        draggable={false}
        style={{ transformOrigin: "center center" }}
      />
      {/* Devanagari title with per-char reveal */}
      <div className="absolute left-1/2 top-[calc(50%+150px)] sm:top-[calc(50%+190px)] -translate-x-1/2 text-center">
        <div
          ref={word}
          className="font-devnag text-copper-light text-5xl sm:text-6xl leading-none flex overflow-hidden"
        >
          {splitGraphemes("रचनाकार").map((c, i) => (
            <span key={i} data-char className="inline-block" style={{ willChange: "transform" }}>
              {c}
            </span>
          ))}
        </div>
        <div
          ref={tagline}
          className="mt-4 text-[0.6rem] sm:text-xs uppercase text-cream/70 tracking-[0.42em]"
        >
          Design Studio · Pune
        </div>
      </div>
    </div>
  );
}
