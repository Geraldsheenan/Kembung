import {
  BookOpenText,
  ChevronRight,
  GalleryVerticalEnd,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Mail,
  MapPinned,
  MessageSquareMore,
  Settings2,
} from "lucide-react";

export const adminSections = [
  {
    slug: "site-settings",
    label: "Site Settings",
    description: "Brand, SEO, dan kontak global.",
    icon: Settings2,
  },
  {
    slug: "homepage",
    label: "Homepage",
    description: "Hero, featured product, reasons, dan TikTok block.",
    icon: Home,
  },
  {
    slug: "products",
    label: "Products",
    description: "Produk, fitur, specs, gallery, dan status aktif.",
    icon: GalleryVerticalEnd,
  },
  {
    slug: "store",
    label: "Store",
    description: "Data store, map, koordinat, dan foto.",
    icon: MapPinned,
  },
  {
    slug: "articles",
    label: "Articles",
    description: "Artikel, tag, section, dan status publish.",
    icon: BookOpenText,
  },
  {
    slug: "about-page",
    label: "About Page",
    description: "Story section, mission, dan value cards.",
    icon: LayoutDashboard,
  },
  {
    slug: "contact-page",
    label: "Contact Page",
    description: "Konten halaman kontak dan CTA sosial.",
    icon: Mail,
  },
  {
    slug: "newsletter",
    label: "Newsletter",
    description: "Subscriber, status, dan export list.",
    icon: Mail,
  },
  {
    slug: "contact-messages",
    label: "Contact Messages",
    description: "Inbox pesan masuk dan status follow-up.",
    icon: MessageSquareMore,
  },
  {
    slug: "navigation",
    label: "Navigation",
    description: "Navbar, footer help, dan social links.",
    icon: ChevronRight,
  },
  {
    slug: "media-library",
    label: "Media Library",
    description: "Asset gambar dari Supabase Storage.",
    icon: ImageIcon,
  },
] as const;

export type AdminSectionSlug = (typeof adminSections)[number]["slug"];

export function getAdminSection(slug: string) {
  return adminSections.find((section) => section.slug === slug);
}
