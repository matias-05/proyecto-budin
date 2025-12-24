import { useState } from 'react';

export default function FormCheckout(props) {

    const [paymentMethod, setPaymentMethod] = useState('efectivo');

    function handleChange(event) {
        setPaymentMethod(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        props.handleCheckout({ paymentMethod });
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-6 font-['Dosis'] w-full max-w-md mx-auto"
        >
            <div className="flex flex-col gap-4">
                <label className="text-[#681104] font-bold uppercase tracking-widest text-center text-lg">
                    Selecciona tu forma de pago
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                    {/* OPCIÓN EFECTIVO */}
                    <label className={`
                        flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer
                        ${paymentMethod === 'efectivo' 
                            ? 'border-[#e37b00] bg-[#681104]/10 text-[#e37b00]' 
                            : 'border-gray-200 text-gray-500 hover:border-[#e37b00]/50'}
                    `}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="efectivo"
                            checked={paymentMethod === 'efectivo'}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <span className="font-bold text-lg uppercase">Efectivo</span>
                        <span className="text-xs opacity-70">En el local</span>
                    </label>

                    {/* OPCIÓN TRANSFERENCIA */}
                    <label className={`
                        flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer
                        ${paymentMethod === 'transferencia' 
                            ? 'border-[#e37b00] bg-[#681104]/10 text-[#e37b00]' 
                            : 'border-gray-200 text-gray-500 hover:border-[#e37b00]/50'}
                    `}>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="transferencia"
                            checked={paymentMethod === 'transferencia'}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <span className="font-bold text-lg uppercase">Transferencia</span>
                        <span className="text-xs opacity-70">Envío de comprobante</span>
                    </label>
                </div>
            </div>

            {/* BOTÓN DE ENVÍO */}
            <button 
                type="submit" 
                className="mt-2 bg-[#e37b00] text-[#681104] font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 tracking-[0.15em] text-lg shadow-black/40"
            >
                Finalizar Pedido
            </button>
        </form>
    );
}