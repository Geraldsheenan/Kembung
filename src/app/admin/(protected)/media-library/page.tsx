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
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Upload Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Media Library
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Upload asset ke Supabase Storage, simpan metadata ke tabel `media_assets`, lalu
          pakai public URL-nya di homepage, about, contact, products, dan articles.
        </p>
      </div>

      <MediaLibraryAdminClient initialAssets={assets} />
    </section>
  );
}
