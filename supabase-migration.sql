-- Crear tabla de acopios
create table acopios (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  tipo          text not null check (tipo in ('punto_fijo', 'punto_movil', 'organizacion')),
  direccion     text not null,
  ciudad        text not null default 'Caracas',
  estado        text not null default 'Distrito Capital',
  lat           float8,
  lng           float8,
  contacto      text not null,
  horario       text,
  que_reciben   text[] default '{}',
  foto_url      text,
  fuente        text,
  fuente_contacto text,
  status        text not null default 'pendiente' check (status in ('pendiente', 'aprobado', 'rechazado')),
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references auth.users(id)
);

-- Índices para consultas en el mapa
create index idx_acopios_status on acopios (status);
create index idx_acopios_ciudad on acopios (ciudad);

-- Habilitar Row Level Security
alter table acopios enable row level security;

-- RLS: Cualquiera puede leer solo aprobados
create policy "Lectura pública de aprobados"
  on acopios for select
  using (status = 'aprobado');

-- RLS: Cualquiera puede insertar (reportar), solo con status pendiente
create policy "Inserción pública limitada"
  on acopios for insert
  with check (
    status = 'pendiente'
    and reviewed_by is null
    and reviewed_at is null
  );

-- RLS: Admin (usuarios autenticados) puede todo
create policy "Admin full access"
  on acopios for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Migración: Agregar columna estado_insumos
alter table acopios add column if not exists estado_insumos text check (estado_insumos in ('full', 'necesita'));
