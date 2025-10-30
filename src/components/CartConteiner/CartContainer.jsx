import { useContext, useState } from "react";
import { cartContext } from "../../context/cartContext";
import { createOrder } from "../../data/firebase";
import './CartContainer.css';
import FormCheckout from "./FormCheckout";

export default function CartContainer() {
    
    const {cartItems, removeItem, totalPrice, clearCart} = useContext(cartContext);
    const [newOrderCreated, setNewOrderCreated] = useState(false);


    async function handleCheckout(buyer) {
        try {
        const newOrder = {
            buyer,
            items: cartItems,
            total: totalPrice(),
            date: new Date(),
        }
        const newOrderConfirmed = await createOrder(newOrder);
        clearCart();
        setNewOrderCreated(newOrderConfirmed.id);
        } catch (error) {
        console.error("Error al crear la orden:", error);
        }
    }

    
    if (newOrderCreated){
        return (
            <section className="cart-container">
                <h2>Gracias por tu pedido</h2>
                <p>Tu número de orden es: {newOrderCreated}</p>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="cart-container">
                <h2>Tu Carrito está vacío</h2>
            </section>
        );
    }
    
    return (
        <section className="cart-container">
            <h2>Tu Carrito !</h2>
            <div className="list-container ">
                {
                    cartItems.map( itemInCart => (
                        <div key={itemInCart.id} className="producto-carrito">
                            <img src={itemInCart.imagen} alt={itemInCart.nombre} className="img-budin"/>
                            <div className="info">
                                <h2 className="titulo-prod">{itemInCart.nombre} x{itemInCart.quantity}</h2>
                                <p className="peso">Peso: {itemInCart.pesoSeleccionado}</p>
                                {itemInCart.agregados.length > 0
                                    ? itemInCart.agregados.map((a, i) => <li key={i} className="lista-agregados">{a} </li>)
                                    : <li className="lista-agregados">Sin agregados</li>
                                }
                                <p>Precio: {itemInCart.precioUnidad * itemInCart.quantity} $</p>
                            </div>
                            <button onClick={() => removeItem(itemInCart.id, itemInCart.precioUnidad)}>Eliminar</button>
                        </div>
                    ))
                }
            </div>
            <div className="checkout-section">
                <FormCheckout handleCheckout={handleCheckout} />
            </div>
        </section>
    );
}