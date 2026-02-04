import { useState, useEffect } from "react";
import { db } from "../../data/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { LayoutDashboard } from "lucide-react";
import BudinesManager from "./BudinesManager";
import CombosManager from "./CombosManager";
import ExtrasManager from "./ExtrasManager";

export default function AdminContainer() {
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [extraPrices, setExtraPrices] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnapshot = await getDocs(collection(db, "products"));
        setProducts(
          prodSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );

        const comboSnapshot = await getDocs(collection(db, "combos"));
        setCombos(
          comboSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );

        const extrasRef = doc(db, "config", "precios_extras");
        const extrasSnap = await getDoc(extrasRef);
        if (extrasSnap.exists()) setExtraPrices(extrasSnap.data());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="min-h-screen bg-[#681104] pt-32 pb-20 px-4 text-[#e37b00] font-['Dosis']">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <LayoutDashboard size={40} />
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-center">
            Panel Admin
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <BudinesManager products={products} setProducts={setProducts} />
            <CombosManager combos={combos} setCombos={setCombos} />
          </div>
          <div className="lg:col-span-1">
            <ExtrasManager
              extraPrices={extraPrices}
              setExtraPrices={setExtraPrices}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
