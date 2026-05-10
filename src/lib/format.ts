export function formatRupiah(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function createWhatsAppLink(productName: string, waTemplate?: string) {
  const phoneNumber = "6281234567890";
  const message =
    waTemplate?.trim() ||
    `Halo, saya mau beli ${productName}. Apakah produknya masih tersedia?`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
