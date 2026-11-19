import { TreatmentsPage } from "@/components/pages/TreatmentsPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Behandelingen", "Alle behandelingen van Caribbean Dental Care in Kralendijk: controle, gebitsreiniging, vullingen, wortelkanaalbehandeling, kronen, kinderen, beugels, aligners en tandenbleken.", "/behandelingen/");
export default function Page() {
  return <TreatmentsPage />;
}
