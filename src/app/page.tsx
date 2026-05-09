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
import { createMetadata } from "@/lib/seo";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "Beranda",
  description:
    "Homepage Kembung dengan tampilan pastel lifestyle untuk brand tumbler estetik, fun, dan friendly.",
  path: "/",
});

const desktopBestSellers = [
  {
    name: "Kembung Minty",
    description: "Essential hydration for busy days.",
    price: "Rp 189.000",
    href: "/produk/kembung-pastel-bottle",
    badge: "Hot Pick",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIqIFBoLrXgCyV6qQfzrZ_BEUPHZ6Q9InbttFh2rbAEYFY6ThFq2NgODKOGW__bxy97ZzrW4pFBn3xHLa193Tyl_aC1d6Ns8mffC_99yNFHAlnCTU-IMyYc7OwQ_dKw8OJ_hiIFNN3X5iiJJki2i1iCmMUXdZJC_aLeDgMT6aLYRCuWe76h4zldNHoQFNUKizV3zI62krmrj9wTlqGVSqFedseoJlUClFLM6L0hVwVeDANkSLDq2i04tu-tGXJWRVWPVgcpIP6gYfq",
    background: "bg-[var(--primary-container)]/10",
  },
  {
    name: "Kembung Peachy",
    description: "Perfectly warm, perfectly cool.",
    price: "Rp 195.000",
    href: "/produk/tumbler-custom-name",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjb5cDoqSpOuuvg_5moJXPutVRFNELOQKp3rJ_KxZB3spbH27F_3TwP3W6_FZV62fZAGmHuBXn9Rk4dA04hd4qWBRxivR_FMjkQtDCzv7W1n3VvfImdrgn3C5b9E-ffueYm9duvM1P7BQH2IIwpFw31IoeUanAuhP8EswKNkTZZ_XTjk3-FbxSpxZ7o-DN-Xv14oh8ietQyTscKnMukFXFmElUVxtcwS1o-f1AK00OVfUOu39gkhNjWxA5KN5hEnjxun6xPMWmmY7E",
    background: "bg-[var(--secondary-container)]/10",
  },
  {
    name: "Kembung Sky",
    description: "Light as air, keeps your focus.",
    price: "Rp 189.000",
    href: "/produk/tumbler-travel-flask",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjL7u9Z8lv9UQzqR4utAcG347IBI0MSDQLt-RGevg6T5I49mB5femYuHI52yjPCuY0gE35Lss-91Lu3W00e8AGwxAuOjS6n4GyLDOGWyaMDHwg0hfKh2crZCMcJblZId09nkrhVRWg9BC1Or6PI1W0RePD5B_1yi9bwrmSuYZzL0KNWcDShk0xqKKe0n9tA4aIv5bO2c1kEPZiDnFCKHm4OiTNnN1gG_FtIkBFyEVchKa7VXb0Wc0sxLszy3TEjkHSdFVMSJUIRVUJ",
    background: "bg-[var(--tertiary-container)]/10",
  },
];

