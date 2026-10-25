export const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Noticias", href: "/noticias" },
  {
    label: "Herramientas",
    href: "/herramientas",
    children: [
      { label: "Autismo", href: "/herramientas/autismo" },
      { label: "TDAH", href: "/herramientas/tdah" },
      { label: "Alzhéimer", href: "/herramientas/alzheimer" },
    ],
  },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Tienda", href: "/tienda" },
];

export const categories = [
  "TDAH",
  "Autismo",
  "Crianza",
  "Sueño",
  "Emociones",
  "Colegio",
  "Rutinas",
  "Comportamiento",
];

export const weeklyHighlights = [
  {
    title: "Cómo apoyar una rutina sin conflictos",
    category: "Rutinas",
    summary: "Ideas sencillas para crear hábitos que no se vuelvan una guerra cada mañana.",
  },
  {
    title: "Recursos para la mañana escolar",
    category: "Colegio",
    summary: "Checklist visual para reducir la carga mental de la entrada al cole.",
  },
  {
    title: "Qué hacer cuando la casa está colapsada",
    category: "Crianza",
    summary: "Un enfoque práctico para ordenar la energía familiar sin culpas.",
  },
];

export const featuredArticles = [
  {
    title: "La estructura ayuda más que la perfección",
    category: "TDAH",
    readTime: "5 min",
    description: "Cuándo la previsibilidad reduce la ansiedad y aumenta la autonomía.",
  },
  {
    title: "Cómo hablar de emociones sin dramatizar",
    category: "Emociones",
    readTime: "6 min",
    description: "Un marco claro para acompañar a los niños sin convertir cada emoción en un conflicto.",
  },
  {
    title: "Rutinas que no se rompen con un mal día",
    category: "Hábitos",
    readTime: "4 min",
    description: "Pequeños ajustes que hacen que la vida diaria sea más fluida y menos exigente.",
  },
];

export const resources = [
  {
    title: "Checklist de inicio de semana",
    category: "Rutinas",
    type: "PDF",
    label: "Gratis",
    description: "Un recordatorio visual para empezar la semana con menos ruido y más claridad.",
  },
  {
    title: "Mini guía de sueño",
    category: "Sueño",
    type: "Imprimible",
    label: "Premium",
    description: "Pequeños cambios para apoyar la transición a la noche.",
  },
];


export type ProductCard = {
  title: string;
  subtitle: string;
  slug: string;
  price: string;
  tag: "Libro" | "Kit";
  topic: "Autismo" | "TDAH";
  image: string;
  isNew?: boolean;
  summary: string;
  description: string[];
  includes: string[];
  format: string;
  shopifyUrl: string;
  companionSlug?: string;
};

const SHOPIFY_STORE = "https://mimentehoy.myshopify.com";

export const shopifyStoreUrl = SHOPIFY_STORE;

