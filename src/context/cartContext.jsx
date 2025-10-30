import React, { createContext, useState } from 'react';

const cartContext = createContext("default value");

export function CartProvider({children}) {

    const [cartItems, setCartItems] = useState([]);

    function clearCart() {
        setCartItems([]);
    }

    function addItem(newItem) {

        const quantityCount = 1;
        const newCart = structuredClone(cartItems)
        const isInCart = cartItems.some(item => item.id === newItem.id && item.precioUnidad === newItem.precioUnidad)

        if (isInCart ) {
            const index = cartItems.findIndex(item => item.id === newItem.id && item.precioUnidad === newItem.precioUnidad)
            newCart[index].quantity += quantityCount
        }
        else {
            newItem.quantity = quantityCount
            newCart.push(newItem)
        }
        setCartItems(newCart)     
    }

    function countCartItems() {
        let count = 0;
        cartItems.forEach(item => count += item.quantity)
        return count;
    }

    function removeItem(idToRemove, precioUnidadToRemove) {
        const newCart = cartItems.filter(itemInCart => itemInCart.id !== idToRemove || itemInCart.precioUnidad !== precioUnidadToRemove)
        setCartItems(newCart)
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