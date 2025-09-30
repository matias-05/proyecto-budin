import { useState } from 'react';
import './Item.css'

export default function Item({ title, img }) {
  const [glaseado, setGlaseado] = useState(false);
  const [chips, setChips] = useState(false);
  const [nueces, setNueces] = useState(false);
  const [peso, setPeso] = useState("500gr");

  // Precios base según el peso
  const precios = {
    "500gr": 3210,
    "300gr": 2300,
    "250gr": 1750
  };

  const extraGlaseado = 900;
  const extraChips = 1050;
  const extraNueces = 850;

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
      <button>Agregar al carrito</button>
      <div className="options">
        <select
          value={peso}
          onChange={e => setPeso(e.target.value)}
          style={{ marginBottom: "1rem", fontWeight: "bold" }}
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
          />
          Glaseado (+${extraGlaseado})
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={chips}
            onChange={() => setChips(!chips)}
          />
          Chips de Chocolate (+${extraChips})
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={nueces}
            onChange={() => setNueces(!nueces)}
          />
          Nueces (+${extraNueces})
        </label>
      </div>
    </div>
  );
}