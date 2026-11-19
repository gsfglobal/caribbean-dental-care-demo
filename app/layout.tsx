import type { Metadata, Viewport } from "next";
import "./globals.css";
import { IS_DEMO, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Tandarts in Kralendijk, Bonaire · Caribbean Dental Care", template: "%s · Caribbean Dental Care" },
  description:
    "Caribbean Dental Care, tandartspraktijk aan de Kaya Korona 18 in Kralendijk, Bonaire. Controle, mondhygiëne, vullingen, kronen, kinderen en meer. Bel +599 717 8106.",
  // Demo/presentatiekopie: buiten zoekmachines houden
  ...(IS_DEMO ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
