'use client'
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"

const PRIMARY = '#1a3a4a'

interface HeaderProps {
  showBack?: boolean
  scrollLogo?: boolean
}

export default function Header({ showBack = false, scrollLogo = false }: HeaderProps) {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
  }

  // Logo visible: si scrollLogo=true, solo cuando scrolled. Si false, siempre visible
  const logoVisible = scrollLogo ? scrolled : true

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Izquierda */}
        <div className="flex items-center gap-3" style={{ minWidth: '40px' }}>
          {showBack && (
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 transition">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <Link href="/">
            <img
              src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
              alt="SaverioLab"
              className={`h-8 transition-opacity duration-300 ${logoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
          </Link>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(p => !p)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl overflow-hidden z-50 border" style={{ backgroundColor: PRIMARY }}>
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs text-white/50">Conectado como</p>
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/portal"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    Mi Portal
                  </Link>
                  <Link
                    href="/portal/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    Ajustes
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-white/10 transition border-t border-white/10"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={`/login?redirectTo=${pathname}`}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="text-white text-sm px-4 py-2 rounded-lg transition"
                style={{ backgroundColor: PRIMARY }}
              >
                Crear Cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}