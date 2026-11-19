import type { MetadataRoute } from "next";
import { IS_DEMO, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  if (IS_DEMO) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
