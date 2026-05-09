import Image from "next/image";
import { HiOutlineChevronRight, HiOutlineMapPin, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { BranchCard } from "@/components/cards/branch-card";
import { branches } from "@/data/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cabang",
  description:
    "Daftar cabang Kembung di Ancol, Serpong, dan Bekasi lengkap dengan alamat, jam operasional, dan CTA WhatsApp.",
  path: "/cabang",
});

export default function BranchesPage() {
  return (
    <>
      <section className="container-shell hidden pt-20 text-center md:block">
        <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-[var(--primary-fixed)] px-4 py-1.5 text-[var(--on-primary-fixed-variant)]">
          <HiOutlineMapPin className="text-[18px]" aria-hidden="true" />
          <span className="text-xs font-bold">Cari Cabang Terdekat</span>
        </div>
        <h1 className="mx-auto mb-6 max-w-4xl text-[3.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--primary)]">
          Temui Kembung di Dekatmu
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
          Mampir dan rasakan kesegaran hidrasi yang menyenangkan di lokasi-lokasi
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
              Stay perfectly hydrated at our nearest lifestyle branch.
            </p>
          </div>

          <button
            type="button"
            className="flex min-h-14 w-full items-center justify-between rounded-[2rem] border border-[var(--primary-container)]/40 bg-[var(--primary-container)]/20 px-6 py-4 text-[var(--on-primary-container)]"
          >
            <span className="flex items-center gap-3 text-sm font-semibold">
              <HiOutlineMapPin className="text-[18px]" aria-hidden="true" />
              Gunakan Lokasi Saya
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
              placeholder="Search neighborhood..."
              className="w-full rounded-full border-none bg-[var(--secondary-container)]/30 py-4 pl-14 pr-5 text-base placeholder:text-[var(--outline-variant)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="container-shell pb-16 md:pt-12 md:pb-20">
        <div className="mx-auto grid max-w-md grid-cols-1 gap-8 md:max-w-none lg:grid-cols-3">
          {branches.map((branch) => (
            <BranchCard key={branch.slug} branch={branch} />
          ))}
        </div>
      </section>

      <section className="container-shell mb-16 hidden md:block md:mb-20">
        <div className="rounded-[2rem] bg-[var(--surface-container)] p-2 md:p-3">
          <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--secondary-fixed-dim)]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArGH8bLG3Vk-8Hcg77K4avRJxSPfGw-OmiWEUkEcpTOSLP75LAXNdHVmCTLgRM1Ukn9KmV5766TbrZcVbbSOFUw8bF9pH_csdhEZ3vbuc_qR3bG6KuOcVrp5JcYx0d0x1aQMGfooy3tFU4CEh3bbI-ot1unveBdS6GsCAZTB7phWqf2EqUZhm60SMoniSyaljVWAA1gDrffZ6uh1AvEwD-u8fMRq0VZkVzJg30csTcsrXa2RIZ16ShwFEqsB0Lh67eRiYYAotgWwi-"
              alt="Map overview cabang Kembung"
              fill
              className="object-cover opacity-30 mix-blend-multiply"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <HiOutlineMapPin className="mb-5 text-[4rem] text-[var(--primary)]" aria-hidden="true" />
              <h2 className="mb-3 text-[2rem] font-bold tracking-[-0.02em] text-[var(--primary)]">
                Cari yang Terdekat?
              </h2>
              <p className="max-w-md text-base leading-7 text-[var(--on-surface-variant)]">
                Aktifkan lokasi di perangkatmu untuk melihat cabang Kembung di
                sekitarmu secara otomatis.
              </p>
              <button
                type="button"
                className="mt-8 rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-semibold text-[var(--on-primary)] shadow-[0_20px_38px_-20px_rgba(61,103,81,0.42)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Gunakan Lokasi Saya
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
