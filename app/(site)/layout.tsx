import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { ClientInit } from "@/components/layout/ClientInit";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { RevealObserver } from "@/components/ui/Reveal";
import { dentistJsonLd, showStructuredData } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-navy focus:px-4 focus:py-3 focus:text-white">
        Naar de inhoud
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      <MobileCTA />
      <DemoBanner />
      <RevealObserver />
      <ClientInit />
      {showStructuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd()) }} />}
    </>
  );
}
