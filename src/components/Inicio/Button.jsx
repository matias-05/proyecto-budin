import './Button.css';
import {Link} from 'react-router';

export default function Button(props) {
   return (
    <Link to="/productos">
        <button className='boton-compra'>
          {props.greeting}
        </button>
    </Link>
  );
}


