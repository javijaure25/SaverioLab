import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { nombre, apellido, email, mensaje } = await req.json()

    const { error } = await resend.emails.send({
      from: 'SaverioLab <onboarding@resend.dev>',
      to: 'javijaure25@gmail.com',
      subject: `Nuevo mensaje de contacto — ${nombre} ${apellido}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <img src="https://static.wixstatic.com/media/dd39ed_659391c883094dfebe1cdbf6f2ea5ed8~mv2.png"
               alt="SaverioLab" style="height:48px;margin-bottom:24px;" />
          <h2 style="color:#1a3a4a;margin-bottom:16px;">Nuevo mensaje de contacto</h2>
          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:16px;">
            <p style="margin:0 0 8px;color:#374151;font-size:14px;">
              <strong>Nombre:</strong> ${nombre} ${apellido}
            </p>
            <p style="margin:0;color:#374151;font-size:14px;">
              <strong>Email:</strong> ${email}
            </p>
          </div>
          <div style="background:#f9fafb;border-radius:12px;padding:16px;">
            <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Mensaje:</strong></p>
            <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">${mensaje}</p>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:32px;">
            © ${new Date().getFullYear()} SaverioLab.
          </p>
        </div>
      `,
    })

    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json({ ok: true })

  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}