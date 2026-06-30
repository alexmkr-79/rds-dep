import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/rachnakar-logo.png.asset.json";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

function Icon({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60 bg-[oklch(0.10_0.014_50)]">
      <div className="hairline absolute inset-x-0 top-0" />
      <Reveal
        stagger={0.08}
        className="container-page py-16 grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
      >
        <RevealItem variant="fade-up">
          <Link to="/" className="flex items-center gap-3">

            <img src={logoAsset.url} alt="Rachnakar Design Studio logo" className="h-14 w-auto" />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl text-cream">Rachnakar Design Studio</span>
              <span className="text-[0.65rem] tracking-[0.32em] uppercase text-copper-light/80">
                Carving · Cutting · Engraving
              </span>
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm text-cream/65 leading-relaxed">
            Premium CNC design studio in Baner, Pune. Heritage carving meets modern precision.
          </p>
        </RevealItem>

        <RevealItem variant="fade-up">
          <FooterColumn
            title="Navigate"
            links={[
              { label: "Home", to: "/" },
              { label: "About", to: "/", hash: "about" },
              { label: "Products", to: "/products" },
              { label: "Services", to: "/", hash: "services" },
              { label: "Contact", to: "/", hash: "contact" },
            ]}
          />
        </RevealItem>
        <RevealItem variant="fade-up">
          <FooterColumn
            title="Legal"
            links={[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
            ]}
          />
        </RevealItem>

        <RevealItem variant="fade-up">
          <h4 className="font-display text-cream/90 text-sm tracking-[0.28em] uppercase mb-5">
            Connect
          </h4>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="h-10 w-10 grid place-items-center rounded-full border border-border/70 text-cream/80 hover:text-copper-light hover:border-copper hover:-translate-y-0.5 transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: s.svg }}
              />
            ))}
          </div>
          <p className="mt-6 text-xs text-cream/55">+91 92844 00646 · hello@rachnakar.studio</p>
        </RevealItem>
      </Reveal>

      <div className="container-page pb-10">
        <div className="hairline mb-6" />
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-[0.7rem] tracking-[0.18em] uppercase text-cream/55">
          <span>© {new Date().getFullYear()} Rachnakar Design Studio™. All rights reserved.</span>
          <span>Rachnakar Design Studio™ is a trademark in India.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string; hash?: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-cream/90 text-sm tracking-[0.28em] uppercase mb-5">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              hash={l.hash}
              className="text-cream/70 hover:text-copper-light transition-colors story-link"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SVG = (inner: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    svg: SVG(
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>',
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/",
    svg: SVG('<path d="M17 2h-3a4 4 0 0 0-4 4v3H7v4h3v9h4v-9h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/>'),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    svg: SVG(
      '<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>',
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/",
    svg: SVG('<path d="M15 3v9a4 4 0 1 1-4-4"/><path d="M15 3a5 5 0 0 0 5 5"/>'),
  },
  {
    label: "Google Maps",
    href: "https://maps.google.com/?q=Rachnakar+Design+Studio+Baner+Pune",
    svg: SVG(
      '<path d="M12 22s-7-7.58-7-12a7 7 0 0 1 14 0c0 4.42-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    ),
  },
];
