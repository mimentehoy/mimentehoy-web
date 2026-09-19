import fs from "fs";
import path from "path";

export type Article = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  date: string;
  status: string;
  featured: boolean;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  content: string;
};

export type Resource = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  label: string;
  description: string;
  status: string;
  downloadUrl: string;
  featured: boolean;
};

const readJsonFile = <T>(fileName: string): T[] => {
  const filePath = path.join(process.cwd(), "data", fileName);
  if (!fs.existsSync(filePath)) return [] as T[];

  try {
    const file = fs.readFileSync(filePath, "utf8");
    return JSON.parse(file) as T[];
  } catch {
    return [] as T[];
  }
};

export const getArticles = (): Article[] => readJsonFile<Article>("articles.json");
export const getResources = (): Resource[] => readJsonFile<Resource>("resources.json");

export const getArticleBySlug = (slug: string) =>
  getArticles().find((article) => article.slug === slug);

export const getResourceBySlug = (slug: string) =>
  getResources().find((resource) => resource.slug === slug);
