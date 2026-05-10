import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: PropsWithChildren) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  if (getRoleFromClaims(data?.claims ?? null) !== "admin") {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
