'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Euro, TrendingUp, Calendar } from "lucide-react"

const PRIMARY = '#1a3a4a'

export default function DescuentosPage() {
  const [saldo, setSaldo] = useState(0)
  const [kgTotal, setKgTotal] = useState(0)
  const [detalle, setDetalle] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('discounts')
        .select('*, pickups(material_type)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const totalSaldo = data?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0
      const totalKg = data?.reduce((acc, d) => acc + (d.kg_recycled || 0), 0) || 0

      setSaldo(totalSaldo)
      setKgTotal(totalKg)
      setDetalle(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Descuentos</h1>
        <p className="text-gray-500 mt-1">Consulta tu saldo y el histórico de abonos por reciclaje.</p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-xl p-6 text-white" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
            <Euro className="w-5 h-5" /> Saldo Total Disponible
          </div>
          {loading ? (
            <div className="h-12 w-32 bg-white/20 rounded animate-pulse" />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-5xl font-bold">{saldo.toFixed(2)} €</div>
                <p className="text-white/70 text-sm mt-2">Se aplicará automáticamente en tu próxima compra.</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                Ratio actual: 2€ / kg <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border rounded-xl p-6">
          <p className="text-sm font-medium text-gray-500 mb-3">Total Histórico</p>
          {loading ? (
            <div className="h-10 w-24 bg-gray-100 rounded animate-pulse" />
          ) : (
            <div className="text-3xl font-bold text-gray-900">{kgTotal.toFixed(1)} kg</div>
          )}
          <p className="text-gray-400 text-sm mt-1">Material reciclado con éxito</p>
        </div>
      </div>

      {/* Detalle */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Desglose por Recogida</h2>

        {loading ? (
          <div className="space-y-3">
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ) : detalle.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-xl p-10 text-center text-gray-400">
            Aún no tienes abonos registrados. El saldo se añade cuando procesamos tu material en el laboratorio.
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Recogida</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Peso</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Crédito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {detalle.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-gray-500">#{d.pickup_id?.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{d.kg_recycled?.toFixed(2)} kg</td>
                    <td className="px-6 py-4 text-right font-semibold" style={{ color: PRIMARY }}>
                      +{d.amount?.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}