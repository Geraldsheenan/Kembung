import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa6";
import { HiOutlineArrowRight, HiOutlineMapPin } from "react-icons/hi2";
import { ContactMessageForm } from "@/components/contact/contact-message-form";
import { createMetadata } from "@/lib/seo";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "Hubungi Kami",
  description:
    "Hubungi Kembung langsung via WhatsApp atau isi form singkat untuk pertanyaan produk, cabang, dan order tumbler.",
  path: "/hubungi-kami",
});

export default function ContactPage() {
  return (
    <section className="container-shell py-20">
      <section className="mb-16 text-center md:text-left">
        <h1 className="mb-3 text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)]">
          Ada yang mau ditanyain?
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
          Gak usah sungkan, kita di sini buat bantu kamu tetep terhidrasi dengan ceria.
          Curhat soal produk atau tanya-tanya stok, bebas!
        </p>
      </section>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_50px_rgba(168,213,186,0.1)] lg:col-span-7">
          <ContactMessageForm />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <Link
            href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col items-start gap-5 overflow-hidden rounded-[2rem] bg-[var(--primary-container)] p-8 text-[var(--on-primary-container)] transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="flex w-full items-center justify-between">
              <span className="rounded-full bg-white/40 p-3 text-[34px]">
                <FaWhatsapp aria-hidden="true" />
              </span>
              <span className="rounded-full bg-white/30 px-3 py-1 text-xs font-semibold">
                Active Now
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Fast response via WA</h3>
              <p className="mt-3 opacity-80">
                Biasanya dibalas dalam waktu kurang dari 15 menit. Chat yuk!
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold">
              Hubungi via WhatsApp
              <HiOutlineArrowRight aria-hidden="true" />
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <FaWhatsapp className="text-[160px]" aria-hidden="true" />
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="#"
              className="flex flex-col items-center gap-3 rounded-[1.5rem] bg-[var(--tertiary-fixed)] p-5 text-center text-[var(--on-tertiary-container)] transition-colors hover:bg-[var(--tertiary-container)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40">
                <FaInstagram className="text-[20px]" aria-hidden="true" />
              </div>
              <span className="font-semibold">Instagram</span>
            </a>
            <a
              href="#"
              className="flex flex-col items-center gap-3 rounded-[1.5rem] bg-[var(--secondary-fixed)] p-5 text-center text-[var(--on-secondary-container)] transition-colors hover:bg-[var(--secondary-container)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/40">
                <FaTiktok className="text-[20px]" aria-hidden="true" />
              </div>
              <span className="font-semibold">TikTok</span>
            </a>
          </div>

          <div className="rounded-[2rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-6">
            <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
              <HiOutlineMapPin className="text-sm" aria-hidden="true" />
              Mampir ke Studio
            </h4>
            <p className="mb-5 text-[var(--on-surface)]">
              Jl. Hidrasi Bahagia No. 24, Jakarta Selatan, Indonesia
            </p>
            <div className="h-40 w-full overflow-hidden rounded-[1.25rem] bg-[var(--surface-container-highest)]">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl-TUrzzLnnKKbq1lxqWZDrEgNeqSLjXqDRHmSspjayd2AsHK0iYRFWdeHA6KUzrkAN3Gw-5shtdbp-02i5AXBH4JfowrU7z9GcjDhzMIhqW_s-8ym9ahpbxRXGDQ3gXfMCCEesRKfxw8FL71l79oIFvcLxh8hiZ6q52bKqgHJas5ExLkmBKVcL320mCu9p5JaARhJSUDFOp2lhJTrccTMdpcXDR6iVvtQl23A_Av2-Gj1mQs2wwVXnTyW4_EZkpNahDeQs74UTe8v"
                alt="Map location"
                width={800}
                height={400}
                className="h-full w-full object-cover opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
