import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ContactPageSettingsContent } from "@/lib/content/contact-page-content";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ContactPageSettingsContent;
    const supabase = getSupabaseAdminClient();
    const payload = {
      singleton_key: true,
      title: body.title?.trim() || null,
      description: body.description?.trim() || null,
      whatsapp_card_title: body.whatsappCardTitle?.trim() || null,
      whatsapp_card_description: body.whatsappCardDescription?.trim() || null,
      studio_label: body.addressLabel?.trim() || null,
      studio_address: body.address?.trim() || null,
      studio_map_image_url: body.studioMapImageUrl?.trim() || null,
      instagram_url: body.instagramUrl?.trim() || null,
      tiktok_url: body.tiktokUrl?.trim() || null,
      address_label: body.addressLabel?.trim() || null,
      address_text: body.address?.trim() || null,
      phone_label: body.phoneLabel?.trim() || null,
      phone_number: body.phoneNumber?.trim() || null,
      email_label: body.emailLabel?.trim() || null,
      email_address: body.emailAddress?.trim() || null,
      website_label: body.websiteLabel?.trim() || null,
      website_url: body.websiteUrl?.trim() || null,
      website_text: body.websiteText?.trim() || null,
      social_media_label: body.socialMediaLabel?.trim() || null,
      instagram_handle: body.instagramHandle?.trim() || null,
      tiktok_handle: body.tiktokHandle?.trim() || null,
      operational_hours_title: body.operationalHoursTitle?.trim() || null,
      weekday_hours: body.weekdayHours?.trim() || null,
      saturday_hours: body.saturdayHours?.trim() || null,
      holiday_hours: body.holidayHours?.trim() || null,
      form_title: body.formTitle?.trim() || null,
      form_description: body.formDescription?.trim() || null,
      closing_statement: body.closingStatement?.trim() || null,
    };

    const { error } = await supabase
      .from("contact_page_settings")
      .upsert(payload, { onConflict: "singleton_key" });

    if (error) {
      throw error;
    }

    revalidatePath("/hubungi-kami");
    revalidatePath("/admin/contact-page");

    return NextResponse.json({ message: "Contact page berhasil disimpan." });
  } catch (error) {
    console.error("Saving contact page failed", error);

    return NextResponse.json(
      { message: "Contact page belum berhasil disimpan." },
      { status: 500 },
    );
  }
}
