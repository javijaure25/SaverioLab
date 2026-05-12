import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      ),
    }
  })

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (!user && (path.startsWith('/portal') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  return response
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/login'],
}