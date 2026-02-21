import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'esbozeywnldxoiqzxsxw.supabase.co',
                pathname: '/storage/v1/object/public/**',
            }
        ]
    }
};

export default withNextIntl(nextConfig);
