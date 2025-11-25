import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/images/banner1.jpg", // ou use URLs externas
      title: "CARNAVAL 2025",
      subtitle: "Blocos Exclusivos",
      description: "Viva a experiência única do carnaval de rua",
      buttonText: "VER INGRESSOS",
      bgColor: "bg-verde-rua",
    },
    {
      id: 2,
      image: "/images/banner2.jpg",
      title: "COLEÇÃO NOVA",
      subtitle: "Lançamento Exclusivo",
      description: "Camisetas com estampas autorais da periferia",
      buttonText: "COMPRAR AGORA",
      bgColor: "bg-verde-escuro",
    },
    {
      id: 3,
      image: "/images/banner3.jpg",
      title: "SAMBA & CULTURA",
      subtitle: "Eventos Mensais",
      description: "Shows e rodas de samba toda semana",
      buttonText: "CONFIRA A PROGRAMAÇÃO",
      bgColor: "bg-azul-gelo",
    },
    {
      id: 4,
      image: "/images/banner4.jpg",
      title: "COMUNIDADE",
      subtitle: "Projetos Sociais",
      description: "Parte do valor é revertido para iniciativas locais",
      buttonText: "SABER MAIS",
      bgColor: "bg-ouro-escuro",
    },
  ];

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000); // Muda a cada 10 segundos

    return () => clearInterval(interval);
  }, [currentSlide]);

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
    <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden mt-20 rounded">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            {/* Imagem de fundo */}
            <div
              className={`w-full h-full ${slide.bgColor} flex items-center justify-center`}
            >
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-black mb-4">
                  {slide.title}
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-verde-neon mb-2">
                  {slide.subtitle}
                </p>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                  {slide.description}
                </p>
                <button className="bg-verde-neon text-verde-rua font-bold py-4 px-8 rounded-full text-xl hover:bg-white hover:scale-105 transform transition-all duration-300">
                  {slide.buttonText}
                </button>
              </div>
            </div>

            {/* Overlay escuro para melhor contraste */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-300 z-10"
      >
        <ChevronLeft size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-300 z-10"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicadores (dots) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-verde-neon scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
