import { useState } from 'react';
import { Link } from 'react-router';
import './Item.css'

export default function Item({ id, title, img, precios }) {
  const [glaseado, setGlaseado] = useState(false);
  const [chips, setChips] = useState(false);
  const [nueces, setNueces] = useState(false);
  const [peso, setPeso] = useState("500gr");

  // Definir los costos adicionales basados en el peso
  let extraChips = 0;
  if (peso === "250gr") extraChips = 610;
  else if (peso === "300gr") extraChips = 700;
  else if (peso === "500gr") extraChips = 1050;

  let extraNueces = 0;
  if (peso === "250gr") extraNueces = 480;
  else if (peso === "300gr") extraNueces = 580;
  else if (peso === "500gr") extraNueces = 850;

  let extraGlaseado = 0;
    if (title.toLowerCase().includes("vainilla")) {
      if (peso === "250gr") extraGlaseado = 450;
      else if (peso === "300gr") extraGlaseado = 740;
      else if (peso === "500gr") extraGlaseado = 900;
    } else {
      if (peso === "250gr") extraGlaseado = 460;
      else if (peso === "300gr") extraGlaseado = 500;
      else if (peso === "500gr") extraGlaseado = 900;
    }


  // Calcular el precio total
  const precioTotal =
    precios[peso] +
    (glaseado ? extraGlaseado : 0) +
    (chips ? extraChips : 0) +
    (nueces ? extraNueces : 0);


  return (
    <div className="item-card">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>Precio: ${precioTotal}</p>
      <button className='agregar-btn'>Agregar al carrito</button>
      <div className="options">
        <select
          value={peso}
          onChange={e => setPeso(e.target.value)}
          className="peso-select"
        >
          <option value="500gr">500gr</option>
          <option value="300gr">300gr</option>
          <option value="250gr">250gr</option>
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={glaseado}
            onChange={() => setGlaseado(!glaseado)}
            className='checkbox-input'
          />
          Glaseado (${extraGlaseado})
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={chips}
            onChange={() => setChips(!chips)}
            className='checkbox-input'
          />
          Chips de Chocolate (${extraChips})
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={nueces}
            onChange={() => setNueces(!nueces)}
            className='checkbox-input'
          />
          Nueces (${extraNueces})
        </label>
      </div>
      <Link to={`/detalle/${id}`}>
        <button className='detalle-btn'>Ver detalle</button>
      </Link>
      
    </div>
  );
}