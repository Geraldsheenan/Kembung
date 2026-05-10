"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi2";
import type { Product } from "@/data/site";
import { useToast } from "@/components/animation/toast";
import { AnimatedCard } from "@/components/animation/animated-card";
import { buildProductMessage } from "@/lib/whatsapp";
import { WhatsAppButton } from "../common/whatsapp-button";

export function ProductCard({ product }: { product: Product }) {
  const [favorite, setFavorite] = useState(false);
  const reduceMotion = useReducedMotion();
  const { pushToast } = useToast();

  return (
    <AnimatedCard className="group rounded-[24px] border border-[var(--outline-variant)]/25 bg-[var(--surface-bright)] p-6">
      <div className="relative mb-6 overflow-hidden rounded-[24px] bg-[var(--primary-container)]/10 p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-[0_20px_50px_-30px_rgba(30,52,43,0.35)] transition-transform duration-500 group-hover:scale-105"
        />
        <motion.button
          type="button"
          aria-label="Tambah ke favorit"
          onClick={() => {
            setFavorite((current) => !current);
            pushToast("Produk ditambahkan ke favorit");
          }}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[var(--primary)] shadow-md backdrop-blur-sm"
        >
          <motion.span
            animate={reduceMotion ? undefined : favorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            {favorite ? <FaHeart className="text-[18px]" /> : <FaRegHeart className="text-[18px]" />}
          </motion.span>
        </motion.button>
        {product.badge ? (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--tertiary)] px-3 py-1 text-xs font-bold text-[var(--on-tertiary)]">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex h-full flex-col">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            {product.category}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-[var(--on-surface)]">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-[var(--on-surface-variant)]">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--on-surface-variant)]">Mulai dari</p>
            <p className="text-2xl font-bold text-[var(--primary)]">{product.price}</p>
          </div>
          <Link
            href={`/produk/${product.slug}`}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--primary)]"
          >
            Detail
            <motion.span whileHover={reduceMotion ? undefined : { x: 4 }}>
              <HiOutlineArrowRight className="text-[16px]" />
            </motion.span>
          </Link>
        </div>
        <WhatsAppButton
          message={buildProductMessage(product.name)}
          label="Beli via WA"
          className="mt-4 w-full"
        />
      </div>
    </AnimatedCard>
  );
}
