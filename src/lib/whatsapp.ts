import { SITE } from "@/data/site";

export function buildWhatsAppUrl(message: string, phoneInternational = SITE.phoneInternational) {
  return `https://wa.me/${phoneInternational}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppMessage() {
  return "Halo Kembunk, saya tertarik dengan produk tumbler. Boleh minta info lebih lanjut?";
}

export function buildBranchMessage(branch: string) {
  return `Halo Kembunk, saya ingin bertanya tentang store ${branch}.`;
}

export function buildProductMessage(product: string) {
  return `Halo Kembunk, saya tertarik dengan produk ${product}. Boleh minta detailnya?`;
}
