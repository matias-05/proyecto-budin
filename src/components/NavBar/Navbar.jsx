import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../data/firebase"; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from "firebase/firestore";
import CartWidget from "./CartWidget";
import logoBudin from "../../media/logo-budin.webp";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hasCombos, setHasCombos] = useState(false); // Estado para detectar combos
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Verificamos si existen combos al cargar el Navbar
  useEffect(() => {
    const checkCombos = async () => {
      try {
        console.log("Iniciando búsqueda de combos...");
        const querySnapshot = await getDocs(collection(db, "combos"));

        console.log("Documentos encontrados en Firebase:", querySnapshot.size);

        if (!querySnapshot.empty) {
          console.log("¡Combos detectados! Activando link...");
          setHasCombos(true);
        } else {
          console.log("La colección 'combos' está vacía en Firebase.");
        }
      } catch (error) {
        console.error("Error crítico buscando combos:", error);
      }
    };
    checkCombos();
  }, []);

  const handleScrollTo = (id) => (e) => {
    e?.preventDefault();
    setOpen(false);

    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate("/", { state: { scrollTo: id } });
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  // 2. Definimos los items base y agregamos "combos" si corresponde
  const navItems = [
    { name: "Inicio", id: "inicio", to: "/" },
    { name: "Productos", id: "productos", to: "/productos" },
  ];

  if (hasCombos) {
    navItems.push({ name: "Combos", id: "combos", to: "/" });
  }

  navItems.push({ name: "Quiénes Somos", id: "quienes-somos", to: "/" });

  return (
    <header className="fixed top-0 w-full z-50 font-['Dosis'] font-bold">
      <nav className="bg-[#e37b00] h-20 px-6 md:px-12 flex justify-between items-center relative z-50">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={logoBudin}
            alt="Logo"
            className="h-12 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          />
          <h1 className="text-[#681104] text-2xl md:text-3xl tracking-wide hidden sm:block font-extrabold">
            Rincón del Budín
          </h1>
        </Link>

        {/* LINKS DESKTOP */}
        <div className="hidden md:flex space-x-12 items-center">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              onClick={
                item.id === "productos" ? undefined : handleScrollTo(item.id)
              }
              className="text-[#681104] text-lg uppercase tracking-widest hover:text-white transition-all duration-300 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <CartWidget />
        </div>

        {/* MÓVIL: CARRITO Y BOTÓN HAMBURGUESA */}
        <div className="md:hidden flex items-center gap-6">
          <CartWidget />
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none"
            aria-label="Menu"
          >
            <span
              className={`block absolute h-1 w-8 bg-[#681104] rounded-full transition-all duration-500 ease-in-out ${open ? "rotate-45" : "-translate-y-2.5"}`}
            ></span>
            <span
              className={`block absolute h-1 w-8 bg-[#681104] rounded-full transition-all duration-500 ease-in-out ${open ? "opacity-0 translate-x-3" : "opacity-100"}`}
            ></span>
            <span
              className={`block absolute h-1 w-8 bg-[#681104] rounded-full transition-all duration-500 ease-in-out ${open ? "-rotate-45" : "translate-y-2.5"}`}
            ></span>
          </button>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div
        className={`absolute top-0 left-0 w-full bg-[#e37b00] transition-all duration-700 ease-in-out -z-10 shadow-2xl overflow-hidden ${
          open ? "max-h-[500px] opacity-100 pt-24 pb-10" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center space-y-8">
          {navItems.map((link, index) => (
            <li
              key={link.id}
              className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Link
                to={link.to}
                onClick={(e) => {
                  if (link.id !== "productos") handleScrollTo(link.id)(e);
                  else setOpen(false);
                }}
                className="text-[#681104] text-2xl uppercase tracking-[0.2em] font-extrabold hover:text-white transition-colors text-center"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
