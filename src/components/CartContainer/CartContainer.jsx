import { useContext, useState } from "react";
import { cartContext } from "../../context/cartContext";
import { createOrder } from "../../data/firebase";
import FormCheckout from "./FormCheckout";
import { Trash2, ShoppingBag, CheckCircle, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom"

export default function CartContainer() {
    const { cartItems, removeItem, totalPrice, clearCart, countCartItems, updateQuantity } = useContext(cartContext);
    const [newOrderCreated, setNewOrderCreated] = useState(false);
    const [buyerInfo, setBuyerInfo] = useState(null);
    const [finalTotal, setFinalTotal] = useState(0);
    const [finalItems, setFinalItems] = useState([]);

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.precioUnidad, -1);
        } else {
            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar "${item.nombre}" del carrito?`);
            if (confirmDelete) {
                removeItem(item.id, item.precioUnidad);
            }
        }
    };

    async function handleCheckout(buyer) {
        try {
            const currentTotal = totalPrice();
            const currentItems = [...cartItems]; 

            const newOrder = {
                buyer, 
                items: currentItems,
                total: currentTotal,
                date: new Date(),
            };

            const newOrderConfirmed = await createOrder(newOrder);
            
            setFinalTotal(currentTotal);
            setFinalItems(currentItems);
            setBuyerInfo(buyer); 
            setNewOrderCreated(newOrderConfirmed.id);

            clearCart();
        } catch (error) {
            console.error("Error al procesar la compra:", error);
        }
    }

    // --- VISTA: ORDEN CREADA ---
    if (newOrderCreated && buyerInfo) {
        const ownerPhone = import.meta.env.VITE_WHATSAPP_OWNER_PHONE;

        const detallePedido = finalItems.map(item => {
            const precioSubtotal = item.precioUnidad * item.quantity;
            let textoItem = `• ${item.nombre} (${item.pesoSeleccionado}) x${item.quantity} - $${precioSubtotal}`;

            if (item.agregados && item.agregados.length > 0) {
                const listaAgregados = item.agregados.map(a => `  └ ${a}`).join("\n");
                textoItem += `\n${listaAgregados}`;
            }
            return textoItem;
        }).join("\n");


        const metodoPagoTexto = buyerInfo.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia';

        const mensajeTexto = 
            `Hola Rincón del Budín, quiero realizar este pedido:\n\n` +
            `${detallePedido}\n\n` +
            `*Total:* $${finalTotal}\n` +
            `*Forma de Pago:* ${metodoPagoTexto}`;

        const whatsappLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(mensajeTexto)}`;

        return (
            <section className="min-h-screen bg-[#e37b00] pt-32 flex justify-center px-4 font-['Dosis']">
                <div className="bg-[#681104] p-8 md:p-12 rounded-3xl shadow-2xl text-center h-fit max-w-lg border border-white/10 animate-in fade-in zoom-in duration-500">
                    <CheckCircle className="text-[#e37b00] w-20 h-20 mx-auto mb-6" />
                    
                    <h2 className="text-[#e37b00] text-4xl font-black italic uppercase mb-4 leading-tight">
                        ¡Finaliza tu compra!
                    </h2>
                    
                    <p className="text-white text-lg mb-8">
                        Tu pedido se registró como pago por <strong>{metodoPagoTexto}</strong>. <br/>
                        Para finalizar el pedido presioná el botón para enviarnos el resumen por WhatsApp.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                        <a 
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 bg-[#25D366] text-white font-black py-4 px-8 rounded-full text-lg uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 w-full justify-center"
                        >
                            Enviar a WhatsApp
                        </a>

                        <Link 
                            to="/"
                            className="text-[#e37b00] border-2 border-[#e37b00]/30 font-bold py-3 px-8 rounded-full text-base uppercase tracking-widest hover:bg-[#e37b00] hover:text-[#681104] transition-all duration-300"
                        >
                            Volver al inicio
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 opacity-50">
                        <p className="text-white font-bold text-sm tracking-widest uppercase">
                            ORDEN: {newOrderCreated}
                        </p>
                    </div>
                </div>
            </section>
        );
    }
    // --- VISTA: CARRITO VACÍO ---
    if (cartItems.length === 0) {
        return (
            <section className="min-h-screen bg-[#e37b00] pt-40 flex flex-col items-center px-4 font-['Dosis'] text-[#681104]">
                <ShoppingBag size={80} className="mb-6 opacity-50" />
                <h2 className="text-4xl md:text-5xl font-black uppercase italic">Tu Carrito está vacío</h2>
                <button 
                    onClick={() => window.history.back()}
                    className="mt-8 bg-[#681104] text-[#e37b00] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    Volver a la tienda
                </button>
            </section>
        );
    }

    // --- VISTA: CARRITO CON PRODUCTOS ---
    return (
    <section className="min-h-screen bg-[#e37b00] pt-28 pb-20 px-4 md:px-12 font-['Dosis']">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-[#681104] text-4xl md:text-6xl font-black uppercase italic mb-10 text-center md:text-left">
                Tu Carrito !
            </h2>

            <div className="flex flex-col lg:flex-row gap-10">
                
                <div className="lg:w-2/3 flex flex-col gap-6">
                    {cartItems.map((item) => (
    <div 
        key={`${item.id}-${item.precioUnidad}`} 
        className="bg-[#681104] rounded-2xl overflow-hidden shadow-xl border border-white/5 relative group"
    >
        <div className="flex items-stretch">
            
            {/* CONTENEDOR DE IMAGEN */}
            <div className="w-32 md:w-48 shrink-0 overflow-hidden relative">
                <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                />
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 flex flex-col justify-between p-4 md:p-8">
                
                <div className="pr-2">
                    <h2 className="text-[#e37b00] text-xl md:text-4xl font-black uppercase italic leading-tight line-clamp-2">
                        {item.nombre}
                    </h2>
                    
                    <p className="text-white/60 font-bold text-xs md:text-xl uppercase tracking-tighter mt-1">
                        Peso: {item.pesoSeleccionado}
                    </p>
                    
                    {item.agregados.length > 0 && (
                        <p className="text-white/40 text-[11px] md:text-sm italic mt-1.5 leading-tight">
                            + {item.agregados.join(", ")}
                        </p>
                    )}
                </div>

                <div className="flex items-end justify-between mt-4">
                    
                    {/* SELECTOR DE CANTIDAD */}
                    <div className="flex items-center gap-2 md:gap-4 bg-black/30 p-1.5 rounded-xl border border-white/5">
                        <button 
                            onClick={() => handleDecrement(item)}
                            className="bg-[#e37b00] text-[#681104] p-1 md:p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer active:scale-90"
                        >
                            {item.quantity === 1 ? <Trash2 size={16} className="md:w-6 md:h-6" /> : <Minus size={16} className="md:w-6 md:h-6" />}
                        </button>

                        <span className="text-white font-black text-base md:text-2xl min-w-[20px] text-center">
                            {item.quantity}
                        </span>

                        <button 
                            onClick={() => updateQuantity(item.id, item.precioUnidad, 1)}
                            className="bg-[#e37b00] text-[#681104] p-1 md:p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer active:scale-90"
                        >
                            <Plus size={16} className="md:w-6 md:h-6" />
                        </button>
                    </div>

                    {/* PRECIO SUBTOTAL */}
                    <div className="text-right">
                        <p className="text-[#e37b00] text-2xl md:text-4xl font-black tracking-tighter">
                            ${item.precioUnidad * item.quantity}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
))}
                </div>

                {/* RESUMEN DE COMPRA */}
                <div className="lg:w-1/3">
                    <div className="bg-[#681104] rounded-3xl p-8 shadow-2xl border border-white/5 sticky top-28">
                        <h2 className="text-[#e37b00] text-3xl font-black uppercase italic mb-6 border-b border-[#e37b00]/20 pb-4 text-center">Resumen</h2>
                        
                        <div className="flex justify-between text-white text-xl mb-4">
                            <span className="font-bold opacity-70 italic">Productos:</span>
                            <span className="font-black text-[#e37b00]">{countCartItems()}</span>
                        </div>
                        
                        <div className="flex justify-between text-white text-3xl mb-8 items-center border-t border-[#e37b00]/20 pt-6">
                            <span className="font-black italic uppercase">Total:</span>
                            <span className="font-black text-[#e37b00] tracking-tighter">${totalPrice()}</span>
                        </div>

                        <div className="bg-black/20 p-4 rounded-2xl">
                            <FormCheckout handleCheckout={handleCheckout} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
);
}