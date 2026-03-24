'use client';

import { useTranslations } from 'next-intl';
import HeroVideo from '@/components/HeroVideo';
import WishlistGrid from '@/components/WishlistGrid';
import React, { useState } from 'react';
import GiftModal from '@/components/GiftModal';
import { motion } from 'framer-motion';

export default function HomeClient({ products }: { products: any[] }) {
    const t = useTranslations('Index');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showWishlist, setShowWishlist] = useState(false);

    return (
        <main className="min-h-screen bg-[var(--background)]">
            <HeroVideo />

            {/* SECCIÓN I: INVITACIÓN A LA MISA */}
            <div className="py-16 max-w-4xl mx-auto px-4 text-center mt-10 relative">
                <blockquote className="text-xl md:text-2xl italic text-[var(--color-liturgic-gold)] mb-8 font-serif">
                    &quot;Jesús, fijando en él su mirada, le amó y le dijo: &quot;Ven y sígueme&quot; (Mc 10,21)&quot;
                </blockquote>

                <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 text-justify md:text-center">
                    &quot;Con gran alegría y profunda gratitud por la misericordia de Dios, quisiera compartir contigo un momento muy especial en mi vida. Me gustaría invitarte a la celebración de la misa en la que, por la gracia de Dios, seré ordenado diácono. Tu presencia y tu oración serán un regalo precioso en este día tan especial&quot;
                </p>

                {/* Photo 1 placeholder */}
                <div className="my-10">
                    <img
                        src="/foto_1.jpg"
                        alt="Ordenación Diaconal"
                        className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl border-2 border-[var(--color-liturgic-gold)]/50 object-cover aspect-video md:aspect-[4/3] bg-black/50"
                    />
                </div>

                <div className="bg-[var(--color-liturgic-gold)]/5 p-8 rounded-3xl glass-card mx-auto max-w-2xl border border-[var(--color-liturgic-gold)]/20 shadow-xl">
                    <p className="text-[var(--color-liturgic-gold)] font-bold text-2xl uppercase tracking-widest mb-4">Ordenación Diaconal</p>
                    <p className="text-white text-xl font-medium mb-1">5 de septiembre 2026</p>
                    <p className="text-white/80 text-lg mb-4">10:00 am</p>
                    <div className="w-16 h-px bg-[var(--color-liturgic-gold)]/30 mx-auto mb-4"></div>
                    <p className="text-white/90 text-lg font-light">Santuario de los Mártires de Cristo Rey</p>
                </div>
            </div>

            {/* SECCIÓN II: LISTA DE DESEOS */}
            <div className="py-16 max-w-5xl mx-auto px-4 border-t border-white/5">
                <h2 className="text-4xl text-center font-bold text-[var(--color-liturgic-gold)] tracking-wide uppercase mb-6">
                    Lista de Deseos
                </h2>

                <div className="max-w-3xl mx-auto">
                    <p className="text-center text-white/80 mb-10 leading-relaxed text-lg text-justify md:text-center italic">
                        &quot;En este momento tan especial, muchos me han preguntado de qué manera podrían acompañarme también con un gesto concreto. Con sencillez, quisiera compartir esta pequeña &apos;wishlist&apos; con algunos artículos que me serán de mucha utilidad en mi futuro ministerio. Quienes lo deseen, pueden colaborar apadrinando alguno de ellos. Por supuesto, se trata de una invitación libre y voluntaria. Tu presencia, afecto y oración es para mí el regalo más valioso&quot;
                    </p>
                </div>

                <div className="flex justify-center mb-12">
                    <button
                        onClick={() => setShowWishlist(!showWishlist)}
                        className="bg-[var(--color-liturgic-gold)] text-[var(--background)] px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(230,195,135,0.3)] hover:shadow-[0_0_30px_rgba(230,195,135,0.5)] transform hover:-translate-y-1"
                    >
                        {showWishlist ? 'Ocultar Lista de Regalos' : 'Ver Lista de Regalos'}
                    </button>
                </div>

                {showWishlist && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <WishlistGrid
                            products={products}
                            onSelectProduct={setSelectedProduct}
                        />
                    </motion.div>
                )}
            </div>

            {/* SECCIÓN III: FAMILIA */}
            <div className="py-16 max-w-4xl mx-auto px-4 text-center border-t border-white/5 mb-10">
                {/* Photo 2 placeholder */}
                <div className="mb-10">
                    <img
                        src="/foto_2.jpg"
                        alt="Mi familia"
                        className="w-full max-w-2xl mx-auto rounded-3xl shadow-2xl border-2 border-[var(--color-liturgic-gold)]/50 object-cover aspect-video md:aspect-[4/3] bg-black/50"
                    />
                </div>

                <p className="text-white/90 text-xl md:text-2xl leading-relaxed italic max-w-2xl mx-auto font-serif">
                    &quot;Y les pido, por último, una oración a estos grandes héroes que me han acompañado durante estos 19 años: ¡mi familia!&quot;
                </p>
            </div>

            <GiftModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </main>
    );
}
