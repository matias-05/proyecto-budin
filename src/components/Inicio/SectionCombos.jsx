import { useContext } from "react"; // 1. Importamos useContext
import { cartContext } from "../../context/cartContext"; // 2. Importamos tu context
import { Package, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SectionCombos({ combos }) {
  // 3. Traemos la función addItem del contexto
  const { addItem } = useContext(cartContext);

  if (!combos || combos.length === 0) return null;

  // 4. Función para manejar el click
  const handleAddCombo = (combo) => {
    const itemToAdd = {
      id: combo.id,
      nombre: combo.nombre,
      precioUnidad: combo.precioCombo, // Usamos el precio de oferta
      imagen: combo.imagen,
      quantity: 1,
      pesoSeleccionado: "Pack Promocional", // Etiqueta para el carrito
      agregados: [], // Los combos suelen ser fijos
    };

    addItem(itemToAdd);
  };

  return (
    <section
      className="min-h-screen w-full bg-[#681104] flex flex-col justify-center py-20 overflow-hidden relative border-y border-[#e37b00]/10"
      id="combos"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#e37b00] opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <span className="text-[#e37b00] font-black uppercase tracking-[0.4em] text-sm mb-4 block">
              Promociones Especiales
            </span>
            <h2 className="text-white text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
              Combos <span className="text-[#e37b00]">Explosivos</span>
            </h2>
          </div>
          <Link
            to="/productos"
            className="group flex items-center gap-3 text-[#e37b00] font-bold uppercase tracking-widest hover:text-white transition-all duration-300 border-b-2 border-transparent hover:border-white pb-1"
          >
            Explorar tienda{" "}
            <ArrowRight
              size={22}
              className="group-hover:translate-x-2 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="bg-[#e37b00] rounded-[3rem] p-1.5 flex flex-col group hover:scale-[1.03] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="bg-[#681104] rounded-[2.8rem] flex-1 flex flex-col relative overflow-hidden">
                <div className="h-56 w-full overflow-hidden relative">
                  <img
                    src={combo.imagen}
                    alt={combo.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#681104] to-transparent opacity-60"></div>
                  <div className="absolute top-5 right-5 bg-[#e37b00] text-[#681104] font-black px-5 py-1.5 rounded-full text-sm shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform">
                    {combo.tag || "PROMO"}
                  </div>
                </div>

                <div className="p-8 pt-4 flex-1 flex flex-col">
                  <h3 className="text-white text-3xl font-black italic uppercase mb-3 leading-tight tracking-tight">
                    {combo.nombre}
                  </h3>

                  <p className="text-white/60 mb-8 font-medium text-lg leading-relaxed">
                    {combo.descripcion}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                    <div>
                      <p className="text-white/30 text-sm uppercase font-bold tracking-widest line-through mb-1">
                        ${combo.precioOriginal}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#e37b00] text-xl font-bold">
                          $
                        </span>
                        <p className="text-[#e37b00] text-5xl font-black tracking-tighter">
                          {combo.precioCombo}
                        </p>
                      </div>
                    </div>

                    {/* 5. BOTÓN ACTUALIZADO: Cambiamos Link por Button */}
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="bg-[#e37b00] text-[#681104] p-3 rounded-[1.5rem] font-black hover:bg-white hover:scale-110 transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      title="Agregar al carrito"
                    >
                      <ShoppingCart size={20} />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
