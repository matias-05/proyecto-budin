import { useState, useEffect } from "react";
import { db } from "../../data/firebase"; 
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";

export default function AdminContainer() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const [extraPrices, setExtraPrices] = useState(null);
    const [updatingExtras, setUpdatingExtras] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Cargar Productos
            const querySnapshot = await getDocs(collection(db, "products"));
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(docs);

            // 2. Cargar Precios de Extras (Colección 'config', documento 'precios_extras')
            const extrasRef = doc(db, "config", "precios_extras");
            const extrasSnap = await getDoc(extrasRef);
            if (extrasSnap.exists()) {
                setExtraPrices(extrasSnap.data());
            }
        };
        fetchData();
    }, []);

    // --- LÓGICA DE PRODUCTOS INDIVIDUALES ---
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const productRef = doc(db, "products", editingProduct.id);
            let finalImageUrl = editingProduct.imagen;
            const fileInput = e.target.foto.files[0];

            if (fileInput) {
                const formData = new FormData();
                formData.append("file", fileInput);
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: "POST", body: formData }
                );
                if (!response.ok) throw new Error("Error al subir a Cloudinary");
                const data = await response.json();
                finalImageUrl = data.secure_url; 
            }

            await updateDoc(productRef, {
                nombre: editingProduct.nombre,
                precios: editingProduct.precios,
                imagen: finalImageUrl 
            });

            alert("¡Budín actualizado!");
            setEditingProduct(null);
            setProducts(products.map(p => p.id === editingProduct.id ? {...editingProduct, imagen: finalImageUrl} : p));
        } catch (error) {
            console.error(error);
            alert("Error al guardar.");
        } finally {
            setUploading(false);
        }
    };

    // --- LÓGICA DE EXTRAS GLOBALES ---
    const handleUpdateExtras = async (e) => {
        e.preventDefault();
        setUpdatingExtras(true);
        try {
            const extrasRef = doc(db, "config", "precios_extras");
            await updateDoc(extrasRef, extraPrices);
            alert("¡Precios de agregados actualizados para toda la web!");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar extras.");
        } finally {
            setUpdatingExtras(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#681104] pt-32 pb-20 px-4 text-[#e37b00] font-['Dosis']">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase text-center mb-10 tracking-tighter">
                    Panel de Administración
                </h1>
                
                {/* SECCIÓN 1: PRODUCTOS */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold uppercase mb-6 border-b border-[#e37b00]/30 pb-2">Gestión de Budines</h2>
                    <div className="grid gap-4">
                        {products.map(p => (
                            <div key={p.id} className="bg-black/20 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                                <div className="flex items-center gap-4">
                                    <img src={p.imagen} className="w-16 h-16 object-cover rounded-xl" alt={p.nombre} />
                                    <div>
                                        <p className="font-black text-xl italic uppercase">{p.nombre}</p>
                                        <p className="text-white/60 font-bold text-sm">Base 500gr: ${p.precios["500gr"]}</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditingProduct(p)} className="bg-[#e37b00] text-[#681104] px-6 py-2 rounded-xl font-black uppercase">Editar</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECCIÓN 2: EXTRAS GLOBALES */}
                <div className="bg-black/30 p-8 rounded-[2.5rem] border-2 border-[#e37b00]/20">
                    <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter text-center">Precios de Agregados (Global)</h2>
                    
                    {extraPrices && (
                        <form onSubmit={handleUpdateExtras} className="grid gap-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {Object.keys(extraPrices).map((extra) => (
                                    <div key={extra} className="bg-[#681104] p-5 rounded-2xl border border-white/5">
                                        <h3 className="font-black uppercase mb-4 text-white italic">{extra.replace('_', ' ')}</h3>
                                        <div className="space-y-3">
                                            {['250gr', '300gr', '500gr'].map(peso => (
                                                <div key={peso} className="flex justify-between items-center gap-4">
                                                    <span className="font-bold text-sm opacity-70">{peso}:</span>
                                                    <div className="relative flex-1 max-w-[120px]">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
                                                        <input 
                                                            type="number"
                                                            className="w-full bg-black/40 border border-[#e37b00]/20 rounded-lg p-2 pl-7 text-white outline-none focus:border-[#e37b00]"
                                                            value={extraPrices[extra][peso]}
                                                            onChange={(e) => setExtraPrices({
                                                                ...extraPrices,
                                                                [extra]: { ...extraPrices[extra], [peso]: Number(e.target.value) }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                type="submit" 
                                disabled={updatingExtras}
                                className="w-full bg-[#e37b00] text-[#681104] py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-white transition-all disabled:opacity-50"
                            >
                                {updatingExtras ? "Actualizando..." : "Guardar todos los precios de extras"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* MODAL DE EDICIÓN PRODUCTO (YA EXISTENTE) */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <form onSubmit={handleUpdateProduct} className="bg-[#681104] p-8 rounded-[2rem] border-2 border-[#e37b00] max-w-md w-full shadow-2xl">
                        <h2 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">Editar Budín</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1 font-bold text-sm uppercase opacity-70">Precio base (500gr):</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 rounded-xl bg-black/20 border border-[#e37b00]/30 text-white outline-none"
                                    value={editingProduct.precios["500gr"]}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct, 
                                        precios: {...editingProduct.precios, "500gr": Number(e.target.value)}
                                    })}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold text-sm uppercase opacity-70">Nueva Foto:</label>
                                <input type="file" name="foto" accept="image/*" className="w-full text-xs text-white/50" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold">Cancelar</button>
                            <button type="submit" disabled={uploading} className="flex-1 bg-[#e37b00] text-[#681104] py-3 rounded-xl font-black uppercase">
                                {uploading ? "Subiendo..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}