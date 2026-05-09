# Kembung App Summary

## Gambaran Umum

Project ini adalah website brand `Kembung` yang dibangun dengan `Next.js 16 App Router`, `React 19`, `TypeScript`, dan `Tailwind CSS v4`.

Fungsi utama aplikasinya:

- menampilkan company profile brand tumbler `Kembung`
- menampilkan katalog produk dan detail produk
- menampilkan daftar cabang dan detail cabang
- menampilkan artikel/blog dan detail artikel
- mengarahkan user ke WhatsApp untuk inquiry atau pembelian

Secara fungsional, ini adalah kombinasi:

- landing page brand
- katalog produk
- company profile
- SEO content website
- funnel CTA ke WhatsApp

## Tujuan Produk

Website ini dirancang untuk:

- membangun identitas brand `Kembung`
- menampilkan produk dengan visual lifestyle pastel
- mempermudah user melihat produk, cabang, dan artikel
- mendorong conversion lewat CTA WhatsApp

Jadi fokus utamanya bukan e-commerce penuh berbasis cart/checkout, tetapi lebih ke:

- browse produk
- baca informasi
- klik CTA
- lanjut komunikasi ke admin

## Stack dan Teknologi

- `Next.js 16.2.6`
- `React 19.2.4`
- `TypeScript`
- `Tailwind CSS v4`
- `Framer Motion` untuk animasi UI
- `React Icons` untuk ikon
- `Ant Design Skeleton` untuk image loading state

## Struktur Route

Route utama ada di `src/app`:

- `/` : homepage / landing page
- `/produk` : katalog produk
- `/produk/[slug]` : detail produk
- `/cabang` : daftar cabang
- `/cabang/[slug]` : detail cabang
- `/artikel` : daftar artikel
- `/artikel/[slug]` : detail artikel
- `/tentang-kami` : halaman brand story / about
- `/hubungi-kami` : halaman contact

Route utilitas:

- `robots.ts`
- `sitemap.ts`
- `not-found.tsx`
- `loading.tsx`

## Struktur Layout Aplikasi

Root layout ada di:

- [src/app/layout.tsx](C:/ProjectXJoki/Kembung/src/app/layout.tsx)

Layout global membungkus semua halaman dengan `AppShell`.

`AppShell` ada di:

- [src/components/layout/app-shell.tsx](C:/ProjectXJoki/Kembung/src/components/layout/app-shell.tsx)

Isi `AppShell`:

- `Navbar`
- `PageTransition`
- `Footer`
- `MobileBottomNav`
- `StickyMobileCTA`
- `AnimatedWhatsAppFloat`
- `NavigationProgress`
- `ToastProvider`

Artinya hampir semua page memakai shell UI yang konsisten antara desktop dan mobile.

## Sumber Data Utama

Semua data statis utama dipusatkan di:

- [src/data/site.ts](C:/ProjectXJoki/Kembung/src/data/site.ts)

File ini menyimpan:

- info brand `SITE`
- `navItems`
- data `branches`
- data `products`
- data `articles`
- `testimonials`
- `seoKeywords`

Ini penting karena aplikasi ini saat ini masih bersifat data-driven dari file lokal, bukan dari database atau CMS.

## Arsitektur Konten

### 1. Produk

Data produk memiliki properti:

- `slug`
- `name`
- `category`
- `price`
- `shortDescription`
- `description`
- `features`
- `colors`
- `audience`
- `specs`
- `image`
- `gallery`
- `badge`

Halaman produk:

- katalog: [src/app/produk/page.tsx](C:/ProjectXJoki/Kembung/src/app/produk/page.tsx)
- detail: [src/app/produk/[slug]/page.tsx](C:/ProjectXJoki/Kembung/src/app/produk/[slug]/page.tsx)

Perilaku produk saat ini:

- user bisa melihat katalog desktop dan mobile
- user bisa membuka detail produk
- CTA pembelian diarahkan ke WhatsApp
- fitur `Tambah ke Keranjang` sudah dihapus

### 2. Artikel

Data artikel memiliki struktur editorial yang lebih kaya:

- `title`, `slug`, `excerpt`, `category`
- `seoTitle`, `metaDescription`
- `author`, `authorRole`
- `image`, `imageAlt`
- `intro`
- `quote`
- `tags`
- `sections`
- `content`

Halaman artikel:

- daftar: [src/app/artikel/page.tsx](C:/ProjectXJoki/Kembung/src/app/artikel/page.tsx)
- detail: [src/app/artikel/[slug]/page.tsx](C:/ProjectXJoki/Kembung/src/app/artikel/[slug]/page.tsx)

Detail artikel sekarang sudah memakai layout editorial dengan:

- hero/title section
- info author
- featured image
- grouped sections
- quote block
- related articles
- tags
- CTA newsletter

### 3. Cabang

Data cabang menyimpan:

- nama cabang
- alamat
- jam operasional
- embed map
- badge / tone / mobile metadata

Halaman cabang:

