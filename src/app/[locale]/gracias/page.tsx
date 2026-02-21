import { createClient } from '@/lib/supabaseServer';

export default async function GraciasPage() {
    const supabase = await createClient();

    // Fetch only public, completed donations to show on the wall
    const { data: benefactors } = await supabase
        .from('donations')
        .select(`
      id,
      donor_name,
      dedication_message,
      products ( name_es )
    `)
        .eq('status', 'completed')
        .eq('show_on_wall', true)
        .order('created_at', { ascending: true });

    return (
        <main className="min-h-screen pt-24 p-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-[var(--color-liturgic-gold)] tracking-wide uppercase mb-4">
                    Muro de Benefactores
                </h1>
                <p className="text-center text-white/70 mb-16 max-w-2xl mx-auto">
                    Un agradecimiento infinito a todos aquellos que con su generosidad hacen posible este camino hacia la ordenación sacerdotal.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefactors?.map((ben) => (
                        <div key={ben.id} className="glass-card p-6 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:border-[var(--color-liturgic-gold)]">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{ben.donor_name}</h3>
                                <p className="text-sm text-[var(--color-liturgic-gold)] mb-4">
                                    Apadrinó: {(ben.products as any)?.name_es}
                                </p>
                                {ben.dedication_message && (
                                    <p className="text-white/80 italic text-sm">"{ben.dedication_message}"</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!benefactors || benefactors.length === 0) && (
                        <div className="col-span-full text-center p-12 glass-card">
                            <p className="text-white/50 text-lg">Sé el primero en formar parte de nuestra historia.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
