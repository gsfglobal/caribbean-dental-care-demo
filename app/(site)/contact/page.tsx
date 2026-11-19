import { ContactPage } from "@/components/pages/ContactPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contact & afspraak", "Maak een afspraak bij Caribbean Dental Care in Kralendijk. Bel of WhatsApp +599 717 8106 of vul het contactformulier in. Kaya Korona 18, Bonaire.", "/contact/");
export default function Page() {
  return <ContactPage />;
}
