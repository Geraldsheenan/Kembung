"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { AnimatedButton } from "@/components/animation/animated-button";
import { Modal } from "@/components/animation/modal";
import { branches, products } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState(branches[0]?.area ?? "Ancol");
  const [product, setProduct] = useState(products[0]?.name ?? "Kembung Pastel Bottle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const reduceMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = "Nama belum diisi.";
    if (!phone.trim()) nextErrors.phone = "Nomor HP belum diisi.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);

    const finalMessage = `Halo Kembung, saya tertarik dengan produk tumbler. Nama saya ${name}. Nomor HP saya ${phone}. Saya ingin bertanya tentang ${product} untuk cabang ${branch}. ${message}`.trim();
    window.setTimeout(() => {
      setLoading(false);
      setSuccessOpen(true);
      window.open(buildWhatsAppUrl(finalMessage), "_blank", "noopener,noreferrer");
    }, 850);
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="rounded-[24px] bg-white p-6 shadow-[0_20px_50px_rgba(168,213,186,0.1)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className={`ml-1 text-sm font-semibold ${name ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]"}`}>Nama</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-full border border-transparent bg-[var(--secondary-fixed)]/30 px-5 py-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-container)]/55"
            placeholder="Nama kamu"
          />
          {errors.name ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="text-sm text-[var(--error)]"
            >
              {errors.name}
            </motion.p>
          ) : null}
        </label>
        <label className="space-y-2">
          <span className={`ml-1 text-sm font-semibold ${phone ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]"}`}>Nomor HP</span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-full border border-transparent bg-[var(--secondary-fixed)]/30 px-5 py-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-container)]/55"
            placeholder="08xxxxxxxxxx"
          />
          {errors.phone ? (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="text-sm text-[var(--error)]"
            >
              {errors.phone}
            </motion.p>
          ) : null}
        </label>
        <label className="space-y-2">
          <span className={`ml-1 text-sm font-semibold ${branch ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]"}`}>Cabang</span>
          <select
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            className="w-full rounded-full border border-transparent bg-[var(--secondary-fixed)]/30 px-5 py-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-container)]/55"
          >
            {branches.map((item) => (
              <option key={item.slug} value={item.area}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            Produk yang diminati
          </span>
          <select
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            className="w-full rounded-full border border-transparent bg-[var(--secondary-fixed)]/30 px-5 py-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-container)]/55"
          >
            {products.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className={`ml-1 text-sm font-semibold ${message ? "text-[var(--primary)]" : "text-[var(--on-surface-variant)]"}`}>Pesan</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-[20px] border border-transparent bg-[var(--secondary-fixed)]/30 px-5 py-4 outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-container)]/55"
            placeholder="Tulis pertanyaan kamu di sini..."
          />
        </label>
      </div>

      <AnimatedButton
        type="submit"
        loading={loading}
        variant="whatsapp"
        icon="whatsapp"
        className="mt-6"
      >
        Kirim ke WhatsApp
      </AnimatedButton>
    </form>

    <Modal open={successOpen} onClose={() => setSuccessOpen(false)} title="Pesan Siap Dikirim">
      <div className="space-y-4">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.88, opacity: 0 }}
          animate={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--primary)]"
        >
          <HiOutlineCheckCircle className="text-[34px]" />
        </motion.div>
        <p className="text-center text-[var(--on-surface-variant)]">
          Admin Kembung siap bantu lanjutkan pertanyaan kamu. WhatsApp akan terbuka dalam tab baru.
        </p>
        <AnimatedButton variant="primary" fullWidth onClick={() => setSuccessOpen(false)}>
          Sip, lanjut
        </AnimatedButton>
      </div>
    </Modal>
    </>
  );
}
