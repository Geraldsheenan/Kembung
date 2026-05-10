import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ContactMessageAdminPayload = {
  id?: string;
  status?: "new" | "read" | "replied" | "archived";
  adminNote?: string;
};

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ContactMessageAdminPayload;

    if (!body.id || !body.status) {
      return NextResponse.json(
        { message: "ID dan status pesan wajib dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({
        status: body.status,
        admin_note: body.adminNote?.trim() || null,
      })
      .eq("id", body.id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/contact-messages");

    return NextResponse.json({ message: "Pesan berhasil diperbarui." });
  } catch (error) {
    console.error("Updating contact message failed", error);

    return NextResponse.json(
      { message: "Pesan belum berhasil diperbarui." },
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
        { message: "ID pesan belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/contact-messages");

    return NextResponse.json({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error("Deleting contact message failed", error);

    return NextResponse.json(
      { message: "Pesan belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
