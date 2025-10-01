import './ItemListConteiner.css'
import getProductos from '../../data/mockAPI.js'
import Item from './Item.jsx';
import { useEffect, useState } from 'react';

export default function ItemListConteiner() {

  const [productos, setProductos] = useState([]);

  useEffect( () => {
    const promiseData = getProductos();
    promiseData.then( (res) => {setProductos(res)} ).catch( (err) => alert("Error" + err) );
  }, [] );

  return (
    <section className="ItemListConteiner" id="productos">  
      <h2>Tradicionales</h2>
      <div className="item-list">
        {productos.map( function(item) {
          return <Item key={item.id} id={item.id}  title={item.nombre} img={item.imagen} precios={item.precios} />
        })}
      </div>
    </section>
  );
}