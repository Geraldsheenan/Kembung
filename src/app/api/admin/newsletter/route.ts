import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type NewsletterAdminPayload = {
  id?: string;
  status?: "subscribed" | "unsubscribed";
};

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as NewsletterAdminPayload;

    if (!body.id || !body.status) {
      return NextResponse.json(
        { message: "ID dan status newsletter wajib dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("newsletter_signups")
      .update({ status: body.status })
      .eq("id", body.id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/newsletter");

    return NextResponse.json({ message: "Status newsletter berhasil diubah." });
  } catch (error) {
    console.error("Updating newsletter failed", error);

    return NextResponse.json(
      { message: "Status newsletter belum berhasil diubah." },
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
        { message: "ID subscriber belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("newsletter_signups").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/newsletter");

    return NextResponse.json({ message: "Subscriber berhasil dihapus." });
  } catch (error) {
    console.error("Deleting newsletter signup failed", error);

    return NextResponse.json(
      { message: "Subscriber belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
