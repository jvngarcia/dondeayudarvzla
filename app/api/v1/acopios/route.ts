import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { JsonApiDocument } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("filter[ciudad]");
  const tipo = searchParams.get("filter[tipo]");
  const estadoInsumos = searchParams.get("filter[estado_insumos]");
  const recurso = searchParams.get("filter[recurso]");
  const categoria = searchParams.get("filter[categoria]");

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
      const empty: JsonApiDocument = {
        data: [],
        meta: { total: 0 },
        jsonapi: { version: "1.0" },
      };
      return NextResponse.json(empty);
    }
  }

  let query = supabaseAdmin
    .from("acopios")
    .select("*")
    .eq("status", "aprobado")
    .order("created_at", { ascending: false });

  if (ciudad) query = query.ilike("ciudad", ciudad);
  if (tipo) query = query.eq("tipo", tipo);
  if (estadoInsumos) query = query.eq("estado_insumos", estadoInsumos);
  if (categoria) query = query.eq("categoria", categoria);
  if (recursoIds) query = query.in("id", recursoIds);

  const { data: acopios, error } = await query;

  if (error) {
    return NextResponse.json(
      { errors: [{ status: "500", title: "Error al consultar datos", detail: error.message }] },
      { status: 500 }
    );
  }

  const acopioIds = (acopios || []).map((a: any) => a.id);
  let recursosPorAcopio: Record<string, unknown[]> = {};

  if (acopioIds.length > 0) {
    const { data: relaciones } = await supabaseAdmin
      .from("acopio_recursos")
      .select("acopio_id, recurso_id")
      .in("acopio_id", acopioIds);

    if (relaciones && relaciones.length > 0) {
      const todosRecursoIds = [...new Set(relaciones.map((r: any) => r.recurso_id))];

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

  const resources = (acopios || []).map((item: any) => ({
    type: "acopios",
    id: item.id,
    attributes: {
      nombre: item.nombre,
      tipo: item.tipo,
      direccion: item.direccion,
      ciudad: item.ciudad,
      estado: item.estado,
      lat: item.lat,
      lng: item.lng,
      contacto: item.contacto,
      horario: item.horario,
      recursos: recursosPorAcopio[item.id] || [],
      estado_insumos: item.estado_insumos,
      categoria: item.categoria,
      foto_url: item.foto_url,
      created_at: item.created_at,
    },
  }));

  const document: JsonApiDocument = {
    data: resources,
    meta: { total: resources.length },
    jsonapi: { version: "1.0" },
  };

  return NextResponse.json(document);
}