const mobileBestSellers = [
  {
    name: "Minty Fresh 750ml",
    price: "Rp 249.000",
    href: "/produk/tumbler-travel-flask",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6NSFBuwKZGZ_ruKwZIVHy8sNBEsfcrzciS_sanUMWN8W4_kEq4iv_UhDT3s-6QFLZXl5GHefdfnbfhkv16GME4gTUPWHPzBPjAk2JuZ5Gd8s_SKBZpvtD9GGG9KiaVVQIev0X88hJXK1TTKc2r35qdCbyekE7kDLMdtU1M6skRdN8dhl1gW8qM-aXjr5Ohlv1I2ZVS5AtwTtCdHWJ2yR4dTJLP5VOkhG-GzI3P7G-kERT0GcznWp1YRn7ew2XsCzGmjT85_xqBpp",
    background: "bg-[var(--secondary-container)]",
  },
  {
    name: "Coral Glow 1L",
    price: "Rp 299.000",
    href: "/produk/tumbler-custom-name",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J5H5Nwg5THhTw1Fq51C-BMJgtQJYtM5MtjzW-VykItwF0sDnYUofedOYBoAiBwh7XXTdmglg5pf7Poz23tv9Nnu36mn9TKuGMjP7u8nTzOW9G3y7GaT9VtyW3Lgc2jbh9mAX0iST6bTXPcaYwbAmE0h-Ix2ykJbZ8IHsYeQFIDu8NOK8rOs20AuarZNLCNHkwAD-dIhnx61MyA3zaZQVDrRerCueLt8EH32IKxG2DoKjnXV_1TjAWN4cFN0EznHw1b73AQfHF8rD",
    background: "bg-[var(--tertiary-container)]",
  },
  {
    name: "Cloud White 500ml",
    price: "Rp 199.000",
    href: "/produk/kembung-pastel-bottle",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDK6cGReqXkWeTgh1RmFB754BzlRpwnpcmnrqz7sunjMMlUVggdc4uMWNfkNOE7CMMOEdGNYjS2fGpAHl8ANCuWygUj4aVsovlr8gfWn4mftj13qZZs3VKfpdlS9RMNnGNojBGIg1CL-Tb3cMtU_pwtkCsfa2kTNuGE9oVssbMxKuymhhkhQAtW4IZ9TYzz6VCpLqNLlMWt1dYEA9eJoNeaAlZIA8wCO1LDdk40oDm2zH2bxwmVM1MgOyH5obgFb8XTkWRbUvFbWLZk",
    background: "bg-[var(--primary-container)]",
  },
];

const desktopReasons = [
  {
    icon: HiOutlineShieldCheck,
    title: "BPA Free",
    description: "Material premium yang aman banget buat kesehatan kamu.",
    card: "bg-[var(--secondary-container)]/50",
    circle: "bg-[var(--primary-container)]",
    titleColor: "text-[var(--on-secondary-container)]",
    textColor: "text-[var(--on-secondary-container)]/80",
  },
  {
    icon: TbSnowflake,
    title: "Keep Cold 24h",
    description: "Air es tetep sejuk seharian meskipun di bawah terik matahari.",
    card: "bg-[var(--primary-container)]/30",
    circle: "bg-[var(--primary-container)]",
    titleColor: "text-[var(--on-primary-container)]",
    textColor: "text-[var(--on-primary-container)]/80",
  },
  {
    icon: LuLeaf,
    title: "Eco-friendly",
    description: "Kurangi sampah plastik dengan cara yang paling estetik.",
    card: "bg-[var(--tertiary-container)]/30",
    circle: "bg-[var(--tertiary-container)]/50",
    titleColor: "text-[var(--on-tertiary-container)]",
    textColor: "text-[var(--on-tertiary-container)]/80",
  },
];

