import './FormCheckout.css';
import { useState } from 'react';

export default function FormCheckout(props) {
    const [formData, setFormData] = useState({username: '', email: '', phone: ''});

    function handleInputChange(event) {
        const { name, value } = event.target;
        const newFormData = { ...formData};
        newFormData[name] = value;
        setFormData(newFormData);
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Formulario enviado");
        props.handleCheckout(formData);
    }

    function resetForm() {
        setFormData({username: '', email: '', phone: ''});
    }

    function handleNumberInput(event) {
        ( ! [1,2,3,4,5,6,7,8,9,0].includes( Number(event.key) ) ) && event.preventDefault();
    }

    return (
        <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">Nombre
                <input type="text" name="username" className="inputs" onChange={handleInputChange} value={formData.username} />
            </label>
            <label htmlFor="">Email
                <input type="email" name="email" className="inputs" onChange={handleInputChange} value={formData.email} />
            </label>
            <label htmlFor="">Teléfono
                <input type="tel" name="phone" className="inputs" onChange={handleInputChange} value={formData.phone} onKeyDown={handleNumberInput} />
            </label>
            <button type="submit">Realizar Pedido</button>
            <button type="button" onClick={resetForm}>Resetear Formulario</button>
        </form>
    );
}