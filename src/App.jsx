import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.jsx';
import Inicio from './components/Inicio/Inicio.jsx';
import ItemListConteiner from './components/ItemListConteiner/ItemListConteiner.jsx';
import ItemDetailConteiner from './components/ItemDetailConteiner/ItemDetailConteiner.jsx';
import './App.css';
import { CartProvider } from './context/cartContext';
import CartContainer from './components/CartConteiner/CartContainer.jsx';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <main className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Inicio greeting={<>Una <span>experiencia deliciosa</span> comienza acá</>} />} />
              <Route path="/productos" element={<ItemListConteiner />} />
              <Route path="/categorias/:categoria" element={<ItemListConteiner />} />
              <Route path="/carrito" element={<CartContainer />} />
              <Route path="/detalle/:id" element={<ItemDetailConteiner />} />
              <Route path="*" element={<h2>404 - Not Found</h2>} />
            </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;