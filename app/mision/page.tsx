'use client'
import { motion } from "framer-motion"
import Link from "next/link"
import { Recycle, FlaskConical, Leaf, Heart } from "lucide-react"
import Header from "@/components/Header"

const PRIMARY = '#1a3a4a'

export default function MisionPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header showBack={true} scrollLogo={true} />

      <main className="flex-1">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-white" />
          <div className="max-w-6xl mx-auto px-4 relative">
            <motion.div className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex justify-center mb-8">
                <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png" alt="SaverioLab" style={{ height: '300px' }} />
              </div>
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 mb-6">
                <Leaf className="w-3 h-3 mr-1" /> Quiénes somos
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">Nuestra Misión</h1>
              <p className="text-lg text-gray-500 text-justify leading-relaxed leading-relaxed">
                En SaverioLab creemos que la impresión 3D y la sostenibilidad pueden ir de la mano.
                Nacimos con una idea simple: transformar los residuos de impresión en filamento reciclado de alta calidad.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 border-t text-white" style={{ backgroundColor: PRIMARY }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-white">Lo que nos mueve</h2>
              <p className="text-white/60 max-w-2xl mx-auto">Tres pilares que definen todo lo que hacemos.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Recycle, title: "Economía Circular", desc: "Cada gramo de material que reciclamos es un gramo que no acaba en el vertedero. Creamos un ciclo de vida sostenible para el filamento." },
                { icon: FlaskConical, title: "Ciencia Aplicada", desc: "Usamos procesos químicos para obtener materia prima para fabricar el filamento, para volver a obtener un filamento de calidad excepcional." },
                { icon: Heart, title: "Comunidad Maker", desc: "Somos makers como tú. Entendemos tus necesidades y hemos diseñado un sistema pensado para la comunidad de impresión 3D." },
              ].map((item, i) => (
                <motion.div key={i} className="bg-white p-8 rounded-xl flex flex-col items-center text-center shadow-sm"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#e8f0f3', color: PRIMARY }}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>{item.title}</h3>
                  <p className="text-gray-500 text-justify leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Nuestra historia</h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                SaverioLab nació de la frustración de ver cómo los restos de impresión — soportes, primeras capas fallidas,
                purgas de cambio de color — acababan inevitablemente en la basura.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                Después de años imprimiendo y acumulando residuos, decidimos hacer algo al respecto.
                Investigamos procesos de reciclaje de polímeros, montamos nuestro propio laboratorio
                y desarrollamos un sistema de recogida y procesado que hoy ponemos a tu disposición.
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                El resultado: filamento reciclado de calidad y un programa de descuentos que premia
                a quienes se comprometen con el medio ambiente.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 text-white text-center" style={{ backgroundColor: PRIMARY }}>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">¿Te sumas al movimiento?</h2>
            <p className="text-white/70 text-lg mb-8">Únete a la comunidad SaverioLab y empieza a acumular descuentos excusivos para filamentos reciclados.</p>
            <Link href="/registro" className="inline-block bg-white text-sm font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition" style={{ color: PRIMARY }}>
              Empezar
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png" alt="SaverioLab" className="h-6 opacity-60" />
            <span>© {new Date().getFullYear()} SaverioLab. Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900 transition">Términos</a>
            <a href="#" className="hover:text-gray-900 transition">Privacidad</a>
            <a href="#" className="hover:text-gray-900 transition">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}