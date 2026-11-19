/** Prefix voor statische bestanden: "" op de echte site, basePath op GitHub Pages, "." in de preview. */
export const BASE = process.env.NEXT_PUBLIC_BASE ?? "";
export const asset = (p: string) => `${BASE}${p}`;
