'use client';

import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
import WishlistGrid from '@/components/WishlistGrid';
import React, { useState } from 'react';
import GiftModal from '@/components/GiftModal';

const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Cáliz de Ordenación',
        description: 'Cáliz principal bañado en oro con detalles litúrgicos grabados a mano, esencial para la Eucaristía.',
        price_mxn: 5000,
        price_usd: 250,
        price_eur: 230,
        quantity_needed: 10,
        quantity_funded: 3,
        image_url: ''
    },
    {
        id: '2',
        name: 'Casulla Sacerdotal Blanca',
        description: 'Vestimenta sagrada de alta calidad para las celebraciones solemnes, con bordados dorados.',
        price_mxn: 3000,
        price_usd: 150,
        price_eur: 140,
        quantity_needed: 5,
        quantity_funded: 5,
        image_url: ''
    },
    {
        id: '3',
        name: 'Copón Grande',
        description: 'Vaso sagrado para la reserva de la Eucaristía, haciendo juego con el cáliz de ordenación.',
        price_mxn: 2500,
        price_usd: 125,
        price_eur: 115,
        quantity_needed: 5,
        quantity_funded: 2,
        image_url: ''
    }
];

export default function HomePage() {
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
                    products={MOCK_PRODUCTS as any}
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
