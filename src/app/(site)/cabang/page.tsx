import { BranchesPageClient } from "@/components/branches/branches-page-client";
import { getPublicBranches } from "@/lib/content/branch-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cabang",
  description:
    "Daftar cabang Kembunk di Ancol, Serpong, dan Bekasi lengkap dengan alamat, jam operasional, dan CTA WhatsApp.",
  path: "/cabang",
});

export default async function BranchesPage() {
  const branches = await getPublicBranches();

  return <BranchesPageClient initialBranches={branches} />;
}
