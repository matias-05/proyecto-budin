import Navbar from './components/NavBar/Navbar.jsx';
import Inicio from './components/Inicio/Inicio.jsx';
import './App.css'
import ItemListConteiner from './components/ItemListConteiner/ItemListConteiner.jsx';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <main className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Inicio greeting={
                <>Una  <span>experiencia deliciosa</span> comienza acá</>
              }/>
              
            </>
          } />
          <Route path="/productos" element={<ItemListConteiner />} />
          <Route path="/carrito" element={<h1 className='titulo-carrito'>Carrito</h1>} />
          <Route path="/detalle/:id" element={<h2>Detalle</h2>} />
          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
