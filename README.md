# Click Producciones — One page

Sitio one page con galería de proyectos. React 19 + Vite + [Motion](https://motion.dev).

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera /dist para publicar
```

## Editar contenido

| Qué | Dónde |
| --- | --- |
| Proyectos de la galería (título, cliente, año, categoría, imágenes, descripción) | `src/data/projects.js` |
| Categorías de los filtros | `CATEGORIES` en `src/data/projects.js` |
| Correo, teléfono, redes, estadísticas, servicios, clientes | `src/data/site.js` |
| Colores y tipografías | variables en `:root` de `src/index.css` |

**Imágenes reales:** colocarlas en `public/proyectos/` y referenciarlas como `'/proyectos/archivo.jpg'`.
Recomendado: WebP/JPG de ~1600px de lado mayor y < 400 KB. Las actuales son placeholders de picsum.photos.

**Tamaño de tarjeta:** el campo `size` de cada proyecto (`normal`, `tall`, `wide`, `large`) arma la grilla tipo bento.

## Estructura

```
src/
  components/   Nav, Hero, Gallery, ProjectCard, Lightbox, About, Contact, Footer
  data/         contenido editable
  hooks/        useLockBody (bloqueo de scroll en modales)
```

## UX incluida

- Filtros animados con contador por categoría
- Visor (lightbox): teclado (← → Esc), swipe en móvil, miniaturas, salto al proyecto anterior/siguiente, precarga de imágenes
- Cursor "Ver" personalizado en desktop, info siempre visible en táctiles
- Accesibilidad: foco atrapado en el visor y devuelto al cerrar, `aria-*`, `prefers-reduced-motion`
- Barra de progreso de scroll, menú móvil a pantalla completa, skeleton de carga en imágenes
