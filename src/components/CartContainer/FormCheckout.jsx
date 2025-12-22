import { useState } from 'react';

export default function FormCheckout(props) {
    const [formData, setFormData] = useState({username: '', phone: ''});

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    function handleSubmit(event){
        event.preventDefault();
        // Validación básica antes de enviar
        if( !formData.phone) {
            alert("Por favor, completa todos los campos");
            return;
        }
        props.handleCheckout(formData);
    }

    function handleNumberInput(event) {
        // Permitir teclas de control (Borrar, Tab, flechas, etc)
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
        if (allowedKeys.includes(event.key)) return;

        // Bloquear si no es un número
        if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
        }
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-6 font-['Dosis'] w-full"
        >
            

            {/* CAMPO: TELÉFONO */}
            <div className="flex flex-col gap-2">
                <label className="text-[#e37b00] font-black uppercase text-xs tracking-[0.2em] ml-2">
                    WhatsApp (Sin el 0 ni el 15)
                </label>
                <input 
                    type="tel" 
                    name="phone" 
                    required
                    placeholder="Ej: 3434556677"
                    className="bg-[#520d03] border-2 border-[#e37b00]/20 rounded-2xl p-4 text-white outline-none focus:border-[#e37b00] focus:ring-1 focus:ring-[#e37b00] transition-all duration-300 placeholder:text-white/20 font-bold"
                    onChange={handleInputChange} 
                    value={formData.phone} 
                    onKeyDown={handleNumberInput} 
                />
            </div>

            {/* BOTÓN DE ENVÍO */}
            <button 
                type="submit" 
                className="mt-4 bg-[#e37b00] text-[#681104] font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 tracking-[0.15em] text-lg shadow-black/40"
            >
                Finalizar Pedido
            </button>

            <p className="text-[#e37b00]/50 text-[10px] text-center uppercase font-bold tracking-widest">
                🔒 Tus datos están protegidos
            </p>
        </form>
    );
}