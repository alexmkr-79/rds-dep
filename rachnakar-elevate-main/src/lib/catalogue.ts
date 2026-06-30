export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Master";

export type Product = {
  slug: string;
  name: string;
  description: string;
  formats: string[];
  difficulty: Difficulty;
  isCustom?: boolean;
  productId: string;
  featured?: boolean;
  material?: string;
  tags?: string[];
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  products: Product[];
};

const CUSTOM: Omit<Product, "productId"> = {
  slug: "custom-design",
  name: "Custom Design — Upload Your Design",
  description:
    "Have your own design? Upload your reference image, sketch, CAD drawing or concept. Rachnakar Design Studio will convert it into a professional CNC-ready design file tailored to your machine and requirements.",
  formats: ["RLF", "STL", "DXF", "AI", "PDF"],
  difficulty: "Master",
  isCustom: true,
  featured: true,
  tags: ["custom", "bespoke"],
};

const FORMATS = ["RLF", "STL", "DXF"];
const DIFFICULTIES: Difficulty[] = [
  "Intermediate",
  "Advanced",
  "Master",
  "Intermediate",
  "Advanced",
];

function make(prefix: string, names: string[]): Product[] {
  return names.map((name, i) => ({
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    name,
    description: `Premium CNC-ready ${prefix.toLowerCase()} design — ${name}. Crafted for precision routing on wood, MDF, plywood and acrylic with hand-finished detailing.`,
    formats: i % 3 === 0 ? [...FORMATS, "ArtCAM"] : FORMATS,
    difficulty: DIFFICULTIES[i % DIFFICULTIES.length],
    productId: `${prefix.replace(/\s+/g, "").toUpperCase().slice(0, 4)}-${String(i + 2).padStart(3, "0")}`,
    featured: i < 2,
    material: i % 2 ? "Teak / Mahogany" : "MDF / Plywood",
    tags: [prefix.toLowerCase()],
  }));
}

function cat(
  slug: string,
  name: string,
  tagline: string,
  prefix: string,
  names: string[],
): Category {
  return {
    slug,
    name,
    tagline,
    products: [
      { ...CUSTOM, productId: `${prefix.replace(/\s+/g, "").toUpperCase().slice(0, 4)}-CUSTOM` },
      ...make(prefix, names),
    ],
  };
}

