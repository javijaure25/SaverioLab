'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Euro, Recycle, Package, Clock, Plus, Box } from "lucide-react"

const PRIMARY = '#1a3a4a'

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  confirmed: 'bg-blue-100 text-blue-700',
  collected: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  collected: 'Recolectada',
  cancelled: 'Cancelada',
}

export default function PortalDashboard() {
  const [saldo, setSaldo] = useState(0)
  const [kgTotal, setKgTotal] = useState(0)
  const [recogidas, setRecogidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: pickups } = await supabase
        .from('pickups').select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(3)

      const { data: discounts } = await supabase
        .from('discounts').select('amount, kg_recycled').eq('user_id', user.id)

      const totalSaldo = discounts?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0
      const totalKg = discounts?.reduce((acc, d) => acc + (d.kg_recycled || 0), 0) || 0

      setSaldo(totalSaldo)
      setKgTotal(totalKg)
      setRecogidas(pickups || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu portal de reciclaje SaverioLab.</p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Saldo */}
        <div className="rounded-xl p-6 text-white flex flex-col items-center justify-center text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-5">
            <Euro className="w-5 h-5" /> Descuento acumulado
          </div>
          {loading ? (
            <div className="h-12 w-24 bg-white/20 rounded animate-pulse" />
          ) : (
            <div className="text-5xl font-bold">{saldo.toFixed(2)} €</div>
          )}
          <p className="text-white/70 text-sm mt-7">Listo para descontar </p>
          <p className="text-white/70 text-sm mt-1">en tus próximas compras</p>
        </div>

        {/* Kg reciclados */}
        <div className="rounded-xl p-6 text-white flex flex-col items-center justify-center text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-6">
            <Recycle className="w-5 h-5" /> Total Reciclado
          </div>
          {loading ? (
            <div className="h-12 w-24 bg-white/20 rounded animate-pulse" />
          ) : (
            <div className="text-5xl font-bold">
              {kgTotal.toFixed(1)} <span className="text-2xl text-white/70 font-medium">kg</span>
            </div>
          )}
          <p className="text-white/70 text-sm mt-8">De material salvado del vertedero</p>
        </div>

        {/* CTA recogida */}
        <div className="rounded-xl p-6 bg-white border-2 border-dashed flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
          <div className="w-15 h-15 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
            <Package className="w-10 h-10" />
          </div>
          <p className="font-medium text-gray-700 mb-3">¿Tienes más material?</p>
          <Link
            href="/portal/recogidas/nueva"
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg transition"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus className="w-4 h-4" /> Solicitar Recogida
          </Link>
        </div>

        {/* Solicitar cajas */}
        <div className="rounded-xl p-6 bg-white border-2 border-dashed flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
            <Box className="w-6 h-6" />
          </div>
          <p className="font-medium text-gray-700 mb-1">¿No tienes cajas en casa?</p>
          <p className="text-xs text-gray-400 mb-3">Te enviamos 5 cajas </p>
          <p className="text-xs text-gray-400 mb-3"> (Coste: 5€ descuento acumulado)</p>
          <Link
            href="/portal/envios/cajas"
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg transition"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus className="w-4 h-4" /> Solicitar Cajas
          </Link>
        </div>
      </div>

      {/* Recogidas recientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recogidas Recientes</h2>
          <Link href="/portal/recogidas" className="text-sm font-medium hover:underline" style={{ color: PRIMARY }}>
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ) : recogidas.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 flex flex-col items-center text-center">
            <Clock className="w-10 h-10 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aún no tienes recogidas</p>
            <p className="text-gray-400 text-sm mt-1">Solicita tu primera recogida para empezar a ganar crédito.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recogidas.map((r) => (
              <div key={r.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}