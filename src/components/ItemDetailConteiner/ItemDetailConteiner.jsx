import { Link } from 'react-router';
import './Item.css'

export default function Item() {
  
  return (
    <div className="item-card">
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>Precio: ${precioTotal}</p>
      <button className='agregar-btn'>Agregar al carrito</button>
      <Link to={`/detalle/${id}`}>
        <button className='detalle-btn'>Ver detalle</button>
      </Link>
      
    </div>
  );
}