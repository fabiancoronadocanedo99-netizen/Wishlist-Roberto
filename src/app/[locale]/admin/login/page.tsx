'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { useTranslations } from 'next-intl';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('¡Enlace mágico enviado! Revisa tu correo.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="glass-card p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-[var(--color-liturgic-gold)] mb-6 text-center">Acceso Admin</h1>
                <p className="text-white/70 mb-8 text-center">
                    Ingresa tu correo autorizado para recibir un enlace de acceso seguro.
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="fabiancoronadocanedo99@gmail.com"
                        className="bg-white/5 border border-white/10 p-4 rounded-lg text-white focus:outline-none focus:border-[var(--color-liturgic-gold)]"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-lg font-bold tracking-widest uppercase transition-all bg-[var(--color-liturgic-gold)] text-black hover:bg-white disabled:opacity-50"
                    >
                        {loading ? 'Enviando...' : 'Enviar Magic Link'}
                    </button>
                </form>

                {message && (
                    <p className="mt-6 text-center text-[var(--color-liturgic-gold)] bg-black/30 p-3 rounded">{message}</p>
                )}
            </div>
        </div>
    );
}
