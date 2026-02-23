import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import ProductManager from '@/components/admin/ProductManager';

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const authorizedEmails = (process.env.BENEFICIARY_EMAIL || '').split(',').map(e => e.trim());
    if (!user || user.email == null || !authorizedEmails.includes(user.email)) {
        redirect('/admin/login');
    }

    // Fetch Donations with Product Joined
    const { data: donations } = await supabase
        .from('donations')
        .select(`
      *,
      products ( name_es )
    `)
        .order('created_at', { ascending: false });

    // Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    // Calculate Totals manually per currency
    let totalMXN = 0;
    let totalUSD = 0;
    let totalEUR = 0;

    if (donations) {
        donations.forEach(d => {
            if (d.status === 'completed') {
                if (d.currency === 'MXN') totalMXN += d.amount_paid;
                else if (d.currency === 'USD') totalUSD += d.amount_paid;
                else if (d.currency === 'EUR') totalEUR += d.amount_paid;
            }
        });
    }

    return (
        <main className="min-h-screen pt-12 p-4 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-[var(--color-liturgic-gold)] mb-12">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-6 flex flex-col justify-center items-center">
                    <p className="text-white/60 mb-2 uppercase tracking-wide">Recaudado (MXN)</p>
                    <p className="text-4xl font-bold text-[var(--color-liturgic-gold)]">${totalMXN.toLocaleString('es-MX')}</p>
                </div>
                <div className="glass-card p-6 flex flex-col justify-center items-center">
                    <p className="text-white/60 mb-2 uppercase tracking-wide">Recaudado (USD)</p>
                    <p className="text-4xl font-bold text-[var(--color-liturgic-gold)]">${totalUSD.toLocaleString('en-US')}</p>
                </div>
                <div className="glass-card p-6 flex flex-col justify-center items-center">
                    <p className="text-white/60 mb-2 uppercase tracking-wide">Recaudado (EUR)</p>
                    <p className="text-4xl font-bold text-[var(--color-liturgic-gold)]">€{totalEUR.toLocaleString('es-ES')}</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[var(--color-liturgic-gold)]">
                                <th className="p-4 font-semibold">Padrino / Madrina</th>
                                <th className="p-4 font-semibold">Regalo</th>
                                <th className="p-4 font-semibold">Monto</th>
                                <th className="p-4 font-semibold">Estado</th>
                                <th className="p-4 font-semibold">Dedicatoria</th>
                            </tr>
                        </thead>
                        <tbody className="text-white/90">
                            {donations?.map((don) => (
                                <tr key={don.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">{don.donor_name} <br /><span className="text-xs text-white/40">{don.donor_email}</span></td>
                                    <td className="p-4">{(don.products as any)?.name_es}</td>
                                    <td className="p-4 font-mono">{don.currency} {don.amount_paid}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${don.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-500/30' : 'bg-yellow-900/50 text-yellow-500 border border-yellow-500/30'}`}>
                                            {don.status}
                                        </span>
                                    </td>
                                    <td className="p-4 italic text-sm">{don.dedication_message || '-'}</td>
                                </tr>
                            ))}
                            {(!donations || donations.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/50">Aún no hay donaciones registradas</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductManager initialProducts={products as any} />
        </main>
    );
}
