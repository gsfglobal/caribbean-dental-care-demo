import { notFound } from "next/navigation";
import { TreatmentDetailPage } from "@/components/pages/TreatmentDetailPage";
import { getTreatment, treatments } from "@/lib/treatments";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTreatment((await params).slug);
  if (!t) return {};
  return pageMeta(t.seoTitle, t.seoDescription, `/behandelingen/${t.slug}/`);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getTreatment(slug)) notFound();
  return <TreatmentDetailPage slug={slug} />;
}
