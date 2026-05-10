"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { createWhatsAppLink, formatRupiah } from "@/lib/format";

type ProductCardProps = {
  product: Product;
};

function getHighlightSpecs(product: Product) {
  return product.specs.filter((spec) =>
    ["kapasitas", "insulasi"].includes(spec.label.trim().toLowerCase()),
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const highlightSpecs = getHighlightSpecs(product);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--outline-variant)]/20 bg-white shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(180deg,rgba(234,247,240,0.95),rgba(252,242,233,0.95))] p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-32px_rgba(30,52,43,0.34)]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-[0.12em] text-[var(--primary)] shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            {product.category}
          </p>
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--on-surface)]">
            {product.name}
          </h2>
          <p className="text-2xl font-bold text-[var(--primary)]">
            {formatRupiah(product.price)}
          </p>
          <p className="text-sm leading-7 text-[var(--on-surface-variant)]">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <span
              key={color}
              className="rounded-full bg-[var(--surface-container-low)] px-3 py-1 text-xs font-semibold text-[var(--on-surface-variant)]"
            >
              {color}
            </span>
          ))}
          {highlightSpecs.map((spec) => (
            <span
              key={`${product.slug}-${spec.label}`}
              className="rounded-full bg-[var(--primary-container)]/50 px-3 py-1 text-xs font-semibold text-[var(--on-primary-container)]"
            >
              {spec.label}: {spec.value}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-3 pt-6">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--surface-container-low)] px-5 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-container)]/45"
          >
            Detail Produk
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={createWhatsAppLink(product.name, product.waTemplate ?? undefined)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--on-primary)] transition-transform hover:scale-[1.01]"
          >
            <MessageCircle className="h-4 w-4" />
            Beli via WhatsApp
          </Link>
        </div>
      </div>
    </article>
  );
}
