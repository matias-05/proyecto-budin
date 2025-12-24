import { useState, useEffect } from "react";
import { db } from "../../data/firebase"; 
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminContainer() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(docs);
        };
        fetchProducts();
    }, []);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        setUploading(true);
        
        try {
            const productRef = doc(db, "products", editingProduct.id);
            let finalImageUrl = editingProduct.imagen;

            const fileInput = e.target.foto.files[0];

            // --- LÓGICA DE CLOUDINARY ---
            if (fileInput) {
                const formData = new FormData();
                formData.append("file", fileInput);
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) throw new Error("Error al subir a Cloudinary");

                const data = await response.json();
                finalImageUrl = data.secure_url; 
            }

            // --- ACTUALIZACIÓN EN FIREBASE ---
            await updateDoc(productRef, {
                nombre: editingProduct.nombre,
                precios: editingProduct.precios,
                imagen: finalImageUrl 
            });

            alert("¡Budín actualizado con éxito!");
            setEditingProduct(null);
            
            setProducts(products.map(p => p.id === editingProduct.id ? {...editingProduct, imagen: finalImageUrl} : p));

        } catch (error) {
            console.error("Error en el proceso:", error);
            alert("Hubo un error al guardar los cambios.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#681104] pt-32 pb-10 px-4 text-[#e37b00] font-['Dosis']">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase text-center mb-10 tracking-tighter">
                    Gestión de Budines
                </h1>
                
                <div className="grid gap-4">
                    {products.map(p => (
                        <div key={p.id} className="bg-black/20 p-4 rounded-2xl flex justify-between items-center border border-white/5 hover:border-[#e37b00]/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={p.imagen} className="w-20 h-20 object-cover rounded-xl shadow-lg" alt={p.nombre} />
                                <div>
                                    <p className="font-black text-xl md:text-2xl italic uppercase">{p.nombre}</p>
                                    <p className="text-white/60 font-bold">500gr: ${p.precios["500gr"]}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setEditingProduct(p)}
                                className="bg-[#e37b00] text-[#681104] px-6 py-2 rounded-xl font-black uppercase hover:bg-white transition-all active:scale-95"
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DE EDICIÓN */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <form onSubmit={handleUpdateProduct} className="bg-[#681104] p-8 rounded-[2rem] border-2 border-[#e37b00] max-w-md w-full shadow-2xl">
                        <h2 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">Editar Producto</h2>
                        
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1 font-bold text-sm uppercase opacity-70">Precio 500gr:</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 rounded-xl bg-black/20 border border-[#e37b00]/30 text-white outline-none focus:border-[#e37b00]"
                                    value={editingProduct.precios["500gr"]}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct, 
                                        precios: {...editingProduct.precios, "500gr": Number(e.target.value)}
                                    })}
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-bold text-sm uppercase opacity-70">Nueva Foto (opcional):</label>
                                <input 
                                    type="file" 
                                    name="foto" 
                                    accept="image/*"
                                    className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e37b00] file:text-[#681104] hover:file:bg-white" 
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button 
                                type="button" 
                                onClick={() => setEditingProduct(null)} 
                                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-red-500/20 hover:text-red-500 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="flex-1 bg-[#e37b00] text-[#681104] py-3 rounded-xl font-black uppercase shadow-lg hover:shadow-[#e37b00]/20 disabled:opacity-50"
                            >
                                {uploading ? "Guardando..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}