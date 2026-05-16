'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LayoutDashboard, Package, Users, LogOut, ShieldCheck, Box } from "lucide-react"

const ADMIN_BG = '#0f2430'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/recogidas', label: 'Recogidas', icon: Package },
  { href: '/admin/cajas', label: 'Solicitudes Cajas', icon: Box },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/portal')
        return
      }

      setEmail(user.email || '')
      setChecking(false)
    }
    check()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Verificando acceso...</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col text-white" style={{ backgroundColor: ADMIN_BG }}>
        {/* Logo + badge admin */}
        <div className="p-4 border-b border-white/10">
          <Link href="/admin">
            <img
              src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
              alt="SaverioLab"
              className="h-50 brightness-0 invert mb-2"
            />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Panel de Administración
          </div>
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
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-sm font-bold text-amber-400">
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

      {/* Contenido */}
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}