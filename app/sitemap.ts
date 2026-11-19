import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { treatments } from "@/lib/treatments";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/behandelingen/", "/over-ons/", "/voor-patienten/", "/contact/"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...treatments.map((t) => ({ url: `${SITE_URL}/behandelingen/${t.slug}/`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
