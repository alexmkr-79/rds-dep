import mainSingle from "@/assets/cat/main-single-doors.jpg";
import doubleDoors from "@/assets/cat/double-main-doors.jpg";
import bed from "@/assets/cat/bed-headboards-legboards.jpg";
import temple from "@/assets/cat/temple-mandir-backdrops.jpg";
import arches from "@/assets/cat/mandir-arches-pillars.jpg";
import sofa from "@/assets/cat/sofa-couch-carvings.jpg";
import dining from "@/assets/cat/dining-tables-chairs.jpg";
import jali from "@/assets/cat/2d-jali-partitions.jpg";
import wall3d from "@/assets/cat/3d-wall-panels.jpg";
import ceiling from "@/assets/cat/ceiling-roses-mandalas.jpg";
import corner from "@/assets/cat/corner-ornaments-brackets.jpg";
import border from "@/assets/cat/running-borders-moldings.jpg";
import frames from "@/assets/cat/mirror-photo-frames.jpg";
import shutters from "@/assets/cat/wardrobe-cabinet-shutters.jpg";
import gods from "@/assets/cat/3d-god-statues.jpg";

export const CATEGORY_IMAGES: Record<string, string> = {
  "main-single-doors": mainSingle,
  "double-main-doors": doubleDoors,
  "bed-headboards-legboards": bed,
  "temple-mandir-backdrops": temple,
  "mandir-arches-pillars": arches,
  "sofa-couch-carvings": sofa,
  "dining-tables-chairs": dining,
  "2d-jali-partitions": jali,
  "3d-wall-panels": wall3d,
  "ceiling-roses-mandalas": ceiling,
  "corner-ornaments-brackets": corner,
  "running-borders-moldings": border,
  "mirror-photo-frames": frames,
  "wardrobe-cabinet-shutters": shutters,
  "3d-god-statues": gods,
};

export const categoryImage = (slug: string): string | undefined => CATEGORY_IMAGES[slug];
