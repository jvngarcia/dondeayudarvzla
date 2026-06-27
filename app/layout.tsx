import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-200 py-3 px-4 text-center text-xs text-gray-500">
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
