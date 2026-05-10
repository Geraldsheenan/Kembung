import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const subject = body.subject?.trim() ?? "";
    const message = body.message?.trim() ?? "";
    const source = body.source?.trim() || "contact-page";

    if (name.length < 2) {
      return NextResponse.json(
        { message: "Nama lengkap minimal 2 karakter." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { message: "Email belum valid. Coba cek lagi ya." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { message: "Pesan minimal 10 karakter supaya tim kami bisa bantu lebih tepat." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const basePayload = {
      name,
      email,
      message,
      source,
    };

    const payloadWithSubject = {
      ...basePayload,
      subject: subject || null,
    };

    const { error: insertWithSubjectError } = await supabase
      .from("contact_messages")
      .insert(payloadWithSubject);

    if (insertWithSubjectError) {
      const { error: fallbackInsertError } = await supabase.from("contact_messages").insert({
        ...basePayload,
        message: subject ? `Subjek: ${subject}\n\n${message}` : message,
      });

      if (fallbackInsertError) {
        throw insertWithSubjectError;
      }
    }

    return NextResponse.json({
      message: `Pesan ${name} berhasil terkirim. Tim Kembung akan cek inbox ini.`,
      name,
      email,
    });
  } catch (error) {
    console.error("Contact message submission failed", error);

    return NextResponse.json(
      { message: "Pesan belum berhasil dikirim. Coba lagi sebentar lagi." },
      { status: 500 },
    );
  }
}
