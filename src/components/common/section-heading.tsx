import { LimitedRichText } from "./limited-rich-text";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <LimitedRichText
          as="p"
          value={eyebrow}
          className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
        />
      ) : null}
      <LimitedRichText
        as="h2"
        value={title}
        className="text-balance text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)] md:text-[48px] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
      />
      {description ? (
        <LimitedRichText
          as="div"
          value={description}
          className="mt-4 text-base leading-8 text-[var(--on-surface-variant)] md:text-lg [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
        />
      ) : null}
    </div>
  );
}
