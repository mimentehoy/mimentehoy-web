import React from 'react'
import Hero from '../components/Hero'

export default function HomePage() {
  return (
    <div className="p-4">
      {/* HERO */}
      <Hero />

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
