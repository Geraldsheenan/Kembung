export const SITE = {
  name: "Kembunk",
  tagline: "Stay Hydrated, Stay Kembunk.",
  description:
    "Tumbler pastel estetik yang siap temani sekolah, kuliah, kerja, nongkrong, sampai traveling.",
  phoneDisplay: "+62 877-8778-4156",
  phoneInternational: "6287787784156",
  url: "https://kembunk.vercel.app",
  social: {
    instagram: "https://www.instagram.com/kembunk.id?igsh=MXFhOGtpOTd4NGp6Yg==",
    tiktok: "https://www.tiktok.com/@hikembunk?_r=1&_t=ZS-96SlJX0oomF",
  },
};

export const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/store", label: "Store" },
  { href: "/produk", label: "Produk" },
  { href: "/artikel", label: "Artikel" },
  { href: "/hubungi-kami", label: "Hubungi Kami" },
];

export type Branch = {
  slug: string;
  name: string;
  address: string;
  shortAddress?: string;
  latitude: number;
  longitude: number;
  hours: string;
  mobileHours?: string;
  area: string;
  badge: string;
  description: string;
  amenity?: string;
  amenityIcon?: "parking" | "wifi" | "pets";
  theme?: "secondary" | "primary" | "tertiary";
  mobileSubtitle?: string;
  mobileAddressLine?: string;
  mobileStatus?: string;
  mobileStatusTone?: "primary" | "tertiary";
  mobileFeatureIcon?: "beach" | "laptop" | "groups";
  mapUrl: string;
  mapEmbed: string;
  image: string;
  imageClassName?: string;
  facilities?: string[];
  gallery?: { imageUrl: string; altText: string }[];
};

