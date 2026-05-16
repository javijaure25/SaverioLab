'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

const PRIMARY = '#0f2430'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  sent: 'Enviadas',
  delivered: 'Entregadas',
  cancelled: 'Cancelada',
}

export default function AdminCajasPage() {
  const [cajas, setCajas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('all')
  const supabase = createClient()

  useEffect(() => { load() }, [filtro])

  async function load() {
    setLoading(true)
    let query = supabase
      .from('box_requests')
      .select('*, profiles(email, full_name, address, city, postal_code)')
      .order('created_at', { ascending: false })

    if (filtro !== 'all') query = query.eq('status', filtro)

    const { data } = await query
    setCajas(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, status: string, email: string) {
  await supabase.from('box_requests').update({ status }).eq('id', id)

  const mensajes: Record<string, string> = {
    sent: 'Tus cajas han sido enviadas y están en camino. Recibirás tu pedido en los próximos días.',
    delivered: 'Tus cajas han sido entregadas. Ya puedes empaquetar tu material y solicitar recogida cuando este llena.',
    cancelled: 'Tu solicitud de cajas ha sido cancelada. Si tienes dudas, contáctanos.',
  }

  if (mensajes[status] && email) {
    await fetch('/api/notificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        status: 'cajas_' + status,
        mensaje: mensajes[status],
        pickupId: id,
        materialType: 'Cajas',
      }),
    })
  }
  load()
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Cajas</h1>
        <p className="text-gray-500 mt-1">Gestiona las solicitudes de cajas de los usuarios.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Todas' },
          { value: 'pending', label: 'Pendientes' },
          { value: 'sent', label: 'Enviadas' },
          { value: 'delivered', label: 'Entregadas' },
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
      ) : cajas.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
          No hay solicitudes con este filtro.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Dirección envío</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Cajas</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Cambiar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cajas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-gray-700 font-medium">{c.profiles?.full_name || '—'}</div>
                    <div className="text-xs text-gray-400">{c.profiles?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {c.direccion || `${c.profiles?.address || ''}, ${c.profiles?.city || ''} ${c.profiles?.postal_code || ''}`.trim() || '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{c.cantidad || 5}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleDateString('es-ES')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>
                      {statusLabels[c.status] || c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={c.status}
                      onChange={e => updateStatus(c.id, e.target.value, c.profiles?.email)}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="sent">Enviadas</option>
                      <option value="delivered">Entregadas</option>
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