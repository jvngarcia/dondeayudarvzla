import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const MAP_COLUMNS = "id, nombre, tipo, categoria, lat, lng, ciudad, estado, direccion, contacto, horario, foto_url, estado_insumos, recursos:acopio_recursos(recurso:recurso_id(*))";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("ciudad");
  const recurso = searchParams.get("recurso");

  let recursoIds: string[] | null = null;

  if (recurso) {
    const { data: recursosData } = await supabaseAdmin
      .from("recursos")
      .select("id")
      .ilike("nombre", recurso);

    if (recursosData && recursosData.length > 0) {
      const { data: acopioRecursos } = await supabaseAdmin
        .from("acopio_recursos")
        .select("acopio_id")
        .in("recurso_id", recursosData.map((r) => r.id));

      if (acopioRecursos) {
        recursoIds = acopioRecursos.map((ar) => ar.acopio_id);
      }
    }

    if (!recursoIds || recursoIds.length === 0) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    }
  }

  let query = supabaseAdmin
    .from("acopios")
    .select(MAP_COLUMNS)
    .eq("status", "aprobado")
    .order("created_at", { ascending: false });

  if (ciudad) {
    query = query.ilike("ciudad", ciudad);
  }

  if (recursoIds) {
    query = query.in("id", recursoIds);
  }

  const { data: acopios, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (acopios || []).map((item: any) => ({
    ...item,
    recursos: (item.recursos || []).map((r: any) => r.recurso),
  }));

  return NextResponse.json(formatted, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
