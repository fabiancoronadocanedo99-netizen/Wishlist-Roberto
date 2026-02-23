export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabaseServer';
import HomeClient from '@/components/HomeClient';
import { getTranslations } from 'next-intl/server';

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
    const params = await props.params;
    const { locale } = params;

    const supabase = await createClient();
    const { data: rawProducts } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

    // Map fields so the grid component gets 'name' and 'description' correctly mapped to the locale
    const mappedProducts = (rawProducts || []).map((p: any) => ({
        ...p,
        name: locale === 'it' && p.name_it ? p.name_it : p.name_es,
        description: locale === 'it' && p.description_it ? p.description_it : p.description_es
    }));

    return (
        <HomeClient products={mappedProducts} />
    );
}
