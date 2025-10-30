import './Inicio.css';
import BtnCompra from './Button.jsx';

export default function Inicio(props) {
  return (
    <section className="inicio" id='inicio'>
        <h2 className='eslogan'>{props.greeting}</h2>
        <BtnCompra greeting="Ver Productos" />
    </section>
  );
}