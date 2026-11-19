import { AboutPage } from "@/components/pages/AboutPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Over ons", "Caribbean Dental Care: persoonlijke en toegankelijke tandheelkundige zorg aan de Kaya Korona in Kralendijk, Bonaire.", "/over-ons/");
export default function Page() {
  return <AboutPage />;
}
