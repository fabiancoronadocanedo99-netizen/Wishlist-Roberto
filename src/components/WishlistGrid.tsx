'use client';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price_mxn: number;
    quantity_needed: number;
    quantity_funded: number;
    image_url: string;
}

interface WishlistGridProps {
    products: Product[];
    onSelectProduct: (product: Product) => void;
}

export default function WishlistGrid({ products, onSelectProduct }: WishlistGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 px-4 md:px-8 max-w-7xl mx-auto">
            {products.map((product, idx) => {
                const progress = Math.min(100, Math.round((product.quantity_funded / product.quantity_needed) * 100));
                const isComplete = product.quantity_funded >= product.quantity_needed;

                return (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={`glass-card overflow-hidden flex flex-col group ${isComplete ? 'opacity-60' : ''}`}
                    >
                        <div className="relative h-64 w-full bg-black/20">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-liturgic-gold)]/30">
                                    <Gift size={64} />
                                </div>
                            )}
                            {isComplete && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-[var(--color-liturgic-gold)] font-bold tracking-widest uppercase border border-[var(--color-liturgic-gold)] px-4 py-2 rounded">
                                        Completado
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-2xl font-semibold mb-2 text-white">{product.name}</h3>
                            <p className="text-white/60 mb-6 flex-grow">{product.description}</p>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/80">Progreso</span>
                                    <span className="text-[var(--color-liturgic-gold)] font-bold">
                                        {product.quantity_funded} / {product.quantity_needed}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-[var(--color-liturgic-gold)] h-2.5 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                disabled={isComplete}
                                onClick={() => onSelectProduct(product)}
                                className="w-full py-3 rounded-lg font-semibold tracking-wide transition-all
                  bg-[var(--color-liturgic-gold)] text-black hover:bg-white
                  disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                APADRINAR
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
