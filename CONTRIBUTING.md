# Contribuyendo a Dónde Ayudar Vzla

Gracias por tu interés en contribuir. Este proyecto busca conectar a personas que necesitan ayuda con quienes pueden ofrecerla en Venezuela.

## Cómo reportar issues

1. Verifica que el issue no haya sido reportado antes.
2. Usa el [buscador de issues](https://github.com/jvngarcia/dondeayudarvzla/issues) para revisar.
3. Crea un issue con:
   - Título descriptivo
   - Pasos para reproducir (si es un bug)
   - Comportamiento esperado vs actual
   - Screenshots si aplica
   - Información del navegador/dispositivo

## Cómo enviar un Pull Request

Trabajamos bajo **Git Flow**. Las ramas principales son:
- `main` — producción
- `develop` — integración de características

1. Haz fork del repositorio.
2. Crea una rama desde `develop` con nombre descriptivo:
   - `feature/nombre-de-la-funcionalidad`
   - `fix/nombre-del-bug`
   - `docs/mejora-documentacion`
3. Haz tus cambios siguiendo la guía de estilo.
4. Asegúrate de que el proyecto compila sin errores:
   ```bash
   npm run lint
   npm run build
   ```
5. Haz commit con mensajes descriptivos en español o inglés.
6. Abre un Pull Request contra la rama `develop`.
7. Describe tus cambios en el PR y referencia issues relacionados.

## Guía de estilo

- Usamos TypeScript con tipos explícitos.
- Componentes en `app/` siguen el App Router de Next.js 14.
- Componentes reutilizables van en `components/`.
- Tipos compartidos en `types/index.ts`.
- Tailwind CSS para estilos (sin CSS modules ni archivos .css adicionales).
- Preferimos componentes cliente (\"use client\") solo cuando es necesario.
- Funciones async con manejo de errores explícito.
- Nombres de variables en español o inglés, consistente con el archivo.

## Proceso de revisión

1. Un mantenedor revisará tu PR en máximo 7 días.
2. Puede solicitar cambios o ajustes.
3. Una vez aprobado, se mergeará a `develop`.

## Código de conducta

Sé respetuoso y constructivo. Este es un proyecto comunitario para ayudar a quienes más lo necesitan.
