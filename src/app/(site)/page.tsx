import Image from "next/image";
import Link from "next/link";
import { FaTiktok } from "react-icons/fa6";
import {
  HiOutlineArrowRight,
  HiOutlineHeart,
  HiOutlineQrCode,
  HiOutlineShieldCheck,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { LuDroplets, LuLeaf } from "react-icons/lu";
import { TbSnowflake } from "react-icons/tb";
import { JsonLd } from "@/components/seo/json-ld";
import { AnimatedCard } from "@/components/animation/animated-card";
import { MotionSection } from "@/components/animation/motion-section";
import { NewsletterSignupForm } from "@/components/forms/newsletter-signup-form";
import { SITE } from "@/data/site";
import { getHomepageContent } from "@/lib/content/homepage-content";
import { getPublicSiteSettings } from "@/lib/content/site-content";
import { createMetadata } from "@/lib/seo";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "Beranda",
  description:
    "Homepage Kembunk dengan tampilan pastel lifestyle untuk brand tumbler estetik, fun, dan friendly.",
  path: "/",
});

const desktopReasonIcons = {
  shield: HiOutlineShieldCheck,
  snowflake: TbSnowflake,
  leaf: LuLeaf,
  heart: HiOutlineHeart,
} as const;

const desktopReasonThemes = {
  secondary: {
    card: "bg-[var(--secondary-container)]/50",
    circle: "bg-[var(--primary-container)]",
    titleColor: "text-[var(--on-secondary-container)]",
    textColor: "text-[var(--on-secondary-container)]/80",
  },
  primary: {
    card: "bg-[var(--primary-container)]/30",
    circle: "bg-[var(--primary-container)]",
    titleColor: "text-[var(--on-primary-container)]",
    textColor: "text-[var(--on-primary-container)]/80",
  },
  tertiary: {
    card: "bg-[var(--tertiary-container)]/30",
    circle: "bg-[var(--tertiary-container)]/50",
    titleColor: "text-[var(--on-tertiary-container)]",
    textColor: "text-[var(--on-tertiary-container)]/80",
  },
} as const;

const mobileReasonIcons = {
  leaf: LuLeaf,
  snowflake: TbSnowflake,
  heart: HiOutlineHeart,
  shield: HiOutlineShieldCheck,
} as const;

const mobileReasonThemes = {
  "surface-wide": {
    className: "col-span-2 bg-[var(--surface-container-lowest)]",
    iconWrap: "bg-[var(--primary-container)] text-[var(--on-primary-container)]",
    titleClass: "text-[var(--primary)]",
    textClass: "text-[var(--on-surface-variant)]",
  },
  secondary: {
    className: "bg-[var(--secondary-container)]",
    iconWrap: "bg-white text-[var(--primary)]",
    titleClass: "text-[var(--primary)]",
    textClass: "text-[var(--on-secondary-container)]",
  },
  tertiary: {
    className: "bg-[var(--tertiary-container)]",
    iconWrap: "bg-white text-[var(--tertiary)]",
    titleClass: "text-[var(--tertiary)]",
    textClass: "text-[var(--on-tertiary-container)]",
  },
} as const;

