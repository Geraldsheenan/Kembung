# Kembung Website Blueprint

## 1. Sitemap Website
- `/`
- `/tentang-kami`
- `/cabang`
- `/cabang/ancol`
- `/cabang/serpong`
- `/cabang/bekasi`
- `/produk`
- `/produk/kembung-pastel-bottle`
- `/produk/tumbler-custom-name`
- `/produk/tumbler-travel-flask`
- `/artikel`
- `/artikel/5-alasan-gen-z-wajib-punya-tumbler-sendiri`
- `/artikel/cara-memilih-tumbler-estetik-yang-cocok-untuk-aktivitas-harian`
- `/artikel/cara-merawat-tumbler-agar-tidak-bau`
- `/artikel/ide-gift-set-tumbler-untuk-teman-komunitas-dan-event`
- `/hubungi-kami`

## 2. Wireframe Section Setiap Halaman
- Beranda: Navbar, Hero, intro brand, keunggulan, produk unggulan, cabang, testimoni, artikel terbaru, CTA akhir, footer.
- Tentang Kami: Hero story, cerita brand, visi-misi, nilai brand, alasan memilih Kembung, CTA.
- Cabang: Hero cabang, grid branch cards.
- Detail Cabang: Hero cabang, info alamat/jam/WA, embed map, cabang terkait.
- Produk: Hero katalog, chips kategori, product grid.
- Detail Produk: Galeri, info harga/deskripsi, spesifikasi, keunggulan, audience, FAQ, related products.
- Artikel: Hero artikel, article grid.
- Detail Artikel: Hero artikel, featured image, isi artikel, CTA internal link, related articles.
- Hubungi Kami: Intro, WhatsApp utama, pilihan cabang, contact form redirect WA.

## 3. Copywriting Headline dan CTA
- Headline utama: Stay Hydrated, Stay Kembung.
- Subheadline hero: Tumbler pastel estetik yang siap temani sekolah, kuliah, kerja, nongkrong, sampai traveling.
- CTA utama: Lihat Produk
- CTA kedua: Pesan via WhatsApp
- CTA cabang: Cari Cabang Terdekat
- CTA contact: Chat WhatsApp Utama

## 4. Rekomendasi Fitur
- Navbar responsive
- Mobile bottom navigation
- WhatsApp floating button
- Structured data sederhana untuk Organization, Product, Article, dan LocalBusiness
- Dynamic route untuk produk, artikel, dan cabang
- Contact form dengan redirect WhatsApp otomatis
- Sitemap dan robots

## 5. Rekomendasi Artikel SEO
- 5 Alasan Gen Z Wajib Punya Tumbler Sendiri
- Cara Memilih Tumbler Estetik yang Cocok untuk Aktivitas Harian
- Cara Merawat Tumbler agar Tidak Bau
- Ide Gift Set Tumbler untuk Teman, Komunitas, dan Event
- Kenapa Tumbler Pastel Lagi Banyak Disukai Anak Muda?
- Rekomendasi Tumbler untuk Kuliah, Kerja, dan Nongkrong

## 6. Struktur Folder Next.js + Tailwind CSS
```text
src/
  app/
    tentang-kami/
    cabang/
      [slug]/
    produk/
      [slug]/
    artikel/
      [slug]/
    hubungi-kami/
  components/
    cards/
    common/
    contact/
    layout/
    seo/
  data/
  lib/
public/
docs/
```

## 7. Contoh Komponen Reusable
- `Navbar`
- `Footer`
- `WhatsAppButton`
- `SectionHeading`
- `ProductCard`
- `BranchCard`
- `ArticleCard`
- `TestimonialCard`
- `ContactForm`

## 8. Contoh Data Dummy
- `src/data/site.ts` berisi dummy produk, cabang, artikel, testimoni, keywords, dan metadata site.

## 9. Contoh Implementasi Tombol WhatsApp Redirect
```ts
export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/6281905640000?text=${encodeURIComponent(message)}`;
}
```

## 10. Rekomendasi Keyword SEO
- tumbler pastel
- tumbler Gen Z
- tumbler estetik
- tumbler custom
- tumbler Kembung
- tumbler untuk kuliah
- tumbler untuk kerja
- tumbler daily use
- tumbler stainless steel
- gift set tumbler
