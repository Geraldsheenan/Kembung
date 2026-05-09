"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaInstagram, FaLink, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineArrowRight, HiOutlineShare } from "react-icons/hi2";
import { ArticleCard } from "@/components/cards/article-card";
import type { Article } from "@/data/site";
import { itemFade, scaleIn, staggerContainer } from "@/lib/motion";

type ArticlesExplorerProps = {
  articles: Article[];
};

const shareItems = [
  { label: "WhatsApp", icon: FaWhatsapp },
  { label: "Instagram", icon: FaInstagram },
  { label: "Copy Link", icon: FaLink },
];

export function ArticlesExplorer({ articles }: ArticlesExplorerProps) {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All");
  const [shareOpen, setShareOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles]
  );

  const visibleArticles = useMemo(
    () =>
      activeCategory === "All"
        ? articles
        : articles.filter((article) => article.category === activeCategory),
    [activeCategory, articles]
  );

  const [featured, ...rest] = visibleArticles;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = activeCategory === category;
          return (
            <motion.button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className={`inline-flex min-h-11 items-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-[0_18px_38px_-22px_rgba(168,213,186,0.8)]"
                  : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
              }`}
            >
              <motion.span
                animate={reduceMotion || !active ? undefined : { y: [0, -2, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 0.28 }}
              >
                {category}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {featured ? (
        <motion.div
          key={featured.slug}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={reduceMotion ? undefined : scaleIn}
          className="relative mt-12 overflow-hidden rounded-[24px] border border-[var(--outline-variant)]/30 bg-[var(--primary-container)] shadow-[0_20px_50px_rgba(168,213,186,0.2)] md:flex"
        >
          <div className="md:w-3/5">
            <Image
              src={featured.image}
              alt={featured.title}
              width={1400}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative bg-white p-8 md:w-2/5 md:p-10">
            <div className="absolute right-6 top-6">
              <button
                type="button"
                aria-label="Bagikan artikel"
                onClick={() => setShareOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
              >
                <HiOutlineShare className="text-[18px]" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {shareOpen ? (
                  <motion.div
                    initial={reduceMotion ? false : "hidden"}
                    animate="visible"
                    exit="hidden"
                    variants={reduceMotion ? undefined : scaleIn}
                    className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-44 rounded-[22px] border border-[var(--outline-variant)]/40 bg-white p-2 shadow-[0_24px_60px_-28px_rgba(47,58,61,0.28)]"
                  >
                    <motion.div
                      variants={reduceMotion ? undefined : staggerContainer(0.06)}
                      initial={reduceMotion ? false : "hidden"}
                      animate="visible"
                    >
                      {shareItems.map(({ label, icon: Icon }) => (
                        <motion.button
                          key={label}
                          variants={reduceMotion ? undefined : itemFade}
                          type="button"
                          className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[var(--on-surface)] transition-transform duration-200 hover:bg-[var(--secondary-fixed)]/45 hover:-translate-y-0.5"
                        >
                          <Icon className="text-[16px]" aria-hidden="true" />
                          {label}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              <span className="rounded-full bg-[var(--secondary-fixed)] px-3 py-1">{featured.category}</span>
              <span className="text-[var(--on-surface-variant)]">{featured.readTime}</span>
            </div>
            <h2 className="text-[32px] font-bold leading-[1.15] text-[var(--primary)]">
              {featured.title}
            </h2>
            <p className="mt-4 text-[var(--on-surface-variant)]">{featured.excerpt}</p>
            <Link
              href={`/artikel/${featured.slug}`}
              className="group mt-6 inline-flex items-center gap-1 font-semibold text-[var(--primary)]"
            >
              Baca Selengkapnya
              <HiOutlineArrowRight
                className="text-[18px] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={reduceMotion ? undefined : staggerContainer(0.08, 0.03)}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit={reduceMotion ? undefined : "hidden"}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {rest.map((article) => (
            <motion.div key={article.slug} variants={reduceMotion ? undefined : itemFade}>
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
