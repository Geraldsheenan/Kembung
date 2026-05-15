import Image from "next/image";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { LimitedRichText } from "@/components/common/limited-rich-text";
import { NewsletterSignupForm } from "@/components/forms/newsletter-signup-form";
import { getPublicArticles } from "@/lib/content/article-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Artikel",
  description:
    "SEO blog Kembunk berisi tips memilih tumbler, manfaat menggunakan tumbler, cara merawat tumbler, dan ide gift set tumbler.",
  path: "/artikel",
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
});

export default async function ArticlesPage() {
  const articles = await getPublicArticles();
  const [featuredArticle, ...otherArticles] = articles;

  return (
    <>
      <section className="container-shell hidden pb-20 md:block">
        <header className="py-16 text-center md:text-left">
          <h1 className="mb-2 text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)]">
            Kembunk Artikel
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
            Kumpulan artikel Kembunk berisi tips hidrasi, inspirasi lifestyle, dan cerita estetik untuk rutinitas harianmu.
          </p>
        </header>

        <section className="mb-20">
          <div className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[2rem] border border-[var(--outline-variant)]/20 bg-[var(--primary-container)] shadow-[0_20px_50px_rgba(168,213,186,0.2)] md:flex-row">
            <div className="relative w-full overflow-hidden md:w-3/5">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="flex w-full flex-col justify-center bg-white p-10 md:w-2/5">
              <div className="mb-6 flex items-center gap-3">
                <span className="rounded-full bg-[var(--tertiary-container)] px-4 py-1 text-xs font-bold text-[var(--on-tertiary-container)]">
                  {featuredArticle.category}
                </span>
                <span className="text-sm text-[var(--on-surface-variant)]">
                  {featuredArticle.readTime}
                </span>
              </div>
              <LimitedRichText
                as="h2"
                value={featuredArticle.title}
                className="mb-6 text-[2rem] font-bold leading-tight text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
              />
              <LimitedRichText
                value={featuredArticle.excerpt}
                className="mb-8 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
              />
              <Link
                href={`/artikel/${featuredArticle.slug}`}
                className="flex items-center gap-1 font-bold text-[var(--primary)] transition-all hover:gap-3"
              >
                Baca Selengkapnya
                <HiOutlineArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {otherArticles.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/artikel/${post.slug}`} className="group flex flex-col">
              <div className="mb-5 aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--secondary-container)]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {post.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--outline-variant)]" />
                <span className="text-xs text-[var(--on-surface-variant)]">{post.readTime}</span>
              </div>
              <LimitedRichText
                as="h3"
                value={post.title}
                className="mb-3 text-2xl font-bold text-[var(--on-surface)] transition-colors group-hover:text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
              />
              <LimitedRichText
                value={post.excerpt}
                className="line-clamp-2 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
              />
            </Link>
          ))}
        </section>

        <section className="mt-20 flex flex-col items-center gap-8 rounded-[2rem] border border-[var(--outline-variant)]/30 bg-[var(--secondary-fixed)] p-10 md:flex-row">
          <div className="flex-1">
            <h2 className="mb-3 text-[2rem] font-bold text-[var(--on-secondary-fixed)]">
              Dapetin Tips Hidrasi Langsung di Inbox Kamu
            </h2>
            <p className="text-[var(--on-secondary-fixed-variant)]">
              Subscribe buat dapet info terbaru tentang produk, promo, dan lifestyle tips eksklusif.
            </p>
          </div>
          <NewsletterSignupForm
            source="article-list"
            inputPlaceholder="Email kamu di sini..."
            buttonLabel="Gabung Sekarang"
            formClassName="flex w-full flex-col gap-4 sm:flex-row md:w-auto"
            inputClassName="min-w-[300px] rounded-full border-none bg-[var(--surface-bright)] px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-70"
            buttonClassName="rounded-full bg-[var(--primary)] px-8 py-3 font-bold text-[var(--on-primary)] transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
          />
        </section>
      </section>

      <section className="mx-auto max-w-md px-4 pb-32 pt-4 md:hidden">
        <section className="mb-8">
          <Link href={`/artikel/${featuredArticle.slug}`} className="group relative block">
            <div className="mb-5 aspect-[4/5] overflow-hidden rounded-[2rem] bg-[var(--surface-container-low)]">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.imageAlt}
                width={900}
                height={1125}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--primary-container)] px-3 py-1 text-xs font-semibold text-[var(--on-primary-container)]">
                {featuredArticle.category}
              </span>
              <span className="rounded-full bg-[var(--secondary-container)] px-3 py-1 text-xs font-semibold text-[var(--on-secondary-container)]">
                {featuredArticle.readTime}
              </span>
            </div>
            <LimitedRichText
              as="h1"
              value={featuredArticle.title}
              className="mb-3 text-[2rem] font-bold leading-tight text-[var(--on-surface)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
            />
            <LimitedRichText
              value={featuredArticle.excerpt}
              className="mb-4 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
            />
            <span className="group flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
              Baca Selengkapnya
              <HiOutlineArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </section>

        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">Update Terbaru</h2>
          <Link href="/artikel" className="text-sm font-semibold text-[var(--primary)]">
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-6">
          {otherArticles.map((post, index) => (
            <Link key={post.slug} href={`/artikel/${post.slug}`} className="group flex items-start gap-4">
              <div className="flex-1">
                <div className="mb-1 flex gap-2 text-xs text-[var(--on-surface-variant)]/60">
                  <span>{dateFormatter.format(new Date(post.date))}</span>
                  <span>&bull;</span>
                  <span className={index % 2 === 0 ? "text-[var(--primary)]" : "text-[var(--tertiary)]"}>
                    {post.category}
                  </span>
                </div>
                <LimitedRichText
                  as="h3"
                  value={post.title}
                  className="mb-1 text-xl font-bold leading-snug text-[var(--on-surface)] transition-colors group-hover:text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
                />
                <LimitedRichText
                  value={post.excerpt}
                  className="line-clamp-2 text-sm text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
                />
              </div>
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[1rem] bg-[var(--surface-container)]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
