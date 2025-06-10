import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from './app/lib/supabase/middleware';
// Define las rutas que quieres proteger
// Por ejemplo, todo lo que esté dentro de /dashboard
const protectedRoutes = ['/dashboard/main'];

export async function middleware(request: NextRequest) {
  // Paso 1: Inicializar el cliente Supabase para el middleware
  const { supabase, response } = await createSupabaseMiddlewareClient(request);

  // Paso 2: Obtener la sesión del usuario
  // Esto intentará refrescar el token de la sesión si es necesario
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: { session }, error } = await supabase.auth.getSession();

  // Opcional: Log para depuración
  // console.log('Middleware Path:', request.nextUrl.pathname);
  // console.log('Session:', session);
  // if (error) console.error('Supabase getSession error in middleware:', error.message);

  // Paso 3: Verificar si la ruta actual es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Paso 4: Lógica de redirección
  if (isProtectedRoute) {
    if (!session) {
      // Si no hay sesión, redirigir a la página de login
      const redirectUrl = new URL('/login', request.url);
      // Opcional: Puedes añadir un parámetro de redirección para volver a la página original
      // redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
      console.log(`Redirigiendo de ${request.nextUrl.pathname} a ${redirectUrl.pathname} (no hay sesión)`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Si hay sesión o la ruta no está protegida, permitir que la solicitud continúe
  // Asegúrate de devolver la 'response' que puede haber sido modificada por Supabase
  // para actualizar las cookies de la sesión.
  return response;
}

// Configuración del matcher para el middleware
// Esto define qué rutas activarán este middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/ (API routes - if you want to protect them separately, add specific matchers)
     * - /login (your login page)
     * - /register (your registration page, if any)
     * - /forgot-password (password reset page, if any)
     * - /auth/callback (Supabase auth callback)
     * - / (your homepage, if it's public)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|login|register|forgot-password|auth/callback|$).*)',
  ],
};