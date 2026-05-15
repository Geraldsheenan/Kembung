# Dokumentasi Website Kembunk

## 1. Gambaran Umum

Kembunk adalah website company profile dan product marketing untuk brand tumbler. Website ini tidak hanya menampilkan halaman promosi, tetapi juga punya:

- katalog produk
- detail produk
- daftar cabang dan detail cabang
- blog artikel SEO
- halaman tentang kami
- halaman kontak
- form newsletter
- form pesan kontak
- dashboard admin berbasis Supabase
- media library untuk upload asset

Secara arsitektur, website ini memakai **Next.js App Router** untuk frontend dan routing, **React** untuk komponen UI, **TypeScript** untuk logika aplikasi, **Tailwind CSS v4** untuk styling, **Framer Motion** untuk animasi, dan **Supabase** sebagai backend data serta autentikasi admin.

---

## 2. Bahasa Pemrograman dan Teknologi yang Dipakai

### Bahasa pemrograman utama

- **TypeScript**: hampir seluruh logic aplikasi ditulis dalam file `.ts` dan `.tsx`
- **JavaScript (Node.js runtime)**: dipakai di beberapa script utilitas dan seed
- **CSS**: styling global ada di `src/app/globals.css`

### Framework dan library utama

- **Next.js 16**: framework fullstack React untuk routing, server rendering, metadata, API route
- **React 19**: membangun komponen UI
- **Tailwind CSS 4**: utility-first CSS
- **Framer Motion**: animasi transisi, scroll behavior, motion section
- **Supabase**: database, auth admin, storage media
- **Ant Design**: tersedia di dependency, bisa dipakai untuk UI admin/komponen lanjutan
- **better-sqlite3**: sisa fondasi fallback lokal lama, sekarang sebagian besar form sudah dipindahkan ke Supabase

### File referensi

- `package.json`
- `src/app/layout.tsx`
- `src/lib/supabase/env.ts`
- `src/lib/supabase/auth.ts`

---

## 3. Fitur Website Kembunk

## 3.1. Fitur publik

### 1. Homepage

Homepage adalah halaman promosi utama dengan beberapa blok:

- hero section desktop dan mobile
- featured / best seller products
- alasan memilih Kembunk
- blok newsletter
- blok CTA TikTok
- CTA WhatsApp

Konten homepage diambil dari Supabase lewat:

- `homepage_sections`
- `homepage_featured_products`
- `homepage_reason_items`

Jika data Supabase kosong, website akan memakai fallback lokal dari code.

Referensi:

- `src/app/(site)/page.tsx`
- `src/lib/content/homepage-content.ts`

### 2. Katalog produk

Halaman katalog menampilkan semua produk dan menyediakan:

- filter kategori
- versi desktop dan mobile yang berbeda
- CTA detail produk
- CTA beli via WhatsApp
- highlight benefit seperti free shipping dan warranty

Referensi:

- `src/app/(site)/produk/page.tsx`
- `src/components/products/products-catalog.tsx`

### 3. Detail produk

Setiap produk punya halaman detail berisi:

- nama produk
- kategori
- harga
- deskripsi utama
- badge produk
- galeri gambar
- fitur unggulan
- warna
- target audience
- spesifikasi tabel
- produk terkait
- tombol beli via WhatsApp
- JSON-LD schema `Product` untuk SEO

Referensi:

- `src/app/(site)/produk/[slug]/page.tsx`

### 4. Halaman cabang

Halaman cabang memiliki fitur:

- daftar semua cabang
- pencarian cabang
- deteksi lokasi pengguna via browser geolocation
- penentuan cabang terdekat
- highlight cabang terdekat
- tampilan kartu cabang desktop dan mobile

Referensi:

- `src/app/(site)/cabang/page.tsx`
- `src/components/branches/branches-page-client.tsx`

### 5. Detail cabang

Setiap cabang punya halaman detail berisi:

- nama cabang
- badge
- deskripsi lokasi
- alamat
- jam operasional
- nomor WhatsApp
- gambar utama
- galeri foto
- peta embed
- fasilitas cabang
- daftar cabang lain
- JSON-LD schema `LocalBusiness`

Referensi:

- `src/app/(site)/cabang/[slug]/page.tsx`

### 6. Halaman artikel / blog SEO

Halaman artikel berfungsi untuk SEO dan content marketing. Fitur yang ada:

- featured article
- listing artikel lain
- kategori artikel
- estimasi waktu baca
- CTA newsletter

Referensi:

- `src/app/(site)/artikel/page.tsx`

### 7. Detail artikel

Detail artikel berisi:

- judul
- kategori
- waktu baca
- author dan author role
- tanggal publish
- gambar utama
- intro
- section artikel dinamis
- quote highlight
- tag populer
- artikel terkait
- CTA ke produk dan kontak
- JSON-LD schema `Article`

