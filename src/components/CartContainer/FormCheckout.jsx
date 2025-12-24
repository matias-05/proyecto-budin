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
            

            

            {/* BOTÓN DE ENVÍO */}
            <button 
                type="submit" 
                className="mt-4 bg-[#e37b00] text-[#681104] font-black uppercase py-5 rounded-2xl shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-300 tracking-[0.15em] text-lg shadow-black/40"
            >
                Finalizar Pedido
            </button>

            
        </form>
    );
}