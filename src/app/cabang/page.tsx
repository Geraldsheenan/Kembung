import { BranchesPageClient } from "@/components/branches/branches-page-client";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cabang",
  description:
    "Daftar cabang Kembung di Ancol, Serpong, dan Bekasi lengkap dengan alamat, jam operasional, dan CTA WhatsApp.",
  path: "/cabang",
});

export default function BranchesPage() {
  return <BranchesPageClient />;
}
