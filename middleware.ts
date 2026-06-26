import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const ipRequests = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/acopios/reportar" && request.method === "POST") {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    const now = Date.now();
    const record = ipRequests.get(ip);

    if (!record || now > record.resetAt) {
      ipRequests.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    } else if (record.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo más tarde." },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/acopios/reportar",
};
