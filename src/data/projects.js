// Catálogo de fotografías.
// Para reemplazar imágenes: coloca los archivos en /public/catalogo y usa rutas como '/catalogo/mi-foto.jpg'.
// `size` controla el tamaño de la tarjeta en la grilla: 'normal' | 'tall' | 'wide' | 'large'.
// `client` es opcional; si se indica, aparece en el visor.

const img = (seed, w = 1200, h = 1500) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const CATEGORIES = ['Panorámicas', 'Operarios', 'Producto', 'Ejecutivos', 'Eventos']

const INFO = {
  Panorámicas: {
    title: 'Panorámica de personal',
    description: 'Fotografía panorámica de equipos completos: todo tu personal en una sola imagen, nítida de extremo a extremo.',
    services: ['Panorámica', 'Foto grupal', 'Retoque'],
  },
  Operarios: {
    title: 'Operarios en planta',
    description: 'Retratos de colaboradores en su área de trabajo, para comunicación interna, reclutamiento y seguridad.',
    services: ['Retrato en locación', 'Procesos', 'Iluminación'],
  },
  Producto: {
    title: 'Fotografía de producto',
    description: 'Producto en estudio o en locación para catálogos, sitio web, empaques y presentaciones comerciales.',
    services: ['Still life', 'Estudio', 'Retoque'],
  },
  Ejecutivos: {
    title: 'Retrato ejecutivo',
    description: 'Retratos profesionales de directivos para informes anuales, prensa, LinkedIn y sitio corporativo.',
    services: ['Retrato', 'Iluminación de estudio', 'Retoque'],
  },
  Eventos: {
    title: 'Evento empresarial',
    description: 'Cobertura fotográfica de convenciones, aniversarios, lanzamientos y reuniones corporativas.',
    services: ['Cobertura', 'Foto de evento', 'Entrega express'],
  },
}

// Formatos de cada foto, en el orden del catálogo.
const LAYOUT = {
  Panorámicas: [
    ['wide', 1800, 800],
    ['wide', 1800, 800],
    ['wide', 1800, 800],
  ],
  Operarios: [
    ['tall', 1000, 1500],
    ['tall', 1000, 1500],
  ],
  Producto: [
    ['large', 1600, 1600],
    ['normal', 1200, 1200],
    ['normal', 1200, 1200],
    ['normal', 1200, 1200],
    ['normal', 1200, 1200],
  ],
  Ejecutivos: [
    ['tall', 1000, 1500],
    ['tall', 1000, 1500],
    ['tall', 1000, 1500],
  ],
  Eventos: [
    ['large', 1600, 1600],
    ['normal', 1200, 1200],
    ['wide', 1600, 900],
    ['normal', 1200, 1200],
    ['tall', 1000, 1500],
    ['normal', 1200, 1200],
    ['normal', 1200, 1200],
    ['wide', 1600, 900],
    ['normal', 1200, 1200],
    ['normal', 1200, 1200],
  ],
}

export const projects = CATEGORIES.flatMap((category) =>
  LAYOUT[category].map(([size, w, h], i) => {
    const id = `${category.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}-${i + 1}`
    const src = img(`click-${id}`, w, h)
    return {
      id,
      category,
      size,
      title: `${INFO[category].title} ${String(i + 1).padStart(2, '0')}`,
      cover: src,
      images: [src],
      description: INFO[category].description,
      services: INFO[category].services,
    }
  }),
)
