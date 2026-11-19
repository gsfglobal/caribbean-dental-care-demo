// Anteprima a pagina singola (hash routing) costruita dagli stessi componenti del sito Next.js.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const r = (p: string) => path.resolve(__dirname, p);
export default defineConfig({
  root: r("preview"),
  base: "./",
  publicDir: r("public"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "next/link", replacement: r("preview/shims/link.tsx") },
      { find: "next/navigation", replacement: r("preview/shims/navigation.ts") },
      { find: "next/dynamic", replacement: r("preview/shims/dynamic.tsx") },
      { find: "@", replacement: r(".") },
    ],
  },
  define: {
    "process.env.NEXT_PUBLIC_BASE": JSON.stringify("."),
    "process.env.NEXT_PUBLIC_PREVIEW": JSON.stringify("1"),
    "process.env.NEXT_PUBLIC_FORM_ENDPOINT": JSON.stringify(""),
    "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify("https://dominio-da-confermare.example"),
  },
  css: { postcss: { plugins: [] } },
  build: { outDir: r("preview-dist"), emptyOutDir: true, assetsInlineLimit: 0, chunkSizeWarningLimit: 2000 },
});
