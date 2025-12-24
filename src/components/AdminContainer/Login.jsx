import { useState } from "react";
import { auth } from "../../data/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin"); 
        } catch (err) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <section className="min-h-screen bg-[#e37b00] flex justify-center items-center px-4 font-['Dosis']">
            <form onSubmit={handleLogin} className="bg-[#681104] p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-2 border-white/10">
                <h2 className="text-[#e37b00] text-3xl font-black uppercase italic text-center mb-8">Admin Login</h2>
                
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-xl text-center mb-4 font-bold">{error}</p>}

                <div className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="p-4 rounded-xl bg-black/20 text-white outline-none border border-transparent focus:border-[#e37b00]"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        className="p-4 rounded-xl bg-black/20 text-white outline-none border border-transparent focus:border-[#e37b00]"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="bg-[#e37b00] text-[#681104] py-4 rounded-xl font-black uppercase hover:bg-white transition-all">
                        Entrar
                    </button>
                </div>
            </form>
        </section>
    );
}