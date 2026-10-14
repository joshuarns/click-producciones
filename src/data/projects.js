// Portafolio de fotografías.
// Las imágenes web viven en /public/portafolio y se generan desde los originales con
// `scripts/optimize-portfolio.sh` (cada foto tiene una versión `-thumb` para la grilla).
// Cada proyecto es una tarjeta; si tiene varias fotos, se recorren en el visor.
// `size` controla el tamaño de la tarjeta en la grilla: 'normal' | 'tall' | 'wide' | 'large'.
// `client` es opcional; si se indica, aparece en el visor.

export const CATEGORIES = ['Panorámicas', 'Operarios', 'Producto', 'Ejecutivos', 'Eventos']

const INFO = {
  Panorámicas: {
    folder: 'panoramicas',
    title: 'Panorámica de personal',
    description: 'Fotografía panorámica de equipos completos: todo tu personal en una sola imagen, nítida de extremo a extremo.',
    services: ['Panorámica', 'Foto grupal', 'Retoque'],
  },
  Operarios: {
    folder: 'operarios',
    title: 'Operarios en planta',
    description: 'Retratos de colaboradores en su área de trabajo, para comunicación interna, reclutamiento y seguridad.',
    services: ['Retrato en locación', 'Procesos', 'Iluminación'],
  },
  Producto: {
    folder: 'producto',
    title: 'Fotografía de producto',
    description: 'Producto en estudio o en locación para catálogos, sitio web, empaques y presentaciones comerciales.',
    services: ['Still life', 'Estudio', 'Retoque'],
  },
  Ejecutivos: {
    folder: 'ejecutivos',
    title: 'Retrato ejecutivo',
    description: 'Retratos profesionales de directivos para informes anuales, prensa, LinkedIn y sitio corporativo.',
    services: ['Retrato', 'Iluminación de estudio', 'Retoque'],
  },
  Eventos: {
    folder: 'eventos',
    title: 'Evento empresarial',
    description: 'Cobertura fotográfica de convenciones, aniversarios, lanzamientos y reuniones corporativas.',
    services: ['Cobertura', 'Foto de evento', 'Entrega express'],
  },
}

// Fotos de cada categoría, en el orden del portafolio.
// `photos` son los nombres de archivo (sin extensión) dentro de /public/portafolio/<carpeta>.
const ITEMS = {
  Panorámicas: [
    { size: 'wide', client: 'Signify', photos: ['20x40-signify-2'] },
    { size: 'wide', client: 'Oxford', photos: ['20x40-oxford-administrativa-1'] },
    { size: 'wide', client: 'IDEAL', photos: ['a-1416-ideal'] },
    { size: 'wide', client: 'Relpisa', photos: ['a-1886-relpisa-op2-20x30', 'a-1886-30x20-opcion-2-relpisa'] },
    { size: 'wide', client: 'HPS', photos: ['hps-20x30-final', 'hps-latam-11x20'] },
    { size: 'wide', client: 'Beckers', photos: ['a-1813-beckers-11x16', 'a-1797-beckers-11x16-1'] },
    { size: 'wide', client: 'Kabla', photos: ['a-1289-kabla-11x16'] },
    { size: 'wide', client: 'RediColor', photos: ['c-3035-redicolor-20x30-2'] },
    { size: 'wide', client: 'Plomaq', photos: ['plomaq-1-op2', 'plomaq-2-op2'] },
  ],
  Operarios: [
    { size: 'wide', photos: ['proyecto-0003-12'] },
    { size: 'normal', photos: ['proyecto-0004-11'] },
    { size: 'normal', photos: ['proyecto-0005-10'] },
    { size: 'large', photos: ['proyecto-0007-8'] },
    { size: 'normal', photos: ['proyecto-0006-9'] },
    { size: 'normal', photos: ['proyecto-0008-7'] },
    { size: 'normal', photos: ['proyecto-0009-6'] },
    { size: 'wide', photos: ['proyecto-0010-5'] },
    { size: 'normal', photos: ['proyecto-0011-4'] },
    { size: 'normal', photos: ['proyecto-0012-3'] },
    { size: 'wide', photos: ['proyecto-0013-2'] },
    { size: 'normal', photos: ['proyecto-0014-1'] },
  ],
  Producto: [
    { size: 'large', photos: range('c2e0050pr-', 8) },
    { size: 'wide', photos: range('c2g1500mqmj-', 8) },
    { size: 'wide', photos: range('c2m0075mli-', 8) },
    { size: 'wide', photos: range('c2e0250mqmj-', 8) },
    {
      size: 'wide',
      photos: ['c2g0250mqmj-1', 'c2g0250mqmj-2', 'c2g025mqmj-3', 'c2g0250mqmj-4', 'c2g0250mqmj-5', 'c2g0250mqmj-6', 'c2g0250mqmj-7', 'c2g0250mqmj-8'],
    },
  ],
  Ejecutivos: [
    { size: 'wide', photos: ['clickprod-10'] },
    { size: 'wide', photos: ['clickprod-11'] },
    { size: 'normal', photos: ['clickprod-24'] },
    { size: 'normal', photos: ['clickprod-25'] },
    { size: 'wide', photos: ['clickprod-26'] },
  ],
  Eventos: [
    { size: 'large', photos: ['empresarial-4-2'] },
    { size: 'wide', photos: ['9c4a3784-copy'] },
    { size: 'normal', photos: ['empresarial-5'] },
    { size: 'normal', photos: ['9c4a3591-copy'] },
    { size: 'wide', photos: ['empresarial-6'] },
  ],
}

function range(prefix, n) {
  return Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`)
}

export const projects = CATEGORIES.flatMap((category) => {
  const { folder, title, description, services } = INFO[category]
  return ITEMS[category].map(({ size, client, photos }, i) => {
    const path = (name) => `/portafolio/${folder}/${name}`
    return {
      id: `${folder}-${i + 1}`,
      category,
      size,
      client,
      title: client ? `${title} · ${client}` : `${title} ${String(i + 1).padStart(2, '0')}`,
      cover: `${path(photos[0])}-thumb.webp`,
      images: photos.map((name) => `${path(name)}.webp`),
      description,
      services,
    }
  })
})
