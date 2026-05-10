import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineEnvelope, HiOutlineGlobeAlt, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { ContactMessageForm } from "@/components/contact/contact-message-form";
import { getContactPageSettings } from "@/lib/content/contact-page-content";
import { createMetadata } from "@/lib/seo";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Hubungi Kembung untuk pertanyaan, kritik, saran, kerja sama, dan informasi produk terbaru.",
  path: "/hubungi-kami",
});

const contactCards = [
  { key: "address", icon: HiOutlineMapPin },
  { key: "phone", icon: HiOutlinePhone },
  { key: "email", icon: HiOutlineEnvelope },
  { key: "website", icon: HiOutlineGlobeAlt },
] as const;

export default async function ContactPage() {
  const pageSettings = await getContactPageSettings();

  return (
    <section className="container-shell py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 space-y-4 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Contact Us - Kembung
          </p>
          <h1 className="text-[3rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)] md:text-[3.75rem]">
            {pageSettings.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--on-surface-variant)] md:text-lg">
            {pageSettings.description} <span aria-hidden="true">😊</span>
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {contactCards.map(({ key, icon: Icon }) => {
                if (key === "address") {
                  return (
                    <div
                      key={key}
                      className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)] md:col-span-2"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-[var(--primary-container)] p-3 text-[var(--primary)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="text-lg font-bold text-[var(--on-surface)]">
                          {pageSettings.addressLabel}
                        </h2>
                      </div>
                      <p className="whitespace-pre-line text-[var(--on-surface-variant)]">
                        {pageSettings.address}
                      </p>
                    </div>
                  );
                }

                if (key === "phone") {
                  return (
                    <div
                      key={key}
                      className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-[var(--secondary-container)] p-3 text-[var(--primary)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="text-lg font-bold text-[var(--on-surface)]">
                          {pageSettings.phoneLabel}
                        </h2>
                      </div>
                      <p className="text-[var(--on-surface-variant)]">{pageSettings.phoneNumber}</p>
                    </div>
                  );
                }

                if (key === "email") {
                  return (
                    <div
                      key={key}
                      className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="rounded-full bg-[var(--tertiary-container)] p-3 text-[var(--primary)]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="text-lg font-bold text-[var(--on-surface)]">
                          {pageSettings.emailLabel}
                        </h2>
                      </div>
                      <p className="break-all text-[var(--on-surface-variant)]">
                        {pageSettings.emailAddress}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)] md:col-span-2"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="rounded-full bg-[var(--surface-container-high)] p-3 text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-lg font-bold text-[var(--on-surface)]">
                        {pageSettings.websiteLabel}
                      </h2>
                    </div>
                    <Link
                      href={pageSettings.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline"
                    >
                      {pageSettings.websiteText}
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
              <h2 className="mb-4 text-lg font-bold text-[var(--on-surface)]">
                {pageSettings.socialMediaLabel}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href={pageSettings.instagramUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-[1.25rem] bg-[var(--tertiary-fixed)] p-4 text-[var(--on-tertiary-container)]"
                >
                  <span className="rounded-full bg-white/50 p-3">
                    <FaInstagram className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Instagram</p>
                    <p className="text-sm opacity-80">{pageSettings.instagramHandle}</p>
                  </div>
                </Link>

                <Link
                  href={pageSettings.tiktokUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-[1.25rem] bg-[var(--secondary-fixed)] p-4 text-[var(--on-secondary-container)]"
                >
                  <span className="rounded-full bg-white/50 p-3">
                    <FaTiktok className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">TikTok</p>
                    <p className="text-sm opacity-80">{pageSettings.tiktokHandle}</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
              <h2 className="mb-4 text-lg font-bold text-[var(--on-surface)]">
                {pageSettings.operationalHoursTitle}
              </h2>
              <div className="space-y-2 text-[var(--on-surface-variant)]">
                <p>{pageSettings.weekdayHours}</p>
                <p>{pageSettings.saturdayHours}</p>
                <p>{pageSettings.holidayHours}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
              <div className="relative aspect-[16/8] bg-[var(--surface-container-low)]">
                <Image
                  src={pageSettings.studioMapImageUrl}
                  alt="Lokasi Kembung"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
              <ContactMessageForm
                title={pageSettings.formTitle}
                description={pageSettings.formDescription}
              />
            </div>

            <Link
              href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
              target="_blank"
              rel="noreferrer"
              className="group relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-[var(--primary-container)] p-7 text-[var(--on-primary-container)] transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/35 p-3 text-3xl">
                  <FaWhatsapp />
                </span>
                <span className="rounded-full bg-white/35 px-3 py-1 text-xs font-semibold">
                  WhatsApp
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{pageSettings.whatsappCardTitle}</h2>
                <p className="mt-2 text-sm leading-7 opacity-85">
                  {pageSettings.whatsappCardDescription}
                </p>
              </div>
              <span className="text-sm font-semibold">Hubungi via WhatsApp</span>
            </Link>

            <blockquote className="rounded-[2rem] border border-[var(--outline-variant)]/25 bg-[var(--surface-container-low)] px-6 py-6 text-base leading-8 text-[var(--on-surface-variant)] italic">
              &ldquo;{pageSettings.closingStatement}&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
