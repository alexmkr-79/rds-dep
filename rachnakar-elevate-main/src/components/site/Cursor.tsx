import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    document.body.classList.add("has-custom-cursor");
    const xDot = gsap.quickTo(dot.current!, "x", { duration: 0.12, ease: "power3.out" });
    const yDot = gsap.quickTo(dot.current!, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring.current!, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring.current!, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      const hot = t.closest("a, button, [role=button], input, textarea, select, [data-cursor=hot]");
      gsap.to(ring.current, { scale: hot ? 1.7 : 1, opacity: hot ? 0.95 : 0.6, duration: 0.3 });
      gsap.to(dot.current, { scale: hot ? 0.4 : 1, duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
    };
    const onEnter = () => {
      gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[300] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-copper-light/70 mix-blend-screen"
        style={{ boxShadow: "0 0 24px oklch(0.80 0.075 70 / 0.35)", opacity: 0 }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[300] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-light"
        style={{ boxShadow: "0 0 12px var(--copper)", opacity: 0 }}
      />
    </>
  );
}