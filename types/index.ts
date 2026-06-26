export type TipoAcopio = "punto_fijo" | "punto_movil" | "organizacion";
export type StatusAcopio = "pendiente" | "aprobado" | "rechazado";

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
  created_at: string;
}

export interface ReportFormData {
  nombre: string;
  tipo: TipoAcopio;
  direccion: string;
  contacto: string;
  horario?: string;
  que_reciben: string[];
  foto?: File | null;
}
