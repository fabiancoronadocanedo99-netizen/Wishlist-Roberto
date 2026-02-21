export { middleware } from './routing';

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(es|it)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
