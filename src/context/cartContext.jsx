import { createContext, useState, useEffect } from "react";
// 1. IMPORTACIONES FALTANTES:
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

const cartContext = createContext("default value");

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("carrito_rincon_budin");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito_rincon_budin", JSON.stringify(cartItems));
  }, [cartItems]);

  function clearCart() {
    setCartItems([]);
  }

  function addItem(newItem) {
    const quantityCount = 1;
    const newCart = structuredClone(cartItems);

    const isInCart = cartItems.some(
      (item) =>
        item.id === newItem.id && item.precioUnidad === newItem.precioUnidad,
    );

    if (isInCart) {
      const index = cartItems.findIndex(
        (item) =>
          item.id === newItem.id && item.precioUnidad === newItem.precioUnidad,
      );
      newCart[index].quantity += quantityCount;
    } else {
      newItem.quantity = quantityCount;
      newCart.push(newItem);
    }

    // 2. CORRECCIÓN DE VARIABLE: Usamos newItem.nombre
    toast.success(`${newItem.nombre} añadido al carrito`, {
      duration: 3000,
      style: {
        border: "2px solid #e37b00",
        padding: "16px",
        color: "#681104",
        backgroundColor: "#fff",
        fontWeight: "bold",
        fontFamily: "Dosis, sans-serif",
        borderRadius: "15px",
      },
      iconTheme: {
        primary: "#e37b00",
        secondary: "#fff",
      },
      icon: <ShoppingCart size={20} color="#e37b00" />,
    });

    setCartItems(newCart);
  }

  // ... (el resto de tus funciones se mantienen igual)
  function countCartItems() {
    let count = 0;
    cartItems.forEach((item) => (count += item.quantity));
    return count;
  }

  function removeItem(idToRemove, precioUnidadToRemove) {
    const newCart = cartItems.filter(
      (itemInCart) =>
        itemInCart.id !== idToRemove ||
        itemInCart.precioUnidad !== precioUnidadToRemove,
    );
    setCartItems(newCart);
  }

  function totalPrice() {
    return cartItems.reduce(
      (acc, item) => acc + item.precioUnidad * item.quantity,
      0,
    );
  }

  function updateQuantity(itemId, precioUnidad, delta) {
    const newCart = structuredClone(cartItems);
    const index = newCart.findIndex(
      (item) => item.id === itemId && item.precioUnidad === precioUnidad,
    );

    if (index !== -1) {
      newCart[index].quantity += delta;
      setCartItems(newCart);
    }
  }

  return (
    <cartContext.Provider
      value={{
        cartItems,
        addItem,
        countCartItems,
        removeItem,
        totalPrice,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}

export { cartContext };
