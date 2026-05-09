import { SITE } from "@/data/site";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${SITE.phoneInternational}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppMessage() {
  return "Halo Kembung, saya tertarik dengan produk tumbler. Boleh minta info lebih lanjut?";
}

export function buildBranchMessage(branch: string) {
  return `Halo Kembung, saya ingin bertanya tentang cabang ${branch}.`;
}

export function buildProductMessage(product: string) {
  return `Halo Kembung, saya tertarik dengan produk ${product}. Boleh minta detailnya?`;
}
