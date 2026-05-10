"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type MediaAssetRecord = {
  id: string;
  bucketName: string;
  filePath: string;
  publicUrl: string;
  altText: string;
  tag: string;
  createdAt: string;
};

type MediaLibraryAdminClientProps = {
  initialAssets: MediaAssetRecord[];
};

export function MediaLibraryAdminClient({
  initialAssets,
}: MediaLibraryAdminClientProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [file, setFile] = useState<File | null>(null);
  const [tag, setTag] = useState("");
  const [altText, setAltText] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return assets;
    }

    return assets.filter((asset) =>
      [asset.filePath, asset.tag, asset.altText, asset.bucketName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [assets, query]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setErrorMessage("Pilih file dulu sebelum upload.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tag", tag);
    formData.append("altText", altText);

    const response = await fetch("/api/admin/media-library", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      message?: string;
      asset?: MediaAssetRecord;
    };

    if (!response.ok || !result.asset) {
      setErrorMessage(result.message ?? "Upload asset belum berhasil.");
      setIsSubmitting(false);
      return;
    }

    setAssets((current) => [result.asset!, ...current]);
    setFile(null);
    setTag("");
    setAltText("");
    const form = event.currentTarget;
    form.reset();
    setMessage(result.message ?? "Asset berhasil diupload.");
    setIsSubmitting(false);
  }

  async function deleteAsset(id: string) {
    const confirmed = window.confirm("Hapus asset ini dari media library?");
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/media-library?id=${id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Asset belum berhasil dihapus.");
      return;
    }

    setAssets((current) => current.filter((asset) => asset.id !== id));
    setMessage(result.message ?? "Asset berhasil dihapus.");
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Public URL berhasil dicopy.");
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleUpload}
        className="grid gap-5 rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)] md:grid-cols-2"
      >
        <div className="space-y-2 md:col-span-2">
          <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            Tag
          </label>
          <input
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            Alt Text
          </label>
          <input
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] disabled:opacity-70"
          >
            {isSubmitting ? "Uploading..." : "Upload Asset"}
          </button>
        </div>
      </form>

      {message ? (
        <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari berdasarkan nama file, tag, alt text..."
          className="w-full rounded-full border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssets.map((asset) => (
          <article
            key={asset.id}
            className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]"
          >
            <div className="relative aspect-[4/3] bg-[var(--surface-container-low)]">
              <Image
                src={asset.publicUrl}
                alt={asset.altText || asset.filePath}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3 p-5">
              <p className="line-clamp-1 text-sm font-semibold text-[var(--on-surface)]">
                {asset.filePath}
              </p>
              <p className="text-xs text-[var(--on-surface-variant)]">
                {asset.tag || "no-tag"} • {asset.bucketName}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => copyUrl(asset.publicUrl)}
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => deleteAsset(asset.id)}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                >
                  Hapus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
