'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Users, Package, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

const PRIMARY = '#0f2430'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalRecogidas: 0,
    pendientes: 0,
    completadas: 0,
  })
  const [recientes, setRecientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [
        { count: totalUsuarios },
        { count: totalRecogidas },
        { count: pendientes },
        { count: completadas },
        { data: recientes },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('pickups').select('*', { count: 'exact', head: true }),
        supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('status', 'collected'),
        supabase.from('pickups').select('*, profiles(email, full_name)').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        totalUsuarios: totalUsuarios || 0,
        totalRecogidas: totalRecogidas || 0,
        pendientes: pendientes || 0,
        completadas: completadas || 0,
      })
      setRecientes(recientes || [])
      setLoading(false)
    }
    load()
  }, [])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Resumen general de SaverioLab.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Usuarios', value: stats.totalUsuarios, icon: Users, color: '#e8f0f3', href: '/admin/usuarios' },
          { label: 'Total Recogidas', value: stats.totalRecogidas, icon: Package, color: '#e8f0f3', href: '/admin/recogidas' },
          { label: 'Pendientes', value: stats.pendientes, icon: Clock, color: '#fef9c3', href: '/admin/recogidas?filtro=pending' },
          { label: 'Completadas', value: stats.completadas, icon: CheckCircle, color: '#dcfce7', href: '/admin/recogidas?filtro=collected' },
        ].map((s, i) => (
          <Link key={i} href={s.href} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: s.color }}>
                <s.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm text-gray-500 font-medium">{s.label}</span>
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            )}
          </Link>
        ))}
      </div>

      {/* Recogidas recientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recogidas Recientes</h2>
          <Link href="/admin/recogidas" className="text-sm font-medium hover:underline" style={{ color: PRIMARY }}>
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : recientes.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
            No hay recogidas todavía.
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Material</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recientes.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{r.profiles?.full_name || r.profiles?.email || '—'}</td>
                    <td className="px-6 py-4 text-gray-700">{r.material_type}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString('es-ES')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[r.status] || r.status}
                      </span>
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