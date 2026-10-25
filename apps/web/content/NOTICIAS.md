# Publicar noticias

Cada artículo se guarda en `content/noticias/` como `slug.md`. Las páginas, la home, el sitemap y el RSS se actualizan en el siguiente despliegue. Los cuatro artículos iniciales permiten probar el listado y los tres relacionados; pueden sustituirse por contenido editorial definitivo.

```yaml
---
titulo: "Título del artículo"
slug: titulo-del-articulo
fecha: "2026-10-25"
descripcion: "Entradilla y descripción para buscadores."
categoria: Crianza
etiquetas: [familias, emociones]
tiempo_lectura: "4 min"
prompt_imagen: "Descripción interna para preparar una portada."
# Opcional: archivo existente en public/noticias/
imagen: /noticias/mi-portada.jpg
---
```

Escribe el cuerpo en Markdown debajo de la cabecera. Se admiten títulos, listas, enlaces, citas y tablas; no se ejecuta HTML incrustado. Omite `imagen` para utilizar la portada por categoría (verde azulado para TDAH, Rutinas y Colegio; verde salvia para Autismo, Emociones y Sueño; terracota para las demás).

`fecha` representa la fecha de publicación o última actualización que se muestra al lector. Actualízala cuando revises el texto. `prompt_imagen` es obligatorio y privado: no se envía al navegador. Las notas que empiezan en una línea con `CONTROL DE CALIDAD` se eliminan hasta el final del archivo antes de procesar el Markdown.

La ruta y el campo `slug` deben coincidir. Las portadas personalizadas deben estar en `public/noticias/` y usar PNG, JPG, WebP o AVIF. Una cabecera inválida detiene la generación con un mensaje que identifica el archivo. Los relacionados priorizan categoría y etiquetas compartidas, completando con los artículos más recientes cuando es necesario.