- daftar: [src/app/cabang/page.tsx](C:/ProjectXJoki/Kembung/src/app/cabang/page.tsx)
- detail: [src/app/cabang/[slug]/page.tsx](C:/ProjectXJoki/Kembung/src/app/cabang/[slug]/page.tsx)

Fungsi utamanya adalah menampilkan lokasi fisik dan CTA kontak cabang via WhatsApp.

## CTA dan Alur Conversion

Semua CTA utama diarahkan ke WhatsApp.

Helper-nya ada di:

- [src/lib/whatsapp.ts](C:/ProjectXJoki/Kembung/src/lib/whatsapp.ts)

Fungsi utama:

- `buildWhatsAppUrl`
- `buildGeneralWhatsAppMessage`
- `buildBranchMessage`
- `buildProductMessage`

Ini berarti funnel aplikasi adalah:

1. user melihat produk/artikel/cabang
2. user tertarik
3. user klik tombol CTA
4. user masuk ke WhatsApp admin

## SEO dan Metadata

SEO helper ada di:

- [src/lib/seo.ts](C:/ProjectXJoki/Kembung/src/lib/seo.ts)

Fungsi `createMetadata()` dipakai untuk membentuk:

- `title`
- `description`
- `canonical`
- `openGraph`
- `twitter`

Selain metadata halaman, project juga sudah memakai:

- `JsonLd` di beberapa halaman detail
- `robots.ts`
- `sitemap.ts`

Jadi fondasi SEO-nya sudah cukup rapi untuk website profil + blog.

## Sistem UI

Secara visual, aplikasi ini memakai arah desain:

- pastel lifestyle
- rounded / soft cards
- mobile-first interaction
- CTA yang dominan ke WhatsApp
- kombinasi layout editorial dan product showcase

Komponen penting dibagi ke folder:

- `layout` : navbar, footer, mobile nav, shell
- `cards` : kartu produk, artikel, cabang
- `common` : logo, tombol reusable, skeleton image
- `animation` : transisi halaman dan animasi elemen
- `seo` : schema / metadata helper components
- `products`, `articles`, `contact` : komponen domain-specific

## Loading Gambar

Sekarang semua image utama memakai wrapper reusable:

- [src/components/common/skeleton-image.tsx](C:/ProjectXJoki/Kembung/src/components/common/skeleton-image.tsx)

Wrapper ini:

- tetap memakai `next/image`
- menambahkan `antd Skeleton` saat gambar belum selesai dimuat
- membuat perpindahan visual lebih halus saat refresh

Catatan:

- ini meningkatkan perceived loading
- ini tidak otomatis mengecilkan ukuran file gambar
- performa network tetap bergantung pada ukuran gambar sumber

## Mobile Experience

Project ini sangat memperhatikan pengalaman mobile, terlihat dari:

- navbar capsule / floating
- mobile bottom nav
- sticky CTA WhatsApp
- layout produk mobile yang sudah dioptimalkan
- detail produk mobile yang didesain berbeda dari desktop

Beberapa bagian memang punya implementasi mobile custom, bukan sekadar versi responsif dari desktop.

## Pola Rendering

Mayoritas page adalah Server Component default App Router.

Komponen client dipakai saat memang perlu:

- animasi
- interaksi scroll
- toast
- motion
- loading image skeleton state

Ini bagus karena:

- page content tetap ringan
- interaktivitas dipisah ke komponen client yang benar-benar perlu

## Kondisi Program Saat Ini

Secara umum program ini sudah:

- jalan sebagai website lengkap
- punya struktur route yang jelas
- punya data statis terpusat
- punya SEO metadata
- punya mobile UI yang cukup kuat
- punya CTA funnel yang konsisten

Program ini belum terlihat memiliki:

- backend/database
- authentication
- checkout/cart real
- CMS admin panel
- API bisnis internal

Jadi saat ini dia paling tepat dipahami sebagai:

> website brand & katalog statis-interaktif dengan conversion ke WhatsApp

## Area Penting Jika Mau Dikembangkan

Kalau nanti project ini mau dinaikkan levelnya, area berikut paling masuk akal:

- mengganti `src/data/site.ts` dengan CMS atau database
- menambahkan filtering produk yang benar-benar aktif
- menambahkan search yang benar-benar berfungsi
- menambahkan analytics conversion CTA
- optimasi ukuran asset image sumber
- membuat sistem favorite/cart hanya jika memang dibutuhkan bisnis

## Ringkasan Singkat

`Kembung` adalah website brand tumbler berbasis `Next.js 16` yang menggabungkan landing page, katalog produk, company profile, daftar cabang, dan blog SEO. Semua konten utama masih berasal dari data statis lokal, dan conversion utama diarahkan ke WhatsApp, bukan ke checkout internal. UI-nya sangat menonjolkan gaya pastel, mobile-first, dan navigasi yang ringan. Secara teknis, fondasinya sudah rapi untuk website marketing yang siap dikembangkan lebih lanjut.
