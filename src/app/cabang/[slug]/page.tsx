import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { SectionHeading } from "@/components/common/section-heading";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { branches, SITE } from "@/data/site";
import { createMetadata } from "@/lib/seo";
import { buildBranchMessage } from "@/lib/whatsapp";

export function generateStaticParams() {
  return branches.map((branch) => ({ slug: branch.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const branch = branches.find((item) => item.slug === params.slug);

  if (!branch) {
    return createMetadata({
      title: "Cabang Tidak Ditemukan",
      description: "Cabang Kembung tidak ditemukan.",
      path: "/cabang",
    });
  }

  return createMetadata({
    title: branch.name,
    description: `${branch.name} - ${branch.address}. Jam operasional ${branch.hours}. Hubungi via WhatsApp ${SITE.phoneDisplay}.`,
    path: `/cabang/${branch.slug}`,
  });
}

export default function BranchDetailPage({ params }: { params: { slug: string } }) {
  const branch = branches.find((item) => item.slug === params.slug);

  if (!branch) notFound();

  return (
    <section className="container-shell py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: branch.name,
          address: branch.address,
          telephone: SITE.phoneDisplay,
          openingHours: branch.hours,
        }}
      />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mb-4 inline-flex rounded-full bg-[var(--primary-container)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--on-primary-container)]">
            {branch.badge}
          </div>
          <h1 className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)]">
            {branch.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--on-surface-variant)]">
            {branch.description}
          </p>

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
              <span>{SITE.phoneDisplay}</span>
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
