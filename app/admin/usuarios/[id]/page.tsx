'use client'
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X, Upload, Download, Loader2 } from "lucide-react"

const PRIMARY = '#0f2430'

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

export default function AdminUsuarioDetallePage() {
  const { id } = useParams()
  const [perfil, setPerfil] = useState<any>(null)
  const [recogidas, setRecogidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [form, setForm] = useState({ material_type: '', estimated_kg: '', status: 'collected', notes: '' })
  const [saving, setSaving] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: perfil }, { data: recogidas }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('pickups').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    ])
    setPerfil(perfil)
    setRecogidas(recogidas || [])
    setLoading(false)
  }

  async function updateStatus(pickupId: string, status: string) {
  await supabase.from('pickups').update({ status }).eq('id', pickupId)

  // Enviar notificación por email
  const recogida = recogidas.find(r => r.id === pickupId)
  if (recogida && perfil?.email) {
    await fetch('/api/notificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: perfil.email,
        status,
        pickupId,
        materialType: recogida.material_type,
      }),
    })
  }

  load()
}

  async function handleAddRecogida(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('pickups').insert({
      user_id: id,
      material_type: form.material_type,
      estimated_kg: form.estimated_kg ? parseFloat(form.estimated_kg) : null,
      status: form.status,
      notes: form.notes || null,
    })
    if (!error) {
      setModal(false)
      setForm({ material_type: '', estimated_kg: '', status: 'collected', notes: '' })
      load()
    }
    setSaving(false)
  }

  async function handleUploadEtiqueta(pickupId: string, file: File) {
    setUploadingId(pickupId)
    const ext = file.name.split('.').pop()
    const path = `${pickupId}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('etiquetas')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      alert('Error al subir la etiqueta: ' + JSON.stringify(uploadError))
      setUploadingId(null)
      return
    }

    await supabase.from('pickups').update({ etiqueta_url: path }).eq('id', pickupId)
    setUploadingId(null)
    load()
  }

  async function getEtiquetaUrl(path: string) {
    const { data } = await supabase.storage.from('etiquetas').createSignedUrl(path, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (loading) return <div className="text-gray-400">Cargando...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/usuarios" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Volver a Usuarios
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{perfil?.full_name || 'Sin nombre'}</h1>
            <p className="text-gray-500 mt-1">{perfil?.email}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${perfil?.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
            {perfil?.role === 'admin' ? 'Admin' : 'Cliente'}
          </span>
        </div>
      </div>

      {/* Datos del perfil */}
      <div className="bg-white border rounded-xl p-6 grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-400">Teléfono</span><p className="font-medium mt-0.5">{perfil?.phone || '—'}</p></div>
        <div><span className="text-gray-400">Ciudad</span><p className="font-medium mt-0.5">{perfil?.city || '—'}</p></div>
        <div className="col-span-2"><span className="text-gray-400">Dirección</span><p className="font-medium mt-0.5">{perfil?.address || '—'}</p></div>
      </div>

      {/* Recogidas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recogidas</h2>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg transition"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus className="w-4 h-4" /> Añadir recogida
          </button>
        </div>

        {recogidas.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-400">
            Este usuario no tiene recogidas todavía.
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Material</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Peso</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Estado</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Etiqueta</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Cambiar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recogidas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700">{r.material_type}</td>
                    <td className="px-6 py-4 text-gray-500">{r.estimated_kg ? `${r.estimated_kg} kg` : '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString('es-ES')}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        ref={el => { fileInputRefs.current[r.id] = el }}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadEtiqueta(r.id, file)
                        }}
                      />
                      {uploadingId === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : r.etiqueta_url ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => getEtiquetaUrl(r.etiqueta_url)}
                            className="flex items-center gap-1 text-xs text-green-600 font-medium hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" /> Ver
                          </button>
                          <button
                            onClick={() => fileInputRefs.current[r.id]?.click()}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            Cambiar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRefs.current[r.id]?.click()}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium"
                        >
                          <Upload className="w-3.5 h-3.5" /> Subir
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={r.status}
                        onChange={e => updateStatus(r.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
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

      {/* Modal añadir recogida */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Añadir recogida manual</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRecogida} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material <span className="text-red-500">*</span></label>
                <input type="text" value={form.material_type} onChange={e => setForm(p => ({ ...p, material_type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: PLA, PETG..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <input type="number" step="0.1" min="0" value={form.estimated_kg} onChange={e => setForm(p => ({ ...p, estimated_kg: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Ej: 2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="collected">Recolectada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                  placeholder="Recogida presencial, enviada por email..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                  Cancelar
                </button>
                <button type="submit" disabled={saving || !form.material_type}
                  className="flex-1 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                  style={{ backgroundColor: PRIMARY }}>
                  {saving ? 'Guardando...' : 'Añadir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}