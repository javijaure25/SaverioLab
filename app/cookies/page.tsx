'use client'
import { useState, useEffect } from "react"
import Link from "next/link"

const PRIMARY = '#1a3a4a'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = document.cookie.includes('cookie-consent=true')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    document.cookie = 'cookie-consent=true; max-age=31536000; path=/'
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ backgroundColor: PRIMARY }}>
        <p className="text-white/80 text-sm flex-1">
          Usamos cookies técnicas necesarias para el funcionamiento de la plataforma. No usamos cookies publicitarias.{' '}
          <Link href="/cookies" className="text-white underline hover:text-white/80">Más información</Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            style={{ color: PRIMARY }}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}