Referensi:

- `src/app/(site)/artikel/[slug]/page.tsx`

### 8. Halaman Tentang Kami

Halaman ini berisi:

- story brand
- image section
- quote section
- mission section
- mission highlights
- value cards
- final brand statement

Referensi:

- `src/app/(site)/tentang-kami/page.tsx`

### 9. Halaman Hubungi Kami

Fitur halaman kontak:

- alamat
- telepon
- email
- website
- social media
- jam operasional
- studio map image
- form kirim pesan
- kartu CTA WhatsApp

Referensi:

- `src/app/(site)/hubungi-kami/page.tsx`
- `src/components/contact/contact-message-form.tsx`

### 10. Newsletter signup

Form newsletter tersedia di beberapa halaman:

- homepage
- halaman artikel
- detail artikel

Kemampuan form:

- validasi email
- submit async ke API
- menampilkan toast sukses/gagal
- menyimpan source form

Referensi:

- `src/components/forms/newsletter-signup-form.tsx`
- `src/app/api/newsletter/route.ts`

### 11. Navigasi dan CTA global

Website punya lapisan layout yang konsisten:

- navbar sticky
- mobile menu
- footer
- mobile bottom navigation
- sticky mobile CTA
- floating WhatsApp button
- progress/navigation indicator
- page transition
- toast system

Referensi:

