import { notFound } from "next/navigation";
import {
  AdminSectionPlaceholder,
} from "@/components/admin/admin-section-placeholder";
import { getAdminSection } from "@/components/admin/admin-config";

type AdminSectionPageProps = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  const { section } = await params;
  const matchedSection = getAdminSection(section);

  if (!matchedSection) {
    notFound();
  }

  return (
    <AdminSectionPlaceholder
      slug={matchedSection.slug}
      label={matchedSection.label}
      description={matchedSection.description}
    />
  );
}
