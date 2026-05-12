'use client'
import Link from "next/link"
import Header from "@/components/Header"

const PRIMARY = '#1a3a4a'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header showBack={true} />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <h1 className="text-4xl font-bold mb-2" style={{ color: PRIMARY }}>Términos y Condiciones</h1>
        <p className="text-gray-400 text-sm mb-10">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>1. Aceptación de los términos</h2>
            <p>Al registrarte y utilizar la plataforma SaverioLab, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de ellos, no debes utilizar nuestros servicios.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>2. Descripción del servicio</h2>
            <p>SaverioLab es una plataforma que permite a los usuarios enviar restos de material de impresión 3D para su reciclaje, a cambio de créditos de descuento aplicables en futuras compras de filamento. El servicio incluye:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Gestión de solicitudes de recogida de material</li>
              <li>Acumulación de saldo de descuento (2€ por kg reciclado válido)</li>
              <li>Acceso al portal personal del usuario</li>
              <li>Envío de cajas para el empaquetado del material (sujeto a disponibilidad)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>3. Registro y cuenta</h2>
            <p>Para usar el servicio debes registrarte con datos verídicos. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas desde tu cuenta. SaverioLab no será responsable de pérdidas derivadas del uso no autorizado de tu cuenta.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>4. Programa de reciclaje y descuentos</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>El ratio de descuento es de <strong>2€ por kg</strong> de material reciclable válido recibido.</li>
              <li>SaverioLab se reserva el derecho de rechazar material que no sea apto para el reciclaje.</li>
              <li>El saldo acumulado no tiene fecha de caducidad mientras la cuenta esté activa.</li>
              <li>El saldo no es transferible ni canjeable por dinero en efectivo.</li>
              <li>SaverioLab puede modificar el ratio de descuento con un preaviso de 30 días.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>5. Servicio de cajas</h2>
            <p>Los usuarios pueden solicitar cajas para el envío de material. Cada solicitud tiene un coste de gestión de <strong>2€</strong> que se descuenta del saldo disponible. Las cajas incluyen:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>5 cajas por solicitud</li>
              <li>Instrucciones de empaquetado</li>
              <li>Etiqueta de envío prepagada (una vez confirmada la recogida)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>6. Obligaciones del usuario</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Proporcionar información veraz sobre el material enviado.</li>
              <li>No enviar materiales peligrosos, contaminados o no relacionados con la impresión 3D.</li>
              <li>Embalar el material adecuadamente para evitar daños durante el transporte.</li>
              <li>No usar la plataforma para actividades ilegales o fraudulentas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>7. Limitación de responsabilidad</h2>
            <p>SaverioLab no se hace responsable de daños indirectos, incidentales o consecuentes derivados del uso de la plataforma. La responsabilidad máxima de SaverioLab se limita al saldo de descuento acumulado en la cuenta del usuario.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>8. Modificaciones del servicio</h2>
            <p>SaverioLab se reserva el derecho de modificar, suspender o interrumpir el servicio en cualquier momento, notificando a los usuarios con un preaviso razonable salvo en casos de fuerza mayor.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>9. Cancelación de cuenta</h2>
            <p>Puedes cancelar tu cuenta en cualquier momento contactando con nosotros. Al cancelar, perderás el saldo de descuento acumulado. SaverioLab puede suspender o cancelar cuentas que incumplan estos términos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>10. Legislación aplicable</h2>
            <p>Estos términos se rigen por la legislación española. Para cualquier disputa, las partes se someten a los juzgados y tribunales del domicilio del usuario, conforme a la normativa de consumidores vigente.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: PRIMARY }}>11. Contacto</h2>
            <p>Para cualquier consulta sobre estos términos, contacta con nosotros en <a href="mailto:saveriolab3d@gmail.com" className="underline">saveriolab3d@gmail.com</a>.</p>
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