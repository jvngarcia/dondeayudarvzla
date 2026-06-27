export type TipoAcopio = "punto_fijo" | "punto_movil" | "organizacion";
export type StatusAcopio = "pendiente" | "aprobado" | "rechazado";
export type EstadoInsumos = "full" | "necesita";
export type CategoriaAcopio = "refugio" | "centro_acopio";

export interface Acopio {
  id: string;
  nombre: string;
  tipo: TipoAcopio;
  direccion: string;
  ciudad: string;
  estado: string;
  lat: number | null;
  lng: number | null;
  contacto: string;
  horario: string | null;
  que_reciben: string[];
  foto_url: string | null;
  fuente: string | null;
  status: StatusAcopio;
  estado_insumos: EstadoInsumos | null;
  categoria: CategoriaAcopio;
  created_at: string;
}

export interface JsonApiResource {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
}

export interface JsonApiDocument {
  data: JsonApiResource | JsonApiResource[];
  meta?: { total: number };
  jsonapi: { version: string };
}

export interface ReportFormData {
  nombre: string;
  tipo: TipoAcopio;
  direccion: string;
  contacto: string;
  horario?: string;
  que_reciben: string[];
  estado_insumos: EstadoInsumos | null;
  categoria: CategoriaAcopio;
  foto?: File | null;
}
