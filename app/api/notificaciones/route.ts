import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const statusMessages: Record<string, { subject: string; mensaje: string }> = {
  confirmed: {
    subject: '✅ Tu recogida ha sido confirmada — SaverioLab',
    mensaje: 'Hemos confirmado tu solicitud de recogida. Nos pondremos en contacto contigo para coordinar los detalles del transporte.',
  },
  collected: {
    subject: '📦 Tu material ha sido recogido — SaverioLab',
    mensaje: 'Hemos recogido tu material correctamente. En breve lo procesaremos en nuestro laboratorio y recibirás tu saldo de descuento.',
  },
  cancelled: {
    subject: '❌ Tu recogida ha sido cancelada — SaverioLab',
    mensaje: 'Lamentablemente tu recogida ha sido cancelada. Si tienes alguna duda, contáctanos y te ayudaremos.',
  },
}

export async function POST(req: Request) {
  try {
    const { email, status, pickupId, materialType } = await req.json()

    const info = statusMessages[status]
    if (!info) return NextResponse.json({ ok: true }) // no enviar para otros estados

    const { error } = await resend.emails.send({
      from: 'SaverioLab <onboarding@resend.dev>',
      to: email,
      subject: info.subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png" 
               alt="SaverioLab" style="height: 48px; margin-bottom: 24px;" />
          
          <h2 style="color: #1a3a4a; margin-bottom: 8px;">${info.subject.replace(/^[^ ]+ /, '')}</h2>
          
          <p style="color: #6b7280; line-height: 1.6;">${info.mensaje}</p>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; color: #374151; font-size: 14px;">
              <strong>Recogida:</strong> #${pickupId.slice(0, 8)}<br/>
              <strong>Material:</strong> ${materialType}
            </p>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal/recogidas"
             style="display: inline-block; background: #1a3a4a; color: white; padding: 12px 24px; 
                    border-radius: 8px; text-decoration: none; font-weight: 500;">
            Ver mis recogidas
          </a>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
            © ${new Date().getFullYear()} SaverioLab. Todos los derechos reservados.
          </p>
        </div>
      `,
    })

    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ ok: true })

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 })
  }
}