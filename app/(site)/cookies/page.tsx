import { LegalPage } from "@/components/pages/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta("Cookies", "Cookieverklaring van Caribbean Dental Care.", "/cookies/"), robots: { index: false } };
export default function Page() {
  return <LegalPage kind="cookies" />;
}
