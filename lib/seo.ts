import type { Metadata } from "next";
import { clinic, IS_DEMO, SITE_URL } from "./site";
import { treatments } from "./treatments";

export const SITE_NAME = "Caribbean Dental Care";

export function pageMeta(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, url, siteName: SITE_NAME, locale: "nl_NL", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  };
}

/** Schema.org Dentist — alleen geverifieerde gegevens (geen openingstijden, prijzen of reviews). */
export function dentistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    url: SITE_URL,
    telephone: clinic.phone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.island,
      addressCountry: clinic.address.countryCode,
    },
    areaServed: { "@type": "Place", name: "Bonaire" },
    availableService: treatments.map((t) => ({ "@type": "MedicalProcedure", name: t.title, url: `${SITE_URL}/behandelingen/${t.slug}/` })),
  };
}

export const showStructuredData = !IS_DEMO;
