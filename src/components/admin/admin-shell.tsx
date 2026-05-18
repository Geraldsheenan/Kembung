"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type PropsWithChildren } from "react";
import {
  Bell,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Search,
  X,
} from "lucide-react";
import { adminSections } from "./admin-config";
import { AdminSignOutButton } from "./admin-sign-out-button";

type AdminIcon = typeof LayoutDashboard;
type AdminShellProps = PropsWithChildren<{
  siteName: string;
  logoUrl: string;
}>;

const groupedMenu = [
  {
    title: "Core",
    items: ["site-settings", "homepage", "navigation"] as const,
  },
  {
    title: "Catalog",
    items: ["products", "store", "media-library"] as const,
  },
  {
    title: "Content",
    items: ["articles", "about-page", "contact-page"] as const,
  },
  {
    title: "Engagement",
    items: ["contact-messages", "newsletter"] as const,
  },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: AdminIcon;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[0.98rem] font-medium transition-colors ${
        active
          ? "bg-[#e8edf6] text-[#4361ee]"
          : "text-[#73796f] hover:bg-[#f1f4f9] hover:text-[#2f3a4d]"
      }`}
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${active ? "text-[#4361ee]" : "text-[#73796f]"}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </Link>
  );
}

function OtherLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: AdminIcon;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-[0.98rem] font-medium text-[#73796f] transition-colors hover:bg-[#f1f4f9] hover:text-[#2f3a4d]"
    >
      <Icon className="h-5 w-5 shrink-0 text-[#73796f]" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

export function AdminShell({ children, siteName, logoUrl }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fd] text-[#181c20]">
      <div className="relative flex min-h-screen w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[302px] max-w-[calc(100vw-1rem)] flex-col border-r border-[#c3c8bd] bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-[105%]"
          }`}
        >
          <div className="flex items-center justify-between gap-4 px-7 pb-6 pt-7">
            <div className="flex items-center gap-4">
              <div className="overflow-hidden rounded-2xl shadow-[0_8px_24px_-14px_rgba(51,79,43,0.65)]">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="text-[2rem] font-medium tracking-[-0.04em] text-[#334f2b]">
                {siteName}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 lg:hidden"
              aria-label="Tutup menu admin"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-7">
            <div className="px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#73796f]">
              Menu
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <NavLink
                  href="/admin"
                  label="Dashboard"
                  icon={LayoutDashboard}
                  active={pathname === "/admin"}
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>

              {groupedMenu.map((group) => (
                <div key={group.title}>
                  <div className="px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#73796f]">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items
                      .map((slug) => adminSections.find((item) => item.slug === slug))
                      .filter((item) => item !== undefined)
                      .map((item) => (
                        <NavLink
                          key={item.slug}
                          href={`/admin/${item.slug}`}
                          label={item.label}
                          icon={item.icon}
                          active={pathname.startsWith(`/admin/${item.slug}`)}
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#e6ebf2] pt-5">
              <OtherLink
                href="/admin"
                label="Help"
                icon={HelpCircle}
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </nav>

          <div className="border-t border-[#c3c8bd] px-5 py-5">
            <AdminSignOutButton className="w-full justify-start rounded-xl border-0 bg-transparent px-4 py-3 text-[0.98rem] font-medium text-[#73796f] shadow-none hover:bg-[#f1f4f9] hover:text-[#2f3a4d]" />
          </div>
        </aside>

        {mobileMenuOpen ? (
          <button
            type="button"
            aria-label="Tutup overlay menu"
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#c3c8bd] bg-white px-5 lg:px-10">
            <div className="flex w-full max-w-2xl items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                aria-label="Buka menu admin"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#73796f]"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-2xl border-none bg-[#edf1f7] py-3 pl-12 pr-4 text-[1rem] text-[#181c20] outline-none ring-0 focus:ring-2 focus:ring-[#334f2b]/15"
                />
              </div>
            </div>

            <div className="ml-6 flex items-center gap-5">
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifikasi admin"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#73796f] transition-colors hover:bg-[#f1f4f9]"
                >
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#ba1a1a]" />
              </div>
            </div>
          </header>

          <main className="px-5 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
