import React from 'react'

export default function HomePage() {
  return (
    <div className="p-4">
      {/* HERO */}
      <section className="hero rounded-2xl overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[var(--text-900)]">Entenderles cambia la forma de ayudarles</h1>
          <p className="mt-2 text-sm text-[var(--text-700)]">Recursos prácticos y fiables sobre TDAH, autismo, crianza y salud mental.</p>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-[var(--brand-600)] text-white">Suscribirme</button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#009bb0] via-[#17aba3] to-[#fd9b10] text-white">Explorar</button>
          </div>
        </div>
      </section>

      {/* LO NUEVO ESTA SEMANA */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Lo nuevo esta semana</h2>
        <div className="space-y-3">
          <article className="p-3 bg-[var(--bg-alt)] rounded-lg">Artículo destacado (placeholder)</article>
          <article className="p-3 bg-[var(--bg-alt)] rounded-lg">Recurso gratuito (placeholder)</article>
          <article className="p-3 bg-[var(--bg-alt)] rounded-lg">Herramienta destacada (placeholder)</article>
        </div>
      </section>

      {/* EXPLORA */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Explora</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-white rounded-lg text-center">TDAH</div>
          <div className="p-2 bg-white rounded-lg text-center">Autismo</div>
          <div className="p-2 bg-white rounded-lg text-center">Crianza</div>
          <div className="p-2 bg-white rounded-lg text-center">Sueño</div>
          <div className="p-2 bg-white rounded-lg text-center">Emociones</div>
          <div className="p-2 bg-white rounded-lg text-center">Hábitos</div>
        </div>
      </section>

      {/* RECURSOS, HERRAMIENTAS, NEWSLETTER, TIENDA (placeholders) */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recursos gratuitos</h2>
        <div className="p-3 bg-[var(--bg-alt)] rounded-lg">Lista de recursos (placeholder)</div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Herramientas</h2>
        <div className="p-3 bg-[var(--bg-alt)] rounded-lg">Herramientas (placeholder)</div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Newsletter</h2>
        <div className="p-3 bg-[var(--bg-alt)] rounded-lg">Bloque de suscripción (placeholder)</div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Productos MIMENTEHOY</h2>
        <div className="p-3 bg-[var(--bg-alt)] rounded-lg">Tienda / productos (placeholder)</div>
      </section>
    </div>
  )
}
