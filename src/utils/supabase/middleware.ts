import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isApiRoute = request.nextUrl.pathname.startsWith('/api') || request.nextUrl.pathname.startsWith('/(es|it)/api')
    const isAdminRoute = request.nextUrl.pathname.includes('/admin')
    const isAuthRoute = request.nextUrl.pathname.includes('/admin/login')

    if (isAdminRoute && !isAuthRoute && !isApiRoute) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/es/admin/login'
            return NextResponse.redirect(url)
        }
        if (user.email !== process.env.BENEFICIARY_EMAIL) {
            const url = request.nextUrl.clone()
            url.pathname = '/es/'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse;
}
