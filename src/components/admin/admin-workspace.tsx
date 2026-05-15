"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/animation/modal";

export function AdminSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_44px_-30px_rgba(15,23,42,0.16)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminWorkspaceShell({
  sidebar,
  children,
}: {
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      {sidebar}
      {children}
    </div>
  );
}

export function AdminSidebarPanel({ children }: { children: ReactNode }) {
  return <AdminSurface className="p-6">{children}</AdminSurface>;
}

export function AdminCanvasPanel({ children }: { children: ReactNode }) {
  return <AdminSurface className="p-8">{children}</AdminSurface>;
}

export function AdminPanelHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3458f5]">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.04em] text-slate-950">
          {title}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminInputClassName() {
  return "w-full rounded-[1.25rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3458f5]/35";
}

export function AdminTextareaClassName() {
  return "w-full rounded-[1.5rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3458f5]/35";
}

export function AdminSectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-[#fbfcfe] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminPrimaryButton({
  children,
  type = "button",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded-full bg-[#3458f5] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_30px_-22px_rgba(52,88,245,0.65)] transition-colors hover:bg-[#2949d8] disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminGhostButton({
  children,
  type = "button",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminDangerButton({
  children,
  type = "button",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminFlashMessage({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: ReactNode;
}) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50/80 text-emerald-700 shadow-[0_10px_24px_-20px_rgba(16,185,129,0.45)]"
      : "border-red-200 bg-red-50/80 text-red-600 shadow-[0_10px_24px_-20px_rgba(239,68,68,0.35)]";

  return (
    <div className={`rounded-[1.25rem] border px-4 py-3 text-sm ${className}`}>{children}</div>
  );
}

export function AdminCreateDialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} className="max-w-2xl">
      <div className="space-y-5">
        <p className="text-sm leading-7 text-slate-500">{description}</p>
        {children}
      </div>
    </Modal>
  );
}
