"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type AdminSignOutButtonProps = {
  iconOnly?: boolean;
  className?: string;
};

export function AdminSignOutButton({
  iconOnly = false,
  className = "",
}: AdminSignOutButtonProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Sign out"
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${className}`.trim()}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.4)] hover:border-slate-300 hover:bg-slate-50 ${className}`.trim()}
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  );
}
