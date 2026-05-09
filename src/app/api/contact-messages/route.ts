import { NextResponse } from "next/server";
import { getDb } from "@/lib/sqlite";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  source?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
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

    const db = getDb();

    db.prepare(
      `
        INSERT INTO contact_messages (name, email, message, source)
        VALUES (@name, @email, @message, @source)
      `,
    ).run({ name, email, message, source });

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
