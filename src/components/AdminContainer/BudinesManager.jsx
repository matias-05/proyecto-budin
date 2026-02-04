import { useState } from "react";
import { db } from "../../data/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Edit3 } from "lucide-react";
import { uploadToCloudinary } from "./adminUtils";

export default function BudinesManager({ products, setProducts }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    precios: { "250gr": 0, "300gr": 0, "500gr": 0 },
    imagen: "",
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const file = e.target.foto.files[0];
      if (!file) return alert("Selecciona una foto");
      const imageUrl = await uploadToCloudinary(file);
      const docRef = await addDoc(collection(db, "products"), {
        ...newProduct,
        imagen: imageUrl,
      });
      setProducts([
        ...products,
        { id: docRef.id, ...newProduct, imagen: imageUrl },
      ]);
      setIsAddingProduct(false);
      setNewProduct({
        nombre: "",
        precios: { "250gr": 0, "300gr": 0, "500gr": 0 },
        imagen: "",
      });
      alert("¡Budín creado!");
    } catch (error) {
      alert("Error al crear budín");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const productRef = doc(db, "products", editingProduct.id);
      let finalImageUrl = editingProduct.imagen;
      const file = e.target.foto.files[0];
      if (file) finalImageUrl = await uploadToCloudinary(file);
      await updateDoc(productRef, { ...editingProduct, imagen: finalImageUrl });
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...editingProduct, imagen: finalImageUrl }
            : p,
        ),
      );
      setEditingProduct(null);
      alert("¡Budín actualizado!");
    } catch (error) {
      alert("Error al actualizar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase italic text-[#e37b00]">
          Budines
        </h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-green-600 text-white p-2 rounded-full hover:rotate-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-[#681104] p-3 rounded-2xl flex justify-between items-center border border-white/5"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.imagen}
                className="w-14 h-14 object-cover rounded-xl"
                alt=""
              />
              <p className="font-black uppercase italic text-lg text-[#e37b00]">
                {p.nombre}
              </p>
            </div>
            <button
              onClick={() => setEditingProduct(p)}
              className="p-3 text-[#e37b00] hover:bg-white/5 rounded-xl"
            >
              <Edit3 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[100] p-4 font-['Dosis']">
          <form
            onSubmit={handleAddProduct}
            className="bg-[#681104] p-8 rounded-[3rem] border-2 border-green-500 max-w-md w-full animate-in zoom-in"
          >
            <h2 className="text-3xl font-black mb-8 italic uppercase text-green-500">
              Nuevo Budín
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                required
                placeholder="Nombre"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white outline-none"
                value={newProduct.nombre}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, nombre: e.target.value })
                }
              />
              <div className="grid grid-cols-3 gap-3">
                {["250gr", "300gr", "500gr"].map((peso) => (
                  <input
                    key={peso}
                    type="number"
                    required
                    placeholder={peso}
                    className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                    value={newProduct.precios[peso]}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        precios: {
                          ...newProduct.precios,
                          [peso]: Number(e.target.value),
                        },
                      })
                    }
                  />
                ))}
              </div>
              <input
                type="file"
                name="foto"
                required
                className="w-full text-xs text-white/30 p-4 border border-dashed border-white/10 rounded-2xl"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="flex-1 text-white font-bold uppercase"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase"
              >
                {uploading ? "Subiendo..." : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[100] p-4 font-['Dosis']">
          <form
            onSubmit={handleUpdateProduct}
            className="bg-[#681104] p-8 rounded-[3rem] border-2 border-[#e37b00] max-w-md w-full"
          >
            <h2 className="text-3xl font-black mb-8 italic uppercase text-[#e37b00]">
              Editar Budín
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                value={editingProduct.nombre}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    nombre: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-3 gap-3">
                {["250gr", "300gr", "500gr"].map((peso) => (
                  <input
                    key={peso}
                    type="number"
                    className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-white"
                    value={editingProduct.precios[peso]}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        precios: {
                          ...editingProduct.precios,
                          [peso]: Number(e.target.value),
                        },
                      })
                    }
                  />
                ))}
              </div>
              <input
                type="file"
                name="foto"
                className="w-full text-xs text-white/30 p-4 border border-dashed border-white/10 rounded-2xl"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="flex-1 text-white font-bold uppercase"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-[#e37b00] text-[#681104] py-4 rounded-2xl font-black uppercase"
              >
                {uploading ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
