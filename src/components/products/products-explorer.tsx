"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { HiMiniCheck, HiOutlineAdjustmentsHorizontal, HiOutlineSparkles } from "react-icons/hi2";
import type { Product } from "@/data/site";
import { staggerContainer } from "@/lib/motion";
import { BottomSheet } from "@/components/animation/bottom-sheet";
import { ProductCard } from "@/components/cards/product-card";

type ProductsExplorerProps = {
  products: Product[];
  categories: string[];
};

const sortOptions = [
  { value: "featured", label: "Paling Relevan" },
  { value: "lowest", label: "Harga Terendah" },
  { value: "highest", label: "Harga Tertinggi" },
];

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

export function ProductsExplorer({ products, categories }: ProductsExplorerProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const filteredProducts = useMemo(() => {
    const base =
      activeCategory === "All Products"
        ? products
        : products.filter((product) => product.category === activeCategory);

    const sorted = [...base];
    if (sortBy === "lowest") {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "highest") {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return sorted;
  }, [activeCategory, products, sortBy]);

  return (
    <>
      <div className="mt-8 hidden flex-wrap gap-3 md:flex">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${
                active
                  ? "bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[0_16px_32px_-18px_rgba(168,213,186,0.95)]"
                  : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
              }`}
            >
              <motion.span
                animate={reduceMotion || !active ? undefined : { y: [0, -3, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 0.34 }}
              >
                <HiOutlineSparkles className="text-[16px]" />
              </motion.span>
              {category}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 md:mt-6">
        <motion.button
          type="button"
          onClick={() => setSheetOpen(true)}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--surface-container)] px-5 py-3 text-sm font-semibold text-[var(--on-surface-variant)] md:hidden"
        >
          <HiOutlineAdjustmentsHorizontal className="text-[18px]" />
          Filter & Sort
        </motion.button>

        <div className="relative ml-auto">
          <motion.button
            type="button"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((value) => !value)}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--outline-variant)]/40 bg-white px-5 py-3 text-sm font-semibold text-[var(--on-surface)]"
          >
            Sort: {sortOptions.find((option) => option.value === sortBy)?.label}
          </motion.button>

          <AnimatePresence>
            {dropdownOpen ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-[calc(100%+12px)] z-30 w-56 rounded-[22px] border border-[var(--outline-variant)]/30 bg-white p-2 shadow-[0_24px_60px_-26px_rgba(47,58,61,0.28)]"
              >
                {sortOptions.map((option) => {
                  const selected = option.value === sortBy;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`flex min-h-11 w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm ${
                        selected
                          ? "bg-[var(--primary-container)]/45 text-[var(--on-primary-container)]"
                          : "text-[var(--on-surface-variant)] hover:bg-[var(--secondary-fixed)]/45"
                      }`}
                    >
                      {option.label}
                      <motion.span
                        initial={false}
                        animate={{ scale: selected ? 1 : 0.6, opacity: selected ? 1 : 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <HiMiniCheck className="text-[18px]" />
                      </motion.span>
                    </button>
                  );
                })}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        key={`${activeCategory}-${sortBy}`}
        variants={reduceMotion ? undefined : staggerContainer(0.06)}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.slug}
            variants={
              reduceMotion
                ? undefined
                : {
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }
            }
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter Produk">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`min-h-11 rounded-full px-4 py-3 text-sm font-semibold ${
                    active
                      ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                      : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          <div className="space-y-2 pt-3">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortBy(option.value)}
                className={`flex min-h-11 w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${
                  sortBy === option.value
                    ? "bg-[var(--primary-container)]/45 text-[var(--on-primary-container)]"
                    : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                }`}
              >
                {option.label}
                {sortBy === option.value ? <HiMiniCheck className="text-[18px]" /> : null}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
