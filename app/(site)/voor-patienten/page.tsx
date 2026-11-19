import { PatientsPage } from "@/components/pages/PatientsPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Voor patiënten", "Praktische informatie: contact opnemen, een afspraak aanvragen, uw eerste bezoek en wat te doen bij kiespijn op Bonaire.", "/voor-patienten/");
export default function Page() {
  return <PatientsPage />;
}
