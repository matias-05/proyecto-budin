import Navbar from './components/Navbar.jsx';
import Pagina1 from './components/Pagina1.jsx';

import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Pagina1 greeting={
        <>Una  <span>experiencia deliciosa</span> comienza acá</>
      }/>
    </div>
  );
}

export default App
