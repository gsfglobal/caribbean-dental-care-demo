import { HomePage } from "@/components/pages/HomePage";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta(
    "Tandarts in Kralendijk, Bonaire",
    "Persoonlijke tandheelkundige zorg aan de Kaya Korona 18 in Kralendijk. Controle, mondhygiëne, vullingen, kronen, kindertandheelkunde en meer. Bel +599 717 8106.",
    "/"
  ),
  title: { absolute: "Tandarts in Kralendijk, Bonaire · Caribbean Dental Care" },
};
export default function Page() {
  return <HomePage />;
}
