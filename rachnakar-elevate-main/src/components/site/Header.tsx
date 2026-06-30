import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/rachnakar-logo.png.asset.json";
import { MenuButton } from "./Menu";

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group min-w-0" aria-label="Rachnakar Design Studio — Home">
          <img
            data-header-logo
            src={logoAsset.url}
            alt=""
            className="h-10 sm:h-12 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
          <span className="hidden sm:flex flex-col leading-tight truncate">
            <span className="font-display text-base sm:text-lg tracking-wide text-cream truncate">Rachnakar</span>
            <span className="text-[0.6rem] uppercase tracking-[0.32em] text-copper-light/80">Design Studio</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              hash={n.hash}
              className="relative font-display tracking-wide text-cream/85 hover:text-copper-light transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:scale-x-0 after:origin-right after:bg-copper-light after:transition-transform after:duration-500 hover:after:scale-x-100 hover:after:origin-left"
              activeProps={{ className: "text-copper-light" }}
              activeOptions={{ exact: n.to === "/" && !n.hash }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <MenuButton onClick={onOpenMenu} />
      </div>
    </header>
  );
}

export const NAV = [
  { label: "Home", to: "/", hash: undefined as string | undefined },
  { label: "Products", to: "/products", hash: undefined },
  { label: "Services", to: "/", hash: "services" },
  { label: "About", to: "/", hash: "about" },
  { label: "Contact", to: "/", hash: "contact" },
];