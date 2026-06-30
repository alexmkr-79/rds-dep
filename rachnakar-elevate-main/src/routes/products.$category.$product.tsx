import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findProduct, type Product } from "@/lib/catalogue";
import { productBuyUrl, siteUrl } from "@/lib/whatsapp";
import { categoryImage } from "@/lib/category-images";

export const Route = createFileRoute("/products/$category/$product")({
  head: ({ params }) => {
    const found = findProduct(params.category, params.product);
    if (!found) {
      return { meta: [{ title: "Design not found — Rachnakar" }] };
    }
    const title = `${found.product.name} — ${found.category.name} | Rachnakar`;
    return {
      meta: [
        { title },
        { name: "description", content: found.product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: found.product.description },
      ],
      links: [{ rel: "canonical", href: `/products/${params.category}/${params.product}` }],
    };
  },
  loader: ({ params }) => {
    const found = findProduct(params.category, params.product);
    if (!found) throw notFound();
    return found;
  },
  component: ProductPage,
});

function ProductPage() {
  const { category, product } = Route.useLoaderData();
  const buy = productBuyUrl({
    productName: product.name,
    categoryName: category.name,
    productId: product.productId,
    url: siteUrl(`/products/${category.slug}/${product.slug}`),
    isCustom: product.isCustom,
  });

  const related = category.products.filter((p: Product) => p.slug !== product.slug).slice(0, 4);
  const img = categoryImage(category.slug);

  return (
    <>
      <section className="container-page pt-32 pb-16">
        <nav className="text-xs uppercase tracking-[0.22em] text-cream/55 mb-8">
          <Link to="/" className="hover:text-copper-light">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-copper-light">Catalogue</Link>
          <span className="mx-2">/</span>
          <Link to="/products/$category" params={{ category: category.slug }} className="hover:text-copper-light">
            {category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream/80">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="grid gap-4">
            <div
              className="relative aspect-[4/3] rounded-3xl border border-border/60 overflow-hidden grid place-items-center bg-walnut"
              style={
                img && !product.isCustom
                  ? undefined
                  : {
                      background: product.isCustom
                        ? "linear-gradient(135deg, oklch(0.22 0.022 50), oklch(0.30 0.04 55))"
                        : "linear-gradient(135deg, oklch(0.30 0.04 55), oklch(0.18 0.022 50))",
                    }
              }
            >
              {img && !product.isCustom ? (
                <img
                  src={img}
                  alt={product.name}
                  width={1280}
                  height={960}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-copper-light/40 text-[12rem] leading-none">
                  {product.isCustom ? "✦" : product.name.slice(0, 1)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl border border-border/60 bg-card/40 grid place-items-center text-copper-light/30 font-display text-3xl"
                >
                  0{i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:sticky lg:top-28 self-start">
            <span className="text-[0.65rem] uppercase tracking-[0.32em] text-copper-light/80">
              {category.name}
            </span>
            <h1 className="mt-3 font-display text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-cream">
              {product.name}
            </h1>
            <p className="mt-5 text-cream/75 leading-relaxed">{product.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40 text-sm">
              <Spec label="Product ID" value={product.productId} />
              <Spec label="Difficulty" value={product.difficulty} />
              <Spec label="Formats" value={product.formats.join(" · ")} />
              <Spec label="Material" value={product.material ?? "All CNC-compatible woods"} />
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buy}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-copper text-walnut-deep px-7 py-3.5 font-medium hover:bg-copper-light transition-colors"
              >
                {product.isCustom ? "Send Your Design" : "Buy Now on WhatsApp"}
                <span aria-hidden>→</span>
              </a>
              <Link
                to="/products/$category"
                params={{ category: category.slug }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-7 py-3.5 text-cream/85 hover:border-copper-light hover:text-copper-light transition-colors"
              >
                Back to {category.name}
              </Link>
            </div>

            <ul className="mt-10 grid gap-2 text-sm text-cream/70">
              {[
                "Production-ready file — open and route",
                "Tuned for V-bit, ball-nose & flat end mills",
                "Hand-finished detailing where it matters",
                "Free file revision within scope",
              ].map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="text-copper-light">◆</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page pb-32 border-t border-border/40 pt-20">
        <h2 className="font-display text-3xl text-cream mb-8">More in {category.name}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((p: Product) => (
            <Link
              key={p.slug}
              to="/products/$category/$product"
              params={{ category: category.slug, product: p.slug }}
              className="group rounded-2xl border border-border/60 bg-card/40 overflow-hidden hover:border-copper/60 transition-colors"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden bg-walnut"
              >
                {img && !p.isCustom ? (
                  <img
                    src={img}
                    alt={p.name}
                    loading="lazy"
                    width={1280}
                    height={960}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full grid place-items-center text-copper-light/30 font-display text-5xl"
                    style={{ background: "linear-gradient(135deg, oklch(0.28 0.035 55), oklch(0.18 0.022 50))" }}
                  >
                    {p.isCustom ? "✦" : p.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="font-display text-cream group-hover:text-copper-light transition-colors">
                  {p.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/60 p-4">
      <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-copper-light/70">{label}</dt>
      <dd className="mt-1 text-cream">{value}</dd>
    </div>
  );
}
