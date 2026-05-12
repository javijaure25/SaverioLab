'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
const supabase = createClient()
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Guardar datos del perfil
    if (data.user) {
      await supabase.from('profiles').update({
        full_name: nombre,
        phone: telefono,
        address: direccion,
        city: ciudad,
        postal_code: codigoPostal,
      }).eq('id', data.user.id)
    }

    router.push('/portal')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SaverioLab</h1>
          <p className="text-gray-500 mt-2">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleRegistro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Javi Jaureguizar"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="612 345 678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Calle Mayor 1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Madrid"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
              <input
                type="text"
                value={codigoPostal}
                onChange={e => setCodigoPostal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="28001"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-black font-medium hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}