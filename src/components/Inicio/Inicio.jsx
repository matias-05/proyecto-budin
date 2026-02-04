import { useState, useEffect } from "react";
import { db } from "../../data/firebase"; // Importamos la base de datos
import { collection, getDocs } from "firebase/firestore"; // Importamos los métodos de Firestore
import SectionInicio from "./SectionInicio.jsx";
import SectionSobreNosotros from "./SectionSobreNosotros.jsx";
import SectionCombos from "./SectionCombos.jsx";

export default function Inicio() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        // 1. Referencia a la colección "combos"
        const combosCollection = collection(db, "combos");

        // 2. Obtenemos los documentos
        const querySnapshot = await getDocs(combosCollection);

        // 3. Mapeamos los datos incluyendo el ID de Firebase
        const listaCombos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCombos(listaCombos);
      } catch (error) {
        console.error("Error al cargar los combos desde Firebase:", error);
      }
    };

    fetchCombos();
  }, []);

  return (
    <div className="font-['Dosis'] bg-[#681104]">
      <SectionInicio />

      {/* RENDERIZADO CONDICIONAL: Solo aparece si Firebase devuelve datos */}
      {combos.length > 0 && <SectionCombos combos={combos} />}

      <SectionSobreNosotros />
    </div>
  );
}
