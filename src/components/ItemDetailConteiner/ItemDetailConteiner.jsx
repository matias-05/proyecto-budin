import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProductoById } from '../../data/mockAPI.js'
import './ItemDetailConteiner.css';

export default function ItemDetailConteiner() {
  const { id } = useParams();
  const [producto, setProducto] = useState({ loading: true });

  useEffect(() => {
    getProductoById(id).then(prod => setProducto(prod));
  }, []);


  if (producto.loading === true) {
    return <h2>Cargando...</h2>;
  }
  return (
    <section className="ItemDetailConteiner">
      <div className='detalle'>
        <div className='detalle-card'>
          <img src={producto.imagen} alt={producto.nombre} className='detalle-imagen'/>
          <h1>{producto.nombre}</h1>
          <p>Categoría: {producto.categoria}</p>
          <p>Descripción: {producto.descripcion}</p>
          
        </div>
      </div>
    </section>
  );
}