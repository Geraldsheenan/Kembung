import { randomUUID } from "node:crypto";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET_NAME = "public-media";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function GET() {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, bucket_name, file_path, public_url, alt_text, tag, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      assets: (data ?? []).map((asset) => ({
        id: asset.id,
        bucketName: asset.bucket_name,
        filePath: asset.file_path,
        publicUrl: asset.public_url,
        altText: asset.alt_text ?? "",
        tag: asset.tag ?? "",
        createdAt: asset.created_at,
      })),
    });
  } catch (error) {
    console.error("Loading media assets failed", error);

    return NextResponse.json(
      { message: "Media library belum berhasil dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const tag = String(formData.get("tag") ?? "").trim();
    const altText = String(formData.get("altText") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "File upload belum dikirim." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = path.extname(file.name) || ".bin";
    const fileName = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeFileName(
      path.basename(file.name, extension),
    )}${extension}`;

    const supabase = getSupabaseAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const { data: asset, error: insertError } = await supabase
      .from("media_assets")
      .insert({
        bucket_name: BUCKET_NAME,
        file_path: fileName,
        public_url: publicData.publicUrl,
        alt_text: altText || null,
        tag: tag || null,
      })
      .select("id, bucket_name, file_path, public_url, alt_text, tag, created_at")
      .single();

    if (insertError || !asset) {
      throw insertError;
    }

    revalidatePath("/admin/media-library");

    return NextResponse.json({
      message: "Asset berhasil diupload.",
      asset: {
        id: asset.id,
        bucketName: asset.bucket_name,
        filePath: asset.file_path,
        publicUrl: asset.public_url,
        altText: asset.alt_text ?? "",
        tag: asset.tag ?? "",
        createdAt: asset.created_at,
      },
    });
  } catch (error) {
    console.error("Uploading media asset failed", error);

    return NextResponse.json(
      { message: "Asset belum berhasil diupload." },
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
        { message: "ID asset belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: asset, error: assetError } = await supabase
      .from("media_assets")
      .select("file_path, bucket_name")
      .eq("id", id)
      .single();

    if (assetError || !asset) {
      throw assetError;
    }

    const { error: storageError } = await supabase.storage
      .from(asset.bucket_name)
      .remove([asset.file_path]);

    if (storageError) {
      throw storageError;
    }

    const { error: deleteError } = await supabase.from("media_assets").delete().eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    revalidatePath("/admin/media-library");

    return NextResponse.json({ message: "Asset berhasil dihapus." });
  } catch (error) {
    console.error("Deleting media asset failed", error);

    return NextResponse.json(
      { message: "Asset belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
