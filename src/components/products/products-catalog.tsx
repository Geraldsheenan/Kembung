"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCheckBadge,
  HiOutlineTruck,
} from "react-icons/hi2";
import type { Product } from "@/data/site";
import { buildProductMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type ProductsCatalogProps = {
  products: Product[];
};

const desktopCardTones = [
  "bg-[var(--primary-fixed)]/20",
  "bg-[var(--secondary-container)]/40",
  "bg-[var(--surface-container-high)]",
  "bg-[var(--secondary-fixed)]/30",
];

const mobileCardTones = [
  "bg-[var(--secondary-container)]",
  "bg-[var(--tertiary-container)]",
  "bg-[var(--primary-container)]",
  "bg-[var(--surface-container-highest)]",
];

const benefits = [
  { title: "Free Shipping", subtitle: "Min. order Rp 500k" },
  { title: "Lifetime Warranty", subtitle: "For all insulation" },
];

function getCategories(products: Product[]) {
  return ["Semua", ...new Set(products.map((product) => product.category))];
}

function getCapacity(product: Product) {
  return (
    product.specs.find((spec) => spec.label.toLowerCase().includes("kapasitas"))?.value ??
    "Daily Use"
  );
}

export function ProductsCatalog({ products }: ProductsCatalogProps) {
  const categories = useMemo(() => getCategories(products), [products]);
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "Semua");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Semua") {
      return products;
    }

    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <>
      <section className="mb-14 hidden flex-wrap items-center justify-center gap-4 md:flex md:justify-start">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`min-h-12 min-w-[170px] rounded-full px-8 py-3 text-base font-semibold transition-all duration-200 ${
                active
                  ? "bg-[var(--primary)] text-[var(--on-primary)]"
                  : "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </section>

      <section className="hidden grid-cols-1 gap-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product, index) => (
          <article
            key={product.slug}
            className={`group relative flex flex-col rounded-[2.25rem] p-6 pt-5 transition-all duration-300 hover:shadow-2xl ${
              desktopCardTones[index % desktopCardTones.length]
            }`}
          >
            <div className="relative mb-6 aspect-square overflow-hidden rounded-[1.6rem] shadow-[0_18px_38px_-22px_rgba(61,103,81,0.24)] transition-transform duration-300 group-hover:-translate-y-3">
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-cover"
              />
              {product.badge ? (
                <div className="absolute right-3 top-3 rounded-full bg-[var(--tertiary-container)] px-4 py-1.5 text-[0.95rem] font-semibold text-[var(--on-tertiary-container)]">
                  {product.badge}
                </div>
              ) : null}
            </div>

            <h3 className="mb-1 text-2xl font-bold text-[var(--primary)]">
              {product.name}
            </h3>
            <p className="mb-2 text-sm text-[var(--on-surface-variant)]">
              {getCapacity(product)} • {product.category}
            </p>
            <p className="mb-5 text-sm leading-7 text-[var(--on-surface-variant)]">
              {product.shortDescription}
            </p>

            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {product.price}
                </span>
                <Link
                  href={`/produk/${product.slug}`}
                  className="text-sm font-semibold text-[var(--primary)] hover:underline"
                >
                  Detail
                </Link>
              </div>
              <Link
                href={buildWhatsAppUrl(buildProductMessage(product.name))}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--on-primary)] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <HiOutlineChatBubbleOvalLeft className="text-[18px]" aria-hidden="true" />
                Beli via WA
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="md:hidden">
        <div className="mb-8">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-11 whitespace-nowrap rounded-full px-4 py-2 text-center text-[12px] font-semibold leading-tight ${
                    active
                      ? "bg-[var(--primary)] text-[var(--on-primary)]"
                      : "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-5">
            {filteredProducts.map((product, index) => (
              <article key={product.slug} className="group flex flex-col gap-3">
                <Link href={`/produk/${product.slug}`} className="block">
                  <div
                    className={`relative flex aspect-[4/5] items-center justify-center overflow-visible rounded-[1.75rem] p-4 ${
                      mobileCardTones[index % mobileCardTones.length]
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={700}
                      height={700}
                      className="h-full w-full rounded-[1.2rem] object-cover drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="px-1 pt-3">
                    <h3 className="text-sm font-semibold text-[var(--on-surface)]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[var(--primary)]">{product.category}</p>
                    <p className="text-sm text-[var(--on-surface-variant)]">{product.price}</p>
                  </div>
                </Link>

                <div className="px-1">
                  <Link
                    href={buildWhatsAppUrl(buildProductMessage(product.name))}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-3 text-sm font-semibold text-[var(--on-primary)] transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <HiOutlineChatBubbleOvalLeft className="text-[18px]" aria-hidden="true" />
                    Beli via WA
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <section className="mx-4 mt-16 rounded-[1.75rem] bg-[var(--surface-container-low)] px-5 py-6">
          <div className="flex flex-col gap-5">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-4">
                <div className="rounded-full bg-[var(--primary-container)] p-2 text-[var(--on-primary-container)]">
                  {benefit.title === "Free Shipping" ? (
                    <HiOutlineTruck className="text-lg" aria-hidden="true" />
                  ) : (
                    <HiOutlineCheckBadge className="text-lg" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[var(--on-surface)]">{benefit.title}</p>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}
