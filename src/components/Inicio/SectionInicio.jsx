import BtnCompra from "./Button.jsx";
import { subirProductos } from "../../data/firebase.js";
import fondoBudin from "../../media/fondo-budin3.webp";

export default function SectionInicio() {
  return (
    <section
      id="inicio"
      className="relative h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoBudin}) ` }}
      loading="lazy"
      decoding="async"
    >
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

      {/* 2. Contenedor Principal */}
      {/* Flex row para separar texto (izq) y botón (der) en escritorio */}
      <div className="relative z-10 h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between px-6 md:px-12 pt-20 md:pt-52">
        {/* --- BLOQUE IZQUIERDO: TEXTO --- */}
        <div className="text-center md:text-left md:w-1/2">
          <h2 className="font-bold leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {/* "Una experiencia" en Blanco */}
            <span className="block text-white text-4xl md:text-6xl ">Una</span>

            {/* "deliciosa" en Naranja */}
            <span className="block text-[#e37b00] text-4xl md:text-6xl mt-2">
              experiencia deliciosa
            </span>

            {/* "comienza acá" en Blanco */}
            <span className="block text-white text-4xl md:text-6xl mt-2">
              comienza acá
            </span>
          </h2>
        </div>

        <div className="mt-10 md:mt-0 md:pt-15 md:w-1/2 flex justify-center md:justify-end">
          <div className="">
            <BtnCompra greeting="Ver Productos" />
          </div>
        </div>
      </div>

      {/* Botón oculto de administración (mantenido del código original) */}
      <button
        onClick={subirProductos}
        aria-label="Actualizar firebase"
        className="hidden absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded z-50"
      >
        Actualizar firebase
      </button>
    </section>
  );
}
