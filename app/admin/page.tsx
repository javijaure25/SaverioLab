'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Users, Package, Clock, CheckCircle, Recycle, Euro, Box, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const PRIMARY = '#0f2430'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalRecogidas: 0,
    pendientes: 0,
    completadas: 0,
    kgTotales: 0,
    saldoEmitido: 0,
    cajasPendientes: 0,
  })
  const [tareas, setTareas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analisisOpen, setAnalisisOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [
        { count: totalUsuarios },
        { count: totalRecogidas },
        { count: pendientes },
        { count: completadas },
        { count: cajasPendientes },
        { data: discounts },
        { data: recientesPendientes },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('pickups').select('*', { count: 'exact', head: true }),
        supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('status', 'collected'),
        supabase.from('box_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('discounts').select('amount, kg_recycled'),
        supabase.from('pickups').select('*, profiles(email, full_name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      ])

      const kgTotales = discounts?.reduce((acc, d) => acc + (d.kg_recycled || 0), 0) || 0
      const saldoEmitido = discounts?.filter(d => d.amount > 0).reduce((acc, d) => acc + (d.amount || 0), 0) || 0

      setStats({
        totalUsuarios: totalUsuarios || 0,
        totalRecogidas: totalRecogidas || 0,
        pendientes: pendientes || 0,
        completadas: completadas || 0,
        kgTotales,
        saldoEmitido,
        cajasPendientes: cajasPendientes || 0,
      })
      setTareas(recientesPendientes || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Panel de control de SaverioLab.</p>
      </div>

      {/* Kg + Descuentos — estilo portal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-6 text-white flex flex-col items-center justify-center text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
            <Recycle className="w-5 h-5" /> Kg Totales Reciclados
          </div>
          {loading ? <div className="h-12 w-24 bg-white/20 rounded animate-pulse" /> : (
            <div className="text-5xl font-bold">{stats.kgTotales.toFixed(1)} <span className="text-2xl text-white/70 font-medium">kg</span></div>
          )}
          <p className="text-white/50 text-sm mt-2">Material procesado en total</p>
        </div>

        <div className="rounded-xl p-6 text-white flex flex-col items-center justify-center text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="flex items-center gap-2 text-white/70 text-sm font-medium mb-3">
            <Euro className="w-5 h-5" /> Descuentos Emitidos
          </div>
          {loading ? <div className="h-12 w-24 bg-white/20 rounded animate-pulse" /> : (
            <div className="text-5xl font-bold">{stats.saldoEmitido.toFixed(2)} <span className="text-2xl text-white/70 font-medium">€</span></div>
          )}
          <p className="text-white/50 text-sm mt-2">Crédito total generado a clientes</p>
        </div>
      </div>

      {/* Análisis General — colapsable */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <button
          onClick={() => setAnalisisOpen(p => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-800">Análisis General</span>
          {analisisOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {analisisOpen && (
          <div className="px-6 pb-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-t pt-4">
            {[
              { label: 'Usuarios', value: stats.totalUsuarios, icon: Users, color: '#e8f0f3' },
              { label: 'Total Recogidas', value: stats.totalRecogidas, icon: Package, color: '#e8f0f3' },
              { label: 'Pendientes', value: stats.pendientes, icon: Clock, color: '#fef9c3' },
              { label: 'Completadas', value: stats.completadas, icon: CheckCircle, color: '#dcfce7' },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: s.color }}>
                    <s.icon className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
                {loading ? <div className="h-7 w-10 bg-gray-200 rounded animate-pulse" /> : (
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solicitudes cajas pendientes */}
      {stats.cajasPendientes > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-700 font-medium">
              {stats.cajasPendientes} solicitud{stats.cajasPendientes > 1 ? 'es' : ''} de cajas pendiente{stats.cajasPendientes > 1 ? 's' : ''} de gestionar
            </span>
          </div>
          <Link href="/admin/cajas" className="text-xs font-medium text-orange-600 hover:underline">
            Ver ahora →
          </Link>
        </div>
      )}

      {/* Tienda */}
      <div className="bg-white border-2 border-dashed rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">🛒 Tienda Online</h2>
          <p className="text-gray-400 text-sm mt-1">La gestión de productos, pedidos e inventario estará disponible próximamente.</p>
        </div>
        <span className="text-xs bg-amber-100 text-amber-600 px-3 py-1 rounded-full font-medium shrink-0">Próximamente</span>
      </div>

      {/* Tareas pendientes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Recogidas Pendientes de Confirmar</h2>
        {loading ? (
          <div className="space-y-2">
            {[1,2].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : tareas.length === 0 ? (
          <div className="bg-white border rounded-xl p-6 flex items-center gap-3 text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm">No hay recogidas pendientes. ¡Todo al día!</span>
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Material</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tareas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{r.profiles?.full_name || r.profiles?.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{r.material_type}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString('es-ES')}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/usuarios/${r.user_id}`} className="text-xs font-medium hover:underline" style={{ color: PRIMARY }}>
                        Gestionar →
                      </Link>
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