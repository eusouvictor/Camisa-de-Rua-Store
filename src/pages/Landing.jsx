import React from "react";
import ModalAuth from "../components/ModalAuth";
import BannerSlider from "../components/Banner";
import { useNavigate } from "react-router-dom";

const Landing = ({
  isAuthOpen,
  setIsAuthOpen,
  handleExploreClick,
  handleSubmit,
  handleLoginSuccess,
}) => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      // Se não está na página inicial, vai pra lá primeiro
      navigate("/");
      // Espera a navegação acontecer e depois scrolla
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Já está na página inicial, só scrolla
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-theme font-sans w-full overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-verde-escuro text-white py-3 px-3 w-full z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/Vector.png"
              alt="Camisa de Rua Logo"
              className="h-12 w-auto max-w-full object-contain"
            />
          </div>

          <div className="flex items-center">
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("Sobre")}
                className="text-white hover:text-verde-neon transition-colors duration-300 text-lg font-semibold"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection("Foco")}
                className="text-white hover:text-verde-neon transition-colors duration-300 text-lg font-semibold"
              >
                Foco
              </button>
              <button
                onClick={() => scrollToSection("Contato")}
                className="text-white hover:text-verde-neon transition-colors duration-300 text-lg font-semibold"
              >
                Contato
              </button>
            </nav>
          </div>

          <button
            onClick={handleExploreClick}
            className="bg-verde-neon hover:bg-dark-theme text-white font-bold py-2 px-6 rounded-full text-xl transition-all duration-500 transform hover:scale-95 whitespace-nowrap"
          >
            Login
          </button>
        </div>
      </header>

      {/* BANNER SECTION */}
      <section className="relative bg-dark-theme text-white py-5 px-10 w-full mt-0">
        <div className="flex justify-center items-center w-full max-w-full">
          <BannerSlider />
        </div>
      </section>

      {/* OBJETIVO SECTION */}
      <section id="Sobre" className="py-20 px-4 bg-dark-theme w-full">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl font-black text-center mb-12 text-white">
            NOSSO <span className="text-verde-neon">OBJETIVO</span>
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 w-full">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              A Camisa de Rua Store nasceu com o propósito de vestir a cultura
              da periferia e dar visibilidade às histórias que nascem no
              asfalto, nos becos e nas vielas onde a criatividade floresce. Cada
              estampa é um retrato vivo da energia dos blocos independentes e do
              carnaval de rua, onde a música, a dança e a coletividade se
              encontram como forma de resistência e celebração.
            </p>
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Mais do que roupas, nossas peças carregam narrativas que valorizam
              a identidade, a diversidade e a potência cultural das comunidades.
              Aqui, moda é instrumento de expressão e também um meio de
              fortalecer tradições que muitas vezes não encontram espaço na
              grande indústria.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              Mas não paramos na estética. Em cada venda, uma parte do valor é
              revertida para projetos sociais que apoiam jovens talentos,
              artistas locais e iniciativas comunitárias, criando uma rede de
              impacto que vai além da moda. Ao escolher nossas camisetas, você
              se conecta a uma corrente de solidariedade que acredita no poder
              da cultura para transformar realidades. Nosso compromisso é unir
              estilo, consciência social e orgulho periférico em um mesmo
              movimento, mostrando que quando a rua veste sua própria história,
              ela também abre caminhos para um futuro mais justo e coletivo.
            </p>
          </div>
        </div>
      </section>

      {/* FOCOS SECTION - Adicionei esta section para o botão "Foco" */}
      <section id="Foco" className="py-20 px-4 bg-dark-theme w-full">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl font-black text-center mb-12 text-white">
            NOSSO <span className="text-verde-neon">FOCO</span>
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 w-full">
            <p className="text-lg leading-relaxed text-gray-700">
              Nosso foco é conectar a cultura periférica com oportunidades reais
              de crescimento e visibilidade. Através da moda, criamos pontes
              entre artistas, comunidades e o mercado, garantindo que cada peça
              conte uma história genuína e transformadora.
            </p>
          </div>
        </div>
      </section>

      {/* CONTATO SECTION */}
      <section id="Contato" className="py-16 px-4 bg-dark-theme w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black mb-4 text-white">
              ENTRE EM CONTATO COM NOSSA{" "}
              <span className="text-verde-neon">EQUIPE!</span>
            </h3>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Discuta sua curiosidade sobre o projeto, ou faça parte com novas
              soluções!
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-white w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-verde-neon">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-verde-neon">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-verde-neon">
                  Mensagem
                </label>
                <textarea
                  required
                  rows="5"
                  className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Conte-nos sobre sua ideia ou projeto..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-verde-rua hover:bg-verde-neon text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                ENVIAR MENSAGEM
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 px-4 w-full">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">
                FUNCIONALIDADES
              </h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Produtos
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Pagamento
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">
                SUPORTE
              </h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Fale conosco
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">LEGAL</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Política de privacidade
                </a>
                <a
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Termos de uso
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-xl font-black">
              VISTA <span className="text-verde-neon">CULTURA</span>. APOIE A{" "}
              <span className="text-verde-neon">COMUNIDADE</span>.
            </p>
            <p className="text-gray-400 mt-2">
              © 2025 Camisa de Rua Store. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Login na Landing Page */}
      <ModalAuth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Landing;
