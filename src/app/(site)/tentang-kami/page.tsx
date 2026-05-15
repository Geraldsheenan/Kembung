import Image from "next/image";
import { HiOutlinePaintBrush, HiOutlineShieldCheck } from "react-icons/hi2";
import { LuDroplets, LuLeaf, LuSmile } from "react-icons/lu";
import { getAboutPageContent } from "@/lib/content/about-content";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Tentang Kami",
  description:
    "Company profile Kembunk dengan cerita brand, visi, misi, nilai brand, dan alasan memilih tumbler Kembunk.",
  path: "/tentang-kami",
});

const valueIcons = {
  "paint-brush": HiOutlinePaintBrush,
  shield: HiOutlineShieldCheck,
  leaf: LuLeaf,
} as const;

const valueThemes = {
  primary: "bg-[var(--primary-container)] text-[var(--primary)]",
  secondary:
    "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
  tertiary:
    "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]",
} as const;

const missionHighlightIcons = {
  droplets: LuDroplets,
  smile: LuSmile,
} as const;

export default async function AboutPage() {
  const about = await getAboutPageContent();
  const story = about.sections.story;
  const mission = about.sections.mission;
  const valuesIntro = about.sections.values_intro;
  const final = about.sections.final;
  const missionHighlights = Array.isArray(mission.extra.highlights)
    ? (mission.extra.highlights as { iconKey: string; label: string }[])
    : [];

  return (
    <section className="container-shell space-y-20 py-20">
      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5">
          <span className="rounded-full bg-[var(--primary-container)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--on-primary-container)]">
            {story.eyebrow}
          </span>
          <h1 className="text-[3.5rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
            {story.title}
          </h1>
          <p className="text-lg leading-8 text-[var(--on-surface-variant)]">
            {story.description}
          </p>
        </div>

        <div className="relative md:col-span-7">
          <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)]">
            <Image
              src={story.imageUrl}
              alt="About Kembunk Origins"
              width={1200}
              height={900}
              className="h-[500px] w-full object-cover"
            />
          </div>
          {story.quoteText ? (
            <div className="absolute -bottom-2 -left-2 hidden max-w-[200px] rounded-[1.25rem] bg-[var(--secondary-container)] p-5 shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)] md:block">
              <p className="font-semibold text-[var(--on-secondary-container)]">
                {story.quoteText}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[2rem] bg-[var(--primary-fixed)] px-8 py-16 text-center md:px-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            {mission.eyebrow}
          </span>
          <h2 className="text-[3rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--on-primary-fixed-variant)]">
            {mission.title}
          </h2>
          <p className="text-lg leading-8 text-[var(--on-primary-fixed-variant)]/80">
            {mission.description}
          </p>
          <div className="flex justify-center gap-12 pt-4">
            {missionHighlights.map((item) => {
              const Icon =
                missionHighlightIcons[
                  item.iconKey as keyof typeof missionHighlightIcons
                ] ?? LuDroplets;

              return (
                <div key={item.label} className="text-center">
                  <Icon className="mx-auto text-[3rem] text-[var(--primary)]" aria-hidden="true" />
                  <p className="mt-2 font-semibold">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-[3rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
            {valuesIntro.title}
          </h2>
          <p className="mt-3 text-[var(--on-surface-variant)]">
            {valuesIntro.description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {about.values.map((value) => {
            const Icon =
              valueIcons[value.iconKey as keyof typeof valueIcons] ?? HiOutlinePaintBrush;
            const circle =
              valueThemes[value.themeKey as keyof typeof valueThemes] ??
              valueThemes.primary;

            return (
              <article
                key={value.title}
                className="flex flex-col items-center rounded-[1.5rem] bg-[var(--surface-container-low)] p-8 text-center shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)] transition-transform duration-200 hover:scale-105"
              >
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${circle}`}>
                  <Icon className="text-[40px]" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--primary)]">{value.title}</h3>
                <p className="mt-3 text-[var(--on-surface-variant)]">{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <Image
            src={final.imageUrl}
            alt="Lifestyle Hydration"
            width={1000}
            height={800}
            className="h-[400px] w-full rounded-[1.5rem] object-cover shadow-[0_20px_40px_-15px_rgba(168,213,186,0.15)]"
          />
        </div>
        <div className="order-1 space-y-6 md:order-2">
          <h2 className="text-[3rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
            {final.title}
          </h2>
          <p className="text-lg leading-8 text-[var(--on-surface-variant)]">
            {final.description}
          </p>
        </div>
      </section>
    </section>
  );
}
