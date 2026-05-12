'use client'
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const PRIMARY = '#1a3a4a'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase redirige aquí con el token en la URL, lo gestiona automáticamente
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Usuario listo para cambiar contraseña
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      setError('Error al cambiar la contraseña. El enlace puede haber caducado.')
      return
    }

    setListo(true)
    setTimeout(() => router.push('/portal'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {listo ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl" style={{ backgroundColor: '#e8f0f3' }}>
              ✅
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Contraseña cambiada</h1>
            <p className="text-gray-500 text-sm">Redirigiendo a tu portal...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
              <p className="text-gray-500 text-sm mt-2">Introduce tu nueva contraseña.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {loading ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}