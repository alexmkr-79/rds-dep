import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// Standard Vite/TanStack Start configuration (Lovable-specific tooling removed).
//
// NOTE: tanstackStart() already wires up the Nitro Vite plugin internally —
// do NOT register `nitro/vite`'s `nitro()` plugin separately, or the build
// breaks with duplicate plugin registration. Nitro options (like the deploy
// preset) are instead supplied via the top-level `nitro` key below, which
// the bundled plugin picks up.
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
  ],
  nitro: {
    preset: "cloudflare_pages",
  },
  build: {
    sourcemap: false,
  },
});
