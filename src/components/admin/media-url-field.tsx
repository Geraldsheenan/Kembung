"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type MediaAssetRecord = {
  id: string;
  bucketName: string;
  filePath: string;
  publicUrl: string;
  altText: string;
  tag: string;
  createdAt: string;
};

type MediaUrlFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  uploadTag?: string;
  uploadAltText?: string;
};

export function MediaUrlField({
  label,
  value,
  onChange,
  placeholder,
  helpText,
  uploadTag,
  uploadAltText,
}: MediaUrlFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [assets, setAssets] = useState<MediaAssetRecord[]>([]);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen || assets.length > 0 || isLoading) {
      return;
    }

    let isActive = true;

    async function loadAssets() {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/admin/media-library");
      const result = (await response.json()) as {
        assets?: MediaAssetRecord[];
        message?: string;
      };

      if (!isActive) {
        return;
      }

      if (!response.ok) {
        setErrorMessage(result.message ?? "Media library belum berhasil dimuat.");
        setIsLoading(false);
        return;
      }

      setAssets(result.assets ?? []);
      setIsLoading(false);
    }

    void loadAssets();

    return () => {
      isActive = false;
    };
  }, [assets.length, isLoading, isOpen]);

  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return assets;
    }

    return assets.filter((asset) =>
      [asset.filePath, asset.tag, asset.altText]
        .filter(Boolean)
        .some((item) => item.toLowerCase().includes(normalized)),
    );
  }, [assets, query]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tag", uploadTag ?? "");
    formData.append("altText", uploadAltText ?? "");

    const response = await fetch("/api/admin/media-library", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      asset?: MediaAssetRecord;
      message?: string;
    };

    if (!response.ok || !result.asset) {
      setErrorMessage(result.message ?? "Asset belum berhasil diupload.");
      setIsUploading(false);
      event.target.value = "";
      return;
    }

    setAssets((current) => [result.asset!, ...current]);
    onChange(result.asset.publicUrl);
    setIsOpen(true);
    setIsUploading(false);
    event.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
        {label}
      </label>

      <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-3">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[1rem] border border-[var(--outline-variant)]/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-full border border-[var(--outline-variant)]/30 bg-white px-4 py-2 text-sm font-semibold text-[var(--on-surface)] disabled:opacity-70"
          >
            {isUploading ? "Mengupload..." : "Upload dari File Explorer"}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Pilih dari Media Library
          </button>

          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-full border border-[var(--outline-variant)]/30 px-4 py-2 text-sm font-semibold text-[var(--on-surface)]"
            >
              Kosongkan
            </button>
          ) : null}
        </div>

        {helpText ? (
          <p className="text-xs leading-6 text-[var(--on-surface-variant)]">{helpText}</p>
        ) : null}

        {value ? (
          <div className="max-w-sm overflow-hidden rounded-[1rem] border border-[var(--outline-variant)]/20 bg-white">
            <div className="relative aspect-[16/10] bg-[var(--surface-container-low)]">
              <Image src={value} alt={label} fill className="object-cover" />
            </div>
          </div>
        ) : null}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-24px_rgba(20,30,24,0.35)]">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--outline-variant)]/20 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-[var(--on-surface)]">Media Library</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Pilih asset untuk field {label.toLowerCase()}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[var(--outline-variant)]/30 px-4 py-2 text-sm font-semibold text-[var(--on-surface)]"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama file, tag, atau alt text"
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />

              {errorMessage ? (
                <div className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              ) : null}

              {isLoading ? (
                <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-8 text-center text-sm text-[var(--on-surface-variant)]">
                  Memuat asset...
                </div>
              ) : (
                <div className="grid max-h-[55vh] gap-4 overflow-y-auto md:grid-cols-2 xl:grid-cols-3">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => {
                          onChange(asset.publicUrl);
                          setIsOpen(false);
                        }}
                        className={`overflow-hidden rounded-[1.5rem] border text-left transition ${
                          value === asset.publicUrl
                            ? "border-[var(--primary)] shadow-[0_0_0_2px_rgba(44,95,75,0.12)]"
                            : "border-[var(--outline-variant)]/20"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-[var(--surface-container-low)]">
                          <Image
                            src={asset.publicUrl}
                            alt={asset.altText || asset.filePath}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="line-clamp-1 text-sm font-semibold text-[var(--on-surface)]">
                            {asset.filePath}
                          </p>
                          <p className="line-clamp-2 text-xs text-[var(--on-surface-variant)]">
                            {asset.tag || "no-tag"} - {asset.altText || "tanpa alt text"}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-8 text-center text-sm text-[var(--on-surface-variant)] md:col-span-2 xl:col-span-3">
                      Tidak ada asset yang cocok.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
