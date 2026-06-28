-- Migración: Agregar tabla recursos y acopio_recursos, eliminar que_reciben

-- 1.1 Crear tabla recursos
create table recursos (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null unique,
  descripcion   text,
  categoria     text not null check (categoria in ('medico', 'higiene', 'alimento', 'vestimenta', 'refugio', 'otro'))
);

-- 1.2 Crear tabla pivote acopio_recursos
create table acopio_recursos (
  acopio_id     uuid not null references acopios(id) on delete cascade,
  recurso_id    uuid not null references recursos(id) on delete cascade,
  primary key (acopio_id, recurso_id)
);

create index idx_acopio_recursos_acopio on acopio_recursos (acopio_id);
create index idx_acopio_recursos_recurso on acopio_recursos (recurso_id);

-- 1.3 Agregar columna edit_token
alter table acopios add column if not exists edit_token text;

-- 1.4 Poblar tabla recursos con seed inicial
insert into recursos (nombre, descripcion, categoria) values
  ('Agua', 'Agua potable embotellada o envasada', 'alimento'),
  ('Comida', 'Comida no perecedera, enlatados, pastas, arroz', 'alimento'),
  ('Ropa', 'Ropa en buen estado para todas las edades', 'vestimenta'),
  ('Medicinas', 'Medicamentos de venta libre y recetados', 'medico'),
  ('Higiene', 'Productos de higiene personal: jabón, pasta dental, etc.', 'higiene'),
  ('Cobijas', 'Cobijas, mantas, frazadas', 'refugio'),
  ('Voluntarios', 'Personas dispuestas a ayudar en labores logísticas', 'otro'),
  ('Pañales adulto', 'Pañales desechables para adultos', 'higiene'),
  ('Vasos humificados', 'Vasos humificadores o humidificadores', 'medico'),
  ('Centros de cama', 'Centros de cama desechables o reutilizables', 'medico'),
  ('Yodo', 'Solución de yodo para desinfección', 'medico'),
  ('Bambene', 'Vendas Bambene (venda elástica adhesiva)', 'medico'),
  ('Vendas 15cm', 'Vendas de gasa de 15 centímetros', 'medico'),
  ('Vendas 20cm', 'Vendas de gasa de 20 centímetros', 'medico'),
  ('Macrogoteros', 'Macrogoteros para administración de líquidos intravenosos', 'medico'),
  ('Gasas', 'Gasas estériles para curación', 'medico'),
  ('Alcohol', 'Alcohol antiséptico', 'medico'),
  ('Guantes', 'Guantes de látex o nitrilo desechables', 'medico'),
  ('Jeringas', 'Jeringas desechables', 'medico'),
  ('Algodón', 'Algodón hidrófilo', 'medico'),
  ('Esparadrapo', 'Esparadrapo para fijar vendajes', 'medico'),
  ('Suero', 'Suero fisiológico', 'medico');

-- 1.5 Migrar datos de que_reciben a acopio_recursos
do $$
declare
  acopio_rec record;
  recurso_nombre text;
  recurso_id uuid;
begin
  for acopio_rec in select id, que_reciben from acopios where array_length(que_reciben, 1) > 0 loop
    foreach recurso_nombre in array acopio_rec.que_reciben loop
      -- Buscar recurso por nombre (case-insensitive)
      select id into recurso_id from recursos where lower(nombre) = lower(trim(recurso_nombre));
      
      -- Si no existe, insertarlo automáticamente
      if recurso_id is null then
        insert into recursos (nombre, descripcion, categoria)
        values (trim(recurso_nombre), null, 'otro')
        returning id into recurso_id;
      end if;
      
      -- Insertar relación
      begin
        insert into acopio_recursos (acopio_id, recurso_id) values (acopio_rec.id, recurso_id);
      exception when unique_violation then
        -- Ya existe la relación, ignorar
      end;
    end loop;
  end loop;
end;
$$;

-- 1.6 Eliminar columna que_reciben
alter table acopios drop column if exists que_reciben;

-- 1.7 Generar edit_token para acopios existentes
update acopios
set edit_token = upper(substr(md5(random()::text), 1, 6))
where edit_token is null;

-- RLS para tabla recursos: lectura pública
alter table recursos enable row level security;
create policy "Lectura pública de recursos"
  on recursos for select
  using (true);

-- RLS para tabla acopio_recursos: lectura pública
alter table acopio_recursos enable row level security;
create policy "Lectura pública de acopio_recursos"
  on acopio_recursos for select
  using (true);

-- RLS para acopio_recursos: admin puede todo
create policy "Admin full access acopio_recursos"
  on acopio_recursos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
