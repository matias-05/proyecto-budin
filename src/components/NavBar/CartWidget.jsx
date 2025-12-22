import carrito from '../../media/logo-carrito.png';
import { useContext } from 'react';
import { cartContext } from '../../context/cartContext';
import { Link } from 'react-router-dom';

export default function CartWidget() {
  const { countCartItems } = useContext(cartContext);
  const totalItems = countCartItems();

  return (
    <Link to="/carrito" className="flex items-center group transition-all duration-300">
      
      {/* LÍNEA DIVISORA IZQUIERDA */}
      <div className="h-8 w-[2px] bg-[#681104] mx-4 md:mx-6 opacity-40 group-hover:opacity-100 transition-opacity" />

      {/* CONTENEDOR DEL ICONO Y CONTADOR */}
      <div className="relative flex items-center justify-center cursor-pointer">
        
        {/* ICONO DEL CARRITO */}
        <img 
          src={carrito} 
          alt="Cart" 
          className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" 
        />

        {/* CONTADOR (Solo se muestra si hay items) */}
        {totalItems > 0 && (
          <span className="
            absolute -top-2 -right-2 
            bg-[#681104] text-[#e37b00] 
            text-[10px] font-black 
            w-5 h-5 
            flex items-center justify-center 
            rounded-full 
            border border-[#e37b00]/30 
            shadow-lg 
            animate-in zoom-in duration-300
          ">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}