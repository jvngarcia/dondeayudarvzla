-- Datos semilla: lugares de acopio confirmados
-- Reemplaza las coordenadas y datos con información real
-- NOTA: Después de la migración a recursos normalizados, los recursos deben insertarse primero en la tabla recursos
-- y luego asociarse mediante acopio_recursos.

INSERT INTO acopios (nombre, tipo, direccion, ciudad, estado, lat, lng, contacto, horario, status) VALUES
('Yummy - Sede Principal', 'organizacion', 'Av. Francisco de Miranda, Caracas', 'Caracas', 'Distrito Capital', 10.4961, -66.8436, '@yummyve (Instagram)', '9am - 5pm', 'aprobado'),
('Cruz Roja Venezolana', 'organizacion', 'Av. Andrés Bello, Caracas', 'Caracas', 'Distrito Capital', 10.4961, -66.8500, '(0212) 555-1234', '8am - 6pm', 'aprobado'),
('Gobernación de Miranda - Punto de Acopio', 'punto_fijo', 'Plaza Bolívar de Los Teques', 'Los Teques', 'Miranda', 10.3461, -67.0436, '0212-555-5678', '9am - 4pm', 'aprobado'),
('Alcaldía de Chacao - Centro de Acopio', 'punto_fijo', 'Plaza Bolívar de Chacao, Caracas', 'Caracas', 'Distrito Capital', 10.4961, -66.8536, '0212-555-9012', '8am - 5pm', 'aprobado'),
('Iglesia San José - Punto de Acopio', 'punto_fijo', 'Av. Principal de La Florida, Caracas', 'Caracas', 'Distrito Capital', 10.4961, -66.8736, '0412-555-3456', '10am - 6pm', 'aprobado');
