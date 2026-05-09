"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi2";
import type { Article } from "@/data/site";
import { AnimatedCard } from "@/components/animation/animated-card";

export function ArticleCard({ article }: { article: Article }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatedCard hoverBorder="rgba(255, 181, 167, 0.9)" className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--outline-variant)]/25 bg-[var(--surface-bright)]">
      <Image
        src={article.image}
        alt={article.title}
        width={1200}
        height={750}
        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          <span>{article.category}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--muted)]/40" />
          <span>{article.readTime}</span>
        </div>
        <h3 className="text-2xl font-bold text-[var(--on-surface)]">{article.title}</h3>
        <p className="mt-3 line-clamp-3 text-[var(--on-surface-variant)]">{article.excerpt}</p>
        <Link
          href={`/artikel/${article.slug}`}
          className="mt-6 inline-flex items-center gap-1 font-semibold text-[var(--primary)] transition-all hover:gap-2"
        >
          Baca Selengkapnya
          <motion.span whileHover={reduceMotion ? undefined : { x: 4 }}>
            <HiOutlineArrowRight className="text-[18px]" aria-hidden="true" />
          </motion.span>
        </Link>
      </div>
    </AnimatedCard>
  );
}
