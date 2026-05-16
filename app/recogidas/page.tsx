'use client'
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Recycle, Euro, Truck, ShieldCheck, Factory, Leaf } from "lucide-react"
import Header from "@/components/Header"
import { createClient } from "@/lib/supabase"

const PRIMARY = '#1a3a4a'

export default function RecogidasLandingPage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header showBack={true} scrollLogo={true} />

      <main className="flex-1">
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-white" />
          <div className="max-w-6xl mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-center mb-8">
                  <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png" alt="SaverioLab" style={{ height: '300px' }} />
                </div>
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 mb-6">
                  <Leaf className="w-3 h-3 mr-1" /> Programa de Reciclaje 3D
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                  Tus residuos de impresión 3D tienen valor.
                </h1>
                <p className="text-lg text-gray-500 text-justify leading-relaxed mb-8 max-w-2xl mx-auto">
                  En SaverioLab transformamos los restos de impresión en filamento reciclado de alta calidad.
                  Tus restos de PLA, PETG, ABS, etc. se convierten de nuevo en filamento 3D, creando una economía circular.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {user ? (
                    <Link href="/portal" className="flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium text-white transition" style={{ backgroundColor: PRIMARY }}>
                      Ir a mi portal <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link href="/login?redirectTo=/portal" className="flex items-center gap-2 px-6 py-3 rounded-lg text-base font-medium text-white transition" style={{ backgroundColor: PRIMARY }}>
                      Comenzar a Reciclar <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <a href="#como-funciona" className="px-6 py-3 rounded-lg text-base font-medium border border-gray-300 hover:bg-gray-50 transition">
                    Saber más
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-24 border-t text-white" style={{ backgroundColor: PRIMARY }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">¿Cómo funciona?</h2>
              <p className="text-white/60 max-w-2xl mx-auto">Un proceso técnico, limpio y transparente. Sin complicaciones.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Factory, step: "01", title: "Guarda tus restos", desc: "Acumula soportes, impresiones fallidas y restos de bobinas. Sepáralos por tipo de material." },
                { icon: Truck, step: "02", title: "Solicita recogida", desc: "Desde tu portal, solicita una recogida. Pesa tu caja, indica el material y nosotros nos encargamos." },
                { icon: Euro, step: "03", title: "Recibe crédito", desc: "Una vez procesado en nuestro laboratorio, recibes saldo de descuento directo en tu cuenta." },
              ].map((item, i) => (
                <motion.div key={i} className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold tracking-widest mb-2" style={{ color: PRIMARY }}>PASO {item.step}</span>
                  <h3 className="text-lg font-bold mb-3" style={{ color: PRIMARY }}>{item.title}</h3>
                  <p className="text-gray-500 text-justify leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-6">Un enfoque científico para la sostenibilidad.</h2>
              <p className="text-lg text-gray-500 mb-8">
                En SaverioLab no hacemos greenwashing. Transformamos el desperdicio de nuevo en filamentos de alta calidad.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                  <div>
                    <span className="font-semibold block">Trazabilidad Total</span>
                    <span className="text-gray-500">Sigue el estado de tus envíos y tu historial desde tu panel personal.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Recycle className="w-6 h-6 shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                  <div>
                    <span className="font-semibold block">Economía Circular Real</span>
                    <span className="text-gray-500">Gana 2€ en crédito por cada kg de material reciclable válido que nos envíes para futuras compras.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-24 text-white text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Únete a la iniciativa SaverioLab</h2>
            <p className="text-white/70 text-lg mb-8">Empieza a reciclar hoy mismo y dale una segunda vida a tus restos de impresión.</p>
            {user ? (
              <Link href="/portal" className="inline-block bg-white text-sm font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition" style={{ color: PRIMARY }}>
                Ir a mi portal
              </Link>
            ) : (
              <Link href="/login?redirectTo=/portal" className="inline-block bg-white text-sm font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition" style={{ color: PRIMARY }}>
                Crear mi cuenta gratis
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="py-6 border-t text-center text-gray-400 text-xs">
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/terminos" className="hover:text-gray-600">Términos</Link>
          <Link href="/privacidad" className="hover:text-gray-600">Privacidad</Link>
          <Link href="/cookies" className="hover:text-gray-600">Cookies</Link>
        </div>
        © {new Date().getFullYear()} SaverioLab. Todos los derechos reservados.
      </footer>
    </div>
  )
}