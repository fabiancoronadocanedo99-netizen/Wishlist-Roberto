import { defineRouting } from 'next-intl/routing';
import createMiddleware from 'next-intl/middleware';

export const routing = defineRouting({
    locales: ['es', 'it'],
    defaultLocale: 'es'
});

export const middleware = createMiddleware(routing);

