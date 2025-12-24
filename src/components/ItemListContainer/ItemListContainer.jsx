import { getProductos, getProductosByCategory, db } from '../../data/firebase.js'; 
import { doc, getDoc } from 'firebase/firestore'; 
import Item from './Item.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [preciosExtras, setPreciosExtras] = useState(null); 
  const { categoria } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(categoria ?? '');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedCategory(categoria ?? '');
  }, [categoria]);

  // Efecto para cargar los productos y los precios globales
  useEffect(() => {
    // 1. Cargar Precios de Extras Globales (una sola vez)
    const fetchExtras = async () => {
      try {
        const extrasRef = doc(db, "config", "precios_extras");
        const extrasSnap = await getDoc(extrasRef);
        if (extrasSnap.exists()) {
          setPreciosExtras(extrasSnap.data());
        }
      } catch (err) {
        console.error("Error cargando extras: ", err);
      }
    };
    fetchExtras();

    // 2. Cargar Productos por categoría
    if (categoria) {
      getProductosByCategory(categoria)
        .then(res => setProductos(res))
        .catch(err => console.error("Error: ", err));
    } else {
      getProductos()
        .then(res => setProductos(res))
        .catch(err => console.error("Error: ", err));
    }
  }, [categoria]);

  const categories = [
    { label: 'Todos', value: '' },
    { label: 'Tradicionales', value: 'Tradicionales' },
    { label: 'Dulces Tentaciones', value: 'Dulces Tentaciones' },
    { label: 'Budín Selecto', value: 'Budín Selecto' },
    { label: 'Delicias Nutritivas', value: 'Delicias Nutritivas' },
  ];

  return (
    <section 
      className="min-h-screen bg-[#e37b00] font-['Dosis'] pt-28 pb-12 px-2 sm:px-6 md:px-12 flex flex-col items-center" 
      id="productos"
    >
      <h2 className="text-[#681104] text-3xl md:text-5xl font-black uppercase mb-8 tracking-tighter italic text-center">
        Nuestros Budines
      </h2>

      {/* SELECTOR DE CATEGORÍAS */}
      <div className="w-full max-w-4xl mb-10 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex justify-start md:justify-center gap-2 md:gap-4 bg-black/10 p-2 rounded-2xl md:rounded-3xl backdrop-blur-sm min-w-max md:min-w-0">
          {categories.map(({ label, value }) => (
            <label key={value || 'todos'} className="cursor-pointer">
              <input
                type="radio"
                name="categoria"
                className="peer hidden"
                value={value}
                checked={selectedCategory === value}
                onChange={() => {
                  setSelectedCategory(value);
                  navigate(value ? `/categorias/${encodeURIComponent(value)}` : '/productos');
                }}
              />
              <span className="block px-4 py-2 rounded-xl text-sm md:text-lg font-bold transition-all text-[#681104] peer-checked:bg-[#681104] peer-checked:text-white">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 w-full max-w-7xl">
        {productos.map(item => (
          <Item
            key={item.id}
            id={item.id}
            title={item.nombre}
            img={item.imagen}
            precios={item.precios}
            prod={item}
            preciosExtras={preciosExtras} 
          />
        ))}
      </div>
    </section>
  );
}