import { middleware as intlMiddleware } from './routing';
import { updateSession } from '@/utils/supabase/middleware';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // First, check auth and refresh token if needed
    const supabaseResponse = await updateSession(request);

    // Skip i18n for auth callbacks
    if (request.nextUrl.pathname.startsWith('/auth')) {
        return supabaseResponse;
    }

    // Apply i18n routing logic
    const response = intlMiddleware(request);

    // Copy auth cookies from supabaseResponse to the final response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value);
    });

    return response;
}

export const config = {
    // Match only internationalized pathnames and admin routes
    matcher: ['/', '/(es|it)/:path*', '/admin/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
