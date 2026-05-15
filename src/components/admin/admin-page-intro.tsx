type AdminPageIntroProps = {
  badge: string;
  title: string;
  description: string;
};

export function AdminPageIntro({
  badge,
  title,
  description,
}: AdminPageIntroProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fd_100%)] p-8 shadow-[0_18px_46px_-30px_rgba(15,23,42,0.18)]">
      <div className="inline-flex items-center rounded-full bg-[#ebf1ff] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#3458f5]">
        {badge}
      </div>
      <h2 className="mt-5 text-[2.8rem] font-extrabold leading-[1.02] tracking-[-0.05em] text-slate-950">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-[1.02rem] leading-8 text-slate-500">
        {description}
      </p>
    </div>
  );
}
