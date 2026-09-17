import Link from "next/link";

const cards = [
  { title: "Mis recursos", description: "Recursos descargados y guardados" },
  { title: "Mis descargas", description: "Archivos y plantillas disponibles" },
  { title: "Mis favoritos", description: "Artículos y recursos guardados" },
  { title: "Mis intereses", description: "TDAH, sueño, crianza, emociones" },
  { title: "Mi cuenta", description: "Detalles del perfil" },
  { title: "Newsletter", description: "Estado de suscripción" },
];

export default function MiMimentehoyPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="soft-label">Mi MIMENTEHOY</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Tu espacio personal</h1>
        </div>
        <Link href="/" className="secondary-button">Cerrar sesión</Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="section-shell p-5">
            <h2 className="text-xl font-semibold text-stone-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{card.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
