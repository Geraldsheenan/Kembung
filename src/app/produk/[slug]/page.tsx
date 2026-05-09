import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  HiOutlineArrowRight,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCheckCircle,
  HiOutlineFire,
  HiOutlineTruck,
} from "react-icons/hi2";
import { LuRuler } from "react-icons/lu";
import { TbSnowflake } from "react-icons/tb";
import { JsonLd } from "@/components/seo/json-ld";
import { products, SITE } from "@/data/site";
import { createMetadata } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const relatedCardBackgrounds = [
  "bg-[var(--tertiary-fixed)]",
  "bg-[var(--secondary-fixed)]",
  "bg-[var(--primary-fixed)]",
  "bg-[var(--surface-container-highest)]",
];

function getSpecValue(product: (typeof products)[number], label: string, fallback: string) {
  return product.specs.find((item) => item.label === label)?.value ?? fallback;
}

function getRelatedProducts(currentSlug: string, count = 4) {
  const baseItems = products.filter((item) => item.slug !== currentSlug);

  if (baseItems.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => baseItems[index % baseItems.length]);
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return createMetadata({
      title: "Produk Tidak Ditemukan",
      description: "Produk Kembung tidak ditemukan.",
      path: "/produk",
    });
  }

  return createMetadata({
    title: product.name,
    description: `${product.name} - ${product.shortDescription} Harga ${product.price}.`,
    path: `/produk/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const capacity = getSpecValue(product, "Kapasitas", "500 ml");
  const coldLabel = getSpecValue(product, "Insulasi", "Cold 24 jam, warm 12 jam")
    .split(",")[0]
    ?.replace("jam", "h")
    .trim() ?? "Cold 24h";
  const hotLabel =
    getSpecValue(product, "Insulasi", "Cold 24 jam, warm 12 jam")
      .split(",")[1]
      ?.replace("warm", "Hot")
      .replace("jam", "h")
      .trim() ?? "Hot 12h";
  const relatedProducts = getRelatedProducts(product.slug, 4);
  const mobileRelatedProducts = getRelatedProducts(product.slug, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: [product.image, ...product.gallery],
          brand: { "@type": "Brand", name: SITE.name },
          offers: {
            "@type": "Offer",
            priceCurrency: "IDR",
            price: product.price.replace(/[^\d]/g, ""),
            availability: "https://schema.org/InStock",
          },
        }}
      />

      <section className="hidden md:block">
        <div className="container-shell py-20">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="relative flex items-center justify-center overflow-visible rounded-[2rem] bg-[var(--secondary-container)] p-16">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={900}
                  height={900}
                  className="w-full max-w-sm transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute left-8 top-8 rounded-full bg-[var(--primary-container)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-primary-container)]">
                  Best Seller
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[product.image, ...product.gallery.slice(0, 2)].map((image) => (
                  <div
                    key={image}
                    className="aspect-square overflow-hidden rounded-[1.25rem] bg-[var(--surface-container)] transition-all duration-200 hover:ring-2 hover:ring-[var(--primary)]"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8 lg:col-span-5">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                  Kembung Classic Series
                </span>
                <h1 className="text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--on-surface)]">
                  {product.name}
                </h1>
                <p className="text-2xl font-bold text-[var(--primary)]">{product.price}</p>
              </div>

              <div className="space-y-5">
                <p className="text-lg leading-8 text-[var(--on-surface-variant)]">
                  Kesegaran yang terjaga sepanjang hari. Minty Fresh hadir dengan warna
                  yang menenangkan, cocok untuk melengkapi produktivitasmu tanpa rasa
                  haus.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-[var(--surface-container-high)] px-4 py-2 text-sm font-semibold">
                    <LuRuler className="text-[var(--primary)]" aria-hidden="true" />
                    500ml
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[var(--surface-container-high)] px-4 py-2 text-sm font-semibold">
                    <TbSnowflake className="text-[var(--primary)]" aria-hidden="true" />
                    Cold 24h
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-[var(--surface-container-high)] px-4 py-2 text-sm font-semibold">
                    <HiOutlineFire className="text-[var(--primary)]" aria-hidden="true" />
                    Hot 12h
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-[var(--secondary-fixed)] p-6">
                <div className="space-y-4">
                  {[
                    "Double Wall Insulation",
                    "BPA Free & Food Grade",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-4">
                      <HiOutlineCheckCircle className="mt-1 text-[var(--primary)]" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-[var(--on-secondary-container)]">{feature}</p>
                        <p className="text-sm text-[var(--on-secondary-container)]/70">
                          {feature === "Double Wall Insulation"
                            ? "Menghindari embun di bagian luar botol."
                            : "Material stainless steel premium 304."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link
                  href={buildWhatsAppUrl(`Halo Kembung, saya ingin beli ${product.name}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-16 items-center justify-center gap-3 rounded-full bg-[var(--primary)] text-xl font-bold text-[var(--on-primary)] shadow-lg shadow-[var(--primary)]/10 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <HiOutlineChatBubbleOvalLeft className="text-[22px]" aria-hidden="true" />
                  Beli Sekarang via WhatsApp
                </Link>
              </div>

              <div className="border-t border-[var(--surface-container-highest)] pt-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--outline)]">
                  Pengiriman
                </p>
                <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
                  <HiOutlineTruck aria-hidden="true" />
                  <span>Gratis ongkir untuk wilayah Jabodetabek.</span>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-[2rem] font-bold text-[var(--on-surface)]">Produk Lainnya</h2>
                <p className="text-[var(--on-surface-variant)]">
                  Lengkapi koleksi hidrasimu dengan warna favorit.
                </p>
              </div>
              <Link href="/produk" className="flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                Lihat Semua <HiOutlineArrowRight className="text-sm" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <Link key={item.slug} href={`/produk/${item.slug}`} className="group block">
                  <div
                    className={`relative mb-4 flex h-64 items-center justify-center overflow-hidden rounded-[1.25rem] p-4 ${
                      relatedCardBackgrounds[index % relatedCardBackgrounds.length]
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={300}
                      className="w-32 transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/50 backdrop-blur-md">
                      +
                    </div>
                  </div>
                  <p className="font-semibold text-[var(--on-surface)]">{item.name}</p>
                  <p className="font-bold text-[var(--primary)]">{item.price}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-28 pt-8 md:hidden">
        <div className="mb-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--secondary-container)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              loading="eager"
              className="object-cover"
            />
          </div>
        </div>

        <section className="mb-4">
          <h1 className="max-w-[15rem] text-[2rem] font-extrabold leading-tight tracking-[-0.03em] text-[var(--on-surface)]">
            {product.name}
          </h1>
          <p className="mt-2 text-[2rem] font-bold leading-none text-[var(--primary)]">
            {product.price}
          </p>
        </section>

        <section className="mb-5 flex flex-wrap gap-2.5">
          <div className="flex items-center gap-2 rounded-full bg-[var(--primary-container)]/35 px-4 py-2.5 text-[var(--on-primary-container)]">
            <LuRuler className="text-[18px]" aria-hidden="true" />
            <span className="text-sm font-semibold">{capacity.replace(" ", "")}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--tertiary-container)]/35 px-4 py-2.5 text-[var(--on-tertiary-container)]">
            <TbSnowflake className="text-[18px]" aria-hidden="true" />
            <span className="text-sm font-semibold">{coldLabel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--secondary-container)] px-4 py-2.5 text-[var(--on-secondary-container)]">
            <HiOutlineFire className="text-[18px]" aria-hidden="true" />
            <span className="text-sm font-semibold">{hotLabel}</span>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center gap-4 rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-4">
            <div className="rounded-full bg-[var(--primary-container)] p-2.5 text-[var(--on-primary-container)]">
              <HiOutlineTruck className="text-[20px]" aria-hidden="true" />
            </div>
            <p className="text-sm leading-6 text-[var(--on-surface-variant)]">
              Gratis ongkir untuk wilayah Jabodetabek
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-[var(--on-surface)]">Key Features</h2>
          <ul className="space-y-4">
            {product.features.slice(0, 5).map((feature) => (
              <li key={feature} className="flex items-center gap-4">
                <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                <p className="text-base leading-7 text-[var(--on-surface)]">{feature}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold text-[var(--on-surface)]">Produk Lainnya</h2>
            <Link href="/produk" className="text-sm font-semibold text-[var(--primary)]">
              See all
            </Link>
          </div>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
            {mobileRelatedProducts.map((item, index) => (
              <Link
                key={item.slug}
                href={`/produk/${item.slug}`}
                className="min-w-[12.5rem] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_8px_30px_rgba(168,213,186,0.1)]"
              >
                <div
                  className={`h-[12.5rem] ${
                    index % 3 === 0
                      ? "bg-[var(--secondary-fixed)]"
                      : index % 3 === 1
                        ? "bg-[var(--primary-fixed)]"
                        : "bg-[var(--tertiary-fixed)]"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="mb-1 text-sm font-semibold text-[var(--on-surface)]">{item.name}</p>
                  <p className="text-xs font-semibold text-[var(--primary)]">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="fixed bottom-20 left-0 z-40 w-full px-4 py-2">
          <Link
            href={buildWhatsAppUrl(`Halo Kembung, saya ingin beli ${product.name}.`)}
            target="_blank"
            rel="noreferrer"
            className="mx-auto flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--on-primary)] shadow-[0_8px_30px_rgba(61,103,81,0.3)] transition-transform duration-200 active:scale-95"
          >
            <HiOutlineChatBubbleOvalLeft className="text-[18px]" aria-hidden="true" />
            Beli Sekarang via WhatsApp
          </Link>
        </div>
      </section>
    </>
  );
}
