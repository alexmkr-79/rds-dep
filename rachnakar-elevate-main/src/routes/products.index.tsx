import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CATEGORIES, allProducts } from "@/lib/catalogue";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Catalogue — Rachnakar Design Studio" },
      {
        name: "description",
        content:
          "Browse 15 CNC design categories — doors, temples, jali screens, headboards, wall panels and more. 200+ CNC-ready files.",
      },
      { property: "og:title", content: "CNC Design Catalogue — Rachnakar" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsIndex,
});

function ProductsIndex() {
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const items = useMemo(() => {
    const all = allProducts();
    const needle = q.trim().toLowerCase();
    return all.filter(({ category, product }) => {
      if (activeCat !== "all" && category.slug !== activeCat) return false;
      if (onlyFeatured && !product.featured) return false;
      if (!needle) return true;
      return (
        product.name.toLowerCase().includes(needle) ||
        category.name.toLowerCase().includes(needle) ||
        product.tags?.some((t) => t.includes(needle))
      );
    });
  }, [q, activeCat, onlyFeatured]);

  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.querySelectorAll(":scope > *");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.92, filter: "blur(12px)", rotateX: 10 },
      {
        opacity: 1, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0,
        duration: 0.95,
        ease: "expo.out",
        stagger: { each: 0.045, from: "start", grid: "auto" },
        overwrite: true,
      }
    );
    // Subtle floating bob — each card on its own phase
    const floats: gsap.core.Tween[] = [];
    cards.forEach((c, i) => {
      floats.push(
        gsap.to(c, {
          y: "+=6",
          duration: 3 + (i % 4) * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: (i % 5) * 0.2,
        })
      );
    });
    return () => { floats.forEach((t) => t.kill()); };
  }, [activeCat, q, onlyFeatured]);

  return (
    <>
      <Reveal as="section" variant="fade-up" className="container-page pt-32 pb-12">
        <span className="text-[0.7rem] uppercase tracking-[0.42em] text-copper-light/80">Catalogue</span>
        <h1 className="mt-4 font-display text-balance text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-cream max-w-4xl">
          200+ CNC-ready designs across 15 categories.
        </h1>
        <p className="mt-6 max-w-2xl text-cream/70 text-lg leading-relaxed">
          Every design ships in RLF, STL and DXF formats — production-ready for your CNC. Tap any card to
          preview, or send your own reference to commission a custom file.
        </p>
      </Reveal>

      <section className="container-page pb-16">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between border-t border-b border-border/60 py-5">
          <div className="relative flex-1 max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search designs, categories, motifs..."
              className="w-full bg-transparent border border-border/70 rounded-full px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-copper-light transition-colors"
            />
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cream/70 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
              className="accent-copper"
            />
            Featured only
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Chip active={activeCat === "all"} onClick={() => setActiveCat("all")}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.slug} active={activeCat === c.slug} onClick={() => setActiveCat(c.slug)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </section>

      <section className="container-page pb-32">
        <div className="text-xs uppercase tracking-[0.22em] text-cream/55 mb-6">
          {items.length} design{items.length === 1 ? "" : "s"}
        </div>
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map(({ category, product }) => (
            <ProductCard key={`${category.slug}-${product.slug}`} category={category} product={product} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-cream/60 py-20">No designs match your filters.</p>
        )}
      </section>

      <section className="container-page pb-32">
        <div className="rounded-3xl border border-border/60 bg-card/40 p-10 sm:p-14 text-center">
          <h3 className="font-display text-3xl sm:text-4xl text-cream">Don't see what you need?</h3>
          <p className="mt-3 text-cream/70 max-w-xl mx-auto">
            Send us a reference image, sketch or CAD file — we'll convert it into a production-ready CNC design.
          </p>
          <Link
            to="/products/$category/$product"
            params={{ category: "main-single-doors", product: "custom-design" }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-copper text-walnut-deep px-7 py-3.5 font-medium hover:bg-copper-light transition-colors"
          >
            Start a custom project →
          </Link>
        </div>
      </section>
    </>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-4 py-2 rounded-full border transition-colors ${
        active
          ? "bg-copper text-walnut-deep border-copper"
          : "border-border/70 text-cream/75 hover:border-copper-light hover:text-copper-light"
      }`}
    >
      {children}
    </button>
  );
}