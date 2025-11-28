import React from "react";
import ModalAuth from "../components/ModalAuth";
import Banner from "../components/Banner";
import { useNavigate } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans w-full overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-4 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("Sobre")}
                className="text-white hover:text-verde-neon transition-all duration-300 text-lg font-semibold relative group"
              >
                Sobre
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-verde-neon transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("Foco")}
                className="text-white hover:text-verde-neon transition-all duration-300 text-lg font-semibold relative group"
              >
                Foco
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-verde-neon transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("Contato")}
                className="text-white hover:text-verde-neon transition-all duration-300 text-lg font-semibold relative group"
              >
                Contato
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-verde-neon transition-all duration-300 group-hover:w-full"></span>
              </button>
            </nav>
          </div>

          <button
            onClick={handleExploreClick}
            className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-8 rounded-full text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 whitespace-nowrap"
          >
            Login
          </button>
        </div>
      </header>

      {/* BANNER SECTION */}
      <section className="relative bg-gradient-to-b from-gray-900 to-black text-white pt-20 pb-10 px-4 w-full">
        <div className="flex justify-center items-center w-full max-w-full">
          <Banner />
        </div>
      </section>

      {/* OBJETIVO SECTION */}
      <section id="Sobre" className="py-20 px-4 bg-gray-900 w-full">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-4xl font-black text-center mb-12 text-white">
            NOSSO <span className="text-verde-neon">OBJETIVO</span>
          </h2>

          <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-8 shadow-2xl">
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              A Camisa de Rua Store nasceu com o propósito de vestir a cultura
              da periferia e dar visibilidade às histórias que nascem no
              asfalto, nos becos e nas vielas onde a criatividade floresce. Cada
              estampa é um retrato vivo da energia dos blocos independentes e do
              carnaval de rua, onde a música, a dança e a coletividade se
              encontram como forma de resistência e celebração.
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              Mais do que roupas, nossas peças carregam narrativas que valorizam
              a identidade, a diversidade e a potência cultural das comunidades.
              Aqui, moda é instrumento de expressão e também um meio de
              fortalecer tradições que muitas vezes não encontram espaço na
              grande indústria.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
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

      {/* FOCOS SECTION */}
      <section
        id="Foco"
        className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black w-full"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-white">
              NOSSO{" "}
              <span className="text-verde-neon bg-gradient-to-r from-verde-neon to-verde-rua bg-clip-text text-transparent">
                FOCO
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Três pilares que guiam nossa missão de transformação através da
              cultura
            </p>
            <div className="w-24 h-1 bg-verde-neon mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="bi bi-pencil-square text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">CONEXÃO</h3>
                <div className="w-12 h-0.5 bg-verde-neon mx-auto"></div>
              </div>
              <p className="text-gray-200 text-center leading-relaxed">
                Unir a cultura periférica com oportunidades reais de crescimento
                e visibilidade através do design e identidade visual.
              </p>
            </div>

            <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="bi bi-megaphone text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  VISIBILIDADE
                </h3>
                <div className="w-12 h-0.5 bg-verde-neon mx-auto"></div>
              </div>
              <p className="text-gray-200 text-center leading-relaxed">
                Criar pontes entre artistas, comunidades e o mercado, garantindo
                que cada peça conte uma história genuína e transformadora.
              </p>
            </div>

            <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className="bi bi-heart text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">CULTURA</h3>
                <div className="w-12 h-0.5 bg-verde-neon mx-auto"></div>
              </div>
              <p className="text-gray-200 text-center leading-relaxed">
                Desenvolver soluções que gerem impacto real e oportunidades de
                crescimento através da tecnologia e inovação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO SECTION */}
      <section
        id="Contato"
        className="py-20 px-4 bg-gradient-to-b from-black to-gray-900 w-full"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-black mb-4 text-white">
              ENTRE EM CONTATO COM NOSSA{" "}
              <span className="text-verde-neon bg-gradient-to-r from-verde-neon to-verde-rua bg-clip-text text-transparent">
                EQUIPE!
              </span>
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Discuta sua curiosidade sobre o projeto, ou faça parte com novas
              soluções!
            </p>
            <div className="w-24 h-1 bg-verde-neon mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h4 className="text-2xl font-bold text-verde-neon mb-6">
                  Nossos Canais
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-verde-neon/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-verde-neon rounded-full flex items-center justify-center">
                      <Mail className="text-gray-900" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <p className="text-gray-300">contato@camisaderua.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-verde-neon/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-verde-neon rounded-full flex items-center justify-center">
                      <Phone className="text-gray-900" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Telefone</p>
                      <p className="text-gray-300">(11) 99999-9999</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-verde-neon/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-verde-neon rounded-full flex items-center justify-center">
                      <MapPin className="text-gray-900" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Endereço</p>
                      <p className="text-gray-300">São Paulo, SP - Brasil</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-2xl font-bold text-verde-neon mb-6">
                  Redes Sociais
                </h4>
                <div className="flex space-x-4">
                  {[Instagram, Facebook, Twitter].map((Icon, index) => (
                    <button
                      key={index}
                      className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-verde-neon hover:border-verde-neon hover:scale-110 transition-all duration-300 group"
                    >
                      <Icon
                        className="text-gray-400 group-hover:text-gray-900"
                        size={20}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 border border-verde-neon/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-3 text-verde-neon">
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3 text-verde-neon">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3 text-verde-neon">
                    Mensagem
                  </label>
                  <textarea
                    required
                    rows="5"
                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300"
                    placeholder="Conte-nos sobre sua ideia ou projeto..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
                >
                  ENVIAR MENSAGEM
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 px-4 w-full border-t border-gray-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <img
                src="/images/cdrfooter.svg"
                alt="Camisa de Rua Logo"
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm">
                Vestindo cultura, transformando realidades.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">
                FUNCIONALIDADES
              </h4>
              <div className="space-y-2">
                {["Produtos", "Pagamento", "Entrega", "Rastreamento"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-gray-400 hover:text-verde-neon transition-all duration-300 transform hover:translate-x-1"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">
                SUPORTE
              </h4>
              <div className="space-y-2">
                {["Fale conosco", "FAQ", "Trocas", "Garantia"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-verde-neon transition-all duration-300 transform hover:translate-x-1"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-verde-neon">LEGAL</h4>
              <div className="space-y-2">
                {[
                  "Política de privacidade",
                  "Termos de uso",
                  "Cookies",
                  "LGPD",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-verde-neon transition-all duration-300 transform hover:translate-x-1"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-2xl font-black mb-4">
              VISTA <span className="text-verde-neon">CULTURA</span>. APOIE A{" "}
              <span className="text-verde-neon">COMUNIDADE</span>.
            </p>
            <p className="text-gray-400">
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