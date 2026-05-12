'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, Box, AlertCircle } from "lucide-react"
import Link from "next/link"

const PRIMARY = '#1a3a4a'

export default function SolicitarCajasPage() {
  const [saldo, setSaldo] = useState(0)
  const [direccion, setDireccion] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: discounts }, { data: profile }] = await Promise.all([
        supabase.from('discounts').select('amount').eq('user_id', user.id),
        supabase.from('profiles').select('address, city, postal_code').eq('id', user.id).single(),
      ])

      const total = discounts?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0
      setSaldo(total)

      if (profile?.address) {
        setDireccion(`${profile.address}, ${profile.city || ''} ${profile.postal_code || ''}`.trim())
      }
      setLoadingData(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saldo < 2) {
      setError('No tienes suficiente saldo. Necesitas al menos 2€ para solicitar cajas.')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: insertError } = await supabase.from('box_requests').insert({
      user_id: user.id,
      cantidad: 5,
      direccion,
      notes: notes || null,
      status: 'pending',
    })

    if (insertError) {
      setError('Error al enviar la solicitud. Inténtalo de nuevo.')
      setLoading(false)
      return
    }

    // Descontar 2€ del saldo
    await supabase.from('discounts').insert({
      user_id: user.id,
      pickup_id: null,
      kg_recycled: 0,
      amount: -2,
    })

    router.push('/portal/envios')
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/portal/envios" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Volver a Envíos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Solicitar Cajas</h1>
        <p className="text-gray-500 mt-1">Te enviamos 5 cajas para que puedas empaquetar tu material.</p>
      </div>

      {/* Info box */}
      <div className="rounded-xl p-5 text-white" style={{ backgroundColor: PRIMARY }}>
        <div className="flex items-start gap-3">
          <Box className="w-5 h-5 shrink-0 mt-0.5 text-white/70" />
          <div>
            <p className="font-semibold mb-1">Lo que recibirás</p>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• 5 cajas para empaquetar tu material</li>
              <li>• Instrucciones de empaquetado incluidas</li>
              <li>• Etiqueta de envío cuando confirmes la recogida</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-sm text-white/70">Coste de gestión</span>
              <span className="font-bold text-lg">2,00 €</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-white/70">Tu saldo actual</span>
              {loadingData ? (
                <div className="h-5 w-16 bg-white/20 rounded animate-pulse" />
              ) : (
                <span className={`font-bold text-lg ${saldo < 2 ? 'text-red-300' : 'text-white'}`}>
                  {saldo.toFixed(2)} €
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {saldo < 2 && !loadingData && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>No tienes suficiente saldo para solicitar cajas. Necesitas al menos 2€. Recicla material para acumular saldo.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección de envío <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Calle, número, ciudad, CP..."
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Hemos rellenado tu dirección del perfil. Puedes cambiarla si lo necesitas.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none text-sm"
            placeholder="Horario de entrega, instrucciones especiales..."
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || saldo < 2 || loadingData}
          className="w-full text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          {loading ? 'Enviando...' : 'Solicitar 5 cajas (-2€)'}
        </button>
      </form>
    </div>
  )
}