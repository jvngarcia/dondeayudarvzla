"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { DocsIcon, ReportIcon, InfoIcon } from "./icons";

export default function TopToolbar() {
  const pathname = usePathname();

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-[2000] bg-white/90 backdrop-blur-md border-b border-gray-200 h-14 items-center justify-between px-6 safe-area-top">
      <Link href="/" className="flex items-center gap-2">
        <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          D
        </span>
        <span className="font-semibold text-gray-800 text-sm">
          Dónde Ayudar Vzla
        </span>
      </Link>
      <div className="flex items-center gap-1">
        <NavLink href="/docs" label="API Docs" Icon={DocsIcon} pathname={pathname} />
        <NavLink href="/reportar" label="Reportar" Icon={ReportIcon} pathname={pathname} />
        <NavLink href="/about" label="Acerca" Icon={InfoIcon} pathname={pathname} />
      </div>
    </header>
  );
}

function NavLink({ href, label, Icon, pathname }: { href: string; label: string; Icon: ComponentType<{ className?: string }>; pathname: string }) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "text-red-600 bg-red-50"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
