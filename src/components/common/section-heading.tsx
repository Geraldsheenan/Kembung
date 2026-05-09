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
        <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--primary)] md:text-[48px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[var(--on-surface-variant)] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
