'use client'
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/Header"

const PRIMARY = '#1a3a4a'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header showBack={true} />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <h1 className="text-4xl font-bold mb-2" style={{ color: PRIMARY }}>Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>1. Responsable del tratamiento</h2>
            <p>El responsable del tratamiento de los datos personales recogidos a través de este sitio web es <strong>SaverioLab</strong>, con correo electrónico de contacto: <a href="mailto:saveriolab3d@gmail.com" className="underline">saveriolab3d@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>2. Datos que recogemos</h2>
            <p>Recogemos los siguientes datos personales:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección postal (para gestión de recogidas)</li>
              <li>Datos de uso de la plataforma (recogidas solicitadas, saldo de descuento)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Gestionar tu cuenta de usuario y el acceso a la plataforma</li>
              <li>Coordinar la recogida de material de impresión 3D</li>
              <li>Gestionar el saldo de descuento acumulado</li>
              <li>Enviarte comunicaciones relacionadas con el estado de tus solicitudes</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>4. Base legal</h2>
            <p>El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li><strong>Ejecución de un contrato:</strong> para gestionar las recogidas y el programa de descuentos.</li>
              <li><strong>Consentimiento:</strong> para el envío de comunicaciones comerciales.</li>
              <li><strong>Interés legítimo:</strong> para la mejora de nuestros servicios.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>5. Conservación de datos</h2>
            <p>Conservamos tus datos mientras mantengas una cuenta activa en nuestra plataforma. Si solicitas la eliminación de tu cuenta, tus datos serán eliminados en un plazo máximo de 30 días, salvo obligación legal de conservarlos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>6. Comunicación a terceros</h2>
            <p>No vendemos ni cedemos tus datos a terceros. Podemos compartirlos con proveedores de servicios necesarios para el funcionamiento de la plataforma (como servicios de hosting o envío de correos electrónicos), siempre bajo acuerdos de confidencialidad y cumpliendo el RGPD.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>7. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos incorrectos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos.</li>
              <li><strong>Limitación:</strong> solicitar la restricción del tratamiento.</li>
            </ul>
            <p className="mt-3">Para ejercer cualquiera de estos derechos, contacta con nosotros en <a href="mailto:saveriolab3d@gmail.com" className="underline">saveriolab3d@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>8. Seguridad</h2>
            <p>Utilizamos medidas técnicas y organizativas adecuadas para proteger tus datos, incluyendo cifrado SSL, autenticación segura y almacenamiento en servidores con altos estándares de seguridad (Supabase/PostgreSQL).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>9. Cookies</h2>
            <p>Utilizamos cookies técnicas necesarias para el funcionamiento de la plataforma. Consulta nuestra <Link href="/cookies" className="underline">Política de Cookies</Link> para más información.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>10. Cambios en esta política</h2>
            <p>Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos por email o mediante un aviso en la plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>11. Contacto y reclamaciones</h2>
            <p>Si tienes cualquier duda sobre esta política, contacta con nosotros en <a href="mailto:saveriolab3d@gmail.com" className="underline">saveriolab3d@gmail.com</a>. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" className="underline">www.aepd.es</a>.</p>
          </section>

        </div>
      </main>

      <footer className="py-8 border-t bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} SaverioLab.</span>
          <div className="flex gap-4">
            <Link href="/terminos" className="hover:text-gray-900 transition">Términos</Link>
            <Link href="/privacidad" className="hover:text-gray-900 transition">Privacidad</Link>
            <Link href="/cookies" className="hover:text-gray-900 transition">Cookies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}