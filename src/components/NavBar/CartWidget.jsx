import carrito from "../../media/logo-carrito.webp";
import { useContext } from "react";
import { cartContext } from "../../context/cartContext";
import { Link } from "react-router-dom";

export default function CartWidget() {
  const { countCartItems } = useContext(cartContext);
  const totalItems = countCartItems();

  return (
    <Link
      to="/carrito"
      className="flex items-center group transition-all duration-300"
    >
      {/* CONTENEDOR DEL ICONO: 
          order-1 en mobile (izquierda) 
          md:order-2 en desktop (derecha) */}
      <div className="relative flex items-center justify-center cursor-pointer order-1 md:order-2">
        <img
          src={carrito}
          alt="Cart"
          className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
        />

        {totalItems > 0 && (
          <span
            className="
            absolute -top-2 -right-2 
            bg-[#681104] text-[#e37b00] 
            text-[10px] font-black 
            w-5 h-5 
            flex items-center justify-center 
            rounded-full 
            border border-[#e37b00]/30 
            shadow-lg 
            animate-in zoom-in duration-300
          "
          >
            {totalItems}
          </span>
        )}
      </div>

      {/* LÍNEA DIVISORA: 
          order-2 en mobile (derecha del carrito) 
          md:order-1 en desktop (izquierda del carrito) */}
      <div className="h-8 w-[2px] bg-[#681104] mx-4 md:mx-6 opacity-40 group-hover:opacity-100 transition-opacity order-2 md:order-1" />
    </Link>
  );
}
