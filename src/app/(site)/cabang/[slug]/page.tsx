import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { LimitedRichText } from "@/components/common/limited-rich-text";
import { SectionHeading } from "@/components/common/section-heading";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/data/site";
import {
  getPublicBranchBySlug,
  getPublicBranches,
  getPublicBranchSlugs,
} from "@/lib/content/branch-content";
import { getPublicSiteSettings } from "@/lib/content/site-content";
import { stripLimitedRichText } from "@/lib/rich-text";
import { createMetadata } from "@/lib/seo";
import { buildBranchMessage } from "@/lib/whatsapp";

export function generateStaticParams() {
  return getPublicBranchSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await getPublicBranchBySlug(slug);
  const siteSettings = await getPublicSiteSettings();

  if (!branch) {
    return createMetadata({
      title: "Cabang Tidak Ditemukan",
      description: "Cabang Kembunk tidak ditemukan.",
      path: "/cabang",
    });
  }

  return createMetadata({
    title: stripLimitedRichText(branch.name),
    description: `${stripLimitedRichText(branch.name)} - ${stripLimitedRichText(branch.address)}. Jam operasional ${stripLimitedRichText(branch.hours)}. Hubungi via WhatsApp ${siteSettings.phoneDisplay}.`,
    path: `/cabang/${branch.slug}`,
  });
}

export default async function BranchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const branch = await getPublicBranchBySlug(slug);
  const branches = await getPublicBranches();
  const siteSettings = await getPublicSiteSettings();

  if (!branch) notFound();

  return (
    <section className="container-shell py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: branch.name,
          address: branch.address,
          telephone: siteSettings.phoneDisplay || SITE.phoneDisplay,
          openingHours: branch.hours,
        }}
      />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mb-4 inline-flex rounded-full bg-[var(--primary-container)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--on-primary-container)]">
            {branch.badge}
          </div>
          <LimitedRichText
            as="h1"
            value={branch.name}
            className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
          />
          <LimitedRichText
            value={branch.description}
            className="mt-5 text-lg leading-8 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
          />

          <div className="mt-8 space-y-4 text-[var(--on-surface-variant)]">
            <div className="flex items-start gap-3">
              <HiOutlineMapPin className="text-[18px] text-[var(--primary)]" aria-hidden="true" />
              <span>{branch.address}</span>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineClock className="text-[18px] text-[var(--primary)]" aria-hidden="true" />
              <span>{branch.hours}</span>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineChatBubbleLeftRight className="text-[18px] text-[var(--primary)]" aria-hidden="true" />
              <span>{siteSettings.phoneDisplay || SITE.phoneDisplay}</span>
            </div>
          </div>

          <div className="mt-8">
            <WhatsAppButton
              message={buildBranchMessage(branch.area)}
              label={`Hubungi Cabang ${branch.area}`}
            />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-[24px] bg-[var(--surface-bright)] p-4 shadow-[0_20px_40px_-15px_rgba(168,213,186,0.18)]">
            <Image
              src={branch.image}
              alt={branch.name}
              width={1200}
              height={900}
              className={`h-[420px] w-full rounded-[20px] object-cover ${
                branch.imageClassName ?? ""
              }`}
            />
          </div>
          {branch.gallery && branch.gallery.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {branch.gallery.map((item) => (
                <div
                  key={item.imageUrl}
                  className="overflow-hidden rounded-[20px] bg-[var(--surface-container)]"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    width={800}
                    height={640}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="rounded-[24px] bg-[var(--surface-container)] p-4">
            <iframe
              src={branch.mapEmbed}
              title={`Peta ${branch.name}`}
              className="h-[360px] w-full rounded-[20px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {branch.facilities && branch.facilities.length > 0 ? (
        <div className="mt-20">
          <SectionHeading
            eyebrow="Fasilitas"
            title="Yang Bisa Kamu Nikmati di Cabang Ini"
          />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {branch.facilities.map((facility) => (
              <div
                key={facility}
                className="rounded-[24px] bg-[var(--surface-bright)] px-6 py-5 text-[var(--on-surface)] shadow-[0_20px_40px_-15px_rgba(168,213,186,0.18)]"
              >
                <LimitedRichText
                  value={facility}
                  className="[&_em]:italic [&_strong]:font-semibold [&_u]:underline"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-20">
        <SectionHeading
          eyebrow="Cabang Lainnya"
          title="Masih mau cek lokasi lain?"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {branches
            .filter((item) => item.slug !== branch.slug)
            .map((item) => (
              <Link
                key={item.slug}
                href={`/cabang/${item.slug}`}
                className="rounded-[24px] bg-[var(--surface-bright)] p-6 shadow-[0_20px_40px_-15px_rgba(168,213,186,0.18)]"
              >
                <h3 className="text-2xl font-bold text-[var(--primary)]">{item.name}</h3>
                <p className="mt-2 text-[var(--on-surface-variant)]">{item.address}</p>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
