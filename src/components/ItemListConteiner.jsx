import './ItemListConteiner.css'
import productos from '../data/productos.js'
import Item from './Item.jsx';

export default function ItemListConteiner() {
  return (
    <section className="ItemListConteiner" id="productos">  
      {console.log(productos)}
      <h2>Tradicionales</h2>
      <div className="item-list">
        {productos.map( function(item) {
          return <Item key={item.id} title={item.nombre} img={item.imagen} price={item.precio} />
        })}
      </div>
    </section>
  );
}