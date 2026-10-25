import type { MetadataRoute } from "next";
import { getNews } from "@/lib/noticias";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mimentehoy.com";

  return [
    { url: `${baseUrl}/noticias`, changeFrequency: "weekly", priority: 0.9 },
    ...getNews().map((article) => ({ url: `${baseUrl}/noticias/${article.slug}`, lastModified: new Date(`${article.fecha}T00:00:00Z`), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/articulos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/recursos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/herramientas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/registro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
