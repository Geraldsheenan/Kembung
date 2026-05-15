import { readdirSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv, loadEnvFile } from "./_load-env.mjs";

loadEnvFile();

type ProductSeed = {
  productNumber: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  badge: string;
  seoTitle: string;
  metaDescription: string;
  waTemplate: string;
  fallbackImageUrl: string;
  fallbackGalleryUrls: string[];
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  colors: string[];
  audiences: string[];
  specs: { label: string; value: string }[];
};

const supabase = createClient(
  getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const productDirectory = path.resolve(process.cwd(), "public", "produk");

const products: ProductSeed[] = [
  {
    productNumber: 1,
    name: "Kembunk Pastel Bottle",
    slug: "kembunk-pastel-bottle",
    category: "Tumbler Pastel",
    price: 189000,
    badge: "Best Seller",
    seoTitle: "Kembunk Pastel Bottle - Tumbler Pastel Estetik untuk Daily Use",
    metaDescription:
      "Kembunk Pastel Bottle adalah tumbler estetik warna pastel untuk aktivitas harian Gen Z. Ringan, clean, dan cocok untuk sekolah, kuliah, kerja, nongkrong, hingga traveling.",
    waTemplate:
      "Halo, saya mau beli Kembunk Pastel Bottle. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmmuPCVRFXe4RqaE78IFl0NsTaIf5JfrMy61P-MDFU8v6QbOEVIHIaL99KGJ7lVeauzu6I7X9_M_auhteOTsawOu8Dz0K_SzjWohemswAxlgCyaPEifQ-gdm3Clsnya038NTaw3Y4bjjMnuYnO32_apUYQWrwANhPrjKbbNb1gCarPj9Ip4u2uOv0EnK8GZQ_EyhvyFYc7FnXYKr0-JJ_vr8DZj2zSzmthygrK2qFvolFELpDoG7AZ1MkC63Ws0BqBuEdbPFSiUsct",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD34bZS8TZcKKsch1wuSUMAJHxxqRGqTJgfEMbpvE7luepZUhiZS6uiRvkhpME2TP6RvGy3dUVskUbUjVLK_2t7L05a1EL2ZgOipca2a-lXQ0u8HarjK3Po7WetIUgphV3KXRs7kvGKlVUnoPawAD7h1r5ZtfU3D-6629E8MsYMeGlorI4V5wBCjMmawSoQXDDPHFyafKxPvmhGhpkVbSA92UfqzPDiQd5n6Z0rNskXY1k7hTwcIdsHXjFuiXltMYKZzmNDs3RMhHSz",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZq5Nvx10dASEfShOU8bJ4GtgEUG9J8b-W8s1BspK_6XoGFVrkFBGdXGy-2F2VF4bYzfj7_gcmIRwStz4rqDRT1VORe3AI4JKRSSr1dhaKX1WnyZgza_EQiL-6Q0YxaFzVIZW-Sx5bWqzzMaRRMSjIgqyD88oWIQCcjd2pyHty-VI5v6dOJjmGApTnQmHG08QSrjq8oOWUQm6Qppnf9i-r3z0MCGzFUw9x2D7nLLXLv8DqeEGKy7Ux3_QJtvtXuVAggctHygsxU4vw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5yGL4SW50Bh0WHmk8TionUVSUseEBJhLpJR4cxFXnVd0W5nyJMsSL4_M4kK_oJiX7ZSEsFkTpiyKzGvVdEcp-REV2Pli2e9HM1BHwbY0CmkRlhBXg2VMR-BTUOWVUsqEkKcnk7okNxrM11RqPTWzlUZVC9JfsjgfKS_y8aJgdwYVZ_WkdzStUmxvIj7cWfCXa6hfmWHk93QN55pAZiUYJ9LfN1Fn10dO6ASCjmb-PUZWyQdRcip4FEJdW4V86Id0z-6aEe-TAWzY",
    ],
    sortOrder: 0,
    isActive: true,
    isFeatured: true,
    shortDescription:
      "Tumbler estetik dengan warna pastel yang cocok untuk aktivitas harian Gen Z.",
    description:
      "Kembunk Pastel Bottle dibuat untuk kamu yang ingin tetap terhidrasi tanpa meninggalkan gaya. Ringan dibawa, nyaman digenggam, dan cocok buat sekolah, kuliah, kerja, nongkrong, sampai traveling.",
    features: [
      "Desain pastel Gen Z",
      "Ringan dan mudah dibawa",
      "Cocok untuk minuman dingin atau hangat",
      "Aman untuk penggunaan harian",
      "Cocok untuk sekolah, kuliah, kerja, dan nongkrong",
    ],
    colors: ["Mint Green", "Soft Cream", "Peach Coral"],
    audiences: [
      "Mahasiswa yang suka meja belajar rapi dan estetik",
      "Pekerja muda yang ingin bawa botol minum yang clean",
      "Komunitas kreatif yang suka produk fun tapi fungsional",
    ],
    specs: [
      { label: "Kapasitas", value: "500 ml" },
      { label: "Material", value: "Food grade stainless steel" },
      { label: "Insulasi", value: "Cold 24 jam, warm 12 jam" },
      { label: "Berat", value: "320 gram" },
    ],
  },
  {
    productNumber: 2,
    name: "Kembunk Cloud Sip Bottle",
    slug: "kembunk-cloud-sip-bottle",
    category: "Bottle Clean Series",
    price: 199000,
    badge: "Daily Favorite",
    seoTitle: "Kembunk Cloud Sip Bottle - Bottle Clean Look untuk Kampus dan Kerja",
    metaDescription:
      "Kembunk Cloud Sip Bottle hadir dengan clean look dan feel premium untuk kamu yang suka bottle minimalis, estetik, dan nyaman dibawa ke kampus, kantor, atau coworking space.",
    waTemplate:
      "Halo, saya mau beli Kembunk Cloud Sip Bottle. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNr9xYl8ul9RNDQMTu1K-SRzj_0gqsZ4Oh3OGQl0aMpBs1GOINUb2biIy8e-9H3jOBDjQ30yPdrefQcz0C72N8TFpUz_w7PzMvT294Z4KCQJBVD6xTT7QZPr1UqL1tBJgWZojo5EaIgyb5vzAbsu9uq5GNt5aQbrjIp_vyhdpOt5W_CPE-20K3iVPWN4tQzRYJLHNga-TcAPfdrI6DJ5AU6VfhMb4YnTBbIWJ12pFaa3NXnUEDDMcfDWghr2fUsEwbbxQFt0xxfNf",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J5H5Nwg5THhTw1Fq51C-BMJgtQJYtM5MtjzW-VykItwF0sDnYUofedOYBoAiBwh7XXTdmglg5pf7Poz23tv9Nnu36mn9TKuGMjP7u8nTzOW9G3y7GaT9VtyW3Lgc2jbh9mAX0iST6bTXPcaYwbAmE0h-Ix2ykJbZ8IHsYeQFIDu8NOK8rOs20AuarZNLCNHkwAD-dIhnx61MyA3zaZQVDrRerCueLt8EH32IKxG2DoKjnXV_1TjAWN4cFN0EznHw1b73AQfHF8rD",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6NSFBuwKZGZ_ruKwZIVHy8sNBEsfcrzciS_sanUMWN8W4_kEq4iv_UhDT3s-6QFLZXl5GHefdfnbfhkv16GME4gTUPWHPzBPjAk2JuZ5Gd8s_SKBZpvtD9GGG9KiaVVQIev0X88hJXK1TTKc2r35qdCbyekE7kDLMdtU1M6skRdN8dhl1gW8qM-aXjr5Ohlv1I2ZVS5AtwTtCdHWJ2yR4dTJLP5VOkhG-GzI3P7G-kERT0GcznWp1YRn7ew2XsCzGmjT85_xqBpp",
    ],
    sortOrder: 1,
    isActive: true,
    isFeatured: true,
    shortDescription:
      "Bottle minimalis dengan vibe clean dan warna soft yang gampang masuk ke semua daily setup.",
    description:
      "Kembunk Cloud Sip Bottle cocok buat kamu yang suka tampilan sederhana tapi tetap niat. Bentuknya clean, ringan dibawa, dan pas buat meja kerja, kelas, sampai coffee run sore hari.",
    features: [
      "Desain clean minimalis",
      "Nyaman digenggam untuk daily commute",
      "Leak-resistant untuk tas harian",
      "Ringan dan praktis dibawa",
      "Cocok untuk kampus, kerja, dan coworking",
    ],
    colors: ["Milk White", "Fog Blue", "Muted Sage"],
    audiences: [
      "Mahasiswa yang suka setup meja belajar clean",
      "Pekerja muda yang ingin bottle simpel tapi estetik",
      "Orang yang suka produk minimalis dan fungsional",
    ],
    specs: [
      { label: "Kapasitas", value: "550 ml" },
      { label: "Material", value: "BPA free premium bottle body" },
      { label: "Insulasi", value: "Cold 10 jam, warm 6 jam" },
      { label: "Berat", value: "290 gram" },
    ],
  },
  {
    productNumber: 3,
    name: "Kembunk Custom Name Tumbler",
    slug: "kembunk-custom-name-tumbler",
    category: "Custom Gift Series",
    price: 219000,
    badge: "Custom",
    seoTitle: "Kembunk Custom Name Tumbler - Tumbler Personal untuk Gift dan Event",
    metaDescription:
      "Kembunk Custom Name Tumbler cocok untuk hadiah bestie, merch komunitas, atau hampers event dengan sentuhan personal yang clean dan premium.",
    waTemplate:
      "Halo, saya mau beli Kembunk Custom Name Tumbler. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNr9xYl8ul9RNDQMTu1K-SRzj_0gqsZ4Oh3OGQl0aMpBs1GOINUb2biIy8e-9H3jOBDjQ30yPdrefQcz0C72N8TFpUz_w7PzMvT294Z4KCQJBVD6xTT7QZPr1UqL1tBJgWZojo5EaIgyb5vzAbsu9uq5GNt5aQbrjIp_vyhdpOt5W_CPE-20K3iVPWN4tQzRYJLHNga-TcAPfdrI6DJ5AU6VfhMb4YnTBbIWJ12pFaa3NXnUEDDMcfDWghr2fUsEwbbxQFt0xxfNf",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J5H5Nwg5THhTw1Fq51C-BMJgtQJYtM5MtjzW-VykItwF0sDnYUofedOYBoAiBwh7XXTdmglg5pf7Poz23tv9Nnu36mn9TKuGMjP7u8nTzOW9G3y7GaT9VtyW3Lgc2jbh9mAX0iST6bTXPcaYwbAmE0h-Ix2ykJbZ8IHsYeQFIDu8NOK8rOs20AuarZNLCNHkwAD-dIhnx61MyA3zaZQVDrRerCueLt8EH32IKxG2DoKjnXV_1TjAWN4cFN0EznHw1b73AQfHF8rD",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6NSFBuwKZGZ_ruKwZIVHy8sNBEsfcrzciS_sanUMWN8W4_kEq4iv_UhDT3s-6QFLZXl5GHefdfnbfhkv16GME4gTUPWHPzBPjAk2JuZ5Gd8s_SKBZpvtD9GGG9KiaVVQIev0X88hJXK1TTKc2r35qdCbyekE7kDLMdtU1M6skRdN8dhl1gW8qM-aXjr5Ohlv1I2ZVS5AtwTtCdHWJ2yR4dTJLP5VOkhG-GzI3P7G-kERT0GcznWp1YRn7ew2XsCzGmjT85_xqBpp",
    ],
    sortOrder: 2,
    isActive: true,
    isFeatured: true,
    shortDescription:
      "Tumbler custom dengan nama personal untuk hadiah, komunitas, dan momen yang ingin terasa lebih spesial.",
    description:
      "Kembunk Custom Name Tumbler dibuat buat kamu yang ingin kasih sentuhan personal pada produk harian. Cocok untuk hadiah sahabat, hampers event, maupun merchandise komunitas yang tetap usable.",
    features: [
      "Bisa custom nama atau inisial",
      "Look clean dan tetap premium",
      "Cocok untuk hadiah dan merchandise",
      "Pilihan warna soft dan modern",
      "Tetap nyaman untuk pemakaian harian",
    ],
    colors: ["Cloud White", "Sky Blue", "Soft Olive", "Peach Nude"],
    audiences: [
      "Orang yang cari hadiah personal tapi tetap fungsional",
      "Komunitas kreatif yang butuh merchandise estetik",
      "Penyelenggara event yang ingin souvenir premium",
    ],
    specs: [
      { label: "Kapasitas", value: "600 ml" },
      { label: "Material", value: "Double wall stainless steel" },
      { label: "Insulasi", value: "Cold 20 jam, warm 10 jam" },
      { label: "Custom", value: "Nama, inisial, atau short quote" },
    ],
  },
  {
    productNumber: 4,
    name: "Kembunk Soft Travel Mug",
    slug: "kembunk-soft-travel-mug",
    category: "Travel Mug",
    price: 239000,
    badge: "Workday Pick",
    seoTitle: "Kembunk Soft Travel Mug - Travel Mug Estetik untuk Commuting Harian",
    metaDescription:
      "Travel mug estetik Kembunk dengan desain clean dan tutup nyaman untuk commuting, kerja, dan aktivitas cepat dari pagi sampai malam.",
    waTemplate:
      "Halo, saya mau beli Kembunk Soft Travel Mug. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjL7u9Z8lv9UQzqR4utAcG347IBI0MSDQLt-RGevg6T5I49mB5femYuHI52yjPCuY0gE35Lss-91Lu3W00e8AGwxAuOjS6n4GyLDOGWyaMDHwg0hfKh2crZCMcJblZId09nkrhVRWg9BC1Or6PI1W0RePD5B_1yi9bwrmSuYZzL0KNWcDShk0xqKKe0n9tA4aIv5bO2c1kEPZiDnFCKHm4OiTNnN1gG_FtIkBFyEVchKa7VXb0Wc0sxLszy3TEjkHSdFVMSJUIRVUJ",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQEiQld7FhkQ0dd2LI8U9EBhvU_BFgjBQ2wzDL4km4b9S61cToowfVpgfK9IhaW91B4GoQzeQCeba_oDw_zF3zi_gdMoK_rUNViRxg27mROxpkbbdLj6gRETPVv5SdMXPrYGdf-M6aRffM4QFL5xdtXXUDKrvBGPl1wQm9ymvNE6waV5JwT-o5DG2ZOcBNBWqkgVG2JfV9gH3N6FYreCPlOLlAcoRzGcTNIViRAx2aXTuObhzuRt5ux3pWyNG0FjUPbWm8fzgdKAQf",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7vd9CPb_SOj0r_YKvTmqYFETRLU8fS2bsxMsCw65I6ZWw0nokLPEHl3MuNLVuB0WHAbCrUNbvqL6NDtTNUwUyXVKFhoRc2uLmx7AfzyscrD_h4gLO3VfHhtnwHJjO7Tbq0204Xzh6flcLCkJQYjlGhuFLvUTo_DnoS--9UPaW3_2vp0OchOr8FT2SBuueGWDTi-e_VhSn80q8EjC9mr1Iibo02xAyOsY8nBmjeA-YzOMDw3Ln4-05FvkU5y4G8MXOYilRh5g9a5x",
    ],
    sortOrder: 3,
    isActive: true,
    isFeatured: false,
    shortDescription:
      "Travel mug modern untuk ngopi atau minuman hangat saat commuting dan aktivitas kerja yang padat.",
    description:
      "Kembunk Soft Travel Mug dirancang untuk kamu yang aktif bergerak tapi tetap ingin bawa minuman dengan cara yang rapi dan estetik. Bentuknya nyaman ditaruh di meja maupun cup holder mobil.",
    features: [
      "Tutup travel-friendly untuk minum cepat",
      "Nyaman dibawa saat commuting",
      "Look modern dan clean",
      "Pas untuk kopi, teh, atau infused water",
      "Cocok untuk meja kerja dan perjalanan singkat",
    ],
    colors: ["Mauve Latte", "Stone Beige", "Slate Blue"],
    audiences: [
      "Pekerja muda yang commuting setiap hari",
      "Coffee lover yang butuh mug estetik",
      "Mahasiswa yang suka bawa minuman hangat ke kelas",
    ],
    specs: [
      { label: "Kapasitas", value: "420 ml" },
      { label: "Material", value: "Premium stainless steel body" },
      { label: "Insulasi", value: "Cold 12 jam, warm 8 jam" },
      { label: "Lid", value: "Sip lid anti tumpah ringan" },
    ],
  },
  {
    productNumber: 5,
    name: "Kembunk Daily Straw Bottle",
    slug: "kembunk-daily-straw-bottle",
    category: "Daily Bottle",
    price: 209000,
    badge: "Campus Core",
    seoTitle: "Kembunk Daily Straw Bottle - Bottle Straw Estetik untuk Daily Routine",
    metaDescription:
      "Bottle straw estetik Kembunk untuk rutinitas harian yang cepat, fun, dan nyaman dipakai saat kuliah, kerja, olahraga ringan, atau nongkrong.",
    waTemplate:
      "Halo, saya mau beli Kembunk Daily Straw Bottle. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmmuPCVRFXe4RqaE78IFl0NsTaIf5JfrMy61P-MDFU8v6QbOEVIHIaL99KGJ7lVeauzu6I7X9_M_auhteOTsawOu8Dz0K_SzjWohemswAxlgCyaPEifQ-gdm3Clsnya038NTaw3Y4bjjMnuYnO32_apUYQWrwANhPrjKbbNb1gCarPj9Ip4u2uOv0EnK8GZQ_EyhvyFYc7FnXYKr0-JJ_vr8DZj2zSzmthygrK2qFvolFELpDoG7AZ1MkC63Ws0BqBuEdbPFSiUsct",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD34bZS8TZcKKsch1wuSUMAJHxxqRGqTJgfEMbpvE7luepZUhiZS6uiRvkhpME2TP6RvGy3dUVskUbUjVLK_2t7L05a1EL2ZgOipca2a-lXQ0u8HarjK3Po7WetIUgphV3KXRs7kvGKlVUnoPawAD7h1r5ZtfU3D-6629E8MsYMeGlorI4V5wBCjMmawSoQXDDPHFyafKxPvmhGhpkVbSA92UfqzPDiQd5n6Z0rNskXY1k7hTwcIdsHXjFuiXltMYKZzmNDs3RMhHSz",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZq5Nvx10dASEfShOU8bJ4GtgEUG9J8b-W8s1BspK_6XoGFVrkFBGdXGy-2F2VF4bYzfj7_gcmIRwStz4rqDRT1VORe3AI4JKRSSr1dhaKX1WnyZgza_EQiL-6Q0YxaFzVIZW-Sx5bWqzzMaRRMSjIgqyD88oWIQCcjd2pyHty-VI5v6dOJjmGApTnQmHG08QSrjq8oOWUQm6Qppnf9i-r3z0MCGzFUw9x2D7nLLXLv8DqeEGKy7Ux3_QJtvtXuVAggctHygsxU4vw",
    ],
    sortOrder: 4,
    isActive: true,
    isFeatured: false,
    shortDescription:
      "Bottle dengan straw lid yang bikin minum lebih gampang dan terasa playful untuk rutinitas sehari-hari.",
    description:
      "Kembunk Daily Straw Bottle cocok buat kamu yang ingin minum lebih sering tanpa ribet buka tutup. Tinggal sip, lanjut aktivitas, dan tetap punya tampilan yang cocok untuk meja kerja maupun tas kampus.",
    features: [
      "Straw lid praktis untuk quick sip",
      "Ringan untuk dibawa seharian",
      "Desain fun dan estetik",
      "Cocok untuk aktivitas indoor maupun outdoor ringan",
      "Gampang dipadukan dengan daily essentials lain",
    ],
    colors: ["Butter Yellow", "Pastel Lilac", "Mint Matcha"],
    audiences: [
      "Mahasiswa yang ingin lebih rajin minum",
      "Pekerja muda dengan aktivitas cepat",
      "Orang yang suka bottle playful tapi tetap clean",
    ],
    specs: [
      { label: "Kapasitas", value: "650 ml" },
      { label: "Material", value: "BPA free body with straw lid" },
      { label: "Insulasi", value: "Cold 8 jam, warm 4 jam" },
      { label: "Berat", value: "310 gram" },
    ],
  },
  {
    productNumber: 6,
    name: "Kembunk Studio Flask",
    slug: "kembunk-studio-flask",
    category: "Premium Flask",
    price: 259000,
    badge: "Creator Pick",
    seoTitle: "Kembunk Studio Flask - Flask Premium Estetik untuk Daily Creative Flow",
    metaDescription:
      "Flask premium Kembunk untuk kreator, pekerja muda, dan siapa pun yang suka produk minum estetik dengan look clean dan performa stabil sepanjang hari.",
    waTemplate:
      "Halo, saya mau beli Kembunk Studio Flask. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjL7u9Z8lv9UQzqR4utAcG347IBI0MSDQLt-RGevg6T5I49mB5femYuHI52yjPCuY0gE35Lss-91Lu3W00e8AGwxAuOjS6n4GyLDOGWyaMDHwg0hfKh2crZCMcJblZId09nkrhVRWg9BC1Or6PI1W0RePD5B_1yi9bwrmSuYZzL0KNWcDShk0xqKKe0n9tA4aIv5bO2c1kEPZiDnFCKHm4OiTNnN1gG_FtIkBFyEVchKa7VXb0Wc0sxLszy3TEjkHSdFVMSJUIRVUJ",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQEiQld7FhkQ0dd2LI8U9EBhvU_BFgjBQ2wzDL4km4b9S61cToowfVpgfK9IhaW91B4GoQzeQCeba_oDw_zF3zi_gdMoK_rUNViRxg27mROxpkbbdLj6gRETPVv5SdMXPrYGdf-M6aRffM4QFL5xdtXXUDKrvBGPl1wQm9ymvNE6waV5JwT-o5DG2ZOcBNBWqkgVG2JfV9gH3N6FYreCPlOLlAcoRzGcTNIViRAx2aXTuObhzuRt5ux3pWyNG0FjUPbWm8fzgdKAQf",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7vd9CPb_SOj0r_YKvTmqYFETRLU8fS2bsxMsCw65I6ZWw0nokLPEHl3MuNLVuB0WHAbCrUNbvqL6NDtTNUwUyXVKFhoRc2uLmx7AfzyscrD_h4gLO3VfHhtnwHJjO7Tbq0204Xzh6flcLCkJQYjlGhuFLvUTo_DnoS--9UPaW3_2vp0OchOr8FT2SBuueGWDTi-e_VhSn80q8EjC9mr1Iibo02xAyOsY8nBmjeA-YzOMDw3Ln4-05FvkU5y4G8MXOYilRh5g9a5x",
    ],
    sortOrder: 5,
    isActive: true,
    isFeatured: false,
    shortDescription:
      "Flask premium dengan feel lebih solid untuk kamu yang ingin performa suhu stabil dan tampilan yang dewasa.",
    description:
      "Kembunk Studio Flask dibuat untuk ritme kerja kreatif yang panjang. Dari brainstorming pagi sampai editing malam, flask ini tetap terlihat rapi, terasa premium, dan siap menemani meja kerja atau perjalanan harian.",
    features: [
      "Body premium dan terasa solid",
      "Cocok untuk cold brew maupun teh hangat",
      "Desain clean tanpa terlihat terlalu formal",
      "Nyaman untuk meja studio atau workspace",
      "Tahan pakai untuk rutinitas padat",
    ],
    colors: ["Graphite Grey", "Dusty Rose", "Cream Sand"],
    audiences: [
      "Content creator dengan jam kerja fleksibel",
      "Pekerja kreatif yang suka workspace rapi",
      "Pengguna yang cari flask premium tapi tetap playful",
    ],
    specs: [
      { label: "Kapasitas", value: "700 ml" },
      { label: "Material", value: "304 stainless steel premium" },
      { label: "Insulasi", value: "Cold 24 jam, warm 14 jam" },
      { label: "Finishing", value: "Soft matte premium touch" },
    ],
  },
  {
    productNumber: 7,
    name: "Kembunk Weekend Hydration Jug",
    slug: "kembunk-weekend-hydration-jug",
    category: "Hydration Jug",
    price: 279000,
    badge: "Weekend Drop",
    seoTitle: "Kembunk Weekend Hydration Jug - Hydration Jug Estetik untuk Aktivitas Panjang",
    metaDescription:
      "Hydration jug Kembunk dengan kapasitas besar untuk olahraga ringan, road trip, studio day, atau aktivitas panjang yang tetap ingin terlihat estetik.",
    waTemplate:
      "Halo, saya mau beli Kembunk Weekend Hydration Jug. Apakah produknya masih tersedia?",
    fallbackImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjL7u9Z8lv9UQzqR4utAcG347IBI0MSDQLt-RGevg6T5I49mB5femYuHI52yjPCuY0gE35Lss-91Lu3W00e8AGwxAuOjS6n4GyLDOGWyaMDHwg0hfKh2crZCMcJblZId09nkrhVRWg9BC1Or6PI1W0RePD5B_1yi9bwrmSuYZzL0KNWcDShk0xqKKe0n9tA4aIv5bO2c1kEPZiDnFCKHm4OiTNnN1gG_FtIkBFyEVchKa7VXb0Wc0sxLszy3TEjkHSdFVMSJUIRVUJ",
    fallbackGalleryUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQEiQld7FhkQ0dd2LI8U9EBhvU_BFgjBQ2wzDL4km4b9S61cToowfVpgfK9IhaW91B4GoQzeQCeba_oDw_zF3zi_gdMoK_rUNViRxg27mROxpkbbdLj6gRETPVv5SdMXPrYGdf-M6aRffM4QFL5xdtXXUDKrvBGPl1wQm9ymvNE6waV5JwT-o5DG2ZOcBNBWqkgVG2JfV9gH3N6FYreCPlOLlAcoRzGcTNIViRAx2aXTuObhzuRt5ux3pWyNG0FjUPbWm8fzgdKAQf",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7vd9CPb_SOj0r_YKvTmqYFETRLU8fS2bsxMsCw65I6ZWw0nokLPEHl3MuNLVuB0WHAbCrUNbvqL6NDtTNUwUyXVKFhoRc2uLmx7AfzyscrD_h4gLO3VfHhtnwHJjO7Tbq0204Xzh6flcLCkJQYjlGhuFLvUTo_DnoS--9UPaW3_2vp0OchOr8FT2SBuueGWDTi-e_VhSn80q8EjC9mr1Iibo02xAyOsY8nBmjeA-YzOMDw3Ln4-05FvkU5y4G8MXOYilRh5g9a5x",
    ],
    sortOrder: 6,
    isActive: true,
    isFeatured: false,
    shortDescription:
      "Hydration jug kapasitas besar untuk weekend plans, studio sessions, atau aktivitas panjang yang butuh stok minum lebih banyak.",
    description:
      "Kembunk Weekend Hydration Jug dibuat untuk kamu yang punya hari-hari panjang dan tidak mau refill terlalu sering. Kapasitasnya lega, pegangannya nyaman, dan tampilannya tetap sejalan dengan gaya Kembunk yang clean dan modern.",
    features: [
      "Kapasitas besar untuk sesi panjang",
      "Handle nyaman untuk dibawa",
      "Look bold tapi tetap clean",
      "Cocok untuk olahraga ringan dan road trip",
      "Tetap estetik untuk studio day atau content setup",
    ],
    colors: ["Cocoa Brown", "Pebble Grey", "Ice Blue"],
    audiences: [
      "Orang yang suka aktivitas outdoor ringan",
      "Gym goer atau weekend walker",
      "Pengguna yang ingin stok air lebih besar tapi tetap stylish",
    ],
    specs: [
      { label: "Kapasitas", value: "1000 ml" },
      { label: "Material", value: "Heavy-duty BPA free jug body" },
      { label: "Insulasi", value: "Cold 14 jam, warm 6 jam" },
      { label: "Berat", value: "480 gram" },
    ],
  },
];