export const branches: Branch[] = [
  {
    slug: "ancol",
    name: "Kembunk Ancol",
    address: "Jl. Marina Indah No. 24, Ancol, Jakarta Utara",
    shortAddress: "Kawasan Wisata Ancol, Jakarta Utara",
    latitude: -6.121435,
    longitude: 106.846113,
    hours: "08:00 - 22:00",
    mobileHours: "08:00 - 22:00",
    area: "Ancol",
    badge: "Pesisir",
    description:
      "Store dengan vibe cerah dekat waterfront buat kamu yang suka nongkrong santai sambil recharge energi.",
    amenity: "Tersedia Parkir Luas",
    amenityIcon: "parking",
    theme: "secondary",
    mobileSubtitle: "North Jakarta Waterfront",
    mobileAddressLine: "Pantai Indah, Ancol Park",
    mobileStatus: "Open Now",
    mobileStatusTone: "primary",
    mobileFeatureIcon: "beach",
    mapUrl: "https://maps.app.goo.gl/r4VevfRhuwyfYtfb8",
    mapEmbed: "https://www.google.com/maps?q=Ancol%20Jakarta&output=embed",
    image: "/ancol.jpg",
    facilities: ["Parkir luas", "Area santai dekat waterfront", "Pilihan tumbler ready stock"],
    gallery: [{ imageUrl: "/ancol.jpg", altText: "Kembunk Ancol" }],
  },
  {
    slug: "serpong",
    name: "Kembunk Serpong",
    address: "Ruko Gading Serpong Blok Bloom No. 7, Tangerang Selatan",
    shortAddress: "Gading Serpong, Tangerang Selatan",
    latitude: -6.241117,
    longitude: 106.628662,
    hours: "09:00 - 21:00",
    mobileHours: "07:00 - 21:00",
    area: "Serpong",
    badge: "Urban Hub",
    description:
      "Spot favorit anak kuliah, pekerja muda, dan komunitas kreatif yang pengin pilih tumbler estetik secara langsung.",
    amenity: "Workspace Friendly",
    amenityIcon: "wifi",
    theme: "primary",
    mobileSubtitle: "BSD Creative Hub",
    mobileAddressLine: "The Breeze, BSD City",
    mobileStatus: "Open Now",
    mobileStatusTone: "primary",
    mobileFeatureIcon: "laptop",
    mapUrl: "https://maps.app.goo.gl/wetjgWZMiA2hPDpPA",
    mapEmbed:
      "https://www.google.com/maps?q=Gading%20Serpong&output=embed",
    image: "/serpong.jpg",
    imageClassName: "object-center",
    facilities: ["Workspace friendly", "Cocok untuk meeting santai", "Pilihan hadiah custom"],
    gallery: [{ imageUrl: "/serpong.jpg", altText: "Kembunk Serpong" }],
  },
  {
    slug: "bekasi",
    name: "Kembunk Bekasi",
    address: "Summarecon Bekasi, Jl. Bulevar Selatan No. 9, Bekasi",
    shortAddress: "Summarecon Bekasi, Jawa Barat",
    latitude: -6.223569,
    longitude: 107.002343,
    hours: "10.00 - 22.00",
    mobileHours: "10:00 - 22:00",
    area: "Bekasi",
    badge: "Family Zone",
    description:
      "Store yang cocok buat daily visit, cari gift set, atau tanya tumbler favorit buat aktivitas keluarga dan komunitas.",
    amenity: "Pet Friendly Area",
    amenityIcon: "pets",
    theme: "tertiary",
    mobileSubtitle: "Grand Galaxy Space",
    mobileAddressLine: "Galaxy Central Park",
    mobileStatus: "Closing Soon",
    mobileStatusTone: "tertiary",
    mobileFeatureIcon: "groups",
    mapUrl: "https://maps.app.goo.gl/AWCwLrhKYzhAjsjB9",
    mapEmbed:
      "https://www.google.com/maps?q=Summarecon%20Bekasi&output=embed",
    image: "/bekasi.jpg",
    facilities: ["Pet friendly area", "Pilihan gift set keluarga", "Spot konsultasi produk"],
    gallery: [{ imageUrl: "/bekasi.jpg", altText: "Kembunk Bekasi" }],
  },
];

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  description: string;
  features: string[];
  colors: string[];
  audience: string[];
  specs: { label: string; value: string }[];
  image: string;
  gallery: string[];
  galleryItems?: { imageUrl: string; altText: string }[];
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "kembunk-pastel-bottle",
    name: "Kembunk Pastel Bottle",
    category: "Tumbler Pastel",
    price: "Rp 189.000",
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
    audience: [
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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmmuPCVRFXe4RqaE78IFl0NsTaIf5JfrMy61P-MDFU8v6QbOEVIHIaL99KGJ7lVeauzu6I7X9_M_auhteOTsawOu8Dz0K_SzjWohemswAxlgCyaPEifQ-gdm3Clsnya038NTaw3Y4bjjMnuYnO32_apUYQWrwANhPrjKbbNb1gCarPj9Ip4u2uOv0EnK8GZQ_EyhvyFYc7FnXYKr0-JJ_vr8DZj2zSzmthygrK2qFvolFELpDoG7AZ1MkC63Ws0BqBuEdbPFSiUsct",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD34bZS8TZcKKsch1wuSUMAJHxxqRGqTJgfEMbpvE7luepZUhiZS6uiRvkhpME2TP6RvGy3dUVskUbUjVLK_2t7L05a1EL2ZgOipca2a-lXQ0u8HarjK3Po7WetIUgphV3KXRs7kvGKlVUnoPawAD7h1r5ZtfU3D-6629E8MsYMeGlorI4V5wBCjMmawSoQXDDPHFyafKxPvmhGhpkVbSA92UfqzPDiQd5n6Z0rNskXY1k7hTwcIdsHXjFuiXltMYKZzmNDs3RMhHSz",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZq5Nvx10dASEfShOU8bJ4GtgEUG9J8b-W8s1BspK_6XoGFVrkFBGdXGy-2F2VF4bYzfj7_gcmIRwStz4rqDRT1VORe3AI4JKRSSr1dhaKX1WnyZgza_EQiL-6Q0YxaFzVIZW-Sx5bWqzzMaRRMSjIgqyD88oWIQCcjd2pyHty-VI5v6dOJjmGApTnQmHG08QSrjq8oOWUQm6Qppnf9i-r3z0MCGzFUw9x2D7nLLXLv8DqeEGKy7Ux3_QJtvtXuVAggctHygsxU4vw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5yGL4SW50Bh0WHmk8TionUVSUseEBJhLpJR4cxFXnVd0W5nyJMsSL4_M4kK_oJiX7ZSEsFkTpiyKzGvVdEcp-REV2Pli2e9HM1BHwbY0CmkRlhBXg2VMR-BTUOWVUsqEkKcnk7okNxrM11RqPTWzlUZVC9JfsjgfKS_y8aJgdwYVZ_WkdzStUmxvIj7cWfCXa6hfmWHk93QN55pAZiUYJ9LfN1Fn10dO6ASCjmb-PUZWyQdRcip4FEJdW4V86Id0z-6aEe-TAWzY",
    ],
    galleryItems: [
      {
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD34bZS8TZcKKsch1wuSUMAJHxxqRGqTJgfEMbpvE7luepZUhiZS6uiRvkhpME2TP6RvGy3dUVskUbUjVLK_2t7L05a1EL2ZgOipca2a-lXQ0u8HarjK3Po7WetIUgphV3KXRs7kvGKlVUnoPawAD7h1r5ZtfU3D-6629E8MsYMeGlorI4V5wBCjMmawSoQXDDPHFyafKxPvmhGhpkVbSA92UfqzPDiQd5n6Z0rNskXY1k7hTwcIdsHXjFuiXltMYKZzmNDs3RMhHSz",
        altText: "Kembunk Pastel Bottle view 1",
      },
      {
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAZq5Nvx10dASEfShOU8bJ4GtgEUG9J8b-W8s1BspK_6XoGFVrkFBGdXGy-2F2VF4bYzfj7_gcmIRwStz4rqDRT1VORe3AI4JKRSSr1dhaKX1WnyZgza_EQiL-6Q0YxaFzVIZW-Sx5bWqzzMaRRMSjIgqyD88oWIQCcjd2pyHty-VI5v6dOJjmGApTnQmHG08QSrjq8oOWUQm6Qppnf9i-r3z0MCGzFUw9x2D7nLLXLv8DqeEGKy7Ux3_QJtvtXuVAggctHygsxU4vw",
        altText: "Kembunk Pastel Bottle view 2",
      },
      {
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBd5yGL4SW50Bh0WHmk8TionUVSUseEBJhLpJR4cxFXnVd0W5nyJMsSL4_M4kK_oJiX7ZSEsFkTpiyKzGvVdEcp-REV2Pli2e9HM1BHwbY0CmkRlhBXg2VMR-BTUOWVUsqEkKcnk7okNxrM11RqPTWzlUZVC9JfsjgfKS_y8aJgdwYVZ_WkdzStUmxvIj7cWfCXa6hfmWHk93QN55pAZiUYJ9LfN1Fn10dO6ASCjmb-PUZWyQdRcip4FEJdW4V86Id0z-6aEe-TAWzY",
        altText: "Kembunk Pastel Bottle view 3",
      },
    ],
    badge: "Best Seller",
  },
  {
    slug: "tumbler-custom-name",
    name: "Tumbler Custom Name",
    category: "Tumbler Custom Name",
    price: "Rp 219.000",
    shortDescription:
      "Tumbler personal dengan nama custom untuk hadiah, komunitas, atau daily use yang lebih personal.",
    description:
      "Bikin tumbler kamu terasa lebih personal dengan custom nama atau inisial. Cocok untuk hadiah bestie, hampers event, atau merch komunitas.",
    features: [
      "Nama custom sesuai request",
      "Pilihan warna pastel dan earth tone",
      "Cocok untuk gift set dan komunitas",
      "Finishing clean dan estetik",
      "Nyaman dipakai sehari-hari",
    ],
    colors: ["Cloud White", "Sky Blue", "Olive", "Peach"],
    audience: [
      "Kamu yang cari tumbler hadiah",
      "Komunitas yang butuh merch estetik",
      "Brand atau event yang ingin souvenir premium",
    ],
    specs: [
      { label: "Kapasitas", value: "600 ml" },
      { label: "Material", value: "Double wall stainless steel" },
      { label: "Custom", value: "Nama / inisial / short quote" },
      { label: "Lead Time", value: "3 - 5 hari kerja" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNr9xYl8ul9RNDQMTu1K-SRzj_0gqsZ4Oh3OGQl0aMpBs1GOINUb2biIy8e-9H3jOBDjQ30yPdrefQcz0C72N8TFpUz_w7PzMvT294Z4KCQJBVD6xTT7QZPr1UqL1tBJgWZojo5EaIgyb5vzAbsu9uq5GNt5aQbrjIp_vyhdpOt5W_CPE-20K3iVPWN4tQzRYJLHNga-TcAPfdrI6DJ5AU6VfhMb4YnTBbIWJ12pFaa3NXnUEDDMcfDWghr2fUsEwbbxQFt0xxfNf",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J5H5Nwg5THhTw1Fq51C-BMJgtQJYtM5MtjzW-VykItwF0sDnYUofedOYBoAiBwh7XXTdmglg5pf7Poz23tv9Nnu36mn9TKuGMjP7u8nTzOW9G3y7GaT9VtyW3Lgc2jbh9mAX0iST6bTXPcaYwbAmE0h-Ix2ykJbZ8IHsYeQFIDu8NOK8rOs20AuarZNLCNHkwAD-dIhnx61MyA3zaZQVDrRerCueLt8EH32IKxG2DoKjnXV_1TjAWN4cFN0EznHw1b73AQfHF8rD",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6NSFBuwKZGZ_ruKwZIVHy8sNBEsfcrzciS_sanUMWN8W4_kEq4iv_UhDT3s-6QFLZXl5GHefdfnbfhkv16GME4gTUPWHPzBPjAk2JuZ5Gd8s_SKBZpvtD9GGG9KiaVVQIev0X88hJXK1TTKc2r35qdCbyekE7kDLMdtU1M6skRdN8dhl1gW8qM-aXjr5Ohlv1I2ZVS5AtwTtCdHWJ2yR4dTJLP5VOkhG-GzI3P7G-kERT0GcznWp1YRn7ew2XsCzGmjT85_xqBpp",
    ],
    galleryItems: [
      {
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD5J5H5Nwg5THhTw1Fq51C-BMJgtQJYtM5MtjzW-VykItwF0sDnYUofedOYBoAiBwh7XXTdmglg5pf7Poz23tv9Nnu36mn9TKuGMjP7u8nTzOW9G3y7GaT9VtyW3Lgc2jbh9mAX0iST6bTXPcaYwbAmE0h-Ix2ykJbZ8IHsYeQFIDu8NOK8rOs20AuarZNLCNHkwAD-dIhnx61MyA3zaZQVDrRerCueLt8EH32IKxG2DoKjnXV_1TjAWN4cFN0EznHw1b73AQfHF8rD",
        altText: "Tumbler Custom Name view 1",
      },
      {
        imageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6NSFBuwKZGZ_ruKwZIVHy8sNBEsfcrzciS_sanUMWN8W4_kEq4iv_UhDT3s-6QFLZXl5GHefdfnbfhkv16GME4gTUPWHPzBPjAk2JuZ5Gd8s_SKBZpvtD9GGG9KiaVVQIev0X88hJXK1TTKc2r35qdCbyekE7kDLMdtU1M6skRdN8dhl1gW8qM-aXjr5Ohlv1I2ZVS5AtwTtCdHWJ2yR4dTJLP5VOkhG-GzI3P7G-kERT0GcznWp1YRn7ew2XsCzGmjT85_xqBpp",
        altText: "Tumbler Custom Name view 2",
      },
    ],
    badge: "Custom",
  },
  {
    slug: "tumbler-travel-flask",
    name: "Tumbler Travel Flask",
    category: "Tumbler Travel",
    price: "Rp 249.000",
    shortDescription:
      "Kapasitas lebih besar untuk commuting, traveling, olahraga, dan aktivitas outdoor yang padat.",
    description:
      "Kalau kamu sering mobile dari pagi sampai malam, Travel Flask ini cocok banget. Kapasitas lega, handle nyaman, dan tetap punya look yang clean.",
    features: [
      "Kapasitas besar untuk aktivitas seharian",
      "Handle nyaman dibawa",
      "Insulasi tahan dingin lebih lama",
      "Desain travel-friendly",
      "Tetap estetik buat daily content",
    ],
    colors: ["Sky Blue", "Terracotta", "Charcoal"],
    audience: [
      "Commuter dan pekerja muda",
      "Anak gym dan olahraga ringan",
      "Traveler yang pengin tetap rapi di jalan",
    ],
    specs: [
      { label: "Kapasitas", value: "750 ml" },
      { label: "Material", value: "Premium stainless steel 304" },
      { label: "Lid", value: "Leak-proof travel cap" },
      { label: "Finishing", value: "Soft matte premium" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjL7u9Z8lv9UQzqR4utAcG347IBI0MSDQLt-RGevg6T5I49mB5femYuHI52yjPCuY0gE35Lss-91Lu3W00e8AGwxAuOjS6n4GyLDOGWyaMDHwg0hfKh2crZCMcJblZId09nkrhVRWg9BC1Or6PI1W0RePD5B_1yi9bwrmSuYZzL0KNWcDShk0xqKKe0n9tA4aIv5bO2c1kEPZiDnFCKHm4OiTNnN1gG_FtIkBFyEVchKa7VXb0Wc0sxLszy3TEjkHSdFVMSJUIRVUJ",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQEiQld7FhkQ0dd2LI8U9EBhvU_BFgjBQ2wzDL4km4b9S61cToowfVpgfK9IhaW91B4GoQzeQCeba_oDw_zF3zi_gdMoK_rUNViRxg27mROxpkbbdLj6gRETPVv5SdMXPrYGdf-M6aRffM4QFL5xdtXXUDKrvBGPl1wQm9ymvNE6waV5JwT-o5DG2ZOcBNBWqkgVG2JfV9gH3N6FYreCPlOLlAcoRzGcTNIViRAx2aXTuObhzuRt5ux3pWyNG0FjUPbWm8fzgdKAQf",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-7vd9CPb_SOj0r_YKvTmqYFETRLU8fS2bsxMsCw65I6ZWw0nokLPEHl3MuNLVuB0WHAbCrUNbvqL6NDtTNUwUyXVKFhoRc2uLmx7AfzyscrD_h4gLO3VfHhtnwHJjO7Tbq0204Xzh6flcLCkJQYjlGhuFLvUTo_DnoS--9UPaW3_2vp0OchOr8FT2SBuueGWDTi-e_VhSn80q8EjC9mr1Iibo02xAyOsY8nBmjeA-YzOMDw3Ln4-05FvkU5y4G8MXOYilRh5g9a5x",
    ],
    badge: "Travel Ready",
  },
];

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: string;
  imageAlt: string;
  intro: string;
  quote?: string;
  tags: string[];
  sections: { heading: string; paragraphs: string[] }[];
  content: string[];
};

