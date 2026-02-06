import { useState } from "react";
import { db } from "../../data/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Importamos deleteDoc
import { Plus, Edit3, Trash2, AlertTriangle } from "lucide-react"; // Importamos Trash2 y AlertTriangle
import { uploadToCloudinary } from "./adminUtils";

export default function BudinesManager({ products, setProducts }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- ESTADOS PARA LA ELIMINACIÓN ---
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      const { id, ...dataToSave } = editingProduct;

      await updateDoc(productRef, {
        ...dataToSave,
        imagen: finalImageUrl,
      });

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
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el producto. Revisa la consola.");
    } finally {
      setUploading(false);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "products", productToDelete.id));
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
      alert("Budín eliminado con éxito.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el budín.");
    } finally {
      setIsDeleting(false);
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

            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(p)}
                className="p-3 text-[#e37b00] hover:bg-white/5 rounded-xl transition-colors"
              >
                <Edit3 size={20} />
              </button>

              {/* BOTÓN DE BORRAR */}
              <button
                onClick={() => setProductToDelete(p)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
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

      {/* --- MODAL DE CONFIRMACIÓN PARA BORRAR --- */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[110] p-4 font-['Dosis']">
          <div className="bg-[#681104] p-8 rounded-[3rem] border-2 border-red-500 max-w-sm w-full text-center animate-in zoom-in duration-300">
            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-red-500 text-2xl font-black uppercase italic mb-2">
              ¿Eliminar Budín?
            </h3>
            <p className="text-white/80 mb-8">
              Vas a borrar definitivamente el budín <br />
              <span className="text-white font-bold">
                "{productToDelete.nombre}"
              </span>
              .
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="bg-red-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-white hover:text-red-500 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-white/60 font-bold py-2 uppercase text-sm tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
