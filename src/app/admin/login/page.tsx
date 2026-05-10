import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const role = getRoleFromClaims(data?.claims ?? null);

  if (role === "admin") {
    redirect("/admin");
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[var(--surface-container-low)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_90px_-38px_rgba(30,52,43,0.28)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-[var(--primary)] p-10 text-[var(--on-primary)] lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
            Kembung Admin
          </p>
          <h1 className="mt-6 text-[3.4rem] font-extrabold leading-[0.95] tracking-[-0.05em]">
            Masuk buat ngatur konten brand dengan aman.
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-white/80">
            Login admin ini dipakai untuk akses dashboard internal, update site settings,
            dan kelola produk langsung dari Supabase.
          </p>
        </div>

        <div className="p-8 md:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Secure Sign In
          </p>
          <h2 className="mt-4 text-[2.4rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
            Login admin
          </h2>
          <p className="mt-4 max-w-lg text-base leading-8 text-[var(--on-surface-variant)]">
            Gunakan akun admin Supabase Auth yang sudah diberi role `admin` di
            `app_metadata` atau `user_metadata`.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}
