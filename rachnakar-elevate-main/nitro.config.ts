import { defineConfig } from "nitro";

export default defineConfig({
  preset: "cloudflare-pages",
  prerender: {
    routes: ["/admin/index.html"],
  },
  routeRules: {
    "/admin/**": { cache: false, swr: 3600 },
  },
});
