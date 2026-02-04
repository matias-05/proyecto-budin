import { useState } from "react";
import { db } from "../../data/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Save } from "lucide-react";

export default function ExtrasManager({ extraPrices, setExtraPrices }) {
  const [updatingExtras, setUpdatingExtras] = useState(false);

  const handleUpdateExtras = async (e) => {
    e.preventDefault();
    setUpdatingExtras(true);
    try {
      await updateDoc(doc(db, "config", "precios_extras"), extraPrices);
      alert("¡Extras actualizados globalmente!");
    } catch (error) {
      alert("Error");
    } finally {
      setUpdatingExtras(false);
    }
  };

  if (!extraPrices) return null;

  return (
    <div className="bg-[#e37b00] p-6 rounded-[2.5rem] shadow-2xl sticky top-32 font-['Dosis']">
      <h2 className="text-[#681104] text-2xl font-black uppercase italic mb-6 text-center">
        Precios Extras
      </h2>
      <form onSubmit={handleUpdateExtras} className="space-y-6">
        {Object.keys(extraPrices).map((extra) => (
          <div key={extra} className="bg-[#681104]/10 p-3 rounded-xl">
            <p className="text-[#681104] font-black uppercase text-[10px] mb-2 italic tracking-wider">
              {extra.replace("_", " ")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["250gr", "300gr", "500gr"].map((peso) => (
                <div key={peso} className="flex flex-col">
                  <span className="text-[8px] font-bold text-[#681104]/60 uppercase text-center mb-1">
                    {peso}
                  </span>
                  <input
                    type="number"
                    className="bg-white/20 p-2 rounded-lg text-[#681104] font-black text-center text-xs outline-none border border-transparent focus:border-[#681104]"
                    value={extraPrices[extra][peso]}
                    onChange={(e) =>
                      setExtraPrices({
                        ...extraPrices,
                        [extra]: {
                          ...extraPrices[extra],
                          [peso]: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={updatingExtras}
          className="w-full bg-[#681104] text-[#e37b00] py-4 rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-white transition-all"
        >
          <Save size={20} />{" "}
          {updatingExtras ? "Guardando..." : "Guardar Agregados"}
        </button>
      </form>
    </div>
  );
}
