import Link from "next/link";

export default function RegistroPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-xl section-shell p-6 sm:p-8">
        <span className="soft-label">Registro</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Crea tu cuenta</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Empieza con lo básico: nombre, email y contraseña.</p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Nombre</label>
            <input type="text" className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
            <input type="email" className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">Contraseña</label>
            <input type="password" className="h-12 w-full rounded-full border border-stone-300 bg-white px-4 outline-none focus:border-stone-500" />
          </div>
          <button type="submit" className="primary-button w-full">Crear cuenta</button>
        </form>

        <div className="mt-5 text-center text-sm text-stone-600">
          ¿Ya tienes cuenta? <Link href="/login" className="font-semibold text-[#7a4a35]">Inicia sesión</Link>
        </div>
      </div>
    </main>
  );
}
