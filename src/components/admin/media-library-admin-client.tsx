"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AdminCreateDialog,
  AdminDangerButton,
  AdminFlashMessage,
  AdminGhostButton,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminSurface,
} from "./admin-workspace";

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const inputClassName = AdminInputClassName();

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
    event.currentTarget.reset();
    setMessage(result.message ?? "Asset berhasil diupload.");
    setIsUploadModalOpen(false);
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
      <AdminCreateDialog
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Asset"
        description="Upload gambar lewat popup agar canvas media library tetap fokus ke pencarian dan pemakaian asset yang sudah ada."
      >
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-600">File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full rounded-[1.25rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Tag</label>
              <input
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Alt Text</label>
              <input
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <AdminGhostButton onClick={() => setIsUploadModalOpen(false)}>Batal</AdminGhostButton>
            <AdminPrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Asset"}
            </AdminPrimaryButton>
          </div>
        </form>
      </AdminCreateDialog>

      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <AdminSurface className="flex-1 p-6">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari berdasarkan nama file, tag, alt text..."
            className="w-full rounded-full border border-slate-200 bg-[#f7f8fa] px-5 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3458f5]/35"
          />
        </AdminSurface>
        <AdminPrimaryButton onClick={() => setIsUploadModalOpen(true)}>
          Upload Baru
        </AdminPrimaryButton>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAssets.map((asset) => (
          <AdminSurface key={asset.id} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-[#f7f8fa]">
              <Image
                src={asset.publicUrl}
                alt={asset.altText || asset.filePath}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3 p-5">
              <p className="line-clamp-1 text-sm font-semibold text-slate-950">{asset.filePath}</p>
              <p className="text-xs text-slate-500">
                {asset.tag || "no-tag"} • {asset.bucketName}
              </p>
              <div className="flex gap-3">
                <AdminPrimaryButton onClick={() => copyUrl(asset.publicUrl)}>
                  Copy URL
                </AdminPrimaryButton>
                <AdminDangerButton onClick={() => deleteAsset(asset.id)}>Hapus</AdminDangerButton>
              </div>
            </div>
          </AdminSurface>
        ))}
      </div>
    </div>
  );
}
