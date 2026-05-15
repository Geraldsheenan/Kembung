import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type NewsletterPayload = {
  email?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterPayload;
    const email = body.email?.trim().toLowerCase() ?? "";
    const source = body.source?.trim() || "unknown";

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Email belum valid. Coba cek lagi ya." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("newsletter_signups").upsert(
      {
        email,
        source,
        status: "subscribed",
      },
      {
        onConflict: "email",
      },
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `${email} berhasil didaftarkan ke inbox Kembunk.`,
      email,
    });
  } catch (error) {
    console.error("Newsletter signup failed", error);

    return NextResponse.json(
      { message: "Pendaftaran belum berhasil. Coba lagi sebentar lagi." },
      { status: 500 },
    );
  }
}
