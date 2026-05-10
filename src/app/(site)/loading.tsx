export default function Loading() {
  return (
    <section className="container-shell py-20">
      <div className="space-y-4">
        <div className="h-4 w-36 animate-pulse rounded-full bg-[var(--primary-container)]/60" />
        <div className="h-12 w-full max-w-xl animate-pulse rounded-[18px] bg-[var(--surface-container-high)]" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-[var(--surface-container)]" />
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[24px] border border-[var(--outline-variant)]/25 bg-white p-5 shadow-[0_20px_40px_-18px_rgba(168,213,186,0.18)]"
          >
            <div className="aspect-[4/5] animate-pulse rounded-[20px] bg-[var(--surface-container-high)]" />
            <div className="mt-5 h-4 w-28 animate-pulse rounded-full bg-[var(--primary-container)]/65" />
            <div className="mt-3 h-8 w-2/3 animate-pulse rounded-full bg-[var(--surface-container)]" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[var(--surface-container)]" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-[var(--surface-container)]" />
          </div>
        ))}
      </div>
    </section>
  );
}
