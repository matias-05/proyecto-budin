import { Link } from 'react-router-dom';

export default function Button(props) {
  return (
    <Link to="/productos" className="inline-block">
      <button className="
        /* Tipografía y Colores */
        font-['Dosis'] font-extrabold uppercase tracking-widest text-white
        bg-[#681104] border-2 border-[#e37b00]
        
        /* Dimensiones y Forma */
        px-15 py-6 rounded-full
        
        /* Sombras y Profundidad */
        shadow-[0_10px_20px_rgba(0,0,0,0.3)]
        
        /* Animaciones Base */
        transition-all duration-500 ease-out
        relative overflow-hidden group
        
        /* Efectos Hover (Mouse encima) */
        hover:scale-110 
        hover:bg-[#831605]
        hover:shadow-[0_0_20px_rgba(227,123,0,0.5)]
        hover:border-white
        
        /* Efectos Active (Click) */
        active:scale-95
      ">
        {/* Capa de brillo interna al pasar el mouse */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
        
        <span className="relative z-10">
          {props.greeting}
        </span>
      </button>
    </Link>
  );
}