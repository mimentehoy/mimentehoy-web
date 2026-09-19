"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "@/data/site";
import { getCurrentUser } from "@/lib/auth";

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getCurrentUser()));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-[#dfeaf0] bg-white/90 backdrop-blur-md">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="MIMENTEHOY home">
          <img src="/logo.png" alt="MIMENTEHOY" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <div className="text-xl font-black tracking-[-0.05em] text-[#001733]">mimentehoy</div>
            <div className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#334155]">
              <span className="h-px w-5 bg-gradient-to-r from-[#009bb0] to-[#ed4a6f]" />
              <span>Entiende tu mente</span>
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#334155] transition hover:text-[#001733]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={isLoggedIn ? "/mi-mimentehoy" : "/login"} className="secondary-button inline-flex">
            {isLoggedIn ? "Mi cuenta" : "Iniciar sesión"}
          </Link>
          <Link href={isLoggedIn ? "/mi-mimentehoy" : "/registro"} className="primary-button">
            {isLoggedIn ? "Cuenta" : "Crear cuenta"}
          </Link>
        </div>
      </div>
    </header>
  );
}
