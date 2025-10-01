import './Button.css';

export default function Button(props) {
   return (
    <a href="/productos">
      <button className='boton-compra'>
        {props.greeting}
      </button>
    </a>
  );
}


