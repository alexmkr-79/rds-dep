import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroVideo } from "@/components/site/HeroVideo";
import { CATEGORIES } from "@/lib/catalogue";
import { whatsappUrl } from "@/lib/whatsapp";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import workTemple from "@/assets/work-temple.jpg";
import workDoor from "@/assets/work-door.jpg";
import workPanel from "@/assets/work-panel.jpg";
import workSign from "@/assets/work-sign.jpg";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rachnakar Design Studio — Premium CNC Design Studio, Pune" },
      {
        name: "description",
        content:
          "Heritage carving meets modern precision. CNC-ready doors, temples, jali panels, furniture & wall art — crafted in Baner, Pune.",
      },
      { property: "og:title", content: "Rachnakar Design Studio" },
      { property: "og:description", content: "Premium CNC design — carving, cutting, engraving." },
      { property: "og:url", content: "https://rachnakar.studio/" },
    ],
    links: [{ rel: "canonical", href: "https://rachnakar.studio/" }],
  }),
  component: Home,
});

const services = [
  {
    title: "CNC Routing & Cutting",
    desc: "Precision cuts on wood, MDF, plywood and acrylic — repeatable to the millimetre.",
  },
  {
    title: "3D Carving & Engraving",
    desc: "Sculptural relief work, bas-reliefs, name plates and bespoke wall art.",
  },
  {
    title: "Temple & Jali Design",
    desc: "Devotional mandirs and intricate jali screens with traditional motifs.",
  },
  {
    title: "Custom Furniture Panels",
    desc: "Designer doors, wardrobe shutters, partitions and feature wall panels.",
  },
];