function splitLines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export default async function HomePage() {
  const [siteSettings, homepage] = await Promise.all([
    getPublicSiteSettings(),
    getHomepageContent(),
  ]);

  const hero = homepage.sections.hero;
  const bestSellersIntro = homepage.sections.best_sellers_intro;
  const reasonsIntro = homepage.sections.reasons_intro;
  const newsletterBlock = homepage.sections.newsletter_block;
  const tiktokBlock = homepage.sections.tiktok_block;

  const mobileHeroTitleLines = splitLines(
    String(hero.extra.mobileTitle ?? "Gak Cuma Haus,\nTapi Puas."),
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteSettings.siteName || SITE.name,
          url: siteSettings.siteUrl || SITE.url,
          telephone: siteSettings.phoneDisplay || SITE.phoneDisplay,
          slogan: siteSettings.tagline || SITE.tagline,
        }}
      />

      <div className="md:hidden">
        <section className="container-shell py-4 pb-10">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_18px_46px_-24px_rgba(61,103,81,0.28)]">
            <Image
              src={String(hero.extra.mobileImageUrl ?? hero.imageUrl)}
              alt="Kembunk hero mobile"
              width={900}
              height={1125}
              className="aspect-[4/5] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5">
              <span className="mb-2 inline-flex rounded-full bg-[var(--primary-container)] px-3 py-1 text-[10px] font-semibold text-[var(--on-primary-container)]">
                {String(hero.extra.mobileBadge ?? hero.subtitle)}
              </span>
              <h1 className="text-[2.35rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
                {mobileHeroTitleLines.map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < mobileHeroTitleLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
            </div>
          </div>

          <div className="space-y-5 px-1 pt-5">
            <p className="text-[1.05rem] leading-8 text-[var(--on-surface-variant)]">
              {String(hero.extra.mobileDescription ?? hero.description)}
            </p>
            <Link
              href={String(hero.extra.mobilePrimaryCtaHref ?? hero.primaryCtaHref)}
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--primary-container)] px-6 py-4 text-sm font-semibold text-[var(--on-primary-container)] shadow-[0_18px_38px_-22px_rgba(61,103,81,0.35)] transition-transform duration-200 active:scale-[0.98]"
            >
              {String(hero.extra.mobilePrimaryCtaLabel ?? hero.primaryCtaLabel)}
            </Link>
          </div>
        </section>

        <section className="py-8">
          <div className="container-shell mb-5 flex items-end justify-between">
            <h2 className="text-[1.65rem] font-bold tracking-[-0.03em] text-[var(--primary)]">
              {bestSellersIntro.title}
            </h2>
            <Link
              href={bestSellersIntro.primaryCtaHref}
              className="translate-y-[5px] border-b border-[var(--primary-container)] text-sm text-[var(--primary)]"
            >
              {String(bestSellersIntro.extra.mobileCtaLabel ?? "View All")}
            </Link>
          </div>

          <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1">
            {homepage.featured.mobile.map((item) => (
              <Link
                key={`${item.href}-${item.name}`}
                href={item.href}
                className="min-w-[210px] snap-start space-y-3 first:ml-5 last:mr-5"
              >
                <div
                  className={`group relative aspect-square overflow-hidden rounded-[1.75rem] p-4 ${item.background}`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={700}
                    height={700}
                    className="h-full w-full rounded-[1.2rem] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[var(--primary)]">{item.name}</p>
                  <p className="text-[0.95rem] text-[var(--on-surface-variant)]">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[var(--surface-container-low)] py-16">
          <div className="container-shell">
            <h2 className="mb-10 text-center text-[1.7rem] font-bold tracking-[-0.03em] text-[var(--primary)]">
              {reasonsIntro.title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {homepage.reasons.mobile.map((reason) => {
                const Icon =
                  mobileReasonIcons[reason.iconKey as keyof typeof mobileReasonIcons] ??
                  HiOutlineHeart;
                const theme =
                  mobileReasonThemes[reason.themeKey as keyof typeof mobileReasonThemes] ??
                  mobileReasonThemes["surface-wide"];

                return (
                  <article
                    key={reason.title}
                    className={`${theme.className} rounded-[1.9rem] border border-[var(--outline-variant)]/30 p-5`}
                  >
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${theme.iconWrap}`}
                    >
                      <Icon className="text-lg" aria-hidden="true" />
                    </div>
                    <h3 className={`mb-2 text-[1.05rem] font-semibold ${theme.titleClass}`}>
                      {reason.title}
                    </h3>
                    <p className={`text-sm leading-7 ${theme.textClass}`}>
                      {reason.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container-shell py-16 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-container)]/20">
            <div className="absolute h-24 w-24 animate-pulse rounded-full bg-[var(--primary)]/18" />
            <LuDroplets className="relative z-10 text-[2rem] text-[var(--primary)]" />
          </div>

          <div className="mx-auto max-w-xs space-y-3">
            <h2 className="text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)]">
              {String(newsletterBlock.extra.mobileTitle ?? newsletterBlock.title)}
            </h2>
            <p className="text-[1.02rem] leading-8 text-[var(--on-surface-variant)]">
              {String(newsletterBlock.extra.mobileDescription ?? newsletterBlock.description)}
            </p>
          </div>

          <NewsletterSignupForm
            source="home-mobile"
            inputPlaceholder={String(
              newsletterBlock.extra.mobileInputPlaceholder ?? "Email lo apa?",
            )}
            buttonLabel={String(
              newsletterBlock.extra.mobileButtonLabel ?? newsletterBlock.primaryCtaLabel,
            )}
            formClassName="mt-8 space-y-3"
            inputClassName="w-full rounded-full border-0 bg-[var(--secondary-container)] px-6 py-4 text-[0.95rem] text-[var(--on-surface)] outline-none ring-0 placeholder:text-[var(--on-secondary-container)]/75 focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-70"
            buttonClassName="w-full rounded-full bg-[var(--primary)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_38px_-22px_rgba(61,103,81,0.5)] transition-transform duration-200 active:scale-[0.98] disabled:opacity-70"
          />
        </section>
      </div>

      <div className="hidden md:block">
        <section className="container-shell grid grid-cols-1 items-center gap-20 py-16 lg:grid-cols-2 lg:py-20">
          <div className="space-y-10">
            <div className="animate-fade-up inline-block rounded-full bg-[var(--primary-fixed)] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--on-primary-fixed-variant)]">
              {hero.subtitle}
            </div>
            <div className="animate-fade-up space-y-6 [animation-delay:100ms]">
              <h1 className="text-[48px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--primary)] lg:text-[56px]">
                {splitLines(hero.title).map((line, index, array) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index < array.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
              <p className="max-w-lg text-lg leading-8 text-[var(--on-surface-variant)]">
                {hero.description}
              </p>
            </div>
            <div className="animate-fade-up flex flex-wrap gap-4 pt-1 [animation-delay:200ms]">
              <Link
                href={hero.primaryCtaHref}
                className="soft-glow-primary rounded-full bg-[var(--primary)] px-11 py-4 text-sm font-semibold text-[var(--on-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]"
              >
                {hero.primaryCtaLabel}
              </Link>
              <Link
                href={
                  hero.secondaryCtaHref === "/hubungi-kami"
                    ? buildWhatsAppUrl(
                        buildGeneralWhatsAppMessage(),
                        siteSettings.phoneInternational,
                      )
                    : hero.secondaryCtaHref
                }
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--surface-container-high)] px-11 py-4 text-sm font-semibold text-[var(--on-surface-variant)] transition-all duration-200 hover:bg-[var(--surface-container-highest)] active:scale-[0.97]"
              >
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="animate-fade-up group relative [animation-delay:260ms]">
            <div className="absolute -inset-4 rounded-[32px] bg-[var(--primary-container)]/18 blur-3xl transition-colors group-hover:bg-[var(--primary-container)]/26" />
            <div className="soft-glow-primary relative overflow-hidden rounded-[32px]">
              <Image
                src={hero.imageUrl}
                alt="Kembunk hero desktop"
                width={1000}
                height={1000}
                className="aspect-square h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <MotionSection className="bg-[var(--surface-container-low)] py-20">
          <div className="container-shell">
            <div className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <h2 className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)]">
                  {bestSellersIntro.title}
                </h2>
                <p className="text-[var(--on-surface-variant)]">
                  {bestSellersIntro.description}
                </p>
              </div>
              <Link
                href={bestSellersIntro.primaryCtaHref}
                className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] transition-all hover:gap-2"
              >
                {bestSellersIntro.primaryCtaLabel}
                <HiOutlineArrowRight className="text-[18px]" aria-hidden="true" />
              </Link>
            </div>

            <div className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4">
              {homepage.featured.desktop.map((item) => (
                <AnimatedCard
                  key={`${item.href}-${item.name}`}
                  className="group w-[calc((100%-4.5rem)/4)] min-w-[260px] shrink-0 snap-start rounded-[2rem] border border-[var(--outline-variant)]/25 bg-[var(--surface-bright)] p-5"
                >
                  <Link href={item.href} className="block focus-visible:outline-none">
                    <div
                      className={`relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.6rem] ${item.background}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={900}
                        height={1125}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {item.badge ? (
                        <div className="absolute right-3 top-3 rounded-full bg-[var(--tertiary)] px-3 py-1 text-xs font-bold text-[var(--on-tertiary)]">
                          {item.badge}
                        </div>
                      ) : null}
                    </div>
                    <h3 className="mb-1 text-[2rem] font-bold tracking-[-0.03em] text-[var(--on-surface)]">
                      {item.name}
                    </h3>
                    <p className="mb-6 text-[var(--on-surface-variant)]">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-2xl font-bold text-[var(--primary)]">
                        {item.price}
                      </span>
                    </div>
                  </Link>
                  <div className="mt-6">
                    <Link
                      href={buildWhatsAppUrl(
                        `Halo Kembunk, saya tertarik dengan ${item.name}.`,
                        siteSettings.phoneInternational,
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--on-primary)] transition-all duration-200 hover:scale-105"
                    >
                      <HiOutlineShoppingBag className="text-[18px]" aria-hidden="true" />
                      Beli via WA
                    </Link>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="container-shell py-20">
          <div className="mx-auto mb-20 max-w-2xl text-center">
            <h2 className="mb-6 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)]">
              {reasonsIntro.title}
            </h2>
            <p className="text-lg text-[var(--on-surface-variant)]">
              {reasonsIntro.description}
            </p>
          </div>

            <div className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-4">
            {homepage.reasons.desktop.map((reason) => {
              const Icon =
                desktopReasonIcons[reason.iconKey as keyof typeof desktopReasonIcons] ??
                HiOutlineShieldCheck;
              const theme =
                desktopReasonThemes[reason.themeKey as keyof typeof desktopReasonThemes] ??
                desktopReasonThemes.primary;

              return (
                <article
                  key={reason.title}
                  className={`${theme.card} group flex w-[calc((100%-4.5rem)/4)] min-w-[240px] shrink-0 snap-start flex-col items-center rounded-[2rem] border border-transparent p-10 text-center transition-all duration-300 hover:border-[var(--primary-container)] hover:shadow-[0_28px_60px_-28px_rgba(168,213,186,0.45)]`}
                >
                  <div
                    className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${theme.circle} text-[var(--primary)]`}
                  >
                    <div className="transition-transform duration-300 group-hover:rotate-[8deg]">
                      <Icon className="text-[40px]" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className={`mb-3 text-2xl font-bold ${theme.titleColor}`}>
                    {reason.title}
                  </h3>
                  <p className={theme.textColor}>{reason.description}</p>
                </article>
              );
            })}
          </div>
        </MotionSection>

        <MotionSection className="container-shell py-20">
          <div className="grid h-auto grid-cols-1 gap-4 md:h-[400px] md:grid-cols-12">
            <div className="flex flex-col justify-center rounded-[2rem] bg-[var(--primary)] p-12 text-[var(--on-primary)] md:col-span-8">
              <h3 className="mb-6 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em]">
                {newsletterBlock.title}
              </h3>
              <p className="mb-8 max-w-md text-lg opacity-90">
                {newsletterBlock.description}
              </p>
              <NewsletterSignupForm
                source="home-desktop"
                inputPlaceholder={String(
                  newsletterBlock.extra.desktopInputPlaceholder ?? "Email kamu...",
                )}
                buttonLabel={String(
                  newsletterBlock.extra.desktopButtonLabel ??
                    newsletterBlock.primaryCtaLabel,
                )}
                formClassName="flex max-w-md flex-col gap-3 sm:flex-row"
                inputClassName="flex-1 rounded-full border-0 bg-white/20 px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary-fixed-dim)] disabled:opacity-70"
                buttonClassName="rounded-full bg-[var(--primary-fixed)] px-8 py-3 text-sm font-semibold text-[var(--on-primary-fixed-variant)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              />
            </div>

            <div className="flex flex-col items-center justify-center rounded-[2rem] bg-[var(--secondary-container)] p-12 text-center md:col-span-4">
              <div className="mb-6 text-[var(--primary)]">
                <HiOutlineQrCode className="text-6xl" aria-hidden="true" />
              </div>
              <h4 className="mb-3 text-2xl font-bold text-[var(--on-secondary-container)]">
                {tiktokBlock.title}
              </h4>
              <p className="mb-4 text-sm text-[var(--on-secondary-container)]/80">
                {tiktokBlock.description}
              </p>
              <Link
                href={tiktokBlock.primaryCtaHref || "#"}
                className="inline-flex items-center gap-2 font-bold text-[var(--primary)]"
              >
                <FaTiktok className="text-[18px]" aria-hidden="true" />
                {tiktokBlock.primaryCtaLabel}
              </Link>
            </div>
          </div>
        </MotionSection>
      </div>
    </>
  );
}