const mobileReasons = [
  {
    icon: LuLeaf,
    title: "Eco-Conscious Choice",
    description:
      "Dibuat dari material premium yang tahan lama, mengurangi limbah plastik sekali pakai dengan gaya.",
    className: "col-span-2 bg-[var(--surface-container-lowest)]",
    iconWrap: "bg-[var(--primary-container)] text-[var(--on-primary-container)]",
    titleClass: "text-[var(--primary)]",
    textClass: "text-[var(--on-surface-variant)]",
  },
  {
    icon: TbSnowflake,
    title: "24H Cold",
    description: "Stay fresh seharian.",
    className: "bg-[var(--secondary-container)]",
    iconWrap: "bg-white text-[var(--primary)]",
    titleClass: "text-[var(--primary)]",
    textClass: "text-[var(--on-secondary-container)]",
  },
  {
    icon: HiOutlineHeart,
    title: "Aesthetic",
    description: "Vibrant colors.",
    className: "bg-[var(--tertiary-container)]",
    iconWrap: "bg-white text-[var(--tertiary)]",
    titleClass: "text-[var(--tertiary)]",
    textClass: "text-[var(--on-tertiary-container)]",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          telephone: SITE.phoneDisplay,
          slogan: SITE.tagline,
        }}
      />

      <div className="md:hidden">
        <section className="container-shell py-4 pb-10">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_18px_46px_-24px_rgba(61,103,81,0.28)]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARtjaQZLS6fD9vaWTC-WsDJXN0FS71l74uI8xb5-YmTdtG8egQ3MsyDLez9UwwvBt9x4kXBOg_ct1uckkcnKp-oDpBBsAyHc0bM5FeZnw2wCIuAMdMFJ1rm0ckDyvFUa53nGQ0qNc2xkmThpCCr_oMIgUojMrucBCU-a386aju9UjF-Ux7hIrypVtB5PoTY-iaAYOiqY2RiQIqU8Ch7B5jlft0kUsvAYtejMPfBu23XFD_fbUO4kNmt2clU3iRHiKfX6peiEwAJiam"
              alt="Stylish young woman holding a mint green Kembung bottle in a warm minimalist studio."
              width={900}
              height={1125}
              className="aspect-[4/5] w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5">
              <span className="mb-2 inline-flex rounded-full bg-[var(--primary-container)] px-3 py-1 text-[10px] font-semibold text-[var(--on-primary-container)]">
                Perfectly Hydrated
              </span>
              <h1 className="text-[2.35rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
                Gak Cuma Haus,
                <br />
                Tapi Puas.
              </h1>
            </div>
          </div>

          <div className="space-y-5 px-1 pt-5">
            <p className="text-[1.05rem] leading-8 text-[var(--on-surface-variant)]">
              Reclaim the word &quot;Kembung&quot;. It&apos;s not about being bloated,
              it&apos;s about being perfectly satisfied and full of life.
            </p>
            <Link
              href="/produk"
              className="flex min-h-14 w-full items-center justify-center rounded-full bg-[var(--primary-container)] px-6 py-4 text-sm font-semibold text-[var(--on-primary-container)] shadow-[0_18px_38px_-22px_rgba(61,103,81,0.35)] transition-transform duration-200 active:scale-[0.98]"
            >
              Shop Collection
            </Link>
          </div>
        </section>

        <section className="py-8">
          <div className="container-shell mb-5 flex items-end justify-between">
            <h2 className="text-[1.65rem] font-bold tracking-[-0.03em] text-[var(--primary)]">
              Best Sellers
            </h2>
            <Link
              href="/produk"
              className="translate-y-[5px] border-b border-[var(--primary-container)] text-sm text-[var(--primary)]"
            >
              View All
            </Link>
          </div>

          <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1">
            {mobileBestSellers.map((item) => (
              <Link
                key={item.name}
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
              Kenapa Kembung?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {mobileReasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <article
                    key={reason.title}
                    className={`${reason.className} rounded-[1.9rem] border border-[var(--outline-variant)]/30 p-5`}
                  >
                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${reason.iconWrap}`}
                    >
                      <Icon className="text-lg" aria-hidden="true" />
                    </div>
                    <h3 className={`mb-2 text-[1.05rem] font-semibold ${reason.titleClass}`}>
                      {reason.title}
                    </h3>
                    <p className={`text-sm leading-7 ${reason.textClass}`}>
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
              Dapetin Info Drop
            </h2>
            <p className="text-[1.02rem] leading-8 text-[var(--on-surface-variant)]">
              Jadilah yang pertama tahu saat koleksi terbatas kami rilis. No
              spam, just joyful hydration.
            </p>
          </div>

          <NewsletterSignupForm
            source="home-mobile"
            inputPlaceholder="Email lo apa?"
            buttonLabel="Gue Mau Join"
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
              New Collection 2026
            </div>
            <div className="animate-fade-up space-y-6 [animation-delay:100ms]">
              <h1 className="text-[48px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--primary)] lg:text-[56px]">
                Stay Hydrated,
                <br />
                Stay Kembung
              </h1>
              <p className="max-w-lg text-lg leading-8 text-[var(--on-surface-variant)]">
                Biar gak haus-haus banget, yuk Kembung bareng! Botol minum
                gemas yang bikin kamu rajin minum air tanpa usaha lebih.
              </p>
            </div>
            <div className="animate-fade-up flex flex-wrap gap-4 pt-1 [animation-delay:200ms]">
              <Link
                href="/produk"
                className="soft-glow-primary rounded-full bg-[var(--primary)] px-11 py-4 text-sm font-semibold text-[var(--on-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]"
              >
                Cek Koleksi
              </Link>
              <Link
                href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--surface-container-high)] px-11 py-4 text-sm font-semibold text-[var(--on-surface-variant)] transition-all duration-200 hover:bg-[var(--surface-container-highest)] active:scale-[0.97]"
              >
                Chat Admin
              </Link>
            </div>
          </div>

          <div className="animate-fade-up group relative [animation-delay:260ms]">
            <div className="absolute -inset-4 rounded-[32px] bg-[var(--primary-container)]/18 blur-3xl transition-colors group-hover:bg-[var(--primary-container)]/26" />
            <div className="soft-glow-primary relative overflow-hidden rounded-[32px]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9OU844Y3W_-EFcUVfx-4SyQwwD34O6_xVTTU760En1bhkP9ptWqYobzpZcqYQd-5ulrzk2rODJYUshq05J_7sjGqA47-uQv6g_Gj5xSalbXZhDHRWkzA_q8csZS-NgIVvckEHSXNl-nSeqCPU8gQ2bIj3VxW7BCOCTI2v5aGxI7ddV_Nwt97csS_1ANn7Um6GYMkj09ts2LQeaW9GX7A02Z3yAxN9P6cZaLMpmzgleHa8ybCET4VFAWtPTHc3MI6wX_XC724gYZc3"
                alt="A collection of minimalist pastel tumblers in soft mint green, peach cream, and baby blue colors."
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
                  Best Sellers
                </h2>
                <p className="text-[var(--on-surface-variant)]">
                  Koleksi favorit paling sering di-checkout!
                </p>
              </div>
              <Link
                href="/produk"
                className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)] transition-all hover:gap-2"
              >
                Lihat Semua Produk
                <HiOutlineArrowRight className="text-[18px]" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              {desktopBestSellers.map((item) => (
                <AnimatedCard
                  key={item.name}
                  className="group rounded-[2rem] border border-[var(--outline-variant)]/25 bg-[var(--surface-bright)] p-5"
                >
                  <Link href={item.href} className="block">
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
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                        Lihat Detail
                        <HiOutlineArrowRight className="text-[18px]" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                  <div className="mt-6">
                    <Link
                      href={buildWhatsAppUrl(`Halo Kembung, saya tertarik dengan ${item.name}.`)}
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
              Kenapa Kembung?
            </h2>
            <p className="text-lg text-[var(--on-surface-variant)]">
              Kita gak cuma jual botol, kita jual kebahagiaan setiap tegukan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {desktopReasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.title}
                  className={`${reason.card} group flex flex-col items-center rounded-[2rem] border border-transparent p-12 text-center transition-all duration-300 hover:border-[var(--primary-container)] hover:shadow-[0_28px_60px_-28px_rgba(168,213,186,0.45)]`}
                >
                  <div
                    className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${reason.circle} text-[var(--primary)]`}
                  >
                    <div className="transition-transform duration-300 group-hover:rotate-[8deg]">
                      <Icon className="text-[40px]" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className={`mb-3 text-2xl font-bold ${reason.titleColor}`}>
                    {reason.title}
                  </h3>
                  <p className={reason.textColor}>{reason.description}</p>
                </article>
              );
            })}
          </div>
        </MotionSection>

        <MotionSection className="container-shell py-20">
          <div className="grid h-auto grid-cols-1 gap-4 md:h-[400px] md:grid-cols-12">
            <div className="flex flex-col justify-center rounded-[2rem] bg-[var(--primary)] p-12 text-[var(--on-primary)] md:col-span-8">
              <h3 className="mb-6 text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em]">
                Dapetin Info Drop Terbaru!
              </h3>
              <p className="mb-8 max-w-md text-lg opacity-90">
                Join circle Kembung dan dapetin promo khusus Gen Z & Creative
                Professionals setiap bulannya.
              </p>
              <NewsletterSignupForm
                source="home-desktop"
                inputPlaceholder="Email kamu..."
                buttonLabel="Daftar"
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
                Follow TikTok
              </h4>
              <p className="mb-4 text-sm text-[var(--on-secondary-container)]/80">
                Scan buat liat review jujur & POV Kembung.
              </p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 font-bold text-[var(--primary)]"
              >
                <FaTiktok className="text-[18px]" aria-hidden="true" />
                @kembung.official
              </Link>
            </div>
          </div>
        </MotionSection>
      </div>
    </>
  );
}
