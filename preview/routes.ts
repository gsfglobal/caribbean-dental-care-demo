/** Mapping percorsi Next.js ⇄ hash dell'anteprima (#nome). */
export const toHash = (href: string) => {
  const clean = href.replace(/^\/+|\/+$/g, "");
  return clean ? `#${clean.replace(/\//g, "-")}` : "#home";
};
export const fromHash = (hash: string) => {
  const h = hash.replace(/^#/, "");
  if (!h || h === "home") return "/";
  if (h.startsWith("behandelingen-")) return `/behandelingen/${h.slice(14)}/`;
  return `/${h}/`;
};