function getNumberTokens(fileName: string) {
  return [...fileName.matchAll(/\d+/g)].map((match) => Number(match[0]));
}

function getPublicImagePath(fileName: string) {
  return `/produk/${fileName}`;
}

function getSortedProductFiles(productNumber: number) {
  const files = readdirSync(productDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const mainImageCandidates = files
    .filter((fileName) => {
      const tokens = getNumberTokens(fileName);
      return tokens.length === 1 && tokens[0] === productNumber;
    })
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

  const galleryCandidates = files
    .filter((fileName) => {
      const tokens = getNumberTokens(fileName);
      return tokens.length >= 2 && tokens[0] === productNumber;
    })
    .sort((left, right) => {
      const leftTokens = getNumberTokens(left);
      const rightTokens = getNumberTokens(right);
      return (
        (leftTokens[1] ?? 0) - (rightTokens[1] ?? 0) ||
        left.localeCompare(right, undefined, { numeric: true })
      );
    });

  return { mainImageCandidates, galleryCandidates };
}

async function upsertRelations(
  productId: string,
  productName: string,
  features: string[],
  colors: string[],
  audiences: string[],
  galleryUrls: string[],
  specs: { label: string; value: string }[],
) {
  await Promise.all([
    supabase.from("product_features").delete().eq("product_id", productId),
    supabase.from("product_colors").delete().eq("product_id", productId),
    supabase.from("product_audiences").delete().eq("product_id", productId),
    supabase.from("product_gallery").delete().eq("product_id", productId),
    supabase.from("product_specs").delete().eq("product_id", productId),
  ]);

  if (features.length > 0) {
    const { error } = await supabase.from("product_features").insert(
      features.map((text, index) => ({
        product_id: productId,
        text,
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  if (colors.length > 0) {
    const { error } = await supabase.from("product_colors").insert(
      colors.map((name, index) => ({
        product_id: productId,
        name,
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  if (audiences.length > 0) {
    const { error } = await supabase.from("product_audiences").insert(
      audiences.map((text, index) => ({
        product_id: productId,
        text,
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  if (galleryUrls.length > 0) {
    const { error } = await supabase.from("product_gallery").insert(
      galleryUrls.map((imageUrl, index) => ({
        product_id: productId,
        image_url: imageUrl,
        alt_text: `${productName} view ${index + 1}`,
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  if (specs.length > 0) {
    const { error } = await supabase.from("product_specs").insert(
      specs.map((spec, index) => ({
        product_id: productId,
        label: spec.label,
        value: spec.value,
        sort_order: index,
      })),
    );
    if (error) throw error;
  }
}

async function run() {
  const missingLocalImages: string[] = [];
  const imageLogs: string[] = [];
  const galleryLogs: string[] = [];
  let successCount = 0;

  for (const product of products) {
    const { mainImageCandidates, galleryCandidates } = getSortedProductFiles(
      product.productNumber,
    );

    const localMainImage = mainImageCandidates[0];
    const imageUrl = localMainImage
      ? getPublicImagePath(localMainImage)
      : product.fallbackImageUrl;

    if (!localMainImage) {
      missingLocalImages.push(product.slug);
    }

    const localGalleryUrls = galleryCandidates.map(getPublicImagePath);
    const galleryUrls = Array.from(
      new Set([
        imageUrl,
        ...(localGalleryUrls.length > 0 ? localGalleryUrls : product.fallbackGalleryUrls),
      ]),
    );

    const { data: savedProduct, error } = await supabase
      .from("products")
      .upsert(
        {
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          badge: product.badge,
          seo_title: product.seoTitle,
          meta_description: product.metaDescription,
          wa_template: product.waTemplate,
          image_url: imageUrl,
          sort_order: product.sortOrder,
          is_active: product.isActive,
          is_featured: product.isFeatured,
          short_description: product.shortDescription,
          description: product.description,
          features: product.features,
          colors: product.colors,
          audiences: product.audiences,
          gallery_urls: galleryUrls,
          specs: product.specs,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error || !savedProduct) {
      throw error;
    }

    await upsertRelations(
      savedProduct.id,
      product.name,
      product.features,
      product.colors,
      product.audiences,
      galleryUrls,
      product.specs,
    );

    successCount += 1;
    imageLogs.push(`${product.slug}: ${imageUrl}`);
    galleryLogs.push(`${product.slug}: ${galleryUrls.join(", ")}`);
  }

  console.log(`Produk berhasil di-upsert: ${successCount}`);
  console.log(
    `Produk tanpa image lokal: ${missingLocalImages.length > 0 ? missingLocalImages.join(", ") : "-"}`,
  );
  console.log("image_url yang dipakai:");
  imageLogs.forEach((log) => console.log(`- ${log}`));
  console.log("gallery_urls yang dipakai:");
  galleryLogs.forEach((log) => console.log(`- ${log}`));
}

run().catch((error) => {
  console.error("Seed products failed.");
  console.error(error);
  process.exit(1);
});
