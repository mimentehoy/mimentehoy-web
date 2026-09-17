import Link from "next/link";
import { navItems } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#f8f3ee]/90 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="MIMENTEHOY home">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#201913] text-sm font-bold text-white">
            M
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              MIMENTEHOY
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-stone-700 transition hover:text-stone-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/newsletter" className="secondary-button hidden sm:inline-flex">
            Newsletter
          </Link>
          <Link href="/registro" className="primary-button">
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  );
}
