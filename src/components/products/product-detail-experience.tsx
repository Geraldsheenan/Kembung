"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { HiOutlineCheck, HiOutlineCheckCircle, HiOutlineTruck } from "react-icons/hi2";
import type { Product } from "@/data/site";
import { AnimatedButton } from "@/components/animation/animated-button";
import { FAQAccordion } from "@/components/animation/faq-accordion";
import { Modal } from "@/components/animation/modal";
import { ProductCard } from "@/components/cards/product-card";
import { LimitedRichText } from "@/components/common/limited-rich-text";
import { SectionHeading } from "@/components/common/section-heading";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { buildProductMessage } from "@/lib/whatsapp";

type ProductDetailExperienceProps = {
  product: Product;
  relatedProducts: Product[];
};

function colorTone(name: string) {
  const map: Record<string, string> = {
    "Mint Green": "#A8D5BA",
    "Soft Cream": "#F6E7D8",
    "Peach Coral": "#FFB5A7",
    "Cloud White": "#F6F2EB",
    "Sky Blue": "#B8D8E8",
    Olive: "#8DAE8E",
    Peach: "#F4B4A4",
    Terracotta: "#D88E7A",
    Charcoal: "#465056",
  };

  return map[name] ?? "#A8D5BA";
}

export function ProductDetailExperience({
  product,
  relatedProducts,
}: ProductDetailExperienceProps) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeColor, setActiveColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const gallery = useMemo(() => [product.image, ...product.gallery], [product.gallery, product.image]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-[24px] bg-[var(--secondary-container)] p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeImage}-${activeColor}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28 }}
              >
                <Image
                  src={activeImage}
                  alt={product.name}
                  width={900}
                  height={1000}
                  className="mx-auto h-auto w-full max-w-sm object-contain shadow-[0_20px_50px_rgba(61,103,81,0.12)]"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((image, index) => {
              const active = activeImage === image;

              return (
                <motion.button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className={`rounded-[18px] border p-3 ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary-container)]/30"
                      : "border-[var(--outline-variant)]/25 bg-[var(--surface-container)]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} galeri ${index + 1}`}
                    width={400}
                    height={400}
                    className="aspect-square w-full rounded-[14px] object-cover"
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            {product.category}
          </p>
          <h1 className="text-[48px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--on-surface)]">
            {product.name}
          </h1>
          <p className="mt-3 text-[32px] font-bold text-[var(--primary)]">{product.price}</p>
          <LimitedRichText
            value={product.description}
            className="mt-6 text-lg leading-8 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-full bg-[var(--surface-container-high)] px-4 py-2"
              >
                <LimitedRichText
                  as="span"
                  value={spec.value}
                  className="text-sm font-semibold text-[var(--on-surface)] [&_em]:italic [&_strong]:font-bold [&_u]:underline"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--outline)]">
              Pilih Warna
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const active = activeColor === color;
                return (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => {
                      setActiveColor(color);
                      setActiveImage(gallery[0]);
                    }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                    className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-3 py-2 pr-4 text-sm font-semibold ${
                      active
                        ? "border-[var(--primary)] bg-[var(--primary-container)]/30 text-[var(--primary)]"
                        : "border-[var(--outline-variant)]/35 bg-white text-[var(--on-surface-variant)]"
                    }`}
                  >
                    <motion.span
                      animate={reduceMotion || !active ? undefined : { boxShadow: ["0 0 0 0 rgba(168,213,186,0.0)", "0 0 0 6px rgba(168,213,186,0.24)", "0 0 0 0 rgba(168,213,186,0.0)"] }}
                      transition={{ duration: 0.55 }}
                      className="h-6 w-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: colorTone(color) }}
                    />
                    {color}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-[var(--outline-variant)]/35 bg-white p-1">
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-[var(--primary)]"
              >
                -
              </motion.button>
              <motion.div
                key={quantity}
                initial={reduceMotion ? false : { scale: 0.86, opacity: 0.6 }}
                animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                className="min-w-10 text-center text-base font-bold text-[var(--on-surface)]"
              >
                {quantity}
              </motion.div>
              <motion.button
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                onClick={() => setQuantity((current) => current + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-[var(--primary)]"
              >
                +
              </motion.button>
            </div>
            <AnimatedButton
              variant="secondary"
              icon="arrow"
              className="flex-1"
              onClick={() => setOrderOpen(true)}
            >
              Order Cepat
            </AnimatedButton>
          </div>

          <div className="mt-8 rounded-[20px] bg-[var(--secondary-fixed)] p-5">
            {product.features.slice(0, 3).map((feature) => (
              <div key={feature} className="flex items-start gap-3 py-3">
                <motion.span whileHover={reduceMotion ? undefined : { rotate: 6 }}>
                  <HiOutlineCheckCircle className="text-[18px] text-[var(--primary)]" aria-hidden="true" />
                </motion.span>
                <div>
                  <p className="font-semibold text-[var(--on-secondary-container)]">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <WhatsAppButton
              message={buildProductMessage(product.name)}
              label="Beli Sekarang via WhatsApp"
              className="w-full py-5 text-base"
            />
            <Link
              href="/hubungi-kami"
              className="rounded-full border-2 border-[var(--outline-variant)] px-6 py-4 text-center font-semibold text-[var(--on-surface-variant)] transition-all hover:border-[#FFB5A7]"
            >
              Tambah ke Keranjang
            </Link>
          </div>

          <div className="mt-8 border-t border-[var(--surface-container-highest)] pt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--outline)]">
              Pengiriman
            </p>
            <div className="flex items-center gap-3 text-[var(--on-surface-variant)]">
              <HiOutlineTruck className="text-[18px] text-[var(--primary)]" aria-hidden="true" />
              <span>Gratis ongkir untuk wilayah Jabodetabek.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] bg-[var(--surface-container-low)] p-8">
          <SectionHeading eyebrow="Cocok Untuk Siapa" title="Dipakai enak, dilihat enak." />
          <ul className="mt-6 space-y-4 text-[var(--on-surface-variant)]">
            {product.audience.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <HiOutlineCheck className="mt-1 text-[18px] text-[var(--primary)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] bg-[var(--surface-container-low)] p-8">
          <SectionHeading eyebrow="FAQ singkat" title="Biar langsung jelas sebelum checkout." />
          <div className="mt-6">
            <FAQAccordion
              items={[
                {
                  question: "Bisa request warna?",
                  answer: "Bisa, selama stok warna masih aktif. Tim Kembunk akan bantu cek warna yang paling dekat dengan vibe kamu.",
                },
                {
                  question: "Bisa untuk hadiah?",
                  answer: "Bisa banget, terutama untuk varian custom name atau gift set komunitas dan event.",
                },
                {
                  question: "Cara order paling cepat?",
                  answer: "Klik tombol WhatsApp atau pakai quick order modal supaya tim kami bisa bantu lebih cepat.",
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading eyebrow="Produk Lainnya" title="Lengkapi koleksi hidrasimu." />
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {relatedProducts.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </div>

      <Modal open={orderOpen} onClose={() => setOrderOpen(false)} title="Quick Order Kembunk">
        <div className="space-y-4">
          <p className="text-[var(--on-surface-variant)]">
            Pesanan cepat untuk <span className="font-semibold text-[var(--on-surface)]">{product.name}</span> dengan warna <span className="font-semibold text-[var(--on-surface)]">{activeColor}</span> dan quantity <span className="font-semibold text-[var(--on-surface)]">{quantity}</span>.
          </p>
          <div className="rounded-[20px] bg-[var(--surface-container-low)] p-4 text-sm leading-7 text-[var(--on-surface-variant)]">
            Admin akan bantu cek stok, pilihan warna aktif, dan detail pengiriman terbaik buat kamu.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton
              message={`${buildProductMessage(product.name)} Saya pilih warna ${activeColor} dan quantity ${quantity}.`}
              label="Lanjut via WhatsApp"
              className="w-full"
            />
            <AnimatedButton
              variant="secondary"
              fullWidth
              onClick={() => setOrderOpen(false)}
            >
              Nanti Dulu
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
