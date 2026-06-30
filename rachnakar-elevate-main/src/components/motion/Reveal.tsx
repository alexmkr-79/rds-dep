import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Variant =
  | "fade-up" | "fade-down" | "fade-left" | "fade-right"
  | "scale" | "blur" | "mask" | "clip" | "perspective";

type RevealProps = {
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
  className?: string;
  children: ReactNode;
};

const TO: Record<Variant, gsap.TweenVars> = {
  "fade-up":     { opacity: 1, y: 0 },
  "fade-down":   { opacity: 1, y: 0 },
  "fade-left":   { opacity: 1, x: 0 },
  "fade-right":  { opacity: 1, x: 0 },
  "scale":       { opacity: 1, scale: 1 },
  "blur":        { opacity: 1, filter: "blur(0px)" },
  "mask":        { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  "clip":        { clipPath: "inset(0 0% 0 0)" },
  "perspective": { opacity: 1, rotateX: 0, y: 0 },
};

export function Reveal({
  as: Tag = "div",
  variant = "fade-up",
  delay = 0,
  duration = 1.0,
  stagger,
  start = "top 82%",
  once = true,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const targets: Element[] =
      typeof stagger === "number"
        ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"))
        : [el];

    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        ...TO[variant],
        duration,
        delay,
        ease: "expo.out",
        stagger: typeof stagger === "number" ? stagger : undefined,
        scrollTrigger: { trigger: el, start, toggleActions: once ? "play none none none" : "play reverse play reverse" },
      });
    }, ref);
    return () => ctx.revert();
  }, [variant, delay, duration, stagger, start, once]);

  const dataAttrs =
    typeof stagger === "number"
      ? {}
      : { "data-reveal": variant };

  return (
    <Tag ref={ref as never} className={className} {...dataAttrs}>
      {children}
    </Tag>
  );
}

/**
 * Helper for stagger children — pair with <Reveal stagger={0.08}>.
 */
export function RevealItem({
  as: Tag = "div",
  variant = "fade-up",
  className,
  children,
}: {
  as?: ElementType;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-reveal-item data-reveal={variant} className={className}>
      {children}
    </Tag>
  );
}