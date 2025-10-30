import './ItemListConteiner.css'
import { getProductos, getProductosByCategory } from '../../data/firebase.js'
import Item from './Item.jsx';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ItemListConteiner() {
  
  const [productos, setProductos] = useState([]);
  const { categoria } = useParams();

  useEffect(() => {
    if (categoria) {
      getProductosByCategory(categoria)
        .then(res => setProductos(res))
        .catch(err => alert("Error" + err));
    } else {
      getProductos()
        .then(res => setProductos(res))
        .catch(err => alert("Error" + err));
    }
  }, [categoria]);

  return (
    <section className="ItemListConteiner" id="productos">  
      <ul className='categorias'>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/categorias/Tradicionales">Tradicionales</Link></li>
        <li><Link to="/categorias/Dulces Tentaciones">Dulces Tentaciones</Link></li>
      </ul>
      <div className="item-list">
        {productos.map(item => (
          <Item key={item.id} id={item.id} title={item.nombre} img={item.imagen} precios={item.precios} prod={item} />
        ))}
      </div>
    </section>
  );
}