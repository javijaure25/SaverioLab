'use client'
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Recycle, FlaskConical, ArrowRight } from "lucide-react"
import Header from "@/components/Header"

const PRIMARY = '#1a3a4a'

function ContactoInline() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, apellido: '' }),
    })
    setLoading(false)
    setEnviado(true)
  }

  if (enviado) return (
    <div className="flex-1 text-center py-4">
      <p className="text-green-600 font-medium">✅ ¡Mensaje enviado! Te responderemos pronto.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex-1 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <textarea
        placeholder="¿En qué podemos ayudarte?"
        value={form.mensaje}
        onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
        required
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        style={{ backgroundColor: PRIMARY }}
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

export default function HomePage() {
  const cards = [
    {
      href: '/mision',
      icon: FlaskConical,
      title: 'Nuestra Misión',
      desc: 'Conoce quiénes somos, qué hacemos y por qué creemos en la economía circular aplicada a la impresión 3D.',
      cta: 'Descubrir',
      bg: '#e8f0f3',
      soon: false,
    },
    {
      href: '/filamentos',
      icon: null,
      title: 'Nuestros Filamentos',
      desc: 'Filamentos de alta calidad fabricados con material reciclado. Próximamente disponibles en nuestra tienda.',
      cta: 'Próximamente',
      bg: '#f0fdf4',
      soon: true,
    },
    {
      href: '/recogidas',
      icon: Recycle,
      title: 'Programa de Recogida',
      desc: 'Envíanos tus restos de impresión y conviértelos en descuento para tus próximas compras en nuestra tienda. 2€ por kg reciclado.',
      cta: 'Empezar a reciclar',
      bg: '#fef9c3',
      soon: false,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Header */}
     

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">

        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
            alt="SaverioLab"
            style={{ height: '200px' }}
            className="mb-4"
          />
          <p className="text-gray-400 text-sm tracking-widest uppercase">Filamentos · Reciclaje · Sostenibilidad</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              <Link
                href={card.href}
                className={`flex flex-col h-full bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all hover:-translate-y-1 ${card.soon ? 'opacity-75 pointer-events-none' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: card.bg }}>
                  {card.icon ? (
                    <card.icon className="w-6 h-6" style={{ color: PRIMARY }} />
                  ) : (
                    <span className="text-xl">🧵</span>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>{card.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{card.desc}</p>
                <div className="flex items-center gap-2 mt-6 text-sm font-semibold" style={{ color: card.soon ? '#9ca3af' : PRIMARY }}>
                  {card.cta}
                  {!card.soon && <ArrowRight className="w-4 h-4" />}
                  {card.soon && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-1">Próximamente</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contacto */}
        <div className="max-w-5xl w-full mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="rounded-2xl border bg-white shadow-lg p-8 flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>¿Tienes alguna duda?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Estamos aquí para ayudarte. Cuéntanos qué necesitas y te respondemos lo antes posible.
              </p>
            </div>
            <ContactoInline />
          </motion.div>
        </div>

      </main>

      <footer className="py-6 border-t text-center text-gray-400 text-xs">
  <div className="flex justify-center gap-4 mb-2">
    <Link href="/terminos" className="hover:text-gray-600">Términos</Link>
    <Link href="/privacidad" className="hover:text-gray-600">Privacidad</Link>
    <Link href="/cookies" className="hover:text-gray-600">Cookies</Link>
  </div>
  © {new Date().getFullYear()} SaverioLab. Todos los derechos reservados.
</footer>

    </div>
  )
}