export const CATEGORIES: Category[] = [
  cat("main-single-doors", "Main Single Doors", "Statement entrance doors — single panel", "Door", [
    "Royal Peacock Door",
    "Ganesha Heritage Door",
    "Floral Vine Door",
    "Maharaja Arch Door",
    "Mughal Lattice Door",
    "Banyan Tree Door",
    "Lotus Mandala Door",
    "Geometric Modern Door",
    "Carved Elephant Door",
    "Krishna Leela Door",
    "Rajwadi Carved Door",
    "Minimal Slat Door",
    "Brass-Inlay Door",
    "Heritage Teak Door",
  ]),
  cat("double-main-doors", "Double Main Doors", "Twin-panel grand entrances", "DoubleDoor", [
    "Twin Peacock Double Door",
    "Royal Durbar Double Door",
    "Lotus Symmetry Door",
    "Mughal Garden Double Door",
    "Ganesh & Lakshmi Doors",
    "Vine Mirror Door",
    "Modern Geometric Pair",
    "Carved Eagle Doors",
    "Heritage Mahogany Pair",
    "Floral Burst Double Door",
    "Rajasthani Haveli Doors",
    "Bel Patra Double Door",
    "Sun & Moon Double Door",
    "Minimal Cathedral Pair",
  ]),
  cat(
    "bed-headboards-legboards",
    "Bed Headboards & Legboards",
    "Sculptural bed centrepieces",
    "Bed",
    [
      "Royal Crown Headboard",
      "Floral Cascade Headboard",
      "Mughal Arch Headboard",
      "Geometric Tufted Headboard",
      "Lotus Bloom Headboard",
      "Peacock Plume Headboard",
      "Wave Relief Headboard",
      "Modern Slat Headboard",
      "Carved Vine Legboard",
      "Minimal Curve Headboard",
      "Mandala Burst Headboard",
      "Tree of Life Headboard",
      "Damask Pattern Headboard",
      "Crescent Moon Headboard",
    ],
  ),
  cat(
    "temple-mandir-backdrops",
    "Temple & Mandir Backdrops",
    "Devotional backdrops & shrines",
    "Temple",
    [
      "Om Mandala Backdrop",
      "Ganesha Aarti Backdrop",
      "Krishna Flute Backdrop",
      "Shiva Trishul Backdrop",
      "Lakshmi Lotus Backdrop",
      "Sai Baba Backdrop",
      "Tirupati Backdrop",
      "Ram Darbar Backdrop",
      "Hanuman Chalisa Backdrop",
      "Buddha Serenity Backdrop",
      "Jain Tirthankar Backdrop",
      "Gurudwara Backdrop",
      "Saraswati Veena Backdrop",
      "Surya Namaskar Backdrop",
    ],
  ),
  cat(
    "mandir-arches-pillars",
    "Mandir Arches & Pillars",
    "Carved arches, toranas & columns",
    "Arch",
    [
      "Carved Torana Arch",
      "Mughal Cusped Arch",
      "Lotus Column Pair",
      "Banana Leaf Torana",
      "Bell-Hanging Arch",
      "Floral Twin Pillars",
      "Conch Shankh Arch",
      "Peacock Torana",
      "Minimal Temple Pillars",
      "Carved Elephant Pillars",
      "Vine-Wrapped Columns",
      "Mandala Crown Arch",
      "Bel Patra Torana",
      "Royal Bracket Arch",
    ],
  ),
  cat("sofa-couch-carvings", "Sofa & Couch Carvings", "Carved sofa backs, arms & legs", "Sofa", [
    "Maharani Sofa Back",
    "Lotus Carved Armrest",
    "Floral Vine Couch Back",
    "Royal Peacock Sofa",
    "Minimal Wave Sofa Back",
    "Mughal Garden Couch",
    "Carved Diwan Back",
    "Heritage Throne Back",
    "Bell-Curve Sofa Back",
    "Damask Pattern Sofa",
    "Modern Geometric Couch",
    "Tufted Lattice Back",
    "Vine Cascade Couch",
    "Royal Crown Sofa",
  ]),
  cat("dining-tables-chairs", "Dining Tables & Chairs", "Carved dining sets & accents", "Dining", [
    "Mandala Centre Dining Top",
    "Carved Banquet Chair Back",
    "Peacock Throne Chair",
    "Lotus Dining Pedestal",
    "Heritage Round Dining Top",
    "Modern Wave Chair Back",
    "Geometric Inlay Dining Top",
    "Royal Carved Chair",
    "Floral Vine Bench Back",
    "Mughal Arch Chair Pair",
    "Minimal Slat Dining Set",
    "Carved Pedestal Base",
    "Bel Patra Dining Top",
    "Heritage High-Back Chair",
  ]),
  cat(
    "2d-jali-partitions",
    "2D/2.5D Jali & Partition Screens",
    "Lattice screens & dividers",
    "Jali",
    [
      "Hexagonal Jali Screen",
      "Mandala Jali Partition",
      "Mughal Lattice Screen",
      "Floral Vine Jali",
      "Geometric Modern Jali",
      "Peacock Jali Panel",
      "Lotus Bloom Jali",
      "Arabesque Lattice Screen",
      "Tree of Life Jali",
      "Star Burst Jali",
      "Bel Patra Jali",
      "Modern Wave Jali",
      "Heritage Carved Screen",
      "Damask Jali Divider",
    ],
  ),
  cat("3d-wall-panels", "3D Wall Panels & Wave Textures", "Sculptural feature walls", "Wall", [
    "Sand Dune Wave Panel",
    "3D Ripple Texture Panel",
    "Mountain Relief Panel",
    "Bamboo Forest Panel",
    "Mandala 3D Wall",
    "Carved Lotus Wall",
    "Geometric Pyramid Panel",
    "Wave Cascade Wall",
    "Honeycomb Relief Panel",
    "Floral Burst Wall",
    "Origami Fold Panel",
    "Modern Diamond Texture",
    "Bel Patra Relief Wall",
    "Heritage Carved Wall",
  ]),
  cat(
    "ceiling-roses-mandalas",
    "Ceiling Roses & Mandalas",
    "Ornamental ceiling centrepieces",
    "Ceiling",
    [
      "Royal Mandala Ceiling Rose",
      "Lotus Bloom Rose",
      "Peacock Plume Mandala",
      "Sunburst Ceiling Rose",
      "Mughal Garden Mandala",
      "Geometric Star Rose",
      "Floral Vine Rose",
      "Bel Patra Mandala",
      "Heritage Rosette",
      "Minimal Concentric Rose",
      "Damask Ceiling Rose",
      "Carved Cherub Rose",
      "Sacred Geometry Mandala",
      "Wave Spiral Rose",
    ],
  ),
  cat(
    "corner-ornaments-brackets",
    "Corner Ornaments & Brackets",
    "Decorative corners & brackets",
    "Corner",
    [
      "Floral Corner Ornament",
      "Peacock Bracket",
      "Lotus Corner Carving",
      "Scrolled Acanthus Bracket",
      "Mughal Corner Motif",
      "Bel Patra Corner",
      "Carved Cherub Corner",
      "Geometric Bracket",
      "Vine Cascade Corner",
      "Royal Crown Bracket",
      "Bell-Hanging Bracket",
      "Heritage Carved Corner",
      "Minimal Curve Bracket",
      "Damask Corner",
    ],
  ),
  cat(
    "running-borders-moldings",
    "Running Borders & Moldings",
    "Continuous trim & moldings",
    "Border",
    [
      "Floral Vine Border",
      "Greek Key Molding",
      "Bel Patra Running Border",
      "Acanthus Leaf Molding",
      "Geometric Chain Border",
      "Peacock Feather Border",
      "Lotus Petal Border",
      "Mughal Arch Molding",
      "Wave Crest Border",
      "Bell-Hanging Border",
      "Damask Trim Molding",
      "Heritage Carved Border",
      "Minimal Reed Molding",
      "Sun Ray Border",
    ],
  ),
  cat("mirror-photo-frames", "Mirror & Photo Frames", "Carved frames for mirrors & art", "Frame", [
    "Baroque Mirror Frame",
    "Peacock Photo Frame",
    "Lotus Carved Frame",
    "Mughal Arch Mirror Frame",
    "Royal Crown Frame",
    "Floral Cascade Frame",
    "Geometric Modern Frame",
    "Bel Patra Photo Frame",
    "Heritage Carved Frame",
    "Minimal Beaded Frame",
    "Damask Mirror Frame",
    "Cherub Carved Frame",
    "Sunburst Mirror Frame",
    "Vine Twin Frame",
  ]),
  cat(
    "wardrobe-cabinet-shutters",
    "Wardrobe & Cabinet Shutter Panels",
    "Carved shutters & cabinet fronts",
    "Shutter",
    [
      "Mughal Lattice Shutter",
      "Floral Vine Shutter",
      "Geometric Modern Shutter",
      "Mandala Bloom Shutter",
      "Peacock Plume Shutter",
      "Lotus Carved Shutter",
      "Minimal Reed Shutter",
      "Heritage Carved Shutter",
      "Damask Pattern Shutter",
      "Bel Patra Shutter",
      "Wave Texture Shutter",
      "Royal Carved Shutter",
      "Tree of Life Shutter",
      "Mirror-Inlay Shutter",
    ],
  ),
  cat(
    "3d-god-statues",
    "3D God Statues & Religious Reliefs",
    "Sculptural deities & reliefs",
    "God",
    [
      "Ganesha 3D Relief",
      "Krishna with Flute Relief",
      "Shiva Meditation Relief",
      "Lakshmi Lotus Relief",
      "Saraswati Veena Relief",
      "Hanuman Standing Relief",
      "Buddha Serene Relief",
      "Sai Baba Relief",
      "Durga Mahishasura Relief",
      "Ram Darbar Relief",
      "Tirupati Balaji Relief",
      "Jain Tirthankar Relief",
      "Guru Nanak Relief",
      "Radha Krishna Relief",
    ],
  ),
];

export const findCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const findProduct = (categorySlug: string, productSlug: string) => {
  const c = findCategory(categorySlug);
  if (!c) return null;
  const p = c.products.find((p) => p.slug === productSlug);
  return p ? { category: c, product: p } : null;
};

export const allProducts = () =>
  CATEGORIES.flatMap((c) => c.products.map((p) => ({ category: c, product: p })));
