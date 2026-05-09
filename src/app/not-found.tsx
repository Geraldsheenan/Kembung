import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-shell flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="rounded-full bg-[var(--primary)]/30 px-4 py-2 text-sm font-semibold text-[var(--foreground)]">
        Oops, halaman lagi ngilang
      </div>
      <div className="max-w-xl space-y-3">
        <h1 className="text-balance text-4xl font-extrabold text-[var(--foreground)] md:text-6xl">
          Halaman yang kamu cari belum ada di tumbler universe Kembung.
        </h1>
        <p className="text-lg text-[var(--muted)]">
          Yuk balik ke beranda atau langsung cek katalog produk biar tetap
          terhidrasi dengan gaya.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[var(--primary-strong)] px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-900/10"
        >
          Balik ke Beranda
        </Link>
        <Link
          href="/produk"
          className="rounded-full border border-[var(--line)] bg-white px-6 py-3 font-semibold text-[var(--foreground)]"
        >
          Lihat Produk
        </Link>
      </div>
    </section>
  );
}
