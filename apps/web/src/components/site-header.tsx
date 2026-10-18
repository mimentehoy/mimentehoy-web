import Link from "next/link";
import { navItems } from "@/data/site";

function BagIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7V6a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

export function SiteHeader() {
  const secondaryItems = navItems.filter((item) => item.href !== "/tienda");

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfeaf0] bg-white/90 backdrop-blur-md print:hidden">
      <div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="MIMENTEHOY home">
          <img src="/logo.png" alt="MIMENTEHOY" className="h-9 w-9 shrink-0 rounded-lg object-cover sm:h-10 sm:w-10" />
          <div className="min-w-0">
            <div className="text-lg font-black tracking-[-0.05em] text-[#001733] sm:text-xl">mimentehoy</div>
            <div className="mt-0.5 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#334155] min-[380px]:flex">
              <span className="h-px w-5 bg-gradient-to-r from-[#009bb0] to-[#ed4a6f]" />
              <span>Entiende tu mente</span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {secondaryItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#334155] transition hover:text-[#001733]">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Tienda: always visible, on mobile and desktop */}
        <Link
          href="/tienda"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008aa0]"
        >
          <BagIcon />
          Tienda
        </Link>
      </div>

      {/* Mobile nav row: everything reachable without scrolling to the footer */}
      <nav className="border-t border-[#eef3f6] md:hidden" aria-label="Menú principal">
        <div className="container-shell flex gap-1 overflow-x-auto py-2 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/tienda"
                  ? "shrink-0 rounded-full bg-[#fff1e8] px-3 py-1.5 font-semibold text-[#7a4a35]"
                  : "shrink-0 rounded-full px-3 py-1.5 font-medium text-[#334155] hover:bg-[#f7fafb]"
              }
            >
              {item.href === "/tienda" ? "Libros y kits" : item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
