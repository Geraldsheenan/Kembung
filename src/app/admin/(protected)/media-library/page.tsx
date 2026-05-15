import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { MediaLibraryAdminClient } from "@/components/admin/media-library-admin-client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type MediaAssetRow = {
  id: string;
  bucket_name: string;
  file_path: string;
  public_url: string;
  alt_text: string | null;
  tag: string | null;
  created_at: string;
};

async function getMediaAssets() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("media_assets")
    .select("id, bucket_name, file_path, public_url, alt_text, tag, created_at")
    .order("created_at", { ascending: false });

  return ((data as MediaAssetRow[] | null) ?? []).map((item) => ({
    id: item.id,
    bucketName: item.bucket_name,
    filePath: item.file_path,
    publicUrl: item.public_url,
    altText: item.alt_text ?? "",
    tag: item.tag ?? "",
    createdAt: item.created_at,
  }));
}

export default async function AdminMediaLibraryPage() {
  const assets = await getMediaAssets();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="Upload Module"
        title="Media Library"
        description="Upload asset ke Supabase Storage, simpan metadata ke tabel `media_assets`, lalu pakai public URL-nya di homepage, about, contact, products, dan articles."
      />

      <MediaLibraryAdminClient initialAssets={assets} />
    </section>
  );
}
