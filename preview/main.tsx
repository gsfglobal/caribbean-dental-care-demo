import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../app/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { ClientInit } from "@/components/layout/ClientInit";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { RevealObserver } from "@/components/ui/Reveal";
import { HomePage } from "@/components/pages/HomePage";
import { TreatmentsPage } from "@/components/pages/TreatmentsPage";
import { TreatmentDetailPage } from "@/components/pages/TreatmentDetailPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { PatientsPage } from "@/components/pages/PatientsPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { LegalPage } from "@/components/pages/LegalPage";
import { AdminApp } from "@/components/admin/AdminApp";
import { usePathname } from "next/navigation";
import { getTreatment } from "@/lib/treatments";

const titles: Record<string, string> = {
  "/behandelingen/": "Behandelingen",
  "/over-ons/": "Over ons",
  "/voor-patienten/": "Voor patiënten",
  "/contact/": "Contact & afspraak",
  "/privacy/": "Privacyverklaring",
  "/cookies/": "Cookies",
  "/admin/": "Beheeromgeving",
};

function Route({ path }: { path: string }) {
  if (path === "/behandelingen/") return <TreatmentsPage />;
  if (path === "/over-ons/") return <AboutPage />;
  if (path === "/voor-patienten/") return <PatientsPage />;
  if (path === "/contact/") return <ContactPage />;
  if (path === "/privacy/") return <LegalPage kind="privacy" />;
  if (path === "/cookies/") return <LegalPage kind="cookies" />;
  const m = path.match(/^\/behandelingen\/([^/]+)\/$/);
  if (m && getTreatment(m[1])) return <TreatmentDetailPage slug={m[1]} />;
  return <HomePage />;
}

function App() {
  const path = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
    const m = path.match(/^\/behandelingen\/([^/]+)\/$/);
    const t = m ? getTreatment(m[1])?.title : titles[path];
    document.title = t ? `${t} · Caribbean Dental Care` : "Caribbean Dental Care — Tandarts in Kralendijk, Bonaire";
  }, [path]);
  if (path === "/admin/") return <AdminApp />;
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} key={path} className="page-in outline-none">
        <Route path={path} />
      </main>
      <Footer />
      <MobileCTA />
      <DemoBanner />
      <RevealObserver />
      <ClientInit />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