- `src/components/layout/app-shell.tsx`
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`

---

## 3.2. Fitur admin

Website ini punya dashboard admin dengan autentikasi role `admin` dari Supabase.

### Fitur admin yang tersedia

- login admin
- proteksi route `/admin/(protected)`
- overview dashboard
- edit site settings
- edit homepage
- CRUD produk
- CRUD cabang
- CRUD artikel
- edit about page
- edit contact page
- kelola subscriber newsletter
- kelola pesan kontak
- kelola navigation
- media library upload/delete/copy URL

Referensi:

- `src/app/admin/(protected)/page.tsx`
- `src/app/admin/(protected)/layout.tsx`
- `src/components/admin/admin-shell.tsx`

### Detail modul admin

#### 1. Site Settings

Mengatur data global brand:

- nama website
- tagline
- deskripsi
- nomor telepon
- URL situs
- Instagram
- TikTok
- logo
- favicon

#### 2. Homepage Editor

Mengatur:

- hero
- best seller intro
- reasons intro
- newsletter block
- TikTok block
- featured products desktop/mobile
- daftar reason desktop/mobile

#### 3. Products Admin

CRUD produk dengan field:

- slug
- nama
- kategori
- harga
- short description
- description
- image
- badge
- SEO title
- meta description
- WA template
- active/featured status
- features
- colors
- audiences
- gallery
- specs

Sudah mendukung drag-and-drop untuk list seperti features, gallery, dan specs.

#### 4. Branches Admin

CRUD cabang dengan field:

- lokasi
- badge
- alamat
- koordinat latitude/longitude
- jam operasional
- map URL dan embed
- image
- fasilitas
- galeri
- mobile content variant

#### 5. Articles Admin

CRUD artikel dengan field:

- slug
- judul
- kategori
- excerpt
- SEO title
- meta description
- tanggal publish
- read time
- author
- author role
- image
- og image
- intro
- quote
- canonical URL
- status draft/published
- featured article
- tags
- sections
- paragraphs di tiap section

#### 6. Newsletter Admin

Mengelola subscriber:

- filter berdasarkan status
- update status subscribed/unsubscribed
- hapus subscriber

#### 7. Contact Messages Admin

Mengelola pesan masuk:

- lihat isi pesan
- ubah status `new`, `read`, `replied`, `archived`
- tulis admin note
- hapus pesan

#### 8. Navigation Admin

Mengelola item:

- navbar
- footer help
- footer social

Sudah mendukung drag-and-drop urutan item.

#### 9. Media Library

Fitur:

- upload file gambar
- simpan tag dan alt text
- simpan asset metadata ke Supabase
- copy public URL
- hapus asset

---

## 4. Struktur Komponen Utama

Berikut pembagian komponen agar website seperti ini mudah dirawat.

### A. Layout components

Lokasi: `src/components/layout`

Komponen utama:

- `app-shell.tsx`
- `navbar.tsx`
- `footer.tsx`
- `mobile-menu.tsx`
- `mobile-bottom-nav.tsx`
- `sticky-mobile-cta.tsx`
- `animated-whatsapp-float.tsx`
- `navigation-progress.tsx`

Fungsi:

- membungkus semua halaman publik
- menampilkan navigasi global
- memberi CTA tetap untuk user mobile
- menjaga UX konsisten

### B. Animation components

Lokasi: `src/components/animation`

Komponen:

- `page-transition.tsx`
- `motion-section.tsx`
- `animated-card.tsx`
- `toast.tsx`
- `modal.tsx`
- `drawer.tsx`
- `bottom-sheet.tsx`
- `faq-accordion.tsx`

Fungsi:

- animasi transisi halaman
- animasi scroll reveal
- popup dan feedback UI

### C. Card components

Lokasi: `src/components/cards`

Komponen:

- `branch-card.tsx`
- `product-card.tsx`
- `article-card.tsx`
- `testimonial-card.tsx`

Fungsi:

- menyajikan data berulang dalam pola UI yang konsisten

### D. Feature components

Lokasi:

- `src/components/products`
- `src/components/branches`
- `src/components/contact`
- `src/components/forms`
- `src/components/common`

Contoh:

- `products-catalog.tsx`
- `branches-page-client.tsx`
- `contact-message-form.tsx`
- `newsletter-signup-form.tsx`
- `whatsapp-button.tsx`
- `section-heading.tsx`
- `brand-logo.tsx`

### E. Admin components

Lokasi: `src/components/admin`

Fungsi:

- editor data
- dashboard shell
- login admin
- upload media
- form CRUD per modul

---

## 5. Arsitektur Data dan Alur Konten

Website ini memakai pendekatan **content-driven**.

### Sumber data publik

1. **Supabase sebagai sumber utama**
2. **Fallback lokal dari `src/data/site.ts` dan helper content** jika database kosong atau gagal diakses

Ini membuat website:

- tetap bisa jalan saat data Supabase belum lengkap
- mudah di-seed di awal
- aman untuk tahap development

### Tabel Supabase yang teridentifikasi

- `site_settings`
- `navigation_items`
- `homepage_sections`
- `homepage_featured_products`
- `homepage_reason_items`
- `products`
- `product_features`
- `product_colors`
- `product_audiences`
- `product_gallery`
- `product_specs`
- `branches`
- `branch_facilities`
- `branch_gallery`
- `articles`
- `article_tags`
- `article_sections`
- `article_section_paragraphs`
- `about_page_sections`
- `about_values`
- `contact_page_settings`
- `newsletter_signups`
- `contact_messages`
- `media_assets`

---

## 6. Bagaimana Cara Membuat Website Seperti Ini

Berikut urutan paling masuk akal untuk membangun website Kembunk dari nol.

### Langkah 1. Buat fondasi project

Gunakan:

- Next.js App Router
- TypeScript
- Tailwind CSS

Tujuannya:

- routing rapi
- komponen reusable
- SEO lebih bagus
- mudah gabungkan frontend dan API

### Langkah 2. Buat layout global

Buat komponen:

- `RootLayout`
- `AppShell`
- `Navbar`
- `Footer`

Tujuan:

- semua halaman punya struktur yang konsisten
- CTA dan navigasi bisa dipakai ulang

### Langkah 3. Definisikan model data

Buat struktur data untuk:

- site settings
- navigation
- products
- branches
- articles
- homepage sections
- about page
- contact page

Awalnya bisa simpan dulu di file lokal seperti:

- `src/data/site.ts`
- `src/lib/content/*.ts`

### Langkah 4. Bangun halaman publik

Urutan ideal:

1. homepage
2. produk list
3. produk detail
4. cabang list
5. cabang detail
6. artikel list
7. artikel detail
8. tentang kami
9. hubungi kami

### Langkah 5. Tambahkan interaksi client-side

Contohnya:

- filter kategori produk
- pencarian cabang
- geolocation cabang terdekat
- submit form kontak
- submit newsletter
- toast feedback

Bagian seperti ini biasanya dibuat sebagai **client component** dengan `"use client"`.

### Langkah 6. Hubungkan ke Supabase

Gunakan Supabase untuk:

- database konten
- auth admin
- storage gambar

File penting di project ini:

- `src/lib/supabase/env.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/supabase/auth.ts`

### Langkah 7. Buat API route

Contohnya:

- `POST /api/newsletter`
- `POST /api/contact-messages`
- `POST /api/admin/products`
- `POST /api/admin/articles`
- `POST /api/admin/branches`
- `POST /api/admin/homepage`
- `POST /api/admin/navigation`
- `POST /api/admin/media-library`

Fungsi API:

- validasi input
- simpan ke Supabase
- kembalikan response sukses/gagal

### Langkah 8. Buat dashboard admin

Pisahkan shell admin dan shell publik.

Website ini melakukannya dengan:

- `src/app/admin/layout.tsx`
- `src/app/admin/(protected)/layout.tsx`
- `src/components/admin/admin-shell.tsx`

Admin sebaiknya punya:

- proteksi login
- editor per modul
- status message
- delete confirmation
- upload media

### Langkah 9. Tambahkan SEO

Website Kembunk sudah menerapkan:

- metadata per halaman
- title dan description
- Open Graph
- Twitter metadata
- sitemap
- robots
- JSON-LD schema

File penting:

- `src/lib/seo.ts`
- `src/components/seo/json-ld.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`

### Langkah 10. Buat fallback data

Ini penting agar website tetap hidup walau DB kosong.

Polanya:

- coba ambil dari Supabase
- kalau gagal, pakai data lokal

Pendekatan ini dipakai di banyak helper `src/lib/content/*.ts`.

---

## 7. Pola Arsitektur yang Dipakai di Project Ini

### 1. Server component untuk data page

Sebagian besar halaman mengambil data langsung di server:

- lebih baik untuk SEO
- initial render lebih cepat
- aman untuk secret dan akses backend

### 2. Client component untuk interaksi

Digunakan saat butuh:

- state
- event handler
- geolocation
- drag-and-drop
- fetch dari browser

### 3. Content adapter pattern

`src/lib/content/*.ts` bertindak sebagai adapter antara halaman dan sumber data.

Manfaatnya:

- page tidak tahu detail query database
- mudah ganti sumber data
- bisa pakai fallback

### 4. Reusable CRUD editor pattern

Komponen admin memakai pola serupa:

- list item di kiri
- form editor di kanan
- save/delete ke API
- update state lokal setelah response sukses

Ini membuat penambahan modul admin baru jadi lebih cepat.

---

## 8. Komponen dan Folder yang Perlu Dibuat Jika Membangun Ulang

Kalau kamu ingin membuat website seperti Kembunk, minimal siapkan struktur berikut:

### Routing

- `src/app/(site)/page.tsx`
- `src/app/(site)/produk/page.tsx`
- `src/app/(site)/produk/[slug]/page.tsx`
- `src/app/(site)/cabang/page.tsx`
- `src/app/(site)/cabang/[slug]/page.tsx`
- `src/app/(site)/artikel/page.tsx`
- `src/app/(site)/artikel/[slug]/page.tsx`
- `src/app/(site)/tentang-kami/page.tsx`
- `src/app/(site)/hubungi-kami/page.tsx`
- `src/app/admin/...`
- `src/app/api/...`

### Components

- layout components
- cards
- forms
- animation helpers
- admin editor components

### Library / helper

- `src/lib/supabase/*`
- `src/lib/content/*`
- `src/lib/seo.ts`
- `src/lib/whatsapp.ts`
- `src/lib/motion.ts`
- `src/lib/format.ts`

### Data fallback

- `src/data/site.ts`

---

## 9. Kesimpulan

Website Kembunk adalah gabungan dari:

- **company profile**
- **product catalog**
- **SEO blog**
- **branch locator**
- **lead generation form**
- **WhatsApp conversion funnel**
- **admin CMS ringan berbasis Supabase**

Kalau dijelaskan secara sederhana, website ini dibuat dengan pola:

1. **Next.js + React + TypeScript** untuk tampilan dan routing
2. **Tailwind + Framer Motion** untuk UI/UX
3. **Supabase** untuk konten, auth, storage, dan data admin
4. **Komponen reusable** agar setiap halaman mudah dirawat
5. **Fallback data lokal** agar development tetap aman

Jadi, ini bukan website statis biasa. Ini sudah mendekati **custom CMS website** untuk brand produk lifestyle.

---

## 10. Referensi File Penting

- `package.json`
- `src/app/layout.tsx`
- `src/app/(site)/page.tsx`
- `src/app/(site)/produk/page.tsx`
- `src/app/(site)/produk/[slug]/page.tsx`
- `src/app/(site)/cabang/page.tsx`
- `src/app/(site)/cabang/[slug]/page.tsx`
- `src/app/(site)/artikel/page.tsx`
- `src/app/(site)/artikel/[slug]/page.tsx`
- `src/app/(site)/tentang-kami/page.tsx`
- `src/app/(site)/hubungi-kami/page.tsx`
- `src/components/layout/app-shell.tsx`
- `src/components/products/products-catalog.tsx`
- `src/components/branches/branches-page-client.tsx`
- `src/components/forms/newsletter-signup-form.tsx`
- `src/components/contact/contact-message-form.tsx`
- `src/components/admin/admin-shell.tsx`
- `src/components/admin/products-admin-client.tsx`
- `src/components/admin/articles-admin-client.tsx`
- `src/components/admin/branches-admin-client.tsx`
- `src/components/admin/homepage-admin-client.tsx`
- `src/components/admin/navigation-admin-client.tsx`
- `src/components/admin/newsletter-admin-client.tsx`
- `src/components/admin/contact-messages-admin-client.tsx`
- `src/components/admin/media-library-admin-client.tsx`
- `src/lib/content/homepage-content.ts`
- `src/lib/content/site-content.ts`
- `src/lib/content/navigation-content.ts`
- `src/lib/supabase/env.ts`

