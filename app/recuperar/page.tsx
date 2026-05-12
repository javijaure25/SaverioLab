'use client'
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const PRIMARY = '#1a3a4a'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) {
      setError('No se pudo enviar el email. Comprueba la dirección.')
      return
    }
    setEnviado(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver al login
        </Link>

        {enviado ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl" style={{ backgroundColor: '#e8f0f3' }}>
              📧
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email enviado</h1>
            <p className="text-gray-500 text-sm">
              Hemos enviado un enlace de recuperación a <span className="font-medium text-gray-700">{email}</span>. Revisa tu bandeja de entrada.
            </p>
            <Link href="/login" className="inline-block text-sm font-medium hover:underline" style={{ color: PRIMARY }}>
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h1>
              <p className="text-gray-500 text-sm mt-2">
                Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="tu@email.com"
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
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}