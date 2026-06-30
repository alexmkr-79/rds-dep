import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;

    const xTo = gsap.quickTo(target, "x", { duration: 0.5, ease: "expo.out" });
    const yTo = gsap.quickTo(target, "y", { duration: 0.5, ease: "expo.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      xTo(x * strength);
      yTo(y * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} data-magnetic className={className}>
      {children}
    </span>
  );
}
