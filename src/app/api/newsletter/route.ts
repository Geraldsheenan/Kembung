import { NextResponse } from "next/server";
import { getDb } from "@/lib/sqlite";

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

    const db = getDb();

    db.prepare(
      `
        INSERT INTO newsletter_signups (email, source)
        VALUES (@email, @source)
        ON CONFLICT(email) DO UPDATE SET source = excluded.source
      `,
    ).run({ email, source });

    return NextResponse.json({
      message: `${email} berhasil didaftarkan ke inbox Kembung.`,
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
