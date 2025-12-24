export default function SectionSobreNosotros(props) {
  return (
    <section id='quienes-somos' className="relative w-full h-screen flex flex-col items-center justify-center md:justify-start md:flex-row md:items-stretch">
        <div className="absolute inset-0 z-0 bg-cover bg-center md:bg-[length:50%] md:bg-right md:bg-no-repeat" style={{ backgroundImage: "url('/fondo-quienes.jpg')" }}>
            <div className="absolute inset-0 bg-black/35 pointer-events-none"></div>
        </div>

        <img src="/logo-quienes.png" alt="Logo mobile" className="relative z-10 h-16 mt-4 md:hidden"/>

        <div className="relative z-10 flex flex-col items-center pt-4 md:pt-0 md:justify-center w-full md:w-[60rem] bg-transparent md:bg-[#e37b00]">
            <h2 className="text-[1.5rem] md:text-[2rem] font-extrabold text-[#ee8e19] bg-[#681104] rounded-[2rem] p-4 mb-4 md:mb-1 md:mt-5 shadow-[-14px_-3px_15px_#000000]">
                ¿ Quiénes Somos ?
            </h2>
            <img src="/logo-quienes.png" alt="Logo desktop" className="hidden md:block  h-16 object-contain"/>
            <p className="text-[1rem] md:text-[1.9em] font-extrabold text-[#4b0d04] bg-[#ff8c00a4] w-[90%] md:w-[70%] rounded-[3rem] p-8 text-center drop-shadow-[3px_3px_15px_#000000]">
                Rincón del Budín es un emprendimiento de budines 100% artesanales, elaborados sin conservantes y con ingredientes seleccionados.
                Creemos que un budín no es solo un postre, sino que es un momento para disfrutar, compartir y recordar.
            </p>
            
        </div>
      </section>
  );}