'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const PRIMARY = '#0f2430'

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('profiles')
      .select('*, pickups(count)')
      .order('created_at', { ascending: false })
    setUsuarios(data || [])
    setLoading(false)
  }

  async function updateRole(e: React.MouseEvent, id: string, role: string) {
    e.stopPropagation()
    await supabase.from('profiles').update({ role }).eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 mt-1">Gestiona los usuarios registrados en SaverioLab.</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : usuarios.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
          No hay usuarios registrados todavía.
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Ciudad</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Recogidas</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Rol</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Cambiar rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/usuarios/${u.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: PRIMARY }}>
                        {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{u.full_name || '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-gray-500">{u.city || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{u.pickups?.[0]?.count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <select
                      value={u.role}
                      onChange={e => updateRole(e as any, u.id, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <option value="user">Cliente</option>
                      <option value="admin">Admin</option>
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