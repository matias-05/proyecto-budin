import './Navbar.css';
import CartWidget from './CartWidget';
import logoBudin from '../../media/logo-budin.png';
import { useState } from "react";
import { Menu, X } from "lucide-react";
import {Link} from 'react-router';

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <img src={logoBudin} alt="Logo Budin" className='logo-budin'/>
        <h1 className='titulo-empresa'>Rincón del Budín</h1>
        {/* Links en desktop */}
        <ul className="hidden md:flex">
          <li><Link to="/" >Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/quienes">Quiénes Somos</Link></li>
        </ul>

        {/* Botón hamburguesa en mobile */}
        <button 
          className="md:hidden boton-hamburguesa"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28}/> : <Menu size={28}/>}
        </button>

        {/* Menú mobile */}
        <div className={`mobile-menu md:hidden ${open ? 'open' : ''}`}>
          <ul className="flex flex-col p-4 gap-3">
            <li><Link to="/" onClick={() => setOpen(false)}>Inicio</Link></li>
            <li><Link to="/productos" onClick={() => setOpen(false)}>Productos</Link></li>
            <li><Link to="/quienes-somos" onClick={() => setOpen(false)}>Quiénes somos</Link></li>
          </ul>
        </div>
       
        <CartWidget />
      </nav>
    </header>
  );
}