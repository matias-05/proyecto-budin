import './ItemListConteiner.css';
import BtnCompra from './Button.jsx';

export default function ItemListConteiner(props) {
  return (
    <section className="ItemListConteiner">
        <h2 className='eslogan'>{props.greeting}</h2>
        <BtnCompra greeting="Comprá Ya!" />
    </section>
  );
}