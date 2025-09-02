import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware for static files and API routes
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // For now, allow all requests to simplify the flow
  // The client-side AuthContext will handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
