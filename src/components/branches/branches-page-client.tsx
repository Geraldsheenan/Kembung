"use client";

import Image from "next/image";
import { startTransition, useMemo, useState } from "react";
import {
  HiOutlineChevronRight,
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { BranchCard } from "@/components/cards/branch-card";
import { useToast } from "@/components/animation/toast";
import type { Branch } from "@/data/site";

type BranchesPageClientProps = {
  initialBranches: Branch[];
};

type UserCoords = {
  latitude: number;
  longitude: number;
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceInKm(from: UserCoords, branch: Branch) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(branch.latitude - from.latitude);
  const lngDelta = toRadians(branch.longitude - from.longitude);
  const originLat = toRadians(from.latitude);
  const targetLat = toRadians(branch.latitude);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(originLat) * Math.cos(targetLat) * Math.sin(lngDelta / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function formatDistance(distanceKm: number) {
  return distanceKm < 10
    ? `${distanceKm.toFixed(1).replace(".", ",")} km`
    : `${Math.round(distanceKm)} km`;
}

function getNearestBranch(userCoords: UserCoords, branches: Branch[]) {
  return branches.reduce(
    (nearest, branch) => {
      const distanceKm = getDistanceInKm(userCoords, branch);

      if (!nearest || distanceKm < nearest.distanceKm) {
        return { branch, distanceKm };
      }

      return nearest;
    },
    null as { branch: Branch; distanceKm: number } | null,
  );
}

function scrollToBranch(slug: string) {
  const desktopCard = document.getElementById(`branch-card-${slug}`);
  const mobileCard = document.getElementById(`branch-card-${slug}-mobile`);
  const activeCard =
    window.innerWidth >= 768 ? desktopCard ?? mobileCard : mobileCard ?? desktopCard;

  activeCard?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getLocationErrorMessage(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Izin lokasi ditolak. Aktifkan akses lokasi di browser lalu coba lagi.";
    case error.POSITION_UNAVAILABLE:
      return "Lokasi belum bisa dideteksi. Pastikan GPS atau jaringan perangkat aktif.";
    case error.TIMEOUT:
      return "Permintaan lokasi terlalu lama. Coba lagi dalam beberapa saat.";
    default:
      return "Lokasi belum bisa diambil saat ini. Coba lagi sebentar lagi.";
  }
}

export function BranchesPageClient({ initialBranches }: BranchesPageClientProps) {
  const { pushToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [nearestSlug, setNearestSlug] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const nearestMatch = useMemo(
    () => (userCoords ? getNearestBranch(userCoords, initialBranches) : null),
    [initialBranches, userCoords],
  );

  const visibleBranches = useMemo(() => {
    const filtered = normalizedQuery
      ? initialBranches.filter((branch) =>
          [
            branch.area,
            branch.name,
            branch.address,
            branch.shortAddress,
            branch.mobileAddressLine,
            branch.badge,
          ]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedQuery)),
        )
      : initialBranches;

    if (!nearestSlug) {
      return filtered;
    }

    return [...filtered].sort((left, right) => {
      if (left.slug === nearestSlug) return -1;
      if (right.slug === nearestSlug) return 1;
      return 0;
    });
  }, [initialBranches, nearestSlug, normalizedQuery]);

  const locationSummary = nearestMatch
    ? `${nearestMatch.branch.area} paling dekat dari lokasimu, sekitar ${formatDistance(
        nearestMatch.distanceKm,
      )}.`
    : "Aktifkan lokasi di perangkatmu untuk melihat store Kembunk di sekitarmu secara otomatis.";

  function handleUseMyLocation() {
    if (!("geolocation" in navigator)) {
      pushToast("Browser ini belum mendukung akses lokasi.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const nextNearest = getNearestBranch(nextCoords, initialBranches);

        startTransition(() => {
          setUserCoords(nextCoords);
          setNearestSlug(nextNearest?.branch.slug ?? null);
        });

        if (nextNearest) {
          window.setTimeout(() => scrollToBranch(nextNearest.branch.slug), 180);
          pushToast(
            `${nextNearest.branch.area} terdeteksi sebagai store terdekat.`,
          );
        }

        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        pushToast(getLocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  return (
    <>
      <section className="container-shell hidden pt-20 text-center md:block">
        <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-[var(--primary-fixed)] px-4 py-1.5 text-[var(--on-primary-fixed-variant)]">
          <HiOutlineMapPin className="text-[18px]" aria-hidden="true" />
          <span className="text-xs font-bold">Cari Store Terdekat</span>
        </div>
        <h1 className="mx-auto mb-6 max-w-4xl text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--primary)]">
          Temui Kembunk di Dekatmu
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
          Mampir dan rasakan kesegaran hidrasi yang menyenangkan di store-store
          terpilih kami. Pilih yang paling dekat dengan rutinitasmu hari ini.
        </p>
      </section>

      <section className="container-shell pt-8 md:hidden">
        <div className="mx-auto max-w-md space-y-6 pb-10">
          <div className="space-y-3 text-center">
            <h1 className="text-[3.4rem] font-extrabold leading-[0.98] tracking-[-0.05em] text-[var(--primary)]">
              Find Your
              <br />
              Oasis
            </h1>
            <p className="text-[1.05rem] leading-8 text-[var(--on-surface-variant)]">
              Stay perfectly hydrated at our nearest lifestyle store.
            </p>
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="flex min-h-14 w-full items-center justify-between rounded-[2rem] border border-[var(--primary-container)]/40 bg-[var(--primary-container)]/20 px-6 py-4 text-[var(--on-primary-container)] transition-opacity disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <HiOutlineMapPin className="text-[18px]" aria-hidden="true" />
              {isLocating ? "Sedang mencari lokasimu..." : "Gunakan Lokasi Saya"}
            </span>
            <HiOutlineChevronRight className="text-[18px]" aria-hidden="true" />
          </button>

          <div className="relative">
            <HiOutlineMagnifyingGlass
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[20px] text-[var(--outline)]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search neighborhood..."
              className="w-full rounded-full border-none bg-[var(--secondary-container)]/30 py-4 pl-14 pr-5 text-base placeholder:text-[var(--outline-variant)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="container-shell pb-16 md:pt-12 md:pb-20">
        {normalizedQuery && visibleBranches.length === 0 ? (
          <div className="mx-auto mb-8 max-w-2xl rounded-[2rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-6 py-5 text-center text-[var(--on-surface-variant)]">
            Tidak ada store yang cocok dengan pencarian `{searchQuery}`.
          </div>
        ) : null}

        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-none lg:grid-cols-3">
          {visibleBranches.map((branch) => (
            <BranchCard
              key={branch.slug}
              branch={branch}
              cardId={`branch-card-${branch.slug}`}
              highlighted={branch.slug === nearestSlug}
              distanceLabel={
                branch.slug === nearestMatch?.branch.slug
                  ? formatDistance(nearestMatch.distanceKm)
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      <section className="container-shell mb-16 hidden md:block md:mb-20">
        <div className="rounded-[2rem] bg-[var(--surface-container)] p-2 md:p-3">
          <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--secondary-fixed-dim)]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArGH8bLG3Vk-8Hcg77K4avRJxSPfGw-OmiWEUkEcpTOSLP75LAXNdHVmCTLgRM1Ukn9KmV5766TbrZcVbbSOFUw8bF9pH_csdhEZ3vbuc_qR3bG6KuOcVrp5JcYx0d0x1aQMGfooy3tFU4CEh3bbI-ot1unveBdS6GsCAZTB7phWqf2EqUZhm60SMoniSyaljVWAA1gDrffZ6uh1AvEwD-u8fMRq0VZkVzJg30csTcsrXa2RIZ16ShwFEqsB0Lh67eRiYYAotgWwi-"
              alt="Map overview store Kembunk"
              fill
              className="object-cover opacity-30 mix-blend-multiply"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <HiOutlineMapPin
                className="mb-5 text-[4rem] text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="mb-3 text-[2rem] font-bold tracking-[-0.02em] text-[var(--primary)]">
                Cari yang Terdekat?
              </h2>
              <p
                className="max-w-md text-base leading-7 text-[var(--on-surface-variant)]"
                aria-live="polite"
              >
                {locationSummary}
              </p>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="mt-8 rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-semibold text-[var(--on-primary)] shadow-[0_20px_38px_-20px_rgba(61,103,81,0.42)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLocating ? "Sedang mencari lokasimu..." : "Gunakan Lokasi Saya"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
