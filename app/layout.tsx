import React from 'react'
import '../styles/globals.css'

export const metadata = {
  title: 'MIMENTEHOY',
  description: 'Entiende tu mente · Mejora tu vida'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[var(--bg)] text-[var(--text-700)]">
        <header className="max-w-xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="mimentehoy" className="w-10 h-10" />
            <span className="font-semibold text-[var(--text-900)] text-lg">mimentehoy</span>
          </div>
        </header>
        <main className="min-h-screen max-w-xl mx-auto">{children}</main>
        <footer className="p-6 text-center text-sm text-muted">© {new Date().getFullYear()} MIMENTEHOY</footer>
      </body>
    </html>
  )
}
