// One-time-per-row seed: imports the original JSON content (data/articles.json,
// data/resources.json) into the real database, but only for slugs that don't
// exist yet. Safe to run on every build — once a row exists, this never
// touches it again, so real edits made through the admin panel are never
// reverted by a later deploy.

const fs = require("fs");
const path = require("path");

const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DB_URL;

if (!databaseUrl) {
  console.log("[db-seed] No DATABASE_URL / NETLIFY_DB_URL set — skipping seed.");
  process.exit(0);
}

process.env.DATABASE_URL = databaseUrl;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const slugify = (value) =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ARTICLE_STATUS_MAP = { publicado: "PUBLISHED", borrador: "DRAFT" };
const RESOURCE_STATUS_MAP = { publicado: "published", borrador: "draft" };

const readJson = (fileName) => {
  const file = path.join(__dirname, "..", "data", fileName);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
};

async function seedArticles() {
  const items = readJson("articles.json");
  let created = 0;

  for (const item of items) {
    const slug = slugify(item.slug || item.title);
    const exists = await prisma.article.findUnique({ where: { slug } });
    if (exists) continue;

    const status = ARTICLE_STATUS_MAP[item.status] || item.status || "DRAFT";
    const categoryLabel = item.category || "General";

    await prisma.article.create({
      data: {
        slug,
        title: item.title,
        description: item.description,
        author: item.author || "MIMENTEHOY",
        status,
        featured: Boolean(item.featured),
        tags: Array.isArray(item.tags) ? item.tags : [],
        seoTitle: item.seoTitle || item.title,
        metaDescription: item.metaDescription || item.description,
        content: item.content || "",
        publishedAt: status === "PUBLISHED" ? new Date(item.date || Date.now()) : null,
        category: {
          connectOrCreate: {
            where: { slug: slugify(categoryLabel) },
            create: { slug: slugify(categoryLabel), label: categoryLabel },
          },
        },
      },
    });
    created += 1;
  }

  return created;
}

async function seedResources() {
  const items = readJson("resources.json");
  let created = 0;

  for (const item of items) {
    const slug = slugify(item.slug || item.title);
    const exists = await prisma.resource.findUnique({ where: { slug } });
    if (exists) continue;

    const status = RESOURCE_STATUS_MAP[item.status] || item.status || "published";
    const categoryLabel = item.category || "General";

    await prisma.resource.create({
      data: {
        slug,
        title: item.title,
        description: item.description,
        type: item.type || "PDF",
        label: item.label || "Gratis",
        status,
        downloadUrl: item.downloadUrl || "/downloads/default.pdf",
        featured: Boolean(item.featured),
        category: {
          connectOrCreate: {
            where: { slug: slugify(categoryLabel) },
            create: { slug: slugify(categoryLabel), label: categoryLabel },
          },
        },
      },
    });
    created += 1;
  }

  return created;
}

(async () => {
  try {
    const [articlesCreated, resourcesCreated] = [await seedArticles(), await seedResources()];
    console.log(`[db-seed] Done. Articles created: ${articlesCreated}. Resources created: ${resourcesCreated}.`);
    process.exit(0);
  } catch (error) {
    console.error("[db-seed] Failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
