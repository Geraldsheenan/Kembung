import Image from "next/image";
import { HiOutlinePaintBrush, HiOutlineShieldCheck } from "react-icons/hi2";
import { LuDroplets, LuLeaf, LuSmile } from "react-icons/lu";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tentang Kami",
  description:
    "Company profile Kembung dengan cerita brand, visi, misi, nilai brand, dan alasan memilih tumbler Kembung.",
  path: "/tentang-kami",
});

const values = [
  {
    icon: HiOutlinePaintBrush,
    title: "Aesthetic Banget",
    description:
      "Desain minimalis dengan warna-warna pastel yang dikurasi khusus buat melengkapi OOTD kamu setiap hari.",
    circle: "bg-[var(--primary-container)] text-[var(--primary)]",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Dibuat Awet",
    description:
      "Bahan stainless steel grade premium yang tahan banting, anti karat, dan menjaga suhu air sampai 24 jam.",
    circle: "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
  },
  {
    icon: LuLeaf,
    title: "Sayang Bumi",
    description:
      "Setiap botol Kembung membantu mengurangi ribuan botol plastik sekali pakai di lautan kita.",
    circle: "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]",
  },
];

export default function AboutPage() {
  return (
    <section className="container-shell space-y-20 py-20">
      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5">
          <span className="rounded-full bg-[var(--primary-container)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-primary-container)]">
            Cerita Kembung
          </span>
          <h1 className="text-[3.5rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
            Berawal dari Kamar Kos yang Berantakan.
          </h1>
          <p className="text-lg leading-8 text-[var(--on-surface-variant)]">
            Kembung lahir bukan di ruang rapat mewah, tapi di sebuah kamar kos sempit di Bandung.
            Lelah dengan botol minum yang membosankan dan cepat rusak, kami memutuskan untuk
            menciptakan sesuatu yang tidak hanya menghidrasi tubuh, tapi juga menyegarkan mata dan jiwa.
          </p>
        </div>

        <div className="relative md:col-span-7">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)]">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeyseFTjiP5_eTf5uRgheNzP2WsU6kr2raSbc2OfqS4glPhnd9pK94UbFI9FC71yAljBs5i2-FHvqetVmdzzRRxxxVFFWV1n1_Fj_6FwQIgOKHAyFtUdognCYpPgCBTWmxc3iaOsaRR2o6c9aF8e6i_DA78hLVA6cwkj_EuS1T0fWHIe7jpOK4-HLZhI_CVkgdSz0dwswbSg_O8S55s6gadysgJ292czhWyMU7wtBrzoz_tZtkHMewz4Hz3_Rml88mYM673H6fEPA4"
              alt="About Kembung Origins"
              width={1200}
              height={900}
              className="h-[500px] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -left-2 hidden max-w-[200px] rounded-[1.25rem] bg-[var(--secondary-container)] p-5 shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)] md:block">
            <p className="font-semibold text-[var(--on-secondary-container)]">
              &quot;Hidrasi itu harusnya seru, bukan tugas.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-[var(--primary-fixed)] px-8 py-16 text-center md:px-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Misi Kita
          </span>
          <h2 className="text-[3rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--on-primary-fixed-variant)]">
            Misi kami? Gak ada yang mati gaya gara-gara kurang minum.
          </h2>
          <p className="text-lg leading-8 text-[var(--on-primary-fixed-variant)]/80">
            Kami ingin menghapus stigma kalau bawa botol minum itu ribet atau &quot;tua.&quot;
            Di Kembung, kami bikin hidrasi jadi bagian dari gaya hidup kamu yang dinamis, kreatif,
            dan penuh warna. Kami ingin kamu merasa puas, sampai &quot;kembung&quot; dalam arti yang paling menyenangkan.
          </p>
          <div className="flex justify-center gap-12 pt-4">
            <div className="text-center">
              <LuDroplets className="mx-auto text-[3rem] text-[var(--primary)]" aria-hidden="true" />
              <p className="mt-2 font-semibold">Perfectly Hydrated</p>
            </div>
            <div className="text-center">
              <LuSmile className="mx-auto text-[3rem] text-[var(--primary)]" aria-hidden="true" />
              <p className="mt-2 font-semibold">Joyful Vibe</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-[3rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
            Kenapa Pilih Kembung?
          </h2>
          <p className="mt-3 text-[var(--on-surface-variant)]">
            Tiga alasan kenapa kita bakal jadi sahabat baru tas kamu.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="flex flex-col items-center rounded-[1.5rem] bg-[var(--surface-container-low)] p-8 text-center shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)] transition-transform duration-200 hover:scale-105"
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${value.circle}`}>
                  <Icon className="text-[40px]" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary)]">{value.title}</h3>
                <p className="mt-3 text-[var(--on-surface-variant)]">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgGJsYFGkrOIGft8isJpupeekaPjTq0SEDgwtYGi6nbq9AdkwCKQ2i4bqpmUgO_hIklh6AUw4mahA0LfM3m6iWMZRJMLNhdUsMz2nZElHYwmYYGVPXxvhrSrpQWRgIDJfk0V1X1LljLy2l9xGeHYRGtSrAbkwkNVxa_VIHS43TO-Cb--jPUB0jVlHlPVTbb60i3ly4EssFmxeRhI6rbSqd6HOMfQOSry4LayKnb9RF7ZR8BOfhpOZIO6LqZ_lNPL2hHgLtfAwziNDd"
            alt="Lifestyle Hydration"
            width={1000}
            height={800}
            className="h-[400px] w-full rounded-[1.5rem] object-cover shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)]"
          />
        </div>
        <div className="order-1 space-y-6 md:order-2">
          <h2 className="text-[3rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
            Bukan Sekadar Botol. Tapi Teman Perjalanan.
          </h2>
          <p className="text-lg leading-8 text-[var(--on-surface-variant)]">
            Kami percaya setiap tegukan adalah momen kecil untuk reset. Apapun mimpimu,
            menyelesaikan skripsi, membangun startup, atau sekadar jalan-jalan sore,
            Kembung ada di sana untuk memastikan kamu tetap segar.
          </p>
        </div>
      </section>
    </section>
  );
}
