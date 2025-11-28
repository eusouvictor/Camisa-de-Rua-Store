import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      // Use imagens reais ou placeholders confiáveis
      image: "/images/banner1.jpg", 
      title: "CARNAVAL 2025",
      subtitle: "Blocos Exclusivos",
      description: "Viva a experiência única do carnaval de rua",
      buttonText: "VER INGRESSOS",
      gradient: "from-verde-rua to-verde-escuro",
    },
    {
      id: 2,
      image: "/images/banner2.jpg",
      title: "COLEÇÃO NOVA",
      subtitle: "Lançamento Exclusivo",
      description: "Camisetas com estampas autorais da periferia",
      buttonText: "COMPRAR AGORA",
      gradient: "from-verde-escuro to-gray-900",
    },
    {
      id: 3,
      image: "/images/banner3.jpg",
      title: "SAMBA & CULTURA",
      subtitle: "Eventos Mensais",
      description: "Shows e rodas de samba toda semana",
      buttonText: "CONFIRA A PROGRAMAÇÃO",
      gradient: "from-azul-gelo to-verde-rua",
    },
    {
      id: 4,
      image: "/images/banner4.jpg",
      title: "COMUNIDADE",
      subtitle: "Projetos Sociais",
      description: "Parte do valor é revertido para iniciativas locais",
      buttonText: "SABER MAIS",
      bgColor: "bg-ouro-escuro",
      gradient: "from-ouro-escuro to-black",
    },
  ];

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden mt-4 sm:mt-8 rounded-2xl shadow-2xl group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            {/* Background com gradiente (fallback se não tiver imagem) */}
            <div
              className={`w-full h-full bg-gradient-to-br ${slide.gradient || "from-gray-900 to-black"} flex items-center justify-center p-4 sm:p-6`}
            >
              <div className="text-center text-white max-w-4xl mx-auto z-10">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 sm:mb-4 tracking-tight">
                  {slide.title}
                </h2>
                
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-verde-neon mb-2 sm:mb-3">
                  {slide.subtitle}
                </p>
                
                <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-200">
                  {slide.description}
                </p>
                
                <button className="bg-verde-neon hover:bg-white text-verde-rua font-bold py-3 px-8 rounded-full text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-verde-neon/50">
                  {slide.buttonText}
                </button>
              </div>
            </div>
             {/* Overlay escuro */}
             <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all duration-300 z-20 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-verde-neon scale-125 w-4 sm:w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;