import { BranchesPageClient } from "@/components/branches/branches-page-client";
import { getPublicBranches } from "@/lib/content/branch-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Store",
  description:
    "Daftar store Kembunk di Ancol, Serpong, dan Bekasi lengkap dengan alamat, jam operasional, dan CTA WhatsApp.",
  path: "/store",
});

export default async function StorePage() {
  const branches = await getPublicBranches();

  return <BranchesPageClient initialBranches={branches} />;
}
