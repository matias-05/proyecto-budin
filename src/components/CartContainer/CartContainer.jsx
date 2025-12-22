import { useContext, useState } from "react";
import { cartContext } from "../../context/cartContext";
import { createOrder } from "../../data/firebase";
import FormCheckout from "./FormCheckout";
import { Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom"

export default function CartContainer() {
    const { cartItems, removeItem, totalPrice, clearCart, countCartItems } = useContext(cartContext);
    const [newOrderCreated, setNewOrderCreated] = useState(false);
    const [buyerInfo, setBuyerInfo] = useState(null);
    
    // NUEVO: Estados para guardar la info final antes de borrar el carrito
    const [finalTotal, setFinalTotal] = useState(0);
    const [finalItems, setFinalItems] = useState([]);

    async function handleCheckout(buyer) {
        try {
            // 1. Guardamos los valores actuales antes de que desaparezcan
            const currentTotal = totalPrice();
            const currentItems = [...cartItems]; 

            const newOrder = {
                buyer,
                items: currentItems,
                total: currentTotal,
                date: new Date(),
            };

            const newOrderConfirmed = await createOrder(newOrder);
            
            // 2. Seteamos los estados locales con la info "congelada"
            setFinalTotal(currentTotal);
            setFinalItems(currentItems);
            setBuyerInfo(buyer);
            setNewOrderCreated(newOrderConfirmed.id);

            // 3. Ahora sí podemos limpiar el carrito sin perder la info para el mensaje
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
        let textoItem = `${item.nombre} ${item.pesoSeleccionado} x${item.quantity} (${precioSubtotal}$)`;

        if (item.agregados && item.agregados.length > 0) {
            const listaAgregados = item.agregados.map(a => `-${a}`).join("\n");
            textoItem += `\nAgregados:\n${listaAgregados}`;
        }
        return textoItem;
    }).join("\n\n");

    const mensajeTexto = 
        `Hola Rincon del Budín, quiero realizar este pedido:\n` +
        `${detallePedido}\n\n` +
        `Total del pedido: ${finalTotal}$\n`;

    const whatsappLink = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(mensajeTexto)}`;

    return (
        <section className="min-h-screen bg-[#e37b00] pt-32 flex justify-center px-4 font-['Dosis']">
            <div className="bg-[#681104] p-8 md:p-12 rounded-3xl shadow-2xl text-center h-fit max-w-lg border border-white/10 animate-in fade-in zoom-in duration-500">
                <CheckCircle className="text-[#e37b00] w-20 h-20 mx-auto mb-6" />
                
                <h2 className="text-[#e37b00] text-4xl font-black italic uppercase mb-4 leading-tight">
                    ¡Pedido Recibido!
                </h2>
                
                <p className="text-white text-lg mb-8">
                    Para finalizar, presioná el botón y envianos el resumen de tu compra por WhatsApp:
                </p>
                
                {/* CONTENEDOR DE BOTONES */}
                <div className="flex flex-col gap-4">
                    {/* BOTÓN PRIMARIO: WHATSAPP */}
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-[#25D366] text-white font-black py-4 px-8 rounded-full text-lg uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 w-full justify-center"
                    >
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.405c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.96-.503-5.69-1.458l-6.394 1.782zm6.191-3.974c1.536.914 3.307 1.395 5.104 1.396 5.409 0 9.811-4.403 9.811-9.812 0-2.618-1.02-5.08-2.873-6.932-1.851-1.852-4.311-2.872-6.938-2.872-5.409 0-9.812 4.403-9.812 9.812 0 1.936.569 3.814 1.644 5.409l-1.074 3.92 4.038-1.121zm10.702-7.042c-.203-.102-1.202-.594-1.386-.662-.185-.067-.319-.101-.454.102-.134.202-.522.661-.641.795-.117.134-.236.152-.439.051-.202-.102-.856-.316-1.631-.996-.604-.543-1.011-1.213-1.129-1.417-.118-.202-.013-.312.089-.413.092-.091.203-.236.304-.354.102-.119.135-.203.203-.339.068-.135.034-.254-.017-.354-.051-.102-.454-1.092-.622-1.493-.164-.393-.329-.339-.454-.346-.118-.006-.252-.007-.386-.007-.135 0-.354.051-.54.254-.185.203-.707.691-.707 1.686 0 .996.724 1.959.826 2.094.101.135 1.425 2.176 3.452 3.051.482.208.859.333 1.153.426.484.153.925.132 1.274.08.389-.057 1.202-.492 1.37-1.165s.168-1.253.118-1.37c-.051-.118-.185-.185-.389-.286z"/></svg>
                        Finalizar por WhatsApp
                    </a>

                    {/* BOTÓN SECUNDARIO: VOLVER AL INICIO */}
                    <Link 
                        to="/"
                        className="text-[#e37b00] border-2 border-[#e37b00]/30 font-bold py-3 px-8 rounded-full text-base uppercase tracking-widest hover:bg-[#e37b00] hover:text-[#681104] transition-all duration-300"
                    >
                        Volver al inicio
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 opacity-50">
                    <p className="text-white font-bold text-sm tracking-widest uppercase">
                        ID DE ORDEN: {newOrderCreated}
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
                            <div key={item.id} className="bg-[#681104] rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-center gap-6 border border-white/5 relative overflow-hidden group">
                                <img src={item.imagen} alt={item.nombre} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-lg transition-transform group-hover:scale-105" />
                                
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-[#e37b00] text-2xl md:text-3xl font-black uppercase italic leading-tight">
                                        {item.nombre} <span className="text-white/50 text-xl font-bold italic lowercase">x{item.quantity}</span>
                                    </h2>
                                    <p className="text-white/80 font-bold text-lg mb-2">Peso: {item.pesoSeleccionado}</p>
                                    
                                    <ul className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                                        {item.agregados.length > 0 ? (
                                            item.agregados.map((a, i) => (
                                                <li key={i} className="bg-[#e37b00]/20 text-[#e37b00] text-xs font-bold px-3 py-1 rounded-full border border-[#e37b00]/30">
                                                    {a}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-white/40 text-xs italic uppercase tracking-widest">Sin agregados</li>
                                        )}
                                    </ul>
                                    <p className="text-[#e37b00] text-2xl font-black">${item.precioUnidad * item.quantity}</p>
                                </div>

                                <button 
                                    onClick={() => removeItem(item.id, item.precioUnidad)} 
                                    className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl transition-all duration-300 group-hover:shadow-lg"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        ))}
                    </div>

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