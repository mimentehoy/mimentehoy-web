import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceBySlug, getResources } from "@/lib/content";
import { FavoriteButton } from "@/components/favorite-button";
import { TrackedDownloadLink } from "@/components/tracked-download-link";

export async function generateStaticParams() {
  const resources = await getResources();
  return resources.map((resource) => ({ slug: resource.slug }));
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/recursos" className="text-sm font-medium text-[#0f7290]">
          ← Volver a recursos
        </Link>

        <div className="mt-6 section-shell p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="soft-label">{resource.category}</span>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700">
              {resource.label}
            </span>
          </div>

          <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{resource.type}</div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {resource.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-stone-600">{resource.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedDownloadLink resourceId={resource.id} href={resource.downloadUrl}>
              Descargar recurso
            </TrackedDownloadLink>
            <a href="https://mimentehoy.myshopify.com/products/kit-para-padres?utm_source=tiktok&utm_medium=social&utm_campaign=perfil" className="secondary-button" target="_blank" rel="noreferrer">
              Ver kit para padres
            </a>
            <FavoriteButton targetType="resource" targetId={resource.id} />
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-5 text-sm leading-7 text-stone-700">
            <p>
              Este material está pensado para usarse en la vida real: como apoyo visual, guía de conversación o
              recordatorio útil para los momentos más exigentes del día.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
