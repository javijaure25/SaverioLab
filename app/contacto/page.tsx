'use client'
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const PRIMARY = '#1a3a4a'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Enviar por Resend
    await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: PRIMARY }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <img
            src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
            alt="SaverioLab"
            className="h-8 brightness-0 invert"
          />
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="text-sm px-4 py-2 rounded-lg font-medium bg-white transition hover:bg-gray-100" style={{ color: PRIMARY }}>
              Crear Cuenta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">

          {enviado ? (
            <div className="text-center space-y-4 py-16">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold" style={{ color: PRIMARY }}>¡Mensaje enviado!</h2>
              <p className="text-gray-500">Gracias por contactarnos. Te responderemos lo antes posible.</p>
              <Link href="/" className="inline-block mt-4 text-sm font-medium hover:underline" style={{ color: PRIMARY }}>
                Volver al inicio
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h1 className="text-5xl font-bold tracking-tight mb-3" style={{ color: PRIMARY }}>CONTACTO</h1>
                <div className="w-16 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: '#22c55e' }} />
                <p className="text-gray-600 leading-relaxed text-sm max-w-md mx-auto">
                  Para todo tipo de preguntas, comentarios e inquietudes, estamos a tu entera disposición para 
                  resolverte dudas, agradecerte tus sugerencias, y más.
                </p>
                <p className="text-gray-600 text-sm mt-3 max-w-md mx-auto">
                  Por favor, completa el formulario a continuación para hacernos llegar lo que piensas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-gray-700 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Apellido <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.apellido}
                      onChange={e => setForm(p => ({ ...p, apellido: e.target.value }))}
                      required
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-gray-700 bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-gray-700 bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Escribe un mensaje <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.mensaje}
                    onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                    required
                    rows={4}
                    className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-gray-700 bg-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-700 transition disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}