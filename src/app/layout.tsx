import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/data/site";

const BRAND_LOGO_ASSET = "/logokembunk-v2.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Kembunk",
  description:
    "Website company profile, product landing page, dan SEO blog untuk brand tumbler Kembunk dengan gaya pastel lifestyle yang estetik, praktis, dan fun.",
  icons: {
    icon: BRAND_LOGO_ASSET,
    shortcut: BRAND_LOGO_ASSET,
    apple: BRAND_LOGO_ASSET,
  },
  keywords: [
    "tumbler pastel",
    "tumbler Gen Z",
    "tumbler estetik",
    "tumbler custom",
    "tumbler Kembunk",
  ],
  openGraph: {
    title: "Kembunk",
    description:
      "Tumbler pastel estetik untuk sekolah, kuliah, kerja, nongkrong, dan traveling.",
    siteName: "Kembunk",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kembunk",
    description:
      "Tumbler pastel estetik untuk Gen Z, mahasiswa, pekerja muda, dan komunitas kreatif.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full pb-24 md:pb-0">
        {children}
      </body>
    </html>
  );
}
