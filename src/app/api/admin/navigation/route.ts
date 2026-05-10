import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type NavigationPayload = {
  id?: string;
  label?: string;
  href?: string;
  location?: "navbar" | "footer_help" | "footer_social";
  sortOrder?: number;
  isActive?: boolean;
  items?: { id?: string; sortOrder?: number }[];
};

function revalidateNavigationPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/navigation");
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NavigationPayload;
    const supabase = getSupabaseAdminClient();

    if (body.items) {
      const sortableItems = body.items.filter((item) => item.id);

      for (const item of sortableItems) {
        const { error } = await supabase
          .from("navigation_items")
          .update({ sort_order: Number(item.sortOrder ?? 0) })
          .eq("id", item.id);

        if (error) {
          throw error;
        }
      }

      revalidateNavigationPaths();

      return NextResponse.json({
        message: "Urutan navigation berhasil disimpan.",
      });
    }

    if (!body.label?.trim() || !body.href?.trim() || !body.location) {
      return NextResponse.json(
        { message: "Label, href, dan location wajib diisi." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("navigation_items")
      .upsert(
        {
          id: body.id,
          label: body.label.trim(),
          href: body.href.trim(),
          location: body.location,
          sort_order: Number(body.sortOrder ?? 0),
          is_active: body.isActive ?? true,
        },
        { onConflict: "id" },
      )
      .select("id")
      .single();

    if (error || !data) {
      throw error;
    }

    revalidateNavigationPaths();

    return NextResponse.json({
      message: "Navigation berhasil disimpan.",
      id: data.id,
    });
  } catch (error) {
    console.error("Saving navigation failed", error);

    return NextResponse.json(
      { message: "Navigation belum berhasil disimpan." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID navigation belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("navigation_items").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidateNavigationPaths();

    return NextResponse.json({ message: "Navigation berhasil dihapus." });
  } catch (error) {
    console.error("Deleting navigation failed", error);

    return NextResponse.json(
      { message: "Navigation belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
