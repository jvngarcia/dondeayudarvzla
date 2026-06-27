import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("ciudad");
  const recurso = searchParams.get("recurso");

  let recursoIds: string[] | null = null;

  if (recurso) {
    const { data: recursosData } = await supabase
      .from("recursos")
      .select("id")
      .ilike("nombre", recurso);

    if (recursosData && recursosData.length > 0) {
      const { data: acopioRecursos } = await supabase
        .from("acopio_recursos")
        .select("acopio_id")
        .in("recurso_id", recursosData.map((r) => r.id));

      if (acopioRecursos) {
        recursoIds = acopioRecursos.map((ar) => ar.acopio_id);
      }
    }

    if (!recursoIds || recursoIds.length === 0) {
      return NextResponse.json([]);
    }
  }

  let query = supabase
    .from("acopios")
    .select(`
      *,
      recursos:acopio_recursos(
        recurso:recurso_id(*)
      )
    `)
    .eq("status", "aprobado")
    .order("created_at", { ascending: false })
    .range(offsetVal, offsetVal + limitVal - 1);

  if (ciudad) {
    query = query.ilike("ciudad", ciudad);
  }

  if (recursoIds) {
    query = query.in("id", recursoIds);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (data || []).map((item) => ({
    ...item,
    recursos: (item.recursos || []).map((r: { recurso: unknown }) => r.recurso),
  }));

  return NextResponse.json(formatted);
}
