'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Package, Euro, User, LogOut, Truck, Menu, X } from "lucide-react"

const PRIMARY = '#1a3a4a'

const navItems = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/recogidas', label: 'Mis Recogidas', icon: Package },
  { href: '/portal/envios', label: 'Envíos', icon: Truck },
  { href: '/portal/descuentos', label: 'Mis Descuentos', icon: Euro },
  { href: '/portal/perfil', label: 'Mi Perfil', icon: User },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
    })
  }, [])

  // Cierra el menú al cambiar de página
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const Sidebar = () => (
    <aside className="w-64 flex flex-col text-white h-full" style={{ backgroundColor: PRIMARY }}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link href="/">
          <img
            src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
            alt="SaverioLab"
            className="h-10 brightness-0 invert"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {email.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-white/70 truncate">{email}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">

      {/* Sidebar desktop — visible solo en md+ */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>

      {/* Header móvil — visible solo en móvil */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 text-white" style={{ backgroundColor: PRIMARY }}>
        <Link href="/">
          <img
            src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
            alt="SaverioLab"
            className="h-7 brightness-0 invert"
          />
        </Link>
        <button onClick={() => setMenuOpen(p => !p)} className="text-white p-1">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay móvil */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar móvil — slide in */}
      <div className={`md:hidden fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      {/* Contenido */}
      <main className="flex-1 bg-gray-50 md:ml-64 min-h-screen">
        <div className="md:hidden h-14" /> {/* espaciador para el header móvil */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}