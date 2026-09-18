'use client'
import React, { useState } from 'react'

export default function Hero({ title = 'Entenderles cambia la forma de ayudarles', subtitle = 'Recursos prácticos y fiables sobre TDAH, autismo, crianza y salud mental.' } : { title?: string, subtitle?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e)

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validateEmail(email)) {
      setMessage('Introduce un email válido')
      setStatus('error')
      return
    }
    setStatus('loading')
    setMessage(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (res.ok) {
        setStatus('success')
        setMessage('Gracias — ya estás suscrito. Revisa tu correo.')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setStatus('error')
        setMessage(data?.message || 'Error al suscribirte. Intenta más tarde.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Error de red. Intenta de nuevo.')
    }
  }

  return (
    <section className="hero rounded-2xl overflow-hidden mb-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[var(--text-900)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-700)]">{subtitle}</p>

        <form onSubmit={onSubmit} className="mt-4 flex gap-3">
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu mejor email"
            className="flex-1 rounded-lg px-3 py-2 border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            aria-label="email"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--brand-600)] text-white" disabled={status === 'loading'}>
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>

        {message && (
          <div className={`mt-3 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}

        <div className="mt-4">
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#009bb0] via-[#17aba3] to-[#fd9b10] text-white">Explorar</button>
        </div>
      </div>
    </section>
  )
}
