import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const resend = new Resend(process.env.RESEND_API_KEY)

// 👇 Cambia esto por tu URL de producción cuando publiques
const APP_URL = 'https://saveriolab.vercel.app'

async function enviarBienvenida() {
  // Obtener todos los usuarios
  const { data: usuarios, error } = await supabase.auth.admin.listUsers()
  if (error) { console.error('Error:', error); return }

  console.log(`Enviando emails a ${usuarios.users.length} usuarios...`)

  for (const user of usuarios.users) {
    // Generar link de reset password (para que pongan su contraseña)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: user.email!,
      options: { redirectTo: `${APP_URL}/reset-password` }
    })

    if (linkError) {
      console.error(`❌ Error generando link para ${user.email}:`, linkError.message)
      continue
    }

    const resetLink = linkData.properties.action_link

    // Enviar email de bienvenida
    const { error: emailError } = await resend.emails.send({
      from: 'SaverioLab <onboarding@resend.dev>',
      to: user.email!,
      subject: '🌿 Bienvenido a la nueva plataforma SaverioLab',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
               alt="SaverioLab" style="height:48px;margin-bottom:24px;" />

          <h2 style="color:#1a3a4a;margin-bottom:8px;">¡Hemos renovado SaverioLab!</h2>
          
          <p style="color:#6b7280;line-height:1.6;">
            Hola, nos complace anunciarte que hemos lanzado nuestra nueva plataforma web, 
            más completa y fácil de usar.
          </p>

          <p style="color:#6b7280;line-height:1.6;">
            Hemos migrado tu cuenta con todos tus datos. Solo necesitas establecer 
            una contraseña para acceder.
          </p>

          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:24px 0;">
            <p style="margin:0;color:#374151;font-size:14px;">
              <strong>Tu email:</strong> ${user.email}
            </p>
          </div>

          <a href="${resetLink}"
             style="display:inline-block;background:#1a3a4a;color:white;padding:14px 28px;
                    border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
            Establecer mi contraseña →
          </a>

          <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
            Este enlace expira en 24 horas. Si tienes alguna duda, 
            contáctanos en saveriolab3d@gmail.com
          </p>

          <p style="color:#9ca3af;font-size:12px;">
            © ${new Date().getFullYear()} SaverioLab. Todos los derechos reservados.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error(`❌ Error enviando email a ${user.email}:`, emailError)
    } else {
      console.log(`✅ Email enviado a ${user.email}`)
    }

    // Esperar 200ms entre emails para no saturar
    await new Promise(r => setTimeout(r, 200))
  }

  console.log('\n✅ Todos los emails enviados.')
}

enviarBienvenida()