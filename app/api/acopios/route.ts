import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("ciudad");

  let query = supabase
    .from("acopios")
    .select("*")
    .eq("status", "aprobado")
    .order("created_at", { ascending: false });

  if (ciudad) {
    query = query.ilike("ciudad", ciudad);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
