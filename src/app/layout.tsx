import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Kembung | Stay Hydrated, Stay Kembung.",
    template: "%s | Kembung",
  },
  description:
    "Website company profile, product landing page, dan SEO blog untuk brand tumbler Kembung dengan gaya pastel lifestyle yang estetik, praktis, dan fun.",
  keywords: [
    "tumbler pastel",
    "tumbler Gen Z",
    "tumbler estetik",
    "tumbler custom",
    "tumbler Kembung",
  ],
  openGraph: {
    title: "Kembung | Stay Hydrated, Stay Kembung.",
    description:
      "Tumbler pastel estetik untuk sekolah, kuliah, kerja, nongkrong, dan traveling.",
    siteName: "Kembung",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kembung | Stay Hydrated, Stay Kembung.",
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
