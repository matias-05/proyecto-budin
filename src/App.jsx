import Navbar from './components/Navbar.jsx';
import ItemListConteiner from './components/ItemListConteiner.jsx';

import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <ItemListConteiner greeting={
        <>Una  <span>experiencia deliciosa</span> comienza acá</>
      }/>
    </div>
  );
}

export default App
