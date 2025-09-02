import './Pagina1.css';
import BtnCompra from './Button.jsx';

export default function Pagina1(props) {
  return (
    <section className="pagina1">
        <h2 className='eslogan'>{props.greeting}</h2>
        <BtnCompra greeting="Comprá Ya!" />
    </section>
  );
}