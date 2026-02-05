import { useState } from "react";
import { db } from "../../data/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // Agregamos deleteDoc
import { Plus, Edit3, Trash2, AlertTriangle } from "lucide-react"; // Agregamos Trash2 y AlertTriangle
import { uploadToCloudinary } from "./adminUtils";

export default function CombosManager({ combos, setCombos }) {
  const [editingCombo, setEditingCombo] = useState(null);
  const [isAddingCombo, setIsAddingCombo] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- ESTADOS PARA BORRAR ---
  const [comboToDelete, setComboToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newCombo, setNewCombo] = useState({
    nombre: "",
    descripcion: "",
    precioOriginal: 0,
    precioCombo: 0,
    tag: "",
    imagen: "",
  });

  const handleAddCombo = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const file = e.target.foto.files[0];
      if (!file) return alert("Selecciona una foto");
      const imageUrl = await uploadToCloudinary(file);
      const docRef = await addDoc(collection(db, "combos"), {
        ...newCombo,
        imagen: imageUrl,
      });
      setCombos([...combos, { id: docRef.id, ...newCombo, imagen: imageUrl }]);
      setIsAddingCombo(false);
      setNewCombo({
        nombre: "",
        descripcion: "",
        precioOriginal: 0,
        precioCombo: 0,
        tag: "",
        imagen: "",
      });
      alert("¡Combo creado!");
    } catch (error) {
      alert("Error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateCombo = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const comboRef = doc(db, "combos", editingCombo.id);
      let finalImageUrl = editingCombo.imagen;
      const file = e.target.foto.files[0];
      if (file) finalImageUrl = await uploadToCloudinary(file);

      // Limpiamos el ID antes de enviar a Firestore
      const { id, ...dataToUpdate } = editingCombo;

      await updateDoc(comboRef, { ...dataToUpdate, imagen: finalImageUrl });
      setCombos(
        combos.map((c) =>
          c.id === editingCombo.id
            ? { ...editingCombo, imagen: finalImageUrl }
            : c,
        ),
      );
      setEditingCombo(null);
      alert("¡Combo actualizado!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    } finally {
      setUploading(false);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleDeleteCombo = async () => {
    if (!comboToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "combos", comboToDelete.id));
      setCombos(combos.filter((c) => c.id !== comboToDelete.id));
      setComboToDelete(null);
      alert("Combo eliminado con éxito.");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el combo.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase italic text-[#e37b00]">
          Combos
        </h2>
        <button
          onClick={() => setIsAddingCombo(true)}
          className="bg-blue-600 text-white p-2 rounded-full hover:rotate-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid gap-3">
        {combos.map((c) => (
          <div
            key={c.id}
            className="bg-[#681104] p-3 rounded-2xl flex justify-between items-center border border-white/5"
          >
            <div className="flex items-center gap-4">
              <img
                src={c.imagen}
                className="w-14 h-14 object-cover rounded-xl"
                alt=""
              />
              <p className="font-black uppercase italic text-lg text-[#e37b00]">
                {c.nombre}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingCombo(c)}
                className="p-3 text-[#e37b00] hover:bg-white/5 rounded-xl transition-colors"
              >
                <Edit3 size={20} />
              </button>

              {/* BOTÓN DE BORRAR */}
              <button
                onClick={() => setComboToDelete(c)}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL AGREGAR (Sin cambios) */}
      {isAddingCombo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[100] p-4 font-['Dosis']">
          <form
            onSubmit={handleAddCombo}
            className="bg-[#681104] p-8 rounded-[3rem] border-2 border-blue-500 max-w-md w-full animate-in zoom-in"
          >
            <h2 className="text-3xl font-black mb-6 italic uppercase text-blue-500">
              Nuevo Combo
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                required
                placeholder="Título"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white outline-none"
                value={newCombo.nombre}
                onChange={(e) =>
                  setNewCombo({ ...newCombo, nombre: e.target.value })
                }
              />
              <textarea
                required
                placeholder="Descripción"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white outline-none h-24 resize-none"
                value={newCombo.descripcion}
                onChange={(e) =>
                  setNewCombo({ ...newCombo, descripcion: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  required
                  placeholder="Real $"
                  className="p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                  value={newCombo.precioOriginal}
                  onChange={(e) =>
                    setNewCombo({
                      ...newCombo,
                      precioOriginal: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  required
                  placeholder="Oferta $"
                  className="p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                  value={newCombo.precioCombo}
                  onChange={(e) =>
                    setNewCombo({
                      ...newCombo,
                      precioCombo: Number(e.target.value),
                    })
                  }
                />
              </div>
              <input
                type="text"
                placeholder="Tag"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                value={newCombo.tag}
                onChange={(e) =>
                  setNewCombo({ ...newCombo, tag: e.target.value })
                }
              />
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
                onClick={() => setIsAddingCombo(false)}
                className="flex-1 text-white font-bold uppercase"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL EDITAR (Sin cambios) */}
      {editingCombo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[100] p-4 font-['Dosis']">
          <form
            onSubmit={handleUpdateCombo}
            className="bg-[#681104] p-8 rounded-[3rem] border-2 border-blue-500 max-w-md w-full"
          >
            <h2 className="text-3xl font-black mb-6 italic uppercase text-blue-500 text-center">
              Editar Combo
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                value={editingCombo.nombre}
                onChange={(e) =>
                  setEditingCombo({ ...editingCombo, nombre: e.target.value })
                }
              />
              <textarea
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white h-24 resize-none"
                value={editingCombo.descripcion}
                onChange={(e) =>
                  setEditingCombo({
                    ...editingCombo,
                    descripcion: e.target.value,
                  })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  className="p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                  value={editingCombo.precioOriginal}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      precioOriginal: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="number"
                  className="p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                  value={editingCombo.precioCombo}
                  onChange={(e) =>
                    setEditingCombo({
                      ...editingCombo,
                      precioCombo: Number(e.target.value),
                    })
                  }
                />
              </div>
              <input
                type="text"
                className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 text-white"
                value={editingCombo.tag}
                onChange={(e) =>
                  setEditingCombo({ ...editingCombo, tag: e.target.value })
                }
              />
              <input
                type="file"
                name="foto"
                className="w-full text-xs text-white/30 p-4 border border-dashed border-white/10 rounded-2xl"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setEditingCombo(null)}
                className="flex-1 text-white font-bold uppercase"
              >
                Cerrar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN PARA BORRAR --- */}
      {comboToDelete && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[110] p-4 font-['Dosis']">
          <div className="bg-[#681104] p-8 rounded-[3rem] border-2 border-red-500 max-w-sm w-full text-center animate-in zoom-in duration-300">
            <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-red-500 text-2xl font-black uppercase italic mb-2">
              ¿Eliminar Combo?
            </h3>
            <p className="text-white/80 mb-8">
              Vas a borrar definitivamente el combo <br />
              <span className="text-white font-bold">
                "{comboToDelete.nombre}"
              </span>
              .
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteCombo}
                disabled={isDeleting}
                className="bg-red-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-white hover:text-red-500 transition-all disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setComboToDelete(null)}
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
