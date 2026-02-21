'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroVideo() {
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const target = new Date(process.env.NEXT_PUBLIC_EVENT_DATE || '2026-09-20').getTime();
        const updateCountdown = () => {
            const now = new Date().getTime();
            const diff = target - now;
            setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
        };
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000 * 60 * 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden rounded-b-[40px] shadow-2xl">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10"></div>

            {/* Fallback pattern if video is missing */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a0f_0%,#1a1528_50%,#0d1117_100%)] z-0"></div>

            <div className="relative z-20 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold text-[var(--color-liturgic-gold)] mb-4 tracking-tight"
                >
                    Ordenación Sacerdotal
                </motion.h1>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-5xl font-light text-white mb-8"
                >
                    H. Roberto Allison Coronado
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="inline-block glass-card px-8 py-4 mt-8"
                >
                    <p className="text-xl md:text-2xl font-medium text-white/90 uppercase tracking-widest">
                        Faltan <span className="text-[var(--color-liturgic-gold)] font-bold text-4xl mx-2">{daysLeft}</span> días
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
