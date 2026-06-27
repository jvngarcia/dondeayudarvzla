import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
      const empty: JsonApiDocument = {
        data: [],
        meta: { total: 0 },
        jsonapi: { version: "1.0" },
      };
      return NextResponse.json(empty);
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
    .order("created_at", { ascending: false });

  if (ciudad) query = query.ilike("ciudad", ciudad);
  if (tipo) query = query.eq("tipo", tipo);
  if (estadoInsumos) query = query.eq("estado_insumos", estadoInsumos);
  if (categoria) query = query.eq("categoria", categoria);
  if (recursoIds) query = query.in("id", recursoIds);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { errors: [{ status: "500", title: "Error al consultar datos", detail: error.message }] },
      { status: 500 }
    );
  }

  const resources = (data || []).map((item) => {
    const recursos = (item.recursos || []).map((r: { recurso: { id: string; nombre: string; descripcion: string | null; categoria: string } }) => r.recurso);
    return {
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
        recursos,
        estado_insumos: item.estado_insumos,
        categoria: item.categoria,
        foto_url: item.foto_url,
        created_at: item.created_at,
      },
    };
  });

  const document: JsonApiDocument = {
    data: resources,
    meta: { total: resources.length },
    jsonapi: { version: "1.0" },
  };

  return NextResponse.json(document);
}
