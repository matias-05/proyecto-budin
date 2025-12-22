import { useState, useContext } from 'react';
import { cartContext } from '../../context/cartContext';

export default function Item({ id, title, img, precios, prod }) {
  const [glaseado, setGlaseado] = useState(false);
  const [chips, setChips] = useState(false);
  const [nueces, setNueces] = useState(false);
  const [peso, setPeso] = useState("500gr");
  const { addItem } = useContext(cartContext);

  //#region Lógica de Precios
  let extraChips = peso === "250gr" ? 610 : peso === "300gr" ? 700 : 1050;
  let extraNueces = peso === "250gr" ? 480 : peso === "300gr" ? 580 : 850;
  
  let extraGlaseado = 0;
  const isVainilla = title.toLowerCase().includes("vainilla");
  if (peso === "250gr") extraGlaseado = isVainilla ? 450 : 460;
  else if (peso === "300gr") extraGlaseado = isVainilla ? 740 : 500;
  else if (peso === "500gr") extraGlaseado = 900;

  const precioTotal = precios[peso] + (glaseado ? extraGlaseado : 0) + (chips ? extraChips : 0) + (nueces ? extraNueces : 0);

  const agregados = [];
  if (!glaseado && !chips && !nueces) agregados.push("Sin agregados");
  if (glaseado) agregados.push("Glaseado");
  if (chips) agregados.push("Chips de Chocolate");
  if (nueces) agregados.push("Nueces");

  const opcionesPermitidas = [
    { permitido: prod.extrasPermitidos.glaseado, estado: glaseado, setEstado: setGlaseado, etiqueta: `Glaseado (+$${extraGlaseado})`, nombre: 'glaseado' },
    { permitido: prod.extrasPermitidos.chips, estado: chips, setEstado: setChips, etiqueta: `Chips (+$${extraChips})`, nombre: 'chips' },
    { permitido: prod.extrasPermitidos.nueces, estado: nueces, setEstado: setNueces, etiqueta: `Nueces (+$${extraNueces})`, nombre: 'nueces' }
  ];
  //#endregion

  return (
    /* 1. Recuperamos hover:scale y transition para la card */
    <div className="bg-[#681104] rounded-xl md:rounded-2xl overflow-hidden shadow-lg flex flex-col w-full border border-white/5 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">
      
      <div className="relative h-32 md:h-44 overflow-hidden">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-1 right-1 bg-[#e37b00] text-[#681104] font-black px-1.5 py-0.5 rounded-full text-[10px] md:text-xs shadow-md">
          {peso}
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3 text-[#e37b00]">
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h3 className="text-sm md:text-xl font-extrabold uppercase truncate">
            {title}
          </h3>
          <span className="text-sm md:text-xl font-black">
            ${precioTotal}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <select
            value={peso}
            onChange={e => setPeso(e.target.value)}
            className="bg-[#520d03] border border-[#e37b00]/30 text-[#e37b00] rounded-md px-1 py-1 md:px-2 md:py-1.5 outline-none text-[10px] md:text-sm font-bold cursor-pointer hover:border-[#e37b00] transition-colors"
          >
            <option value="500gr">500gr</option>
            <option value="300gr">300gr</option>
            <option value="250gr">250gr</option>
          </select>

          <div className="flex flex-col gap-1">
            {opcionesPermitidas.map(opcion => 
              opcion.permitido && (
                <label key={opcion.nombre} className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={opcion.estado}
                    onChange={() => opcion.setEstado(!opcion.estado)}
                    className="w-3.5 h-3.5 md:w-4 md:h-4 border border-[#e37b00] rounded checked:bg-[#e37b00] appearance-none cursor-pointer transition-all"
                  />
                  <span className="font-bold text-[9px] md:text-xs truncate group-hover:text-white transition-colors">
                    {opcion.etiqueta}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* 2. Recuperamos hover:bg-white y active:scale para el botón */}
        <button
          className="w-full mt-1 bg-[#e37b00] text-[#681104] font-black uppercase py-2 md:py-2.5 rounded-lg text-[11px] md:text-base tracking-tighter md:tracking-widest transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-95 cursor-pointer relative z-10"
          onClick={() => addItem({ ...prod, precioUnidad: precioTotal, agregados, pesoSeleccionado: peso })}
        >
          Agregar
        </button>
      </div>
    </div>
  );
}