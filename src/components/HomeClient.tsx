'use client';

import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
import WishlistGrid from '@/components/WishlistGrid';
import React, { useState } from 'react';
import GiftModal from '@/components/GiftModal';

export default function HomeClient({ products }: { products: any[] }) {
    const t = useTranslations('Index');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <HeroVideo />

            <div className="py-12">
                <h2 className="text-4xl text-center font-bold text-[var(--color-liturgic-gold)] tracking-wide uppercase mb-2">
                    La Lista de Regalos
                </h2>
                <p className="text-center text-white/60 mb-8 max-w-2xl mx-auto px-4">
                    Cada aporte nos acerca más a la meta. Elige el artículo con el que deseas contribuir al ministerio sacerdotal de Roberto.
                </p>

                <WishlistGrid
                    products={products}
                    onSelectProduct={setSelectedProduct}
                />
            </div>

            <GiftModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </main>
    );
}
