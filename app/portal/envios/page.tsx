'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Package, Box, Clock, Download, Plus } from "lucide-react"

const PRIMARY = '#1a3a4a'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  collected: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  sent: 'bg-purple-100 text-purple-700',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  collected: 'Recolectada',
  cancelled: 'Cancelada',
  sent: 'Enviadas',
}

export default function EnviosPage() {
  const [recogidas, setRecogidas] = useState<any[]>([])
  const [cajas, setCajas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'recogidas' | 'cajas'>('recogidas')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: pickups }, { data: boxes }] = await Promise.all([
        supabase.from('pickups').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('box_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setRecogidas(pickups || [])
      setCajas(boxes || [])
      setLoading(false)
    }
    load()
  }, [])

  async function descargarEtiqueta(path: string) {
    const { data } = await supabase.storage.from('etiquetas').createSignedUrl(path, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Envíos</h1>
          <p className="text-gray-500 mt-1">Historial completo de recogidas y cajas solicitadas.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/portal/recogidas/nueva"
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg transition"
            style={{ backgroundColor: PRIMARY }}
          >
            <Package className="w-4 h-4" /> Nueva Recogida
          </Link>
          <Link
            href="/portal/envios/cajas"
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border-2 transition hover:bg-gray-50"
            style={{ color: PRIMARY, borderColor: PRIMARY }}
          >
            <Box className="w-4 h-4" /> Solicitar Cajas
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('recogidas')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'recogidas' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Mis Recogidas {recogidas.length > 0 && <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{recogidas.length}</span>}
        </button>
        <button
          onClick={() => setTab('cajas')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === 'cajas' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Cajas Solicitadas {cajas.length > 0 && <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">{cajas.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : tab === 'recogidas' ? (
        recogidas.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-xl p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
              <Package className="w-7 h-7" />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">Sin recogidas</p>
            <p className="text-gray-400 text-sm max-w-xs mb-6">Solicita tu primera recogida para empezar a reciclar y ganar crédito.</p>
            <Link href="/portal/recogidas/nueva" className="text-white text-sm px-5 py-2 rounded-lg" style={{ backgroundColor: PRIMARY }}>
              Solicitar Primera Recogida
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recogidas.map((r) => (
              <div key={r.id} className="bg-white border rounded-xl p-5 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">Recogida #{r.id.slice(0, 8)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[r.status] || r.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 flex gap-4">
                    <span>{new Date(r.created_at).toLocaleDateString('es-ES')}</span>
                    <span>Material: <span className="text-gray-600 font-medium">{r.material_type}</span></span>
                    {r.estimated_kg && <span>Est. {r.estimated_kg} kg</span>}
                  </div>
                  {r.etiqueta_url && (
                    <button
                      onClick={() => descargarEtiqueta(r.etiqueta_url)}
                      className="flex items-center gap-1.5 text-xs font-medium mt-2 px-3 py-1 rounded-lg border transition hover:bg-gray-50"
                      style={{ color: PRIMARY, borderColor: PRIMARY }}
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar etiqueta
                    </button>
                  )}
                </div>
                {!r.etiqueta_url && <Clock className="w-5 h-5 text-gray-300 shrink-0" />}
              </div>
            ))}
          </div>
        )
      ) : (
        cajas.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-xl p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
              <Box className="w-7 h-7" />
            </div>
            <p className="text-gray-700 font-semibold text-lg mb-1">Sin cajas solicitadas</p>
            <p className="text-gray-400 text-sm max-w-xs mb-6">¿No tienes cajas para enviar tu material? Solicítalas aquí. Coste de gestión: 2€.</p>
            <Link href="/portal/envios/cajas" className="text-white text-sm px-5 py-2 rounded-lg" style={{ backgroundColor: PRIMARY }}>
              Solicitar Cajas
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cajas.map((c) => (
              <div key={c.id} className="bg-white border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">Solicitud #{c.id.slice(0, 8)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[c.status] || c.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 flex gap-4">
                    <span>{new Date(c.created_at).toLocaleDateString('es-ES')}</span>
                    <span><span className="text-gray-600 font-medium">5 cajas</span></span>
                    <span className="text-red-500 font-medium">-2€ gestión</span>
                  </div>
                  {c.direccion && <p className="text-sm text-gray-400 mt-1">📦 {c.direccion}</p>}
                </div>
                <Box className="w-5 h-5 text-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}