import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Beheeromgeving", robots: { index: false, follow: false } };
export default function Page() {
  return <AdminApp />;
}
