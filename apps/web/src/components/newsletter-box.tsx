export function NewsletterBox() {
  return (
    <div className="section-shell bg-[#efe4d7] p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
        <div>
          <span className="soft-label">Newsletter</span>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Recibe ideas útiles cada semana</h3>
          <p className="mt-2 max-w-lg text-sm leading-6 text-stone-700">
            Mensajes sencillos, claros y útiles para familias que buscan soluciones reales sin ruido.
          </p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
          <input
            type="email"
            placeholder="Tu email"
            className="h-12 flex-1 rounded-full border border-stone-300 bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-stone-500"
            aria-label="Email"
          />
          <button type="submit" className="primary-button h-12 min-w-[140px]">
            Suscribirme
          </button>
        </form>
      </div>
    </div>
  );
}
