import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/catalogue";
import { whatsappUrl } from "@/lib/whatsapp";

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="group relative h-11 w-11 rounded-full border border-border/70 bg-background/40 backdrop-blur grid place-items-center hover:border-copper transition-colors"
    >
      <span className="sr-only">Open menu</span>
      <span className="flex flex-col items-end gap-[5px]">
        <span className="block h-px w-5 bg-cream transition-all duration-300 group-hover:w-6" />
        <span className="block h-px w-3 bg-copper-light transition-all duration-300 group-hover:w-6" />
      </span>
    </button>
  );
}

type Props = { open: boolean; onClose: () => void };

const PRIMARY = [
  { label: "Home", to: "/", hash: undefined as string | undefined },
  { label: "Products", to: "/products", hash: undefined },
  { label: "Services", to: "/", hash: "services" },
  { label: "Our Work", to: "/", hash: "work" },
  { label: "About", to: "/", hash: "about" },
  { label: "Contact", to: "/", hash: "contact" },
];

export function FullscreenMenu({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.set(root.current, { display: "block", autoAlpha: 0 });
      gsap.set(panel.current, { clipPath: "inset(0% 0% 100% 0%)" });
      const items = itemsRef.current?.querySelectorAll("[data-menu-item]") ?? [];
      gsap.set(items, { y: 40, opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(root.current, { autoAlpha: 1, duration: 0.25 })
        .to(panel.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.out" }, "<")
        .to(items, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, "-=0.45");
    }, root);
    return () => ctx.revert();
  }, [open]);

  const handleClose = () => {
    if (!root.current) return onClose();
    const items = itemsRef.current?.querySelectorAll("[data-menu-item]") ?? [];
    gsap
      .timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(root.current, { display: "none" });
          onClose();
        },
      })
      .to(items, { y: 20, opacity: 0, duration: 0.35, stagger: 0.03 })
      .to(
        panel.current,
        { clipPath: "inset(100% 0% 0% 0%)", duration: 0.7, ease: "expo.in" },
        "-=0.2",
      )
      .to(root.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
  };

  return (
    <div
      ref={root}
      style={{ display: "none" }}
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={panel}
        className="absolute inset-0 bg-[oklch(0.10_0.014_50)/0.92] backdrop-blur-2xl"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="container-page flex h-16 sm:h-20 items-center justify-between">
          <span className="font-display text-cream/80 tracking-wide">Menu</span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close menu"
            className="h-11 w-11 rounded-full border border-border/70 grid place-items-center hover:border-copper transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" className="text-cream">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <div
          ref={itemsRef}
          className="container-page grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 pt-8 pb-16 h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <nav className="flex flex-col gap-2 sm:gap-3">
            {PRIMARY.map((n) => (
              <div data-menu-item key={n.label} className="overflow-hidden">
                <Link
                  to={n.to}
                  hash={n.hash}
                  onClick={handleClose}
                  className="font-display text-cream hover:text-copper-light transition-colors text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] tracking-tight"
                >
                  {n.label}
                </Link>
              </div>
            ))}
            <div data-menu-item className="mt-6">
              <a
                href={whatsappUrl("Hello Rachnakar Design Studio, I'd like to discuss a project.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-copper-light hover:text-cream transition-colors"
              >
                <span className="hairline w-10" /> WhatsApp the studio
              </a>
            </div>
          </nav>

          <aside className="border-l border-border/40 lg:pl-12">
            <div
              data-menu-item
              className="text-[0.65rem] uppercase tracking-[0.3em] text-copper-light/70 mb-6"
            >
              Catalogue
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li data-menu-item key={c.slug} className="overflow-hidden">
                  <Link
                    to="/products/$category"
                    params={{ category: c.slug }}
                    onClick={handleClose}
                    className="block py-1.5 text-cream/80 hover:text-copper-light transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
