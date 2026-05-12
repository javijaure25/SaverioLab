'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, Plus, Trash2, Info } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const PRIMARY = '#1a3a4a'

interface Paquete {
  material_type: string
  estimated_kg: string
  largo: string
  ancho: string
  alto: string
}

const emptyPaquete = (): Paquete => ({
  material_type: '',
  estimated_kg: '',
  largo: '',
  ancho: '',
  alto: '',
})

function TruckAnimation() {
  const duration = 3.5 // segundos totales

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ backgroundColor: PRIMARY }}>
      <motion.div
        className="flex flex-col items-center gap-8 w-80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Texto */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">¡Solicitud enviada!</h2>
          <p className="text-white/70 text-sm">Preparándonos para recoger tu paquete...</p>
        </div>

        {/* Carretera */}
        <div className="relative w-full h-24 overflow-hidden rounded-xl bg-gray-800">
          {/* Líneas discontinuas animadas (scrolling) */}
          <motion.div
            className="absolute bottom-6 flex gap-6"
            style={{ width: '200%' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(16)].map((_, i) => (
              <div key={i} className="h-1 w-8 bg-yellow-400 rounded shrink-0" />
            ))}
          </motion.div>

          {/* Furgoneta avanza de izquierda a derecha una sola vez */}
          <motion.div
            className="absolute"
            style={{ bottom: 20 }}
            initial={{ x: -80 }}
            animate={{ x: 290 }}
            transition={{ duration, ease: 'easeInOut' }}
          >
            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cuerpo */}
              <rect x="2" y="8" width="40" height="22" rx="2" fill="white"/>
              {/* Cabina */}
              <rect x="42" y="14" width="18" height="16" rx="2" fill="white"/>
              {/* Parabrisas */}
              <rect x="44" y="16" width="10" height="8" rx="1" fill="#93c5fd"/>
              {/* Ruedas */}
              <circle cx="12" cy="32" r="5" fill="#1f2937"/>
              <circle cx="12" cy="32" r="2.5" fill="#6b7280"/>
              <circle cx="50" cy="32" r="5" fill="#1f2937"/>
              <circle cx="50" cy="32" r="2.5" fill="#6b7280"/>
              {/* Puerta cabina */}
              <rect x="44" y="26" width="8" height="6" rx="1" fill="#e5e7eb" opacity="0.5"/>
              {/* Logo SVL */}
              <text x="10" y="23" fontSize="9" fontWeight="bold" fill="#1a3a4a">SVL</text>
            </svg>
          </motion.div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function NuevaRecogidaPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([emptyPaquete()])
  const [notes, setNotes] = useState('')
  const [fecha, setFecha] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAnim, setShowAnim] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function updatePaquete(i: number, field: keyof Paquete, value: string) {
    setPaquetes(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function addPaquete() {
    setPaquetes(prev => [...prev, emptyPaquete()])
  }

  function removePaquete(i: number) {
    setPaquetes(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const inserts = paquetes.map(p => ({
      user_id: user.id,
      material_type: p.material_type,
      estimated_kg: p.estimated_kg ? parseFloat(p.estimated_kg) : null,
      notes: [
        notes,
        fecha ? `Fecha preferida: ${fecha}` : null,
        p.largo && p.ancho && p.alto ? `Dimensiones: ${p.largo}x${p.ancho}x${p.alto} cm` : null,
      ].filter(Boolean).join(' | ') || null,
      status: 'pending',
    }))

    const { error } = await supabase.from('pickups').insert(inserts)

    if (error) {
      setError('Error al enviar la solicitud. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    // Mostrar animación 3 segundos y luego redirigir
    setShowAnim(true)
    setTimeout(() => {
      router.push('/portal/recogidas')
    }, 3500)
  }

  return (
    <>
      {showAnim && <TruckAnimation />}

      <div className="max-w-2xl space-y-6">
        <div>
          <Link href="/portal/recogidas" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeft className="w-4 h-4" /> Volver a Mis Recogidas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Solicitar Recogida</h1>
          <p className="text-gray-500 mt-1">Dinos qué material tienes y organizaremos la recogida.</p>
        </div>

        {/* Aviso */}
        <div className="flex gap-3 bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: PRIMARY }} />
          <div>
            <span className="font-semibold">Importante antes de solicitar</span>
            <p className="mt-0.5 text-gray-500">Asegúrate de haber completado tu dirección en <Link href="/portal/perfil" className="underline">Mi Perfil</Link> antes de solicitar una recogida. Recomendamos un mínimo de 1kg para optimizar el transporte.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {paquetes.map((p, i) => (
            <div key={i} className="bg-white border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">Caja {i + 1}</h2>
                {paquetes.length > 1 && (
                  <button type="button" onClick={() => removePaquete(i)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de material <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={p.material_type}
                  onChange={e => updatePaquete(i, 'material_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: PLA, PETG, ABS, Mixto..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Si envías varios tipos, escribe "Mixto" y sepáralos en cajas distintas.</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Peso est. (kg)</label>
                  <input
                    type="number" step="0.1" min="0"
                    value={p.estimated_kg}
                    onChange={e => updatePaquete(i, 'estimated_kg', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Largo (cm)</label>
                  <input
                    type="number" min="0"
                    value={p.largo}
                    onChange={e => updatePaquete(i, 'largo', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ancho (cm)</label>
                  <input
                    type="number" min="0"
                    value={p.ancho}
                    onChange={e => updatePaquete(i, 'ancho', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Alto (cm)</label>
                  <input
                    type="number" min="0"
                    value={p.alto}
                    onChange={e => updatePaquete(i, 'alto', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addPaquete}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition"
          >
            <Plus className="w-4 h-4" /> Añadir otra caja
          </button>

          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Detalles Adicionales</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none text-sm"
                placeholder="Ej: Solo disponible por las mañanas, timbre no funciona, código de acceso..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferencia de fecha (opcional)</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Fecha a partir de la cual está listo para recoger.</p>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || paquetes.some(p => !p.material_type)}
            className="w-full text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
            style={{ backgroundColor: PRIMARY }}
          >
            {loading ? 'Enviando...' : `Solicitar Recogida${paquetes.length > 1 ? ` (${paquetes.length} cajas)` : ''}`}
          </button>
        </form>
      </div>
    </>
  )
}