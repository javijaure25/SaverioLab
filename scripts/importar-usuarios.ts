import { createClient } from '@supabase/supabase-js'

// ⚠️ Usa la SERVICE ROLE KEY, nunca en frontend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// 👇 PON AQUÍ TUS USUARIOS DE WIX
const usuarios = [
  {
    email: 'usuario1@email.com',
    full_name: 'Nombre Apellido',
    phone: '+34 600 000 001',
    address: 'Calle Mayor 1',
    city: 'Madrid',
    postal_code: '28001',
  },
  {
    email: 'usuario2@email.com',
    full_name: 'Nombre Apellido',
    phone: '+34 600 000 002',
    address: 'Calle Ejemplo 2',
    city: 'Barcelona',
    postal_code: '08001',
  },
  // ... añade todos los usuarios aquí
]

async function importar() {
  console.log(`Importando ${usuarios.length} usuarios...`)

  for (const u of usuarios) {
    // 1. Crear usuario en Supabase Auth (sin contraseña, recibirán email para ponerla)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      email_confirm: true, // email ya confirmado, no necesitan verificar
      password: Math.random().toString(36).slice(-12) + 'Aa1!', // contraseña temporal aleatoria
    })

    if (authError) {
      console.error(`❌ Error creando ${u.email}:`, authError.message)
      continue
    }

    const userId = authData.user.id

    // 2. Actualizar perfil con sus datos
    const { error: profileError } = await supabase.from('profiles').update({
      full_name: u.full_name,
      phone: u.phone,
      address: u.address,
      city: u.city,
      postal_code: u.postal_code,
      role: 'user',
    }).eq('id', userId)

    if (profileError) {
      console.error(`❌ Error perfil ${u.email}:`, profileError.message)
    } else {
      console.log(`✅ ${u.email} importado correctamente`)
    }
  }

  console.log('\n✅ Importación completada.')
  console.log('Cuando publiques la web, ejecuta: npx tsx scripts/enviar-bienvenida.ts')
}

importar()