const works = [
  { src: workTemple, title: "Carved Mandir", tag: "Temple" },
  { src: workDoor, title: "Heritage Door", tag: "Door" },
  { src: workPanel, title: "Backlit Mandala Panel", tag: "Wall art" },
  { src: workSign, title: "Engraved Name Plate", tag: "Signage" },
];

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = heroRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const devnag = root.querySelector("[data-hero-devnag]");
      const title = root.querySelectorAll("[data-hero-line]");
      const para = root.querySelector("[data-hero-para]");
      const ctas = root.querySelectorAll("[data-hero-cta]");
      gsap.set([eyebrow, devnag, ...title, para, ...ctas], { opacity: 0, y: 32 });

      const begin = () => {
        if (reduce) {
          gsap.set([eyebrow, devnag, ...title, para, ...ctas], { opacity: 1, y: 0 });
          return;
        }
        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.0 } });
        tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6 })
          .to(devnag, { opacity: 1, y: 0, duration: 1.1 }, "-=0.3")
          .to(title, { opacity: 1, y: 0, stagger: 0.08 }, "-=0.7")
          .to(para, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
          .to(ctas, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 }, "-=0.5");
      };

      // Wait for intro handoff before revealing hero
      const onDone = () => begin();
      window.addEventListener("rk:intro-done", onDone, { once: true });
      // Fallback in case the intro was skipped (reduced motion / already done)
      const fallback = setTimeout(begin, 3500);

      // Hero parallax on scroll
      const video = root.querySelector("video, img");
      if (video && !reduce) {
        gsap.to(video, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // Mouse parallax (desktop only)
      if (window.matchMedia("(pointer: fine)").matches && !reduce) {
        const layers = root.querySelectorAll<HTMLElement>("[data-parallax]");
        const onMove = (e: PointerEvent) => {
          const cx = window.innerWidth / 2,
            cy = window.innerHeight / 2;
          const nx = (e.clientX - cx) / cx;
          const ny = (e.clientY - cy) / cy;
          layers.forEach((l) => {
            const d = Number(l.dataset.parallax) || 12;
            gsap.to(l, { x: nx * d, y: ny * d, duration: 0.8, ease: "expo.out" });
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("rk:intro-done", onDone);
          clearTimeout(fallback);
        };
      }
      return () => {
        window.removeEventListener("rk:intro-done", onDone);
        clearTimeout(fallback);
      };
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex items-end pt-20 pb-16 sm:pb-24 overflow-hidden"
      >
        <HeroVideo />
        <div className="container-page relative z-10 grid gap-8" data-parallax="14">
          <span
            data-hero-eyebrow
            className="text-[0.7rem] sm:text-xs tracking-[0.42em] uppercase text-copper-light/85"
          >
            Carving · Cutting · Engraving
          </span>
          <h1 className="font-display text-balance text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] text-cream max-w-5xl">
            <span
              data-hero-devnag
              className="font-devnag block text-copper-light text-[clamp(3rem,9vw,8rem)] leading-[1] mb-3"
            >
              रचनाकार
            </span>
            <span data-hero-line className="block">
              Where heritage carving meets
            </span>
            <span data-hero-line className="block">
              <em className="italic text-copper-light">modern precision.</em>
            </span>
          </h1>
          <p data-hero-para className="max-w-xl text-cream/75 text-base sm:text-lg leading-relaxed">
            A premium CNC design studio in Baner, Pune — crafting bespoke doors, temples, jali
            panels and sculptural furniture for discerning homes and architects.
          </p>
          <div className="flex flex-wrap gap-3">
            <span data-hero-cta>
              <Magnetic>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-copper text-walnut-deep px-7 py-3.5 font-medium hover:bg-copper-light transition-colors shadow-[0_18px_50px_-18px_oklch(0.80_0.075_70/0.6)]"
                >
                  Explore Catalogue
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Magnetic>
            </span>
            <span data-hero-cta>
              <Magnetic>
                <a
                  href={whatsappUrl(
                    "Hello Rachnakar Design Studio, I'd like to discuss a project.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-7 py-3.5 text-cream/90 hover:border-copper-light hover:text-copper-light transition-colors"
                >
                  WhatsApp Studio
                </a>
              </Magnetic>
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-page py-24 sm:py-32">
        <Reveal variant="mask">
          <SectionLead eyebrow="Services" title="Crafted with precision, finished by hand" />
        </Reveal>
        <Reveal
          stagger={0.1}
          className="mt-14 grid gap-px bg-border/40 rounded-3xl overflow-hidden border border-border/40"
        >
          {services.map((s) => (
            <RevealItem variant="fade-up" key={s.title}>
              <div className="grid sm:grid-cols-[1fr_2fr] gap-6 p-8 sm:p-10 bg-background/60 hover:bg-card/60 transition-colors">
                <h3 className="font-display text-2xl sm:text-3xl text-cream/95">{s.title}</h3>
                <p className="text-cream/70 leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* CATEGORIES TEASER */}
      <section id="catalogue" className="container-page py-24 sm:py-32 border-t border-border/40">
        <Reveal
          variant="fade-up"
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <SectionLead eyebrow="Catalogue" title="15 categories. 200+ CNC-ready designs." />
          <Link
            to="/products"
            className="text-sm text-copper-light hover:text-cream tracking-wider uppercase story-link"
          >
            View all →
          </Link>
        </Reveal>
        <Reveal
          stagger={0.05}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {CATEGORIES.slice(0, 10).map((c) => (
            <RevealItem variant="scale" key={c.slug}>
              <Link
                to="/products/$category"
                params={{ category: c.slug }}
                className="group relative aspect-square rounded-2xl border border-border/60 bg-card/40 p-5 flex flex-col justify-between overflow-hidden hover:border-copper/60 hover:-translate-y-1 transition-all duration-500"
              >
                <span className="text-[0.6rem] uppercase tracking-[0.28em] text-copper-light/70">
                  {String(CATEGORIES.indexOf(c) + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg text-cream leading-tight group-hover:text-copper-light transition-colors">
                  {c.name}
                </span>
                <span className="text-xs text-cream/50">{c.products.length} designs</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(300px circle at 50% 50%, oklch(0.80 0.075 70 / 0.12), transparent 60%)",
                  }}
                />
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* WORK */}
      <section id="work" className="container-page py-24 sm:py-32 border-t border-border/40">
        <Reveal variant="clip">
          <SectionLead eyebrow="Selected Work" title="A small glimpse of recent commissions" />
        </Reveal>
        <WorkGrid />
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="container-page py-24 sm:py-32 border-t border-border/40 grid lg:grid-cols-2 gap-12 lg:gap-20"
      >
        <Reveal variant="fade-right">
          <SectionLead eyebrow="About" title="A studio devoted to the line, the grain, the bit." />
          <p className="mt-8 text-cream/75 text-lg leading-relaxed">
            Rachnakar Design Studio was founded to bridge two worlds — the soul of Indian craft
            tradition and the exacting tolerances of modern CNC. Every file leaves our studio
            production-ready, machine-tested and tuned for the material it will live in.
          </p>
          <p className="mt-4 text-cream/65 leading-relaxed">
            We work with architects, interior designers, builders, temple committees and homeowners
            across India.
          </p>
        </Reveal>
        <Reveal stagger={0.1} className="grid grid-cols-2 gap-4 self-start">
          <RevealItem variant="scale">
            <Stat n="15" label="Catalogue categories" />
          </RevealItem>
          <RevealItem variant="scale">
            <Stat n="200+" label="CNC-ready designs" />
          </RevealItem>
          <RevealItem variant="scale">
            <Stat n="2000+" label="Projects delivered" />
          </RevealItem>
          <RevealItem variant="scale">
            <Stat n="100%" label="Hand-finished" />
          </RevealItem>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container-page py-24 sm:py-32 border-t border-border/40">
        <Reveal variant="perspective">
          <SectionLead eyebrow="Contact" title="Tell us about your project." />
        </Reveal>
        <Reveal stagger={0.1} className="mt-14 grid lg:grid-cols-3 gap-8">
          <RevealItem variant="fade-up">
            <InfoCard
              label="WhatsApp"
              value="+91 92844 00646"
              href={whatsappUrl("Hello Rachnakar Design Studio")}
            />
          </RevealItem>
          <RevealItem variant="fade-up">
            <InfoCard
              label="Email"
              value="hello@rachnakar.studio"
              href="mailto:hello@rachnakar.studio"
            />
          </RevealItem>
          <RevealItem variant="fade-up">
            <InfoCard
              label="Studio"
              value="Baner, Pune · Maharashtra, India"
              href="https://maps.google.com/?q=Baner+Pune"
            />
          </RevealItem>
        </Reveal>
      </section>
    </>
  );
}

function SectionLead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <span className="text-[0.7rem] uppercase tracking-[0.42em] text-copper-light/80">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-balance text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] text-cream">
        {title}
      </h2>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border/60 p-6 bg-card/40">
      <div className="font-display text-4xl text-copper-light">{n}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-cream/60">{label}</div>
    </div>
  );
}

function InfoCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border/60 bg-card/40 p-8 hover:border-copper/60 hover:bg-card/70 transition-colors"
    >
      <span className="text-[0.65rem] uppercase tracking-[0.32em] text-copper-light/80">
        {label}
      </span>
      <div className="mt-3 font-display text-2xl text-cream group-hover:text-copper-light transition-colors">
        {value}
      </div>
    </a>
  );
}

function WorkGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const figures = root.querySelectorAll<HTMLElement>("[data-work-figure]");

      figures.forEach((fig, i) => {
        const img = fig.querySelector<HTMLElement>("[data-work-img]");
        const caption = fig.querySelector<HTMLElement>("[data-work-cap]");
        const cover = fig.querySelector<HTMLElement>("[data-work-cover]");

        // Entry: cover panel slides off, image scales down, caption rises
        const tl = gsap.timeline({
          scrollTrigger: { trigger: fig, start: "top 85%", once: true },
          defaults: { ease: "expo.out" },
        });
        tl.fromTo(cover, { yPercent: 0 }, { yPercent: -101, duration: 1.4, delay: i * 0.12 })
          .fromTo(
            img,
            { scale: 1.4, filter: "blur(8px)" },
            { scale: 1, filter: "blur(0px)", duration: 1.6 },
            "<",
          )
          .fromTo(caption, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.7");

        // Continuous parallax on the image
        if (img) {
          gsap.to(img, {
            yPercent: -10,
            ease: "none",
            scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {works.map((w) => (
        <figure
          key={w.title}
          data-work-figure
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-walnut"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              data-work-img
              src={w.src}
              alt={w.title}
              loading="lazy"
              width={1024}
              height={1280}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              style={{ willChange: "transform, filter" }}
            />
          </div>
          {/* Sliding cover veil — gives a luxurious unveiling */}
          <span
            aria-hidden
            data-work-cover
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.62 0.085 55) 0%, oklch(0.15 0.018 50) 100%)",
            }}
          />
          {/* Hover glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(500px circle at 50% 80%, oklch(0.80 0.075 70 / 0.18), transparent 60%)",
            }}
          />
          <figcaption
            data-work-cap
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-walnut-deep/95 to-transparent"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.28em] text-copper-light/80">
              {w.tag}
            </span>
            <div className="font-display text-cream text-lg">{w.title}</div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
