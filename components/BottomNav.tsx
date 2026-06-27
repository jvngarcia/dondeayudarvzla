"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MapIcon, DocsIcon, ReportIcon, InfoIcon } from "./icons";

const NAV_ITEMS = [
  { href: "/", label: "Explorar", Icon: MapIcon },
  { href: "/docs", label: "API Docs", Icon: DocsIcon },
  { href: "/reportar", label: "Reportar", Icon: ReportIcon },
  { href: "/about", label: "Acerca", Icon: InfoIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[2000] bg-white/90 backdrop-blur-md border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-12">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition-colors ${
                isActive
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={isActive ? "w-5 h-5" : "w-5 h-5"} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
