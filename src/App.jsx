import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./data/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/NavBar/Navbar.jsx";
import Inicio from "./components/Inicio/Inicio.jsx";
import ItemListContainer from "./components/ItemListContainer/ItemListContainer.jsx";
import ItemDetailContainer from "./components/ItemDetailContainer/ItemDetailContainer.jsx";
import CartContainer from "./components/CartContainer/CartContainer.jsx";
import AdminContainer from "./components/AdminContainer/AdminContainer.jsx";
import Login from "./components/AdminContainer/Login.jsx";
import { CartProvider } from "./context/cartContext";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#681104] flex justify-center items-center">
        <p className="text-[#e37b00] font-black italic animate-pulse">
          CARGANDO...
        </p>
      </div>
    );

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <CartProvider>
        <BrowserRouter>
          <main className="App">
            <Navbar />
            <Routes>
              {/* RUTAS PÚBLICAS */}
              <Route
                path="/"
                element={
                  <Inicio
                    greeting={
                      <>
                        Una <span>experiencia deliciosa</span> comienza acá
                      </>
                    }
                  />
                }
              />
              <Route path="/productos" element={<ItemListContainer />} />
              <Route
                path="/categorias/:categoria"
                element={<ItemListContainer />}
              />
              <Route path="/carrito" element={<CartContainer />} />
              <Route path="/detalle/:id" element={<ItemDetailContainer />} />

              {/* RUTA DE LOGIN */}
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/admin" />}
              />

              {/* RUTA PROTEGIDA (ADMIN) */}
              <Route
                path="/admin"
                element={user ? <AdminContainer /> : <Navigate to="/login" />}
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <h2 className="pt-32 text-center text-[#681104]">
                    404 - Not Found
                  </h2>
                }
              />
            </Routes>
          </main>
        </BrowserRouter>
      </CartProvider>
    </>
  );
}

export default App;
