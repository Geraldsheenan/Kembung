import { AnimatedCard } from "@/components/animation/animated-card";

export function TestimonialCard({
  name,
  quote,
}: {
  name: string;
  quote: string;
}) {
  return (
    <AnimatedCard className="rounded-[24px] border border-[var(--outline-variant)]/25 bg-[var(--surface-bright)] p-6">
      <p className="text-lg leading-8 text-[var(--on-surface)]">
        &quot;{quote}&quot;
      </p>
      <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
        {name}
      </p>
    </AnimatedCard>
  );
}
