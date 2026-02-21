import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({ params }: { params: { locale: string } }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations('Index');

    return (
        <main className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-[var(--color-liturgic-gold)]">
                {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-center mb-12 opacity-80">
                {t('daysLeft', { days: 114 })}
            </p>

            {/* Placeholder for HeroVideo and WishlistGrid */}
            <div className="glass-card p-8 w-full max-w-4xl text-center">
                <p className="text-[var(--color-liturgic-gold)] text-lg">
                    [HeroVideo y WishlistGrid se insertarán aquí pronto]
                </p>
            </div>
        </main>
    );
}
