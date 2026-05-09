# Sitemap: Kembung Website

1. **Beranda (Home)**: Hero section, best sellers, brand value, brief "Tentang Kami", CTA WhatsApp.
2. **Tentang Kami (About Us)**: Brand story, vision/mission, "Kenapa Kembung?".
3. **Cabang (Locations)**: List of branches (Ancol, Serpong, Bekasi) with maps/addresses.
4. **Produk (Product Catalog)**: Grid of all tumbler variants with filters.
5. **Detail Produk (Product Detail)**: Large image, features, price, "Beli via WhatsApp" button.
6. **Artikel / SEO Blog (Blog)**: Educational/lifestyle content about hydration and style.
7. **Hubungi Kami (Contact Us)**: Contact form, social media links, and direct WhatsApp CTA.

# Next.js + Tailwind Structure (Proposed)
/app
  /about-us
  /blog
  /branches
  /contact
  /products
    /[slug]
/components
  /ui (Buttons, Cards, Badges)
  /layout (Navbar, Footer, WhatsAppFloat)
/data (dummy-products.json, dummy-articles.json)
/public
  /images (tumblers, icons)

# Copywriting Strategy
Tone: Relaxed, friendly, "Gen Z" slang (but professional), focus on lifestyle and hydration.
Example: "Biar gak haus-haus banget, yuk Kembung bareng!"