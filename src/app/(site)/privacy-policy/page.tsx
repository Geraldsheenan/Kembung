import {
  HiOutlineBellAlert,
  HiOutlineBookmarkSquare,
  HiOutlineCircleStack,
  HiOutlineLockClosed,
  HiOutlineQuestionMarkCircle,
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineWifi,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Kebijakan Privasi Kembunk yang menjelaskan bagaimana informasi pengguna dikumpulkan, digunakan, disimpan, dan dilindungi.",
  path: "/privacy-policy",
});

type PolicySection = {
  title: string;
  icon: IconType;
  paragraphs: string[];
  bullets?: string[];
  closing?: string;
};

const policySections: PolicySection[] = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    icon: HiOutlineUserCircle,
    paragraphs: [
      "Kami dapat mengumpulkan informasi pribadi ketika Anda:",
    ],
    bullets: [
      "Menghubungi kami melalui WhatsApp atau kanal komunikasi lain;",
      "Melakukan pemesanan atau bertanya tentang produk;",
      "Mendaftar untuk mendapatkan info terbaru, promo, atau product drop;",
      "Berinteraksi dengan akun media sosial Kembunk.",
    ],
    closing:
      "Informasi yang dapat kami kumpulkan meliputi nama, nomor WhatsApp atau kontak, alamat pengiriman jika diperlukan untuk pemesanan, detail produk yang dipesan, serta informasi lain yang Anda berikan secara sukarela.",
  },
  {
    title: "2. Penggunaan Informasi",
    icon: HiOutlineBookmarkSquare,
    paragraphs: [
      "Informasi yang kami kumpulkan digunakan untuk:",
    ],
    bullets: [
      "Memproses pesanan dan pengiriman produk;",
      "Menjawab pertanyaan, permintaan, atau keluhan pelanggan;",
      "Memberikan informasi tentang produk, promo, atau koleksi terbaru;",
      "Meningkatkan layanan, pengalaman pengguna, dan kualitas komunikasi Kembunk;",
      "Keperluan administrasi dan pencatatan transaksi.",
    ],
    closing:
      "Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga.",
  },
  {
    title: "3. Pembagian Informasi kepada Pihak Ketiga",
    icon: HiOutlineUserGroup,
    paragraphs: [
      "Kami hanya dapat membagikan informasi pribadi Anda kepada pihak ketiga jika diperlukan untuk menjalankan layanan, seperti:",
    ],
    bullets: [
      "Jasa pengiriman;",
      "Penyedia layanan pembayaran, jika tersedia;",
      "Penyedia platform komunikasi atau layanan teknis;",
      "Pihak berwenang apabila diwajibkan oleh hukum.",
    ],
    closing:
      "Setiap pembagian data dilakukan sejauh diperlukan dan dengan memperhatikan perlindungan privasi pengguna.",
  },
  {
    title: "4. Penggunaan Cookies dan Teknologi Serupa",
    icon: HiOutlineWifi,
    paragraphs: [
      "Website kami dapat menggunakan cookies atau teknologi serupa untuk membantu meningkatkan pengalaman pengguna, memahami aktivitas pengunjung, dan mengoptimalkan tampilan website.",
      "Anda dapat mengatur atau menonaktifkan cookies melalui pengaturan browser masing-masing. Namun, beberapa fitur website mungkin tidak berjalan optimal jika cookies dinonaktifkan.",
    ],
  },
  {
    title: "5. Keamanan Data",
    icon: HiOutlineShieldCheck,
    paragraphs: [
      "Kami berupaya menjaga keamanan informasi pribadi Anda dari akses, penggunaan, perubahan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi data melalui internet yang sepenuhnya aman. Oleh karena itu, kami tidak dapat menjamin keamanan mutlak atas data yang dikirimkan secara online.",
    ],
  },
  {
    title: "6. Penyimpanan Data",
    icon: HiOutlineCircleStack,
    paragraphs: [
      "Informasi pribadi akan disimpan selama diperlukan untuk memenuhi tujuan pengumpulan data, seperti pemrosesan pesanan, layanan pelanggan, promosi, atau kewajiban hukum yang berlaku.",
    ],
  },
  {
    title: "7. Hak Pengguna",
    icon: HiOutlineScale,
    paragraphs: [
      "Anda berhak untuk:",
    ],
    bullets: [
      "Meminta akses terhadap data pribadi Anda;",
      "Meminta perbaikan data yang tidak akurat;",
      "Meminta penghapusan data pribadi, sejauh tidak bertentangan dengan kewajiban hukum atau administrasi;",
      "Berhenti menerima informasi promosi dari Kembunk.",
    ],
    closing:
      "Untuk menggunakan hak tersebut, Anda dapat menghubungi kami melalui kontak resmi yang tersedia di website.",
  },
  {
    title: "8. Tautan ke Pihak Ketiga",
    icon: HiOutlineLockClosed,
    paragraphs: [
      "Website Kembunk dapat memuat tautan ke platform pihak ketiga, seperti WhatsApp, TikTok, Instagram, atau layanan eksternal lainnya. Kebijakan Privasi ini tidak berlaku untuk website atau platform pihak ketiga tersebut. Kami menyarankan Anda membaca kebijakan privasi masing-masing platform sebelum memberikan informasi pribadi.",
    ],
  },
  {
    title: "9. Perubahan Kebijakan Privasi",
    icon: HiOutlineBellAlert,
    paragraphs: [
      "Kembunk dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan berlaku sejak dipublikasikan di website ini. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.",
    ],
  },
  {
    title: "10. Kontak Kami",
    icon: HiOutlineQuestionMarkCircle,
    paragraphs: [
      "Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui kanal kontak resmi Kembunk yang tersedia di website https://www.kembunk.my.id/.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="container-shell py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 space-y-4 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Legal - Kembunk
          </p>
          <h1 className="text-[3rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)] md:text-[3.75rem]">
            Privacy Policy
          </h1>
          <p className="text-sm font-semibold text-[var(--on-surface-variant)] md:text-base">
            Effective Date: 18 Mei 2026
          </p>
          <p className="max-w-3xl text-base leading-8 text-[var(--on-surface-variant)] md:text-lg">
            Kembunk menghargai privasi setiap pengunjung dan pelanggan kami. Kebijakan
            Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan,
            dan melindungi informasi pribadi yang Anda berikan saat mengakses website
            https://www.kembunk.my.id/.
          </p>
        </header>

        <div className="overflow-hidden rounded-[2rem] border border-[var(--outline-variant)]/30 bg-white shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
          <div className="divide-y divide-[var(--outline-variant)]/20">
            {policySections.map(({ title, icon: Icon, paragraphs, bullets, closing }) => (
              <section key={title} className="px-6 py-8 md:px-8 md:py-9">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-[var(--primary-container)] p-3 text-[var(--primary)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-[1.45rem] font-bold leading-tight text-[var(--primary)] md:text-[1.65rem]">
                    {title}
                  </h2>
                </div>

                <div className="space-y-4 text-base leading-8 text-[var(--on-surface-variant)]">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {bullets ? (
                    <ul className="space-y-2 pl-5">
                      {bullets.map((item) => (
                        <li key={item} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {closing ? <p>{closing}</p> : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
