'use client'
import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase"
import { useSearchParams } from "next/navigation"

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  collected: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  in_transit: 'En tránsito',
  collected: 'Entregada',
  cancelled: 'Cancelada',
}

function RecogidasContent() {
  const searchParams = useSearchParams()
  const [recogidas, setRecogidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState(searchParams.get('filtro') || 'all')
  const supabase = createClient()

  useEffect(() => { load() }, [filtro])

  async function load() {
    setLoading(true)
    let query = supabase
      .from('pickups')
      .select('*, profiles(email, full_name)')
      .order('created_at', { ascending: false })

    if (filtro !== 'all') query = query.eq('status', filtro)

    const { data } = await query
    setRecogidas(data || [])
    setLoading(false)
  }

 async function updateStatus(id: string, status: string) {
  await supabase.from('pickups').update({ status }).eq('id', id)

  const recogida = recogidas.find(r => r.id === id)
  if (recogida?.profiles?.email) {
    await fetch('/api/notificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: recogida.profiles.email,
        status,
        pickupId: id,
        materialType: recogida.material_type,
      }),
    })
  }
  load()
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recogidas</h1>
        <p className="text-gray-500 mt-1">Gestiona todas las solicitudes de recogida.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Todas' },
{ value: 'pending', label: 'Pendientes' },
{ value: 'confirmed', label: 'Confirmadas' },
{ value: 'in_transit', label: 'En tránsito' },
{ value: 'collected', label: 'Entregadas' },
{ value: 'cancelled', label: 'Canceladas' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filtro === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-600 border-gray-300 hover:border-gray-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : recogidas.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
          No hay recogidas con este filtro.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Material</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Peso est.</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Cambiar estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recogidas.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">
                    <div>{r.profiles?.full_name || '—'}</div>
                    <div className="text-xs text-gray-400">{r.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{r.material_type}</td>
                  <td className="px-6 py-4 text-gray-500">{r.estimated_kg ? `${r.estimated_kg} kg` : '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString('es-ES')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[r.status] || r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                     <option value="pending">Pendiente</option>
                     <option value="confirmed">Confirmada</option>
                     <option value="in_transit">En tránsito</option>
                     <option value="collected">Entregada</option>
                     <option value="cancelled">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function AdminRecogidasPage() {
  return (
    <Suspense fallback={<div className="text-gray-400">Cargando...</div>}>
      <RecogidasContent />
    </Suspense>
  )
}