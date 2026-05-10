import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { createWhatsAppLink, formatRupiah } from "@/lib/format";

type ProductDetailPageContentProps = {
  product: Product;
  collectionHref: string;
};

export function ProductDetailPageContent({
  product,
  collectionHref,
}: ProductDetailPageContentProps) {
  const gallery =
    product.galleryItems.length > 0
      ? product.galleryItems
      : [{ imageUrl: product.imageUrl, altText: product.name }];

  return (
    <section className="container-shell py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(234,247,240,0.95),rgba(252,242,233,0.95))] p-5 shadow-[0_28px_80px_-36px_rgba(30,52,43,0.22)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gallery.map((item, index) => (
              <div
                key={`${item.imageUrl}-${index}`}
                className="relative overflow-hidden rounded-[1.35rem] bg-white shadow-[0_20px_50px_-32px_rgba(30,52,43,0.18)]"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.imageUrl}
                    alt={item.altText}
                    fill
                    className="rounded-[1.35rem] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.25rem] bg-white p-7 shadow-[0_28px_80px_-36px_rgba(30,52,43,0.18)] md:p-9">
          <div className="space-y-4">
            {product.badge ? (
              <span className="inline-flex rounded-full bg-[var(--primary-container)]/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-primary-container)]">
                {product.badge}
              </span>
            ) : null}
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
              {product.category}
            </p>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.05em] text-[var(--on-surface)]">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[var(--primary)]">
              {formatRupiah(product.price)}
            </p>
            <p className="text-base leading-8 text-[var(--on-surface-variant)]">
              {product.shortDescription}
            </p>
            <p className="text-base leading-8 text-[var(--on-surface)]">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-xs font-semibold text-[var(--on-surface-variant)]"
              >
                {color}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={createWhatsAppLink(product.name, product.waTemplate ?? undefined)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-base font-semibold text-[var(--on-primary)] transition-transform hover:scale-[1.01]"
            >
              <MessageCircle className="h-5 w-5" />
              Beli Sekarang via WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <section className="rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.16)] lg:col-span-2">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">Fitur Unggulan</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-[1.5rem] bg-[var(--surface-container-low)] p-4"
              >
                <div className="mt-0.5 rounded-full bg-[var(--primary-container)] p-2 text-[var(--on-primary-container)]">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-[var(--on-surface)]">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.16)]">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">Cocok Untuk</h2>
          <ul className="mt-5 space-y-3">
            {product.audiences.map((audience) => (
              <li
                key={audience}
                className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-3 text-sm leading-7 text-[var(--on-surface)]"
              >
                {audience}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.16)]">
        <h2 className="text-2xl font-bold text-[var(--on-surface)]">Spesifikasi</h2>
        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--outline-variant)]/20">
          <table className="min-w-full divide-y divide-[var(--outline-variant)]/20">
            <tbody className="divide-y divide-[var(--outline-variant)]/20">
              {product.specs.map((spec) => (
                <tr key={spec.label} className="bg-white">
                  <th className="w-[34%] bg-[var(--surface-container-low)] px-4 py-4 text-left text-sm font-semibold text-[var(--on-surface)]">
                    {spec.label}
                  </th>
                  <td className="px-4 py-4 text-sm text-[var(--on-surface-variant)]">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-10">
        <Link
          href={collectionHref}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--outline-variant)]/30 bg-white px-6 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--surface-container-low)]"
        >
          Kembali ke koleksi
        </Link>
      </div>
    </section>
  );
}
