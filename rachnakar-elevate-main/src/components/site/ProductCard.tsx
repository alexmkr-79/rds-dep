import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Category, Product } from "@/lib/catalogue";
import { productBuyUrl, siteUrl } from "@/lib/whatsapp";
import { categoryImage } from "@/lib/category-images";

gsap.registerPlugin(ScrollTrigger);

export function ProductCard({ category, product }: { category: Category; product: Product }) {
  const href = `/products/${category.slug}/${product.slug}`;
  const buy = productBuyUrl({
    productName: product.name,
    categoryName: category.name,
    productId: product.productId,
    url: siteUrl(href),
    isCustom: product.isCustom,
  });
  const ref = useRef<HTMLElement>(null);
  const qxRef = useRef<((v: number) => void) | null>(null);
  const qyRef = useRef<((v: number) => void) | null>(null);
  const qzRef = useRef<((v: number) => void) | null>(null);
  const imgWrapRef = useRef<HTMLAnchorElement>(null);
  const img = categoryImage(category.slug);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    qxRef.current = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "expo.out" });
    qyRef.current = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "expo.out" });
    qzRef.current = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
  }, []);

  // Cinematic unveiling: cover panel slides up, image scales/blurs in.
  useEffect(() => {
    const root = imgWrapRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const cover = root.querySelector<HTMLElement>("[data-pc-cover]");
    const image = root.querySelector<HTMLElement>("[data-pc-img]");
    if (!cover || !image) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 88%", once: true },
        defaults: { ease: "expo.out" },
      });
      tl.fromTo(cover, { yPercent: 0 }, { yPercent: -101, duration: 1.2 }).fromTo(
        image,
        { scale: 1.35, filter: "blur(10px)" },
        { scale: 1, filter: "blur(0px)", duration: 1.4 },
        "<",
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    qyRef.current?.((0.5 - py) * 10);
    qxRef.current?.((px - 0.5) * 12);
    qzRef.current?.(-6);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => {
    qxRef.current?.(0);
    qyRef.current?.(0);
    qzRef.current?.(0);
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: 1100 }}
      className="rk-tilt group relative flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden hover:shadow-[var(--shadow-copper)] hover:border-copper/60"
    >
      <Link
        ref={imgWrapRef}
        to="/products/$category/$product"
        params={{ category: category.slug, product: product.slug }}
        className="block aspect-[4/3] overflow-hidden bg-walnut relative"
      >
        {img && !product.isCustom ? (
          <img
            data-pc-img
            src={img}
            alt={product.name}
            loading="lazy"
            width={1280}
            height={960}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
            style={{ willChange: "transform, filter" }}
          />
        ) : (
          <div
            data-pc-img
            className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            style={{
              background: product.isCustom
                ? "linear-gradient(135deg, oklch(0.22 0.022 50), oklch(0.30 0.04 55))"
                : "linear-gradient(135deg, oklch(0.30 0.04 55), oklch(0.18 0.022 50))",
            }}
          >
            <div className="h-full w-full grid place-items-center text-copper-light/40 font-display text-7xl">
              {product.isCustom ? "✦" : product.name.slice(0, 1)}
            </div>
          </div>
        )}
        {/* Sliding cover veil — luxurious unveiling */}
        <span
          aria-hidden
          data-pc-cover
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.62 0.085 55) 0%, oklch(0.15 0.018 50) 100%)",
          }}
        />
        {/* dark gradient for label legibility */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-walnut-deep/40 via-transparent to-transparent"
        />
        {/* shine sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-1/2 -top-1/2 h-[200%] w-[60%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[260%] transition-all duration-[1100ms] ease-out"
        />
      </Link>

      <div className="rk-tilt-inner flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug text-cream">
            <Link
              to="/products/$category/$product"
              params={{ category: category.slug, product: product.slug }}
              className="hover:text-copper-light transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.22em] text-copper-light/70 border border-border/70 rounded-full px-2 py-0.5">
            {product.difficulty}
          </span>
        </div>
        <p className="mt-2 text-sm text-cream/65 line-clamp-2">{product.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.formats.map((f) => (
            <span
              key={f}
              className="text-[0.65rem] uppercase tracking-wider text-cream/60 px-1.5 py-0.5 border border-border/60 rounded"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Link
            to="/products/$category/$product"
            params={{ category: category.slug, product: product.slug }}
            className="flex-1 text-center text-sm py-2.5 rounded-full border border-border/70 hover:border-copper-light hover:text-copper-light transition-colors"
          >
            Preview
          </Link>
          <a
            href={buy}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm py-2.5 rounded-full bg-copper text-walnut-deep font-medium hover:bg-copper-light transition-colors"
          >
            {product.isCustom ? "Send Your Design" : "Buy Now"}
          </a>
        </div>
      </div>
    </article>
  );
}
