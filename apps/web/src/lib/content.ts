import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";

export type Article = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  author: string;
  date: string;
  status: string; // "DRAFT" | "PUBLISHED"
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
  status: string; // "draft" | "published"
  downloadUrl: string;
  featured: boolean;
};

// --- JSON fallback (local dev without a database, or the one-time seed
// source read by scripts/db-seed.js) — the JSON files use the Spanish
// status labels the admin forms used before the DB migration.

const readJsonFile = <T>(fileName: string): T[] => {
  const filePath = path.join(process.cwd(), "data", fileName);
  if (!fs.existsSync(filePath)) return [] as T[];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T[];
  } catch {
    return [] as T[];
  }
};

const ARTICLE_STATUS_MAP: Record<string, string> = { publicado: "PUBLISHED", borrador: "DRAFT" };
const RESOURCE_STATUS_MAP: Record<string, string> = { publicado: "published", borrador: "draft" };

const getFallbackArticles = (): Article[] =>
  readJsonFile<Article>("articles.json").map((a) => ({ ...a, status: ARTICLE_STATUS_MAP[a.status] ?? a.status }));

const getFallbackResources = (): Resource[] =>
  readJsonFile<Resource>("resources.json").map((r) => ({ ...r, status: RESOURCE_STATUS_MAP[r.status] ?? r.status }));

// --- Real data (Prisma / Postgres) ---

const hasDb = () => Boolean(process.env.DATABASE_URL);

type ArticleRow = Awaited<ReturnType<typeof prisma.article.findMany>>[number] & {
  category: { label: string } | null;
};

const mapArticleRow = (row: ArticleRow): Article => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  description: row.description,
  category: row.category?.label ?? "General",
  author: row.author,
  date: (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10),
  status: row.status,
  featured: row.featured,
  tags: row.tags,
  seoTitle: row.seoTitle ?? row.title,
  metaDescription: row.metaDescription ?? row.description,
  content: row.content,
});

type ResourceRow = Awaited<ReturnType<typeof prisma.resource.findMany>>[number] & {
  category: { label: string } | null;
};

const mapResourceRow = (row: ResourceRow): Resource => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  category: row.category?.label ?? "General",
  type: row.type,
  label: row.label,
  description: row.description,
  status: row.status,
  downloadUrl: row.downloadUrl,
  featured: row.featured,
});

/** includeDrafts is only meant for admin views — the JSON fallback path always excludes drafts, since it has no session gating of its own to protect behind. */
export const getArticles = async ({ includeDrafts = false } = {}): Promise<Article[]> => {
  if (!hasDb()) {
    const items = getFallbackArticles();
    return includeDrafts ? items : items.filter((a) => a.status === "PUBLISHED");
  }

  try {
    const rows = await prisma.article.findMany({
      where: includeDrafts ? undefined : { status: "PUBLISHED" },
      include: { category: { select: { label: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapArticleRow);
  } catch {
    return [];
  }
};

export const getResources = async ({ includeDrafts = false } = {}): Promise<Resource[]> => {
  if (!hasDb()) {
    const items = getFallbackResources();
    return includeDrafts ? items : items.filter((r) => r.status === "published");
  }

  try {
    const rows = await prisma.resource.findMany({
      where: includeDrafts ? undefined : { status: "published" },
      include: { category: { select: { label: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapResourceRow);
  } catch {
    return [];
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
};

export const getResourceBySlug = async (slug: string): Promise<Resource | undefined> => {
  const resources = await getResources();
  return resources.find((resource) => resource.slug === slug);
};