export const articles: Article[] = [
  {
    slug: "5-alasan-gen-z-wajib-punya-tumbler-sendiri",
    title: "5 Alasan Gen Z Wajib Punya Tumbler Sendiri",
    category: "Manfaat Menggunakan Tumbler",
    excerpt:
      "Dari hemat sampai lebih estetik di meja kerja, ini alasan kenapa tumbler sudah jadi daily essential anak muda.",
    seoTitle: "5 Alasan Gen Z Wajib Punya Tumbler Sendiri",
    metaDescription:
      "Cari tahu 5 alasan kenapa Gen Z wajib punya tumbler sendiri untuk sekolah, kuliah, kerja, dan aktivitas harian.",
    date: "2026-04-05",
    readTime: "5 menit",
    author: "Sarah J.",
    authorRole: "Lifestyle Editor",
    image: "/artikel/artikel-1.png",
    imageAlt:
      "Mahasiswa duduk di meja belajar dengan tumbler pastel Kembunk di samping laptop dan catatan kuliah.",
    intro:
      "Punya tumbler sendiri sekarang bukan cuma soal gaya, tapi juga bagian dari kebiasaan hidup yang lebih praktis dan sadar lingkungan. Buat Gen Z yang mobilitasnya tinggi, tumbler bikin minum jadi lebih gampang di mana pun.",
    quote:
      "Tumbler yang kepakai tiap hari itu bukan cuma lucu dilihat, tapi juga bikin habit sehat jadi jauh lebih realistis.",
    tags: ["#GenZLife", "#Hydration", "#DailyEssentials", "#StudyTips"],
    sections: [
      {
        heading: "Lebih Hemat Buat Aktivitas Harian",
        paragraphs: [
          "Alasan pertama jelas soal efisiensi. Kamu gak perlu terus-terusan beli air kemasan. Tinggal isi ulang sebelum berangkat, dan hari kamu jadi lebih ringan karena gak perlu repot cari minum setiap beberapa jam.",
        ],
      },
      {
        heading: "Visual yang Estetik Bikin Mood Naik",
        paragraphs: [
          "Alasan kedua, tumbler estetik bikin mood naik. Banyak anak muda suka barang yang enak dilihat sekaligus berguna. Warna pastel, bentuk clean, dan desain yang lucu bikin tumbler jadi bagian dari personal style juga.",
        ],
      },
      {
        heading: "Kecil Kebiasaannya, Besar Dampaknya",
        paragraphs: [
          "Alasan ketiga adalah sustainability. Makin banyak orang sadar kalau kebiasaan kecil seperti bawa tumbler bisa bantu ngurangin sampah plastik sekali pakai. Small action, good impact.",
          "Sisanya? Tumbler bikin kamu lebih mindful sama kebutuhan tubuh sendiri. Kamu jadi lebih ingat minum, lebih siap saat sibuk, dan lebih nyaman ngejalanin aktivitas harian.",
        ],
      },
    ],
    content: [
      "Punya tumbler sendiri sekarang bukan cuma soal gaya, tapi juga bagian dari kebiasaan hidup yang lebih praktis dan sadar lingkungan. Buat Gen Z yang mobilitasnya tinggi, tumbler bikin minum jadi lebih gampang di mana pun.",
      "Alasan pertama jelas soal efisiensi. Kamu gak perlu terus-terusan beli air kemasan. Tinggal isi ulang sebelum berangkat, dan hari kamu jadi lebih ringan karena gak perlu repot cari minum setiap beberapa jam.",
      "Alasan kedua, tumbler estetik bikin mood naik. Banyak anak muda suka barang yang enak dilihat sekaligus berguna. Warna pastel, bentuk clean, dan desain yang lucu bikin tumbler jadi bagian dari personal style juga.",
      "Alasan ketiga adalah sustainability. Makin banyak orang sadar kalau kebiasaan kecil seperti bawa tumbler bisa bantu ngurangin sampah plastik sekali pakai. Small action, good impact.",
      "Sisanya? Tumbler bikin kamu lebih mindful sama kebutuhan tubuh sendiri. Kamu jadi lebih ingat minum, lebih siap saat sibuk, dan lebih nyaman ngejalanin aktivitas harian.",
    ],
  },
  {
    slug: "cara-memilih-tumbler-estetik-yang-cocok-untuk-aktivitas-harian",
    title: "Cara Memilih Tumbler Estetik yang Cocok untuk Aktivitas Harian",
    category: "Tips Memilih Tumbler",
    excerpt:
      "Pilih tumbler gak cuma soal warna. Cek ukuran, material, cara pakai, dan feel-nya supaya benar-benar cocok buat rutinitasmu.",
    seoTitle:
      "Cara Memilih Tumbler Estetik yang Cocok untuk Aktivitas Harian",
    metaDescription:
      "Panduan memilih tumbler estetik untuk sekolah, kuliah, kerja, dan traveling agar tetap praktis dan stylish.",
    date: "2026-04-11",
    readTime: "6 menit",
    author: "Mika A.",
    authorRole: "Product Story Curator",
    image: "/artikel/artikel-2.png",
    imageAlt:
      "Deretan tumbler estetik warna pastel di meja minimalis dengan cahaya lembut dari samping.",
    intro:
      "Tumbler estetik yang bagus itu harus seimbang antara fungsi dan visual. Kalau cuma lucu tapi berat atau susah dibersihin, biasanya malah gak kepakai lama.",
    quote:
      "Tumbler terbaik itu yang terasa pas di tangan, nyambung sama rutinitas, dan tetap bikin kamu pengin refill lagi.",
    tags: ["#HealthyHabits", "#Hydration", "#TumblerGuide", "#GenZLife"],
    sections: [
      {
        heading: "Tentukan Kapasitas Sesuai Rutinitas",
        paragraphs: [
          "Pertama, tentukan kapasitas sesuai aktivitas. Untuk kuliah atau kerja harian, 500 sampai 750 ml biasanya paling aman. Kalau kamu sering banget mobile, ukuran lebih besar bisa lebih cocok.",
        ],
      },
      {
        heading: "Perhatikan Material dan Ketahanannya",
        paragraphs: [
          "Kedua, perhatikan material. Stainless steel food grade jadi pilihan populer karena lebih awet, aman, dan bisa menjaga suhu minuman lebih lama.",
        ],
      },
      {
        heading: "Sesuaikan Tutup dan Warna dengan Gaya Hidup",
        paragraphs: [
          "Ketiga, pilih model tutup yang sesuai gaya hidup. Ada yang suka straw lid buat minum cepat, ada juga yang lebih nyaman pakai screw cap supaya anti tumpah saat dibawa commuting.",
          "Terakhir, baru pilih warna dan desain. Kalau kamu suka tampilan clean, pastel mint, cream, atau sky blue biasanya paling mudah dipadukan dengan daily setup kamu.",
        ],
      },
    ],
    content: [
      "Tumbler estetik yang bagus itu harus seimbang antara fungsi dan visual. Kalau cuma lucu tapi berat atau susah dibersihin, biasanya malah gak kepakai lama.",
      "Pertama, tentukan kapasitas sesuai aktivitas. Untuk kuliah atau kerja harian, 500 sampai 750 ml biasanya paling aman. Kalau kamu sering banget mobile, ukuran lebih besar bisa lebih cocok.",
      "Kedua, perhatikan material. Stainless steel food grade jadi pilihan populer karena lebih awet, aman, dan bisa menjaga suhu minuman lebih lama.",
      "Ketiga, pilih model tutup yang sesuai gaya hidup. Ada yang suka straw lid buat minum cepat, ada juga yang lebih nyaman pakai screw cap supaya anti tumpah saat dibawa commuting.",
      "Terakhir, baru pilih warna dan desain. Kalau kamu suka tampilan clean, pastel mint, cream, atau sky blue biasanya paling mudah dipadukan dengan daily setup kamu.",
    ],
  },
  {
    slug: "cara-merawat-tumbler-agar-tidak-bau",
    title: "Cara Merawat Tumbler agar Tidak Bau",
    category: "Cara Merawat Tumbler",
    excerpt:
      "Biar tumbler tetap fresh dipakai tiap hari, ini langkah simpel yang wajib kamu biasakan.",
    seoTitle: "Cara Merawat Tumbler agar Tidak Bau",
    metaDescription:
      "Pelajari cara merawat tumbler agar tetap bersih, tidak bau, dan nyaman dipakai setiap hari.",
    date: "2026-04-17",
    readTime: "4 menit",
    author: "Rhea K.",
    authorRole: "Care & Lifestyle Writer",
    image: "/artikel/artikel-3.png",
    imageAlt:
      "Tumbler stainless dibersihkan di wastafel dengan sikat botol dan cahaya pagi yang terang.",
    intro:
      "Tumbler yang dipakai setiap hari wajib dirawat dengan cara yang benar. Kalau enggak, aroma minuman bisa nempel dan bikin pengalaman minum jadi kurang nyaman.",
    quote:
      "Kebiasaan bilas dan keringkan dengan benar sering kali lebih penting daripada deep clean yang jarang dilakukan.",
    tags: ["#HealthyHabits", "#CareTips", "#Hydration", "#CleanLiving"],
    sections: [
      {
        heading: "Jangan Tunda Bilas Setelah Dipakai",
        paragraphs: [
          "Biasakan bilas tumbler segera setelah dipakai, terutama kalau isinya minuman manis, kopi, teh, atau susu. Semakin lama didiamkan, semakin gampang muncul bau.",
        ],
      },
      {
        heading: "Bersihkan Bagian yang Sering Terlewat",
        paragraphs: [
          "Gunakan sabun yang lembut dan sikat botol khusus untuk menjangkau bagian dasar. Jangan lupa bersihkan tutup, seal, dan sedotan karena bagian itu paling sering menyimpan sisa cairan.",
        ],
      },
      {
        heading: "Keringkan Total Sebelum Disimpan",
        paragraphs: [
          "Setelah dicuci, keringkan tumbler dalam kondisi terbuka supaya tidak lembap. Menyimpan tumbler saat masih basah bisa memicu bau yang sulit hilang.",
          "Kalau perlu deep clean, kamu bisa pakai campuran air hangat dan baking soda untuk merontokkan bau yang membandel.",
        ],
      },
    ],
    content: [
      "Tumbler yang dipakai setiap hari wajib dirawat dengan cara yang benar. Kalau enggak, aroma minuman bisa nempel dan bikin pengalaman minum jadi kurang nyaman.",
      "Biasakan bilas tumbler segera setelah dipakai, terutama kalau isinya minuman manis, kopi, teh, atau susu. Semakin lama didiamkan, semakin gampang muncul bau.",
      "Gunakan sabun yang lembut dan sikat botol khusus untuk menjangkau bagian dasar. Jangan lupa bersihkan tutup, seal, dan sedotan karena bagian itu paling sering menyimpan sisa cairan.",
      "Setelah dicuci, keringkan tumbler dalam kondisi terbuka supaya tidak lembap. Menyimpan tumbler saat masih basah bisa memicu bau yang sulit hilang.",
      "Kalau perlu deep clean, kamu bisa pakai campuran air hangat dan baking soda untuk merontokkan bau yang membandel.",
    ],
  },
  {
    slug: "ide-gift-set-tumbler-untuk-teman-komunitas-dan-event",
    title: "Ide Gift Set Tumbler untuk Teman, Komunitas, dan Event",
    category: "Ide Hadiah atau Gift Set Tumbler",
    excerpt:
      "Butuh hadiah yang lucu, kepakai, dan gak generic? Gift set tumbler bisa jadi pilihan yang aman tapi tetap berkesan.",
    seoTitle: "Ide Gift Set Tumbler untuk Teman, Komunitas, dan Event",
    metaDescription:
      "Temukan ide gift set tumbler untuk teman, komunitas, hampers event, dan hadiah yang estetik sekaligus berguna.",
    date: "2026-04-22",
    readTime: "5 menit",
    author: "Naya P.",
    authorRole: "Community Gift Editor",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTNr9xYl8ul9RNDQMTu1K-SRzj_0gqsZ4Oh3OGQl0aMpBs1GOINUb2biIy8e-9H3jOBDjQ30yPdrefQcz0C72N8TFpUz_w7PzMvT294Z4KCQJBVD6xTT7QZPr1UqL1tBJgWZojo5EaIgyb5vzAbsu9uq5GNt5aQbrjIp_vyhdpOt5W_CPE-20K3iVPWN4tQzRYJLHNga-TcAPfdrI6DJ5AU6VfhMb4YnTBbIWJ12pFaa3NXnUEDDMcfDWghr2fUsEwbbxQFt0xxfNf",
    imageAlt:
      "Gift set tumbler pastel dengan kartu ucapan, pouch, dan kemasan premium di atas meja kayu terang.",
    intro:
      "Gift set tumbler cocok banget kalau kamu mau kasih hadiah yang lucu, berguna, dan tetap punya kesan personal. Dibanding hadiah random yang cepat dilupakan, tumbler biasanya langsung kepakai.",
    quote:
      "Hadiah yang paling diingat biasanya bukan yang paling mahal, tapi yang terasa personal dan benar-benar kepakai.",
    tags: ["#GiftIdeas", "#Community", "#KembunkLife", "#Lifestyle"],
    sections: [
      {
        heading: "Hadiah Personal yang Tetap Praktis",
        paragraphs: [
          "Untuk hadiah teman, kamu bisa pilih warna yang sesuai karakter mereka lalu tambahkan nama custom. Sentuhan kecil seperti itu bikin hadiahnya terasa lebih niat.",
        ],
      },
      {
        heading: "Cocok untuk Komunitas dan Event",
        paragraphs: [
          "Kalau untuk komunitas atau event, pilih desain yang clean supaya tetap relevan dipakai setelah acara selesai. Tambahkan pouch, sticker, atau thank you card biar paketnya makin lengkap.",
        ],
      },
      {
        heading: "Tetap Premium untuk Partnership atau Corporate Gift",
        paragraphs: [
          "Buat corporate atau partnership gift, pilih warna netral atau pastel soft yang universal. Hasilnya tetap premium tanpa terasa terlalu formal.",
          "Intinya, gift set tumbler itu fleksibel banget: bisa personal, bisa kolektif, dan tetap cocok dengan lifestyle anak muda sekarang.",
        ],
      },
    ],
    content: [
      "Gift set tumbler cocok banget kalau kamu mau kasih hadiah yang lucu, berguna, dan tetap punya kesan personal. Dibanding hadiah random yang cepat dilupakan, tumbler biasanya langsung kepakai.",
      "Untuk hadiah teman, kamu bisa pilih warna yang sesuai karakter mereka lalu tambahkan nama custom. Sentuhan kecil seperti itu bikin hadiahnya terasa lebih niat.",
      "Kalau untuk komunitas atau event, pilih desain yang clean supaya tetap relevan dipakai setelah acara selesai. Tambahkan pouch, sticker, atau thank you card biar paketnya makin lengkap.",
      "Buat corporate atau partnership gift, pilih warna netral atau pastel soft yang universal. Hasilnya tetap premium tanpa terasa terlalu formal.",
      "Intinya, gift set tumbler itu fleksibel banget: bisa personal, bisa kolektif, dan tetap cocok dengan lifestyle anak muda sekarang.",
    ],
  },
];

export const testimonials = [
  {
    name: "Nadya, Mahasiswa",
    quote:
      "Warnanya lucu banget dan gak norak. Aku jadi lebih rajin minum pas lagi kuliah karena tumbler-nya enak dilihat dan enteng dibawa.",
  },
  {
    name: "Raka, Graphic Designer",
    quote:
      "Pas buat meja kerja. Looks clean, feels premium, dan dinginnya awet. Kembunk literally bikin daily setup aku makin niat.",
  },
  {
    name: "Mita, Community Lead",
    quote:
      "Aku order versi custom name buat hadiah komunitas. Hasilnya rapi, estetik, dan semuanya suka banget karena kepakai terus.",
  },
];

export const seoKeywords = [
  "tumbler pastel",
  "tumbler Gen Z",
  "tumbler estetik",
  "tumbler custom",
  "tumbler Kembunk",
  "tumbler untuk kuliah",
  "tumbler untuk kerja",
  "gift set tumbler",
  "tumbler stainless steel",
  "tumbler daily use",
];
