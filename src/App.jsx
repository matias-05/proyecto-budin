import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar.jsx';
import Inicio from './components/Inicio/Inicio.jsx';
import ItemListContainer from './components/ItemListContainer/ItemListContainer.jsx';
import ItemDetailContainer from './components/ItemDetailContainer/ItemDetailContainer.jsx';
import './App.css';
import { CartProvider } from './context/cartContext';
import CartContainer from './components/CartContainer/CartContainer.jsx';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <main className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Inicio greeting={<>Una <span>experiencia deliciosa</span> comienza acá</>} />} />
              <Route path="/productos" element={<ItemListContainer />} />
              <Route path="/categorias/:categoria" element={<ItemListContainer />} />
              <Route path="/carrito" element={<CartContainer />} />
              <Route path="/detalle/:id" element={<ItemDetailContainer />} />
              <Route path="" element={<h2>404 - Not Found</h2>} />
            </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;