import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ciudad = searchParams.get("ciudad");
  const limitVal = parseInt(searchParams.get("limit") || "50", 10);
  const offsetVal = parseInt(searchParams.get("offset") || "0", 10);

  let query = supabase
    .from("acopios")
    .select("*", { count: "exact" })
    .eq("status", "aprobado")
    .order("created_at", { ascending: false })
    .range(offsetVal, offsetVal + limitVal - 1);

  if (ciudad) {
    query = query.ilike("ciudad", ciudad);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count });
}
