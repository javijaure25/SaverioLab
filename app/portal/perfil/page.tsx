'use client'
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

const PRIMARY = '#1a3a4a'

export default function PerfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState({
    full_name: '', phone: '', address: '', city: '', postal_code: '', email: '',
  })
  const [showDelete, setShowDelete] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setForm({
        full_name: data?.full_name || '',
        phone: data?.phone || '',
        address: data?.address || '',
        city: data?.city || '',
        postal_code: data?.postal_code || '',
        email: user.email || '',
      })
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMensaje('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
      city: form.city,
      postal_code: form.postal_code,
    }).eq('id', user.id)
    setSaving(false)
    setMensaje(error ? 'Error al guardar.' : 'Cambios guardados correctamente.')
  }

  async function handleDeleteAccount() {
    if (confirmEmail !== form.email) {
      setDeleteError('El email no coincide. Inténtalo de nuevo.')
      return
    }
    setDeleting(true)
    setDeleteError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('discounts').delete().eq('user_id', user.id)
    await supabase.from('pickups').delete().eq('user_id', user.id)
    await supabase.from('box_requests').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  const field = (label: string, key: keyof typeof form, placeholder = '', disabled = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={placeholder}
        disabled={disabled || loading}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-50 disabled:text-gray-400"
      />
      {disabled && <p className="text-xs text-gray-400 mt-1">El email está vinculado a tu cuenta.</p>}
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-1">Gestiona tus datos personales y dirección de recogida.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Información Personal</h2>
            <p className="text-sm text-gray-400">Estos datos se utilizarán para gestionar tus recogidas.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('Nombre completo', 'full_name', 'Tu nombre')}
            {field('Teléfono', 'phone', '+34 600 000 000')}
          </div>
          {field('Correo Electrónico', 'email', '', true)}
        </div>

        <div className="bg-white border rounded-xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Dirección de Recogida</h2>
            <p className="text-sm text-gray-400">Dirección donde pasaremos a recoger tu material.</p>
          </div>
          {field('Dirección completa', 'address', 'Calle, número, piso, puerta...')}
          <div className="grid grid-cols-2 gap-4">
            {field('Ciudad', 'city', 'Madrid')}
            {field('Código Postal', 'postal_code', '28001')}
          </div>
        </div>

        {mensaje && (
          <p className={`text-sm font-medium ${mensaje.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {mensaje}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || loading}
          className="w-full text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
          style={{ backgroundColor: PRIMARY }}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>

      {/* Zona de peligro */}
      <div className="bg-white border border-red-200 rounded-xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-red-600">Eliminar cuenta</h2>
            <p className="text-sm text-gray-500 mt-1">
              Esta acción es permanente e irreversible. Se eliminarán todos tus datos, recogidas y saldo de descuento acumulado.
            </p>
          </div>
        </div>

        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="w-full border border-red-300 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
          >
            Quiero eliminar mi cuenta
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 space-y-2">
              <p className="font-semibold">⚠️ ¿Estás seguro?</p>
              <p>Se eliminarán permanentemente:</p>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                <li>Tu cuenta y datos personales</li>
                <li>Todo tu historial de recogidas</li>
                <li>Todo tu saldo de descuento acumulado</li>
              </ul>
              <p className="font-medium mt-2">Esta acción no se puede deshacer.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Para confirmar, escribe tu email: <span className="font-bold">{form.email}</span>
              </label>
              <input
                type="email"
                value={confirmEmail}
                onChange={e => { setConfirmEmail(e.target.value); setDeleteError('') }}
                placeholder="tu@email.com"
                className="w-full border border-red-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
              />
            </div>

            {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowDelete(false); setConfirmEmail(''); setDeleteError('') }}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || confirmEmail !== form.email}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-40"
              >
                {deleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}