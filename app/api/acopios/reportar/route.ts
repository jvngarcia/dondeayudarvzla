import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!;

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

async function geocode(direccion: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`,
      { headers: { "User-Agent": "dondeayudarvzla/1.0" } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // geocoding falló, se puede ajustar manualmente luego
  }
  return null;
}

export async function POST(request: NextRequest) {
  const turnstileToken = request.headers.get("x-turnstile-token");

  if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
    return NextResponse.json({ error: "Verificación de seguridad fallida" }, { status: 429 });
  }

  const formData = await request.formData();
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;
  const direccion = formData.get("direccion") as string;
  const contacto = formData.get("contacto") as string;
  const horario = formData.get("horario") as string | null;
  const queRecibenRaw = formData.get("que_reciben") as string;
  const estadoInsumos = formData.get("estado_insumos") as string | null;
  const categoria = formData.get("categoria") as string;
  const foto = formData.get("foto") as File | null;

  if (!nombre || !tipo || !direccion || !contacto || !categoria) {
    return NextResponse.json({ error: "Campos obligatorios: nombre, tipo, dirección, contacto, categoría" }, { status: 400 });
  }

  const queReciben = queRecibenRaw ? queRecibenRaw.split(",").map((s: string) => s.trim()).filter(Boolean) : [];

  const coords = await geocode(direccion);

  let fotoUrl: string | null = null;

  if (foto && foto.size > 0) {
    const fileExt = foto.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fotos-acopios")
      .upload(fileName, foto);

    if (uploadError) {
      return NextResponse.json({ error: "Error al subir la foto" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("fotos-acopios").getPublicUrl(fileName);
    fotoUrl = urlData.publicUrl;
  }

  const { data, error } = await supabase.from("acopios").insert({
    nombre,
    tipo,
    direccion,
    contacto,
    horario: horario || null,
    que_reciben: queReciben,
    estado_insumos: estadoInsumos || null,
    categoria: categoria || "centro_acopio",
    foto_url: fotoUrl,
    lat: coords?.lat || null,
    lng: coords?.lng || null,
    status: "pendiente",
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
