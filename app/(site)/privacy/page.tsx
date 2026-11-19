import { LegalPage } from "@/components/pages/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta("Privacyverklaring", "Privacyverklaring van Caribbean Dental Care.", "/privacy/"), robots: { index: false } };
export default function Page() {
  return <LegalPage kind="privacy" />;
}
