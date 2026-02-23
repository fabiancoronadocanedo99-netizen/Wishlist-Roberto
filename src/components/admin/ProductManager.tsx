'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseBrowser';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import Image from 'next/image';

interface Product {
    id: string;
    name_es: string;
    name_it: string;
    description_es: string;
    description_it: string;
    price_mxn: number;
    price_usd: number;
    price_eur: number;
    quantity_needed: number;
    quantity_funded: number;
    category: string;
    image_url: string;
}

export default function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const supabase = createClient();

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
            alert('Error eliminando producto: ' + error.message);
        } else {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleCreateNew = () => {
        setEditingProduct({
            name_es: '',
            name_it: '',
            description_es: '',
            description_it: '',
            price_mxn: 0,
            price_usd: 0,
            price_eur: 0,
            quantity_needed: 1,
            category: 'Litúrgico',
            image_url: ''
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = editingProduct?.image_url || '';

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrlData.publicUrl;
            }

            const payload = {
                ...editingProduct,
                image_url: finalImageUrl
            };

            // Remove full objects that might cause issues if they exist
            delete payload.id;
            // Never overwrite quantity_funded on edit if it's new
            if (!editingProduct?.id) {
                (payload as any).quantity_funded = 0;
            }

            let responseError;
            let responseData;

            if (editingProduct?.id) {
                // Update
                const { data, error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProduct.id)
                    .select()
                    .single();
                responseError = error;
                responseData = data;
            } else {
                // Insert
                const { data, error } = await supabase
                    .from('products')
                    .insert([payload])
                    .select()
                    .single();
                responseError = error;
                responseData = data;
            }

            if (responseError) throw responseError;

            // Update local state
            if (editingProduct?.id) {
                setProducts(products.map(p => p.id === responseData.id ? responseData : p));
            } else {
                setProducts([responseData, ...products]);
            }

            setIsModalOpen(false);
        } catch (error: any) {
            alert('Error guardando producto: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-[var(--color-liturgic-gold)]">Inventario de Productos</h2>
                <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-liturgic-gold)] text-black rounded font-bold hover:bg-white transition-colors uppercase tracking-widest text-sm"
                >
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="glass-card p-4 flex flex-col group">
                        <div className="relative h-40 w-full mb-4 bg-black/30 rounded overflow-hidden">
                            {product.image_url ? (
                                <Image src={product.image_url} alt={product.name_es} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-white/20">Sin imagen</div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-white truncate" title={product.name_es}>{product.name_es}</h3>
                        <p className="text-sm text-white/50 mb-4">{product.category}</p>

                        <div className="flex flex-col gap-1 text-sm text-[var(--color-liturgic-gold)] font-mono mb-4">
                            <span> MXN {product.price_mxn}</span>
                            <span> USD {product.price_usd}</span>
                            <span className="flex-grow"> EUR {product.price_eur}</span>
                        </div>

                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                            <span className="text-white/70 text-sm">Meta: {product.quantity_needed}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(product)} className="text-white/50 hover:text-[var(--color-liturgic-gold)] p-1 transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="text-white/50 hover:text-red-500 p-1 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="glass-card w-full max-w-3xl my-8 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <form onSubmit={handleSave} className="p-8">
                            <h2 className="text-2xl font-bold text-[var(--color-liturgic-gold)] mb-6 uppercase tracking-wide">
                                {editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* ES */}
                                <div className="space-y-4">
                                    <h3 className="text-white font-bold border-b border-white/10 pb-2">Español</h3>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-1">Nombre</label>
                                        <input
                                            required
                                            type="text"
                                            value={editingProduct?.name_es || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, name_es: e.target.value })}
                                            className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-1">Descripción</label>
                                        <textarea
                                            required
                                            value={editingProduct?.description_es || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, description_es: e.target.value })}
                                            className="w-full bg-black/30 border border-white/20 rounded p-2 text-white h-24"
                                        />
                                    </div>
                                </div>

                                {/* IT */}
                                <div className="space-y-4">
                                    <h3 className="text-white font-bold border-b border-white/10 pb-2">Italiano</h3>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-1">Nombre</label>
                                        <input
                                            type="text"
                                            value={editingProduct?.name_it || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, name_it: e.target.value })}
                                            className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/70 mb-1">Descripción</label>
                                        <textarea
                                            value={editingProduct?.description_it || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, description_it: e.target.value })}
                                            className="w-full bg-black/30 border border-white/20 rounded p-2 text-white h-24"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm text-[var(--color-liturgic-gold)] mb-1">Precio MXN</label>
                                    <input
                                        required type="number"
                                        value={editingProduct?.price_mxn || 0}
                                        onChange={e => setEditingProduct({ ...editingProduct, price_mxn: Number(e.target.value) })}
                                        className="w-full bg-black/30 border border-[var(--color-liturgic-gold)]/50 rounded p-2 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--color-liturgic-gold)] mb-1">Precio USD</label>
                                    <input
                                        required type="number"
                                        value={editingProduct?.price_usd || 0}
                                        onChange={e => setEditingProduct({ ...editingProduct, price_usd: Number(e.target.value) })}
                                        className="w-full bg-black/30 border border-[var(--color-liturgic-gold)]/50 rounded p-2 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-[var(--color-liturgic-gold)] mb-1">Precio EUR</label>
                                    <input
                                        required type="number"
                                        value={editingProduct?.price_eur || 0}
                                        onChange={e => setEditingProduct({ ...editingProduct, price_eur: Number(e.target.value) })}
                                        className="w-full bg-black/30 border border-[var(--color-liturgic-gold)]/50 rounded p-2 text-white font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div>
                                    <label className="block text-sm text-white/70 mb-1">Categoría</label>
                                    <select
                                        value={editingProduct?.category || 'Litúrgico'}
                                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                        className="w-full bg-black/30 border border-white/20 rounded p-2 text-white"
                                    >
                                        <option value="Litúrgico">Litúrgico</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Viaje">Viaje</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/70 mb-1">Cantidad Necesaria</label>
                                    <input
                                        required type="number" min="1"
                                        value={editingProduct?.quantity_needed || 1}
                                        onChange={e => setEditingProduct({ ...editingProduct, quantity_needed: Number(e.target.value) })}
                                        className="w-full bg-black/30 border border-white/20 rounded p-2 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/70 mb-1">Nueva Imagen</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                setImageFile(e.target.files[0]);
                                            }
                                        }}
                                        className="w-full bg-black/30 border border-white/20 rounded p-1 text-white text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-liturgic-gold)] file:text-black hover:file:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 rounded font-bold tracking-widest uppercase bg-[var(--color-liturgic-gold)] text-black hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
