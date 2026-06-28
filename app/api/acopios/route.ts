import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
      return NextResponse.json([]);
    }
  }

  let query = supabaseAdmin
    .from("acopios")
    .select("*")
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

  const acopioIds = (acopios || []).map((a) => a.id);
  let recursosPorAcopio: Record<string, unknown[]> = {};

  if (acopioIds.length > 0) {
    const { data: relaciones } = await supabaseAdmin
      .from("acopio_recursos")
      .select("acopio_id, recurso_id")
      .in("acopio_id", acopioIds);

    if (relaciones && relaciones.length > 0) {
      const todosRecursoIds = [...new Set(relaciones.map((r) => r.recurso_id))];

      const { data: todosRecursos } = await supabaseAdmin
        .from("recursos")
        .select("*")
        .in("id", todosRecursoIds);

      const recursoMap: Record<string, unknown> = {};
      if (todosRecursos) {
        for (const r of todosRecursos) {
          recursoMap[r.id] = r;
        }
      }

      for (const rel of relaciones) {
        if (!recursosPorAcopio[rel.acopio_id]) recursosPorAcopio[rel.acopio_id] = [];
        if (recursoMap[rel.recurso_id]) {
          recursosPorAcopio[rel.acopio_id].push(recursoMap[rel.recurso_id]);
        }
      }
    }
  }

  const formatted = (acopios || []).map((item) => ({
    ...item,
    recursos: recursosPorAcopio[item.id] || [],
  }));

  return NextResponse.json(formatted);
}
