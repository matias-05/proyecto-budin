import Navbar from './components/Navbar.jsx';
import Inicio from './components/Inicio.jsx';
import './App.css'
import ItemListConteiner from './components/ItemListConteiner.jsx';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Inicio greeting={
        <>Una  <span>experiencia deliciosa</span> comienza acá</>
      }/>
      <ItemListConteiner />
    </div>
  );
}

export default App
