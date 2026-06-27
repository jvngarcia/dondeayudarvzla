import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { JsonApiDocument } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("filter[ciudad]");
  const tipo = searchParams.get("filter[tipo]");
  const estadoInsumos = searchParams.get("filter[estado_insumos]");
  const queReciben = searchParams.get("filter[que_reciben]");

  let query = supabase
    .from("acopios")
    .select("*")
    .eq("status", "aprobado")
    .order("created_at", { ascending: false });

  if (ciudad) query = query.ilike("ciudad", ciudad);
  if (tipo) query = query.eq("tipo", tipo);
  if (estadoInsumos) query = query.eq("estado_insumos", estadoInsumos);
  if (queReciben) query = query.contains("que_reciben", [queReciben]);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { errors: [{ status: "500", title: "Error al consultar datos", detail: error.message }] },
      { status: 500 }
    );
  }

  const resources = (data || []).map((item) => ({
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
      que_reciben: item.que_reciben,
      estado_insumos: item.estado_insumos,
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
