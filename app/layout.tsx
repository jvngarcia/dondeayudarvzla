import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";
import BottomNav from "@/components/BottomNav";
import TopToolbar from "@/components/TopToolbar";

export const metadata: Metadata = {
  title: "Dónde Ayudar Vzla",
  description: "Encuentra puntos de acopio y organizaciones para donar en Venezuela",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const REPO_URL = "https://github.com/jvngarcia/dondeayudarvzla";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="h-full flex flex-col">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-03PBX1SVN3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-03PBX1SVN3');`}
        </Script>
        <TopToolbar />
        <main className="flex-1 md:pt-14 pb-12 md:pb-0">{children}</main>
        <BottomNav />
        <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-500 md:pb-3 pb-16">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            Contribuir en GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
