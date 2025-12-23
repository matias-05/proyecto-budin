import { createContext, useState, useEffect } from "react";

const cartContext = createContext("default value");

export function CartProvider({children}) {
    // 1. Inicialización "Lazy": Intenta cargar lo que haya en el disco al nacer el componente
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem("carrito_rincon_budin");
        return localData ? JSON.parse(localData) : [];
    });

    // 2. Efecto de Sincronización: Cada vez que cartItems cambie, se guarda en localStorage
    useEffect(() => {
        localStorage.setItem("carrito_rincon_budin", JSON.stringify(cartItems));
    }, [cartItems]);

    function clearCart() {
        setCartItems([]);
    }

    function addItem(newItem) {
        const quantityCount = 1;
        const newCart = structuredClone(cartItems);
        
        // Buscamos si ya existe el producto con el mismo ID y MISMO PRECIO (por los extras/peso)
        const isInCart = cartItems.some(item => 
            item.id === newItem.id && item.precioUnidad === newItem.precioUnidad
        );

        if (isInCart) {
            const index = cartItems.findIndex(item => 
                item.id === newItem.id && item.precioUnidad === newItem.precioUnidad
            );
            newCart[index].quantity += quantityCount;
        }
        else {
            newItem.quantity = quantityCount;
            newCart.push(newItem);
        }
        setCartItems(newCart);     
    }

    function countCartItems() {
        let count = 0;
        cartItems.forEach(item => count += item.quantity);
        return count;
    }

    function removeItem(idToRemove, precioUnidadToRemove) {
        const newCart = cartItems.filter(itemInCart => 
            itemInCart.id !== idToRemove || itemInCart.precioUnidad !== precioUnidadToRemove
        );
        setCartItems(newCart);
    }

    function totalPrice() {
        return cartItems.reduce((acc, item) => acc + item.precioUnidad * item.quantity, 0);
    }

    return (
        <cartContext.Provider value={{cartItems, addItem, countCartItems, removeItem, totalPrice, clearCart}}>
            {children}
        </cartContext.Provider>
    );
}

export { cartContext };