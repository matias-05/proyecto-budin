import './Navbar.css';
import CartWidget from './CartWidget';
import logoBudin from '../media/logo-budin.png';
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <img src={logoBudin} alt="Logo Budin" className='logo-budin'/>
        <h1 className='titulo-empresa'>Rincón del Budín</h1>
        {/* Links en desktop */}
        <ul className="hidden md:flex">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#productos">Productos</a></li>
          <li><a href="#quienes">Quiénes somos</a></li>
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
            <li><a href="#inicio" onClick={() => setOpen(false)}>Inicio</a></li>
            <li><a href="#productos" onClick={() => setOpen(false)}>Productos</a></li>
            <li><a href="#quienes" onClick={() => setOpen(false)}>Quiénes somos</a></li>
          </ul>
        </div>
       
        <CartWidget />
      </nav>
    </header>
  );
}