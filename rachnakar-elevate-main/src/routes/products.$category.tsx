import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CATEGORIES, findCategory, type Product } from "@/lib/catalogue";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/products/$category")({
  head: ({ params }) => {
    const c = findCategory(params.category);
    const title = c ? `${c.name} — Rachnakar Design Studio` : "Category — Rachnakar";
    const desc = c
      ? `${c.tagline}. Browse ${c.products.length} premium CNC-ready designs in the ${c.name} collection.`
      : "CNC catalogue category.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
      links: [{ rel: "canonical", href: `/products/${params.category}` }],
    };
  },
  loader: ({ params }) => {
    const c = findCategory(params.category);
    if (!c) throw notFound();
    return { category: c };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.querySelectorAll(":scope > *");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 70, scale: 0.9, filter: "blur(14px)", rotateX: 12 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        rotateX: 0,
        duration: 1.0,
        ease: "expo.out",
        stagger: { each: 0.05, from: "start" },
      },
    );
  }, [category.slug]);

  return (
    <>
      <section className="container-page pt-32 pb-16">
        <nav className="text-xs uppercase tracking-[0.22em] text-cream/55 mb-8">
          <Link to="/" className="hover:text-copper-light">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-copper-light">
            Catalogue
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream/80">{category.name}</span>
        </nav>

        <span className="text-[0.7rem] uppercase tracking-[0.42em] text-copper-light/80">
          Collection
        </span>
        <h1 className="mt-4 font-display text-balance text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] text-cream max-w-4xl">
          {category.name}
        </h1>
        <p className="mt-5 max-w-2xl text-cream/70 text-lg">{category.tagline}.</p>
      </section>

      <section className="container-page pb-32">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {category.products.map((product: Product) => (
            <ProductCard key={product.slug} category={category} product={product} />
          ))}
        </div>
      </section>

      <section className="container-page pb-32 border-t border-border/40 pt-20">
        <h2 className="font-display text-3xl text-cream mb-8">Explore other collections</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              to="/products/$category"
              params={{ category: c.slug }}
              className="text-xs px-4 py-2 rounded-full border border-border/70 text-cream/75 hover:border-copper-light hover:text-copper-light transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
