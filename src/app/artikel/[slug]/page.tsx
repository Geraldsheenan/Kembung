import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterSignupForm } from "@/components/forms/newsletter-signup-form";
import { JsonLd } from "@/components/seo/json-ld";
import { articles } from "@/data/site";
import { createMetadata } from "@/lib/seo";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return createMetadata({
      title: "Artikel Tidak Ditemukan",
      description: "Artikel Kembung tidak ditemukan.",
      path: "/artikel",
    });
  }

  return createMetadata({
    title: article.seoTitle,
    description: article.metaDescription,
    path: `/artikel/${article.slug}`,
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRelatedArticles(slug: string) {
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return [];
  }

  return articles
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      ...item,
      score:
        item.category === article.category
          ? 3
          : item.tags.filter((tag) => article.tags.includes(tag)).length,
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 2);
}

function getPopularTags(currentSlug: string) {
  const tagCounts = new Map<string, number>();

  articles
    .filter((article) => article.slug !== currentSlug)
    .flatMap((article) => article.tags)
    .forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });

  return [...tagCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([tag]) => tag);
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) notFound();

  const relatedArticles = getRelatedArticles(article.slug);
  const popularTags = [...new Set([...article.tags, ...getPopularTags(article.slug)])].slice(0, 6);

  return (
    <section className="container-shell py-10 md:py-14 lg:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.metaDescription,
          image: article.image,
          datePublished: article.date,
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: "Kembung" },
        }}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <article className="lg:col-span-8">
          <header className="mb-8 md:mb-10">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[var(--tertiary-container)] px-4 py-1.5 text-xs font-bold tracking-[0.12em] text-[var(--on-tertiary-container)] uppercase">
                {article.category}
              </span>
              <span className="rounded-full bg-[var(--primary-container)] px-4 py-1.5 text-xs font-bold tracking-[0.12em] text-[var(--on-primary-container)] uppercase">
                {article.readTime}
              </span>
            </div>

            <h1 className="max-w-4xl text-balance text-[2.4rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-[var(--on-surface)] md:text-[3.4rem] lg:text-[4rem]">
              {article.title}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary-fixed)] text-sm font-bold text-[var(--primary)]">
                {getInitials(article.author)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--on-surface)]">{article.author}</p>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  {article.authorRole} &bull; {dateFormatter.format(new Date(article.date))}
                </p>
              </div>
            </div>
          </header>

          <div className="group relative mb-10 overflow-hidden rounded-[2rem] bg-[var(--surface-container-low)] shadow-[0_18px_45px_-24px_rgba(61,103,81,0.28)]">
            <Image
              src={article.image}
              alt={article.imageAlt}
              width={1400}
              height={788}
              priority
              className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>

          <div className="space-y-10">
            <p className="text-lg leading-8 text-[var(--on-surface-variant)] md:text-[1.15rem]">
              {article.intro}
            </p>

            {article.sections.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-[1.65rem] font-bold leading-tight text-[var(--primary)] md:text-[1.85rem]">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-base leading-8 text-[var(--on-surface-variant)] md:text-lg">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            {article.quote ? (
              <blockquote className="rounded-[1.75rem] border-l-4 border-[var(--primary)] bg-[var(--secondary-container)] px-6 py-6 text-[1.35rem] font-semibold italic leading-8 text-[var(--on-secondary-container)] md:px-8 md:text-[1.5rem]">
                &ldquo;{article.quote}&rdquo;
              </blockquote>
            ) : null}
          </div>

          <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-[var(--primary-container)] px-6 py-8 md:px-8 md:py-10">
            <div className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h3 className="text-[1.65rem] font-bold leading-tight text-[var(--on-primary-container)]">
                  Dapetin Tips Hidrasi Langsung di Inbox Kamu
                </h3>
                <p className="mt-2 text-[var(--on-primary-container)]/80">
                  Update info lifestyle, promo spesial, dan rahasia tetap seger tanpa ribet.
                </p>
              </div>

              <NewsletterSignupForm
                source={`article-detail:${article.slug}`}
                inputPlaceholder="Email kamu..."
                buttonLabel="Join Now"
                formClassName="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md"
                inputClassName="min-h-12 flex-1 rounded-full border border-white/30 bg-[var(--surface-container-lowest)] px-5 text-sm text-[var(--on-surface)] outline-none ring-0 placeholder:text-[var(--on-surface-variant)] disabled:opacity-70"
                buttonClassName="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] shadow-[0_16px_34px_-20px_rgba(61,103,81,0.7)] disabled:opacity-70"
              />
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-6 py-7 md:px-8">
            <h3 className="text-[1.5rem] font-bold text-[var(--primary)]">
              Mau lanjut cari tumbler yang cocok dengan vibe artikel ini?
            </h3>
            <p className="mt-3 max-w-2xl text-[var(--on-surface-variant)]">
              Lanjut cek katalog produk Kembung atau ngobrol langsung dengan admin buat cari model, warna, dan kapasitas yang paling pas buat aktivitas harian kamu.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/produk"
                className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)]"
              >
                Lihat Produk
              </Link>
              <Link
                href="/hubungi-kami"
                className="rounded-full border border-[var(--outline-variant)] bg-white px-6 py-3 text-sm font-semibold text-[var(--on-surface)]"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </article>

        <aside className="space-y-8 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <section>
            <h3 className="mb-5 text-[1.65rem] font-bold text-[var(--on-surface)]">
              Artikel Terkait
            </h3>

            <div className="space-y-6">
              {relatedArticles.map((item) => (
                <Link key={item.slug} href={`/artikel/${item.slug}`} className="group block">
                  <div className="mb-3 overflow-hidden rounded-[1.5rem] bg-[var(--surface-container)]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={800}
                      height={450}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                    {item.category}
                  </span>
                  <h4 className="mt-2 text-lg font-semibold leading-7 text-[var(--on-surface)] transition-colors group-hover:text-[var(--primary)]">
                    {item.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--on-surface-variant)]">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container)] p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--outline-variant)]/25 bg-[var(--surface-container-lowest)] px-4 py-2 text-xs font-semibold text-[var(--on-surface-variant)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-[var(--secondary-container)] p-6">
            <h3 className="text-lg font-bold text-[var(--on-secondary-fixed)]">Quick Read</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-secondary-fixed-variant)]">
                  Publish Date
                </dt>
                <dd className="mt-1 text-sm text-[var(--on-secondary-fixed)]">
                  {dateFormatter.format(new Date(article.date))}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-secondary-fixed-variant)]">
                  Read Time
                </dt>
                <dd className="mt-1 text-sm text-[var(--on-secondary-fixed)]">{article.readTime}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--on-secondary-fixed-variant)]">
                  Focus
                </dt>
                <dd className="mt-1 text-sm text-[var(--on-secondary-fixed)]">{article.category}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
}
