'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function GiftModal({ isOpen, onClose, product }: GiftModalProps) {
    const [currency, setCurrency] = useState('MXN');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Connect to Stripe Checkout Route
        setTimeout(() => {
            setLoading(false);
            alert('Checkout Stripe irá aquí');
        }, 1000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    onClick={onClose}
                ></motion.div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg glass-card p-8 border border-[var(--color-liturgic-gold)]/30"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                        <X size={24} />
                    </button>

                    <h2 className="text-3xl font-bold text-[var(--color-liturgic-gold)] mb-2">Un Regalo Especial</h2>
                    <p className="text-white/70 mb-6">Estás apoyando con: <strong className="text-white">{product.name}</strong></p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Moneda</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-liturgic-gold)]"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                >
                                    <option value="MXN">MXN Pesos</option>
                                    <option value="USD">USD Dólares</option>
                                    <option value="EUR">EUR Euros</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-white/60 mb-1">Monto aportado</label>
                                <div className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/50">
                                    {currency === 'MXN' ? '$' + product.price_mxn : currency === 'USD' ? '$' + product.price_usd : '€' + product.price_eur}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1">Tu Nombre</label>
                            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-liturgic-gold)]" />
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1">Tu Correo</label>
                            <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-liturgic-gold)]" />
                        </div>

                        <div>
                            <label className="block text-sm text-white/60 mb-1">Dedicatoria para Roberto</label>
                            <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-liturgic-gold)] resize-none" placeholder="Unas palabras de cariño..."></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-4 rounded-lg font-bold tracking-widest uppercase transition-all
                bg-[var(--color-liturgic-gold)] text-black hover:bg-white
                disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? 'Procesando...' : 'Ir a Pagar'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
