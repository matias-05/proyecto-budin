import './Navbar.css';
import CartWidget from './CartWidget';
import logoBudin from '../media/logo-budin.png';


export default function Navbar() {
  return (
    <header className="navbar">
      <img src={logoBudin} alt="Logo Budin" className='logo-budin'/>
      <h1 className='titulo-empresa'>Rincón del Budín</h1>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/quienes-somos">Quienes somos</a></li>
        </ul>
      <CartWidget />
    </header>
  );
}