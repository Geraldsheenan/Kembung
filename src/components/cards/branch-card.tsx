"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineMap,
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineWifi,
} from "react-icons/hi2";
import { PiWaveSineBold } from "react-icons/pi";
import { MdOutlineLocalParking, MdOutlinePets } from "react-icons/md";
import { LimitedRichText } from "@/components/common/limited-rich-text";
import type { Branch } from "@/data/site";

const themeClasses = {
  secondary: {
    card: "bg-[var(--secondary-container)]",
    overlay: "from-[var(--secondary-container)]",
    badge: "text-[var(--on-secondary-container)]",
    text: "text-[var(--on-secondary-container)]",
    muted: "text-[var(--on-secondary-container)]/80",
    icon: "text-[var(--on-secondary-container)]/70",
  },
  primary: {
    card: "bg-[var(--primary-container)]",
    overlay: "from-[var(--primary-container)]",
    badge: "text-[var(--on-primary-container)]",
    text: "text-[var(--on-primary-container)]",
    muted: "text-[var(--on-primary-container)]/80",
    icon: "text-[var(--on-primary-container)]/70",
  },
  tertiary: {
    card: "bg-[var(--tertiary-container)]",
    overlay: "from-[var(--tertiary-container)]",
    badge: "text-[var(--on-tertiary-container)]",
    text: "text-[var(--on-tertiary-container)]",
    muted: "text-[var(--on-tertiary-container)]/80",
    icon: "text-[var(--on-tertiary-container)]/70",
  },
} as const;

const amenityIconMap = {
  parking: MdOutlineLocalParking,
  wifi: HiOutlineWifi,
  pets: MdOutlinePets,
} as const;

const mobileFeatureIconMap = {
  beach: PiWaveSineBold,
  laptop: HiOutlineAcademicCap,
  groups: HiOutlineSparkles,
} as const;

function normalizeLookupKey(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

type BranchCardProps = {
  branch: Branch;
  cardId?: string;
  highlighted?: boolean;
  distanceLabel?: string;
};

export function BranchCard({
  branch,
  cardId,
  highlighted = false,
  distanceLabel,
}: BranchCardProps) {
  const reduceMotion = useReducedMotion();
  const theme = themeClasses[branch.theme ?? "secondary"];
  const AmenityIcon =
    amenityIconMap[
      normalizeLookupKey(branch.amenityIcon) as keyof typeof amenityIconMap
    ] ?? HiOutlineWifi;
  const MobileFeatureIcon =
    mobileFeatureIconMap[
      normalizeLookupKey(branch.mobileFeatureIcon) as keyof typeof mobileFeatureIconMap
    ] ?? HiOutlineSparkles;
  const nearestLabel = distanceLabel
    ? `Terdekat • ${distanceLabel}`
    : "Terdekat dari lokasimu";

  return (
    <>
      <motion.article
        id={cardId}
        whileHover={reduceMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`group relative hidden overflow-hidden rounded-[2rem] shadow-sm transition-all duration-300 hover:shadow-lg md:block ${theme.card} ${
          highlighted
            ? "ring-2 ring-[var(--primary)] ring-offset-4 ring-offset-[var(--surface)] shadow-[0_24px_60px_-28px_rgba(61,103,81,0.5)]"
            : ""
        }`}
      >
        <div className="relative h-64 bg-[var(--surface-container-high)]">
          <Image
            src={branch.image}
            alt={branch.name}
            width={1200}
            height={825}
            className={`h-full w-full object-cover grayscale-[20%] transition-all duration-500 group-hover:grayscale-0 ${
              branch.imageClassName ?? ""
            }`}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${theme.overlay} via-transparent to-transparent`} />
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-[var(--on-primary)]">
              {branch.badge}
            </span>
          </div>
          {highlighted ? (
            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-bold text-[var(--primary)] shadow-sm backdrop-blur-sm">
                {nearestLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-5 p-6">
          <div>
            <LimitedRichText
              as="h3"
              value={branch.area}
              className={`text-2xl font-bold ${theme.text} [&_em]:italic [&_strong]:font-extrabold [&_u]:underline`}
            />
            <LimitedRichText
              value={branch.shortAddress ?? branch.address}
              className={`mt-1 text-base ${theme.muted} [&_em]:italic [&_strong]:font-semibold [&_u]:underline`}
            />
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${theme.icon}`}>
              <HiOutlineClock className="text-[20px]" aria-hidden="true" />
              <span className="text-sm font-semibold">{branch.hours}</span>
            </div>
            <div className={`flex items-center gap-3 ${theme.icon}`}>
              <AmenityIcon className="text-[20px]" aria-hidden="true" />
              <LimitedRichText
                as="span"
                value={branch.amenity}
                className="text-sm font-semibold [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
              />
            </div>
          </div>

          <Link
            href={branch.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-4 text-sm font-semibold text-[var(--on-primary)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiOutlineMap className="text-[18px]" aria-hidden="true" />
            Petunjuk Jalan
          </Link>
        </div>
      </motion.article>

      <motion.article
        id={cardId ? `${cardId}-mobile` : undefined}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={`group overflow-hidden rounded-[2rem] border bg-[var(--surface-container-lowest)] shadow-[0_10px_40px_-10px_rgba(168,213,186,0.25)] md:hidden ${
          highlighted
            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
            : "border-[var(--surface-variant)]"
        }`}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={branch.image}
            alt={branch.name}
            width={1200}
            height={825}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              branch.imageClassName ?? ""
            }`}
          />
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[var(--surface-bright)]/90 px-3 py-1 backdrop-blur-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                branch.mobileStatusTone === "tertiary"
                  ? "bg-[var(--tertiary)]"
                  : "bg-[var(--primary)]"
              }`}
            />
            <span
              className={`text-[11px] font-semibold ${
                branch.mobileStatusTone === "tertiary"
                  ? "text-[var(--tertiary)]"
                  : "text-[var(--primary)]"
              }`}
            >
              {branch.mobileStatus}
            </span>
          </div>
          {highlighted ? (
            <div className="absolute bottom-4 left-4">
              <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold text-[var(--primary)] shadow-sm backdrop-blur-sm">
                {nearestLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <LimitedRichText
                as="h3"
                value={branch.area}
                className="text-[2rem] font-bold leading-none tracking-[-0.03em] text-[var(--on-surface)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
              />
              <LimitedRichText
                value={branch.mobileSubtitle}
                className="mt-1 text-sm font-medium text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
              />
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--secondary-container)] text-[var(--on-secondary-container)]">
              <MobileFeatureIcon className="text-[22px]" aria-hidden="true" />
            </div>
          </div>

          <div className="space-y-2 text-[var(--on-surface-variant)]">
            <div className="flex items-center gap-3 text-base">
              <HiOutlineClock className="text-sm" aria-hidden="true" />
              <span>{branch.mobileHours ?? branch.hours}</span>
            </div>
            <div className="flex items-center gap-3 text-base">
              <HiOutlineMapPin className="text-sm" aria-hidden="true" />
              <span>{branch.mobileAddressLine ?? branch.shortAddress ?? branch.address}</span>
            </div>
          </div>

          <Link
            href={branch.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-4 text-sm font-semibold text-[var(--on-primary)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.95]"
          >
            <HiOutlineMap className="text-[18px]" aria-hidden="true" />
            Petunjuk Jalan
          </Link>
        </div>
      </motion.article>
    </>
  );
}