export const productCards: ProductCard[] = [
  {
    title: "El idioma de tu hijo",
    subtitle: "Guía práctica para entender y acompañar a tu hijo autista",
    slug: "el-idioma-de-tu-hijo",
    price: "12,95 €",
    tag: "Libro",
    topic: "Autismo",
    image: "https://cdn.shopify.com/s/files/1/1034/2521/2793/files/el-idioma-de-tu-hijo-portada.jpg",
    isNew: true,
    summary:
      "Tu hijo no está roto. Habla otro idioma. Una guía para observar con calma, entender qué hay detrás de cada conducta y probar apoyos concretos.",
    description: [
      "A veces tu hijo se expresa con gestos, con movimiento, con silencios o con una crisis que parece salir de la nada. Este libro te ayuda a traducirlo: a observar antes de juzgar, a entender qué hay detrás de cada conducta y a probar apoyos que muchas familias encuentran útiles.",
      "Una guía práctica y basada en la evidencia para madres, padres y cuidadores de niños autistas: 47 capítulos cortos en 8 partes que no hace falta leer en orden. Si hoy te preocupa el sueño o las crisis, empiezas por ahí.",
    ],
    includes: [
      "47 capítulos cortos: diagnóstico, comunicación, vida en casa, colegio, sueño, comida y crisis",
      "Sello de evidencia en las estrategias importantes",
      "Recuadros «Pruébalo hoy», «Qué puedes decir» y «Perspectiva autista»",
      "Diccionario del idioma de tu hijo: conductas frecuentes y lo que pueden estar diciendo",
      "Un capítulo para cuidar a quien cuida",
    ],
    format: "PDF (188 páginas) + EPUB · Descarga inmediata",
    shopifyUrl: `${SHOPIFY_STORE}/products/el-idioma-de-tu-hijo`,
    companionSlug: "kit-plantillas-el-idioma-de-tu-hijo",
  },
  {
    title: "Kit de plantillas · El idioma de tu hijo",
    subtitle: "22 plantillas para el día a día con tu hijo autista",
    slug: "kit-plantillas-el-idioma-de-tu-hijo",
    price: "3,99 €",
    tag: "Kit",
    topic: "Autismo",
    image: "https://cdn.shopify.com/s/files/1/1034/2521/2793/files/kit-plantillas-autismo-portada.jpg",
    isNew: true,
    summary:
      "Lo que tienes que recordar, explicar o anotar, puesto en papel para que tu hijo, el colegio y los profesionales hablen el mismo «idioma».",
    description: [
      "22 plantillas prácticas para el día a día con un niño autista: rutinas visuales, comunicación, crisis, colegio, sueño, comida y consultas.",
      "Cada plantilla remite al capítulo de «El idioma de tu hijo» donde se explica cómo usarla. Rellénalas en pantalla o imprímelas y complétalas a mano.",
    ],
    includes: [
      "Mi hijo en una página, para el colegio y los profesionales",
      "Rutinas de mañana y noche, primero-después y aviso de cambio",
      "Perfil sensorial orientativo y registro de sobrecarga",
      "Mapa y tablero básico de comunicación",
      "Guía de uso incluida y licencia para compartir con el colegio",
    ],
    format: "PDF A4 a color (26 páginas), rellenable · Descarga inmediata",
    shopifyUrl: `${SHOPIFY_STORE}/products/kit-plantillas-el-idioma-de-tu-hijo`,
    companionSlug: "el-idioma-de-tu-hijo",
  },
  {
    title: "No es que no quiera",
    subtitle: "Guía práctica para padres de niños con TDAH",
    slug: "no-es-que-no-quiera",
    price: "9,90 €",
    tag: "Libro",
    topic: "TDAH",
    image: "/images/products/no-es-que-no-quiera.png",
    summary:
      "No lo hace a propósito. Entiende qué hay detrás cuando tu hijo con TDAH no hace lo que le pides y qué respuesta necesita cada situación.",
    description: [
      "Cuando un niño no hace lo que le pides hay al menos cuatro situaciones distintas detrás: no quiere, no sabe, no puede todavía o necesita otra estructura. Y cada una necesita una respuesta diferente.",
      "Una guía práctica con base científica para madres, padres y cuidadores de niños con TDAH: 35 capítulos cortos, escritos para leer diez minutos antes de caer redondo, con referencias para que puedas ir a la fuente.",
    ],
    includes: [
      "35 capítulos cortos que no hace falta leer en orden",
      "Qué es el TDAH, qué pasa en su cerebro y doce mitos",
      "Estrategias para casa y el colegio con su referencia científica",
      "Complemento opcional: Kit para padres con 16 láminas",
    ],
    format: "PDF (138 páginas) + EPUB · Descarga inmediata",
    shopifyUrl: `${SHOPIFY_STORE}/products/no-es-que-no-quiera`,
    companionSlug: "kit-para-padres",
  },
  {
    title: "Kit para padres",
    subtitle: "16 láminas imprimibles para el día a día con TDAH",
    slug: "kit-para-padres",
    price: "2,99 €",
    tag: "Kit",
    topic: "TDAH",
    image: "/images/products/kit-para-padres.png",
    summary:
      "Las herramientas de «No es que no quiera», en papel: 16 láminas A4 para imprimir, colgar en la puerta y rellenar a mano.",
    description: [
      "Una rutina visual dentro de un ebook no sirve de nada: hay que imprimirla y pegarla en la puerta. Para eso es este kit.",
      "16 láminas en A4 pensadas para el día a día en casa con un niño con TDAH. Se puede usar solo o como complemento del libro.",
    ],
    includes: [
      "Rutinas de mañana, vuelta del colegio y noche",
      "Tabla semanal y sistema de puntos",
      "Planificador de deberes y preparación de la mochila",
      "Acuerdo de pantallas y semáforo emocional",
      "Doce frases para la nevera",
    ],
    format: "PDF A4 imprimible · Descarga inmediata",
    shopifyUrl: `${SHOPIFY_STORE}/products/kit-para-padres`,
    companionSlug: "no-es-que-no-quiera",
  },
];

export const metrics = [
  { label: "Artículos", value: "120+" },
  { label: "Recursos", value: "35" },
  { label: "Newsletter", value: "8k" },
  { label: "Familias", value: "100%" },
];
