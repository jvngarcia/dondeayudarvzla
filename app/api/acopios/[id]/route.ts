import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { recursos, contacto, horario, edit_token } = body;

  if (!edit_token) {
    return NextResponse.json({ error: "Token de edición requerido" }, { status: 401 });
  }

  const { data: acopio, error: fetchError } = await supabase
    .from("acopios")
    .select("edit_token, status")
    .eq("id", id)
    .single();

  if (fetchError || !acopio) {
    return NextResponse.json({ error: "Acopio no encontrado" }, { status: 404 });
  }

  if (acopio.edit_token !== edit_token) {
    return NextResponse.json({ error: "Token de edición inválido" }, { status: 403 });
  }

  const updateData: Record<string, unknown> = {};
  if (contacto !== undefined) updateData.contacto = contacto;
  if (horario !== undefined) updateData.horario = horario;

  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from("acopios")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  if (recursos !== undefined) {
    await supabaseAdmin
      .from("acopio_recursos")
      .delete()
      .eq("acopio_id", id);

    if (recursos.length > 0) {
      const inserts = recursos.map((recursoId: string) => ({
        acopio_id: id,
        recurso_id: recursoId,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("acopio_recursos")
        .insert(inserts);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }
  }

  const { data: updated, error: selectError } = await supabaseAdmin
    .from("acopios")
    .select(`
      *,
      recursos:acopio_recursos(
        recurso:recurso_id(*)
      )
    `)
    .eq("id", id)
    .single();

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  const formatted = {
    ...updated,
    recursos: (updated.recursos || []).map((r: { recurso: unknown }) => r.recurso),
  };

  return NextResponse.json(formatted);
}
