import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  House,
  ShoppingCart,
  Ticket,
  Bolt,
  Menu,
  X,
  Filter,
} from "lucide-react";

<<<<<<< HEAD
// Dados dos eventos (Agora com IMAGENS!)
=======
// Dados dos eventos
>>>>>>> amigo/minha-nova-feature
const eventos = [
  {
    id: 1,
    nome: "CARNAVAL DA RUA 2025",
    preco: 89.9,
    data: "25/02/2025",
    local: "Centro da Cidade",
    descricao: "O maior bloco de carnaval de rua da região!",
    categoria: "carnaval",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1582716401301-b2407dc65613?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
  {
    id: 2,
    nome: "SAMBA NA PRAÇA",
    preco: 45.0,
    data: "15/03/2025",
    local: "Praça Central",
    descricao: "Noite de samba com as melhores bandas locais",
    categoria: "musica",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1514525253440-b393452e8d2e?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
  {
    id: 3,
    nome: "FESTA DO BLOCO DA LATINHA",
    preco: 65.0,
    data: "28/02/2025",
    local: "Rua da Festa, 123",
    descricao: "Traga sua latinha e venha curtir o melhor do carnaval",
    categoria: "carnaval",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
  {
    id: 4,
    nome: "SHOW DE SAMBA TRADICIONAL",
    preco: 75.0,
    data: "10/03/2025",
    local: "Teatro Municipal",
    descricao: "As raízes do samba com artistas consagrados",
    categoria: "musica",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
  {
    id: 5,
    nome: "BAILE DE CARNAVAL FAMÍLIA",
    preco: 35.0,
    data: "01/03/2025",
    local: "Clube da Cidade",
    descricao: "Carnaval para toda a família, das 14h às 20h",
    categoria: "carnaval",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1551972251-12070d63502a?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
  {
    id: 6,
    nome: "FESTIVAL DE MÚSICA URBANA",
    preco: 120.0,
    data: "20/04/2025",
    local: "Parque Central",
    descricao: "12 horas de música com diversos artistas urbanos",
    categoria: "musica",
<<<<<<< HEAD
    imagem: "https://images.unsplash.com/photo-1533174072545-e8d4aa97d848?auto=format&fit=crop&w=800&q=80"
=======
>>>>>>> amigo/minha-nova-feature
  },
];

const EventCard = ({ evento, onAddToCart }) => {
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: evento.id,
      name: evento.nome,
      price: evento.preco,
<<<<<<< HEAD
      type: "evento", // Tipo para diferenciar no carrinho
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao,
      imageUrl: evento.imagem // Passa a imagem para o carrinho
=======
      type: "evento",
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao,
>>>>>>> amigo/minha-nova-feature
    });
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40 transition-all duration-500">
      <div className="h-48 sm:h-64 bg-gradient-to-br from-verde-rua to-verde-escuro flex items-center justify-center relative overflow-hidden">
<<<<<<< HEAD
        {evento.imagem ? (
          <img 
            src={evento.imagem} 
            alt={evento.nome} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="text-white text-sm sm:text-base font-semibold z-10">
            Imagem do Evento
          </span>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
      </div>
      
=======
        <span className="text-white text-sm sm:text-base font-semibold z-10">
          Imagem do Evento
        </span>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
      </div>
>>>>>>> amigo/minha-nova-feature
      <div className="p-6">
        <p className="font-bold mb-3 text-white text-sm sm:text-base line-clamp-2">
          {evento.nome}
        </p>
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
          {evento.descricao}
        </p>
        <div className="text-sm text-gray-300 space-y-2 mb-4">
          <p className="flex items-center space-x-2">
            <span>📅</span>
            <span>{evento.data}</span>
          </p>
          <p className="flex items-center space-x-2">
            <span>📍</span>
            <span className="line-clamp-1">{evento.local}</span>
          </p>
        </div>
        <span className="text-xl font-black text-verde-neon">
          {formatarPreco(evento.preco)}
        </span>
        <span className="block text-sm text-gray-300 capitalize mb-4 font-medium">
          {evento.categoria}
        </span>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
        >
          Comprar Ingresso
        </button>
      </div>
    </div>
  );
};

const Events = ({ addToCart, cart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [eventosFiltrados, setEventosFiltrados] = useState(eventos);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);
  }, [navigate]);

  const aplicarFiltro = (categoria) => {
    setFiltroAtivo(categoria);

    if (categoria === "todos") {
      setEventosFiltrados(eventos);
    } else if (categoria === "preco") {
      const ordenados = [...eventos].sort((a, b) => a.preco - b.preco);
      setEventosFiltrados(ordenados);
    } else {
      const filtrados = eventos.filter(
        (evento) => evento.categoria === categoria
      );
      setEventosFiltrados(filtrados);
    }
  };

  const handleAddToCart = (evento) => {
    addToCart(evento);
<<<<<<< HEAD
    // Feedback visual opcional pode ser adicionado aqui
    alert(`Ingresso para ${evento.nome} adicionado ao carrinho!`);
=======
    alert(`Ingresso para ${evento.name} adicionado ao carrinho!`);
>>>>>>> amigo/minha-nova-feature
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

<<<<<<< HEAD
  // Contador de itens no carrinho
=======
>>>>>>> amigo/minha-nova-feature
  const totalItemsNoCarrinho = cart.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-4 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              <span className="text-verde-neon font-semibold text-lg">
<<<<<<< HEAD
                Olá, {user.nome || user.name}
=======
                Olá, {user.nome}
>>>>>>> amigo/minha-nova-feature
              </span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
              >
                SAIR
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                className="p-2 bg-verde-neon/20 rounded-lg hover:bg-verde-neon/30 transition-all duration-300"
              >
                {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="sm:hidden bg-gray-800/95 backdrop-blur-lg border-t border-verde-neon/20 mt-4 py-4 rounded-b-2xl">
            <div className="flex flex-col space-y-4 px-4">
              <span className="text-verde-neon text-center font-semibold">
<<<<<<< HEAD
                Olá, {user.nome || user.name}
=======
                Olá, {user.nome}
>>>>>>> amigo/minha-nova-feature
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-full transition-all duration-300"
              >
                SAIR
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col sm:flex-row pt-20">
        {/* MENU LATERAL - DESKTOP */}
        <aside className="hidden sm:flex ml-4 w-16 bg-gray-800/50 backdrop-blur-lg flex-col items-center py-6 fixed top-32 h-80 bottom-8 rounded-2xl z-40 border border-verde-neon/20">
          <Link
            to="/home"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <House className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/events"
            className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl mb-8 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <Ticket className="text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/cart"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 relative group border border-gray-600"
          >
            <ShoppingCart className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link
            to="/settings"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mt-auto transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Bolt className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
        </aside>

        {/* MENU INFERIOR - MOBILE */}
        <nav className="sm:hidden fixed bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur-lg border border-verde-neon/20 rounded-2xl z-40 shadow-2xl">
          <div className="flex justify-around items-center py-3">
            <Link
              to="/home"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <House className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
            <Link
              to="/events"
              className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl transition-all duration-300 hover:scale-110"
            >
              <Ticket className="text-gray-900 w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 relative group border border-gray-600"
            >
              <ShoppingCart className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
              {totalItemsNoCarrinho > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {totalItemsNoCarrinho}
                </span>
              )}
            </Link>
            <Link
              to="/settings"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <Bolt className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
          </div>
        </nav>

        {/* CONTEÚDO PRINCIPAL */}
<<<<<<< HEAD
        <main className="flex-1 sm:ml-20 pb-20 sm:pb-0">
          {/* TOPO COM FILTROS */}
          <div className="bg-gray-800/50 backdrop-blur-lg border-b border-verde-neon/20 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                {/* Título e Ícone */}
                <div className="flex items-center space-x-3">
                  <Filter className="text-verde-neon w-5 h-5 sm:w-6 sm:h-6" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                    Eventos e Festas
                  </h1>
                </div>

                {/* Filtros - Versão Responsiva */}
                <div className="w-full lg:w-auto">
                  <div className="flex flex-wrap justify-start lg:justify-end gap-2 sm:gap-3">
                    {[
                      { key: "todos", label: "TODOS" },
                      { key: "preco", label: "PREÇO" },
                      { key: "carnaval", label: "CARNAVAL" },
                      { key: "musica", label: "MÚSICA" },
                    ].map((filtro) => (
                      <button
                        key={filtro.key}
                        onClick={() => aplicarFiltro(filtro.key)}
                        className={`
=======
<main className="flex-1 sm:ml-20 pb-20 sm:pb-0">
  {/* TOPO COM FILTROS */}
  <div className="bg-gray-800/50 backdrop-blur-lg border-b border-verde-neon/20 p-4 sm:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        
        {/* Título e Ícone */}
        <div className="flex items-center space-x-3">
          <Filter className="text-verde-neon w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
            Eventos e Festas
          </h1>
        </div>

        {/* Filtros - Versão Responsiva */}
        <div className="w-full lg:w-auto">
          <div className="flex flex-wrap justify-start lg:justify-end gap-2 sm:gap-3">
            {[
              { key: "todos", label: "TODOS" },
              { key: "preco", label: "PREÇO" },
              { key: "carnaval", label: "CARNAVAL" },
              { key: "musica", label: "MÚSICA" },
            ].map((filtro) => (
              <button
                key={filtro.key}
                onClick={() => aplicarFiltro(filtro.key)}
                className={`
>>>>>>> amigo/minha-nova-feature
                  px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg font-semibold 
                  transition-all duration-300 whitespace-nowrap border text-sm sm:text-base
                  transform hover:scale-105 active:scale-95
                  ${
                    filtroAtivo === filtro.key
                      ? "bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 border-transparent shadow-lg shadow-verde-neon/30 scale-105"
                      : "bg-gray-700/50 text-gray-300 border-verde-neon/20 hover:border-verde-neon/40 hover:text-verde-neon hover:bg-gray-600/50"
                  }
                `}
<<<<<<< HEAD
                      >
                        {filtro.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
=======
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
>>>>>>> amigo/minha-nova-feature

          {/* GRID DE EVENTOS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
            {eventosFiltrados.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onAddToCart={handleAddToCart}
              />
            ))}
          </section>

          {eventosFiltrados.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-verde-neon/20">
                <p className="text-xl font-bold text-verde-neon mb-2">
                  Nenhum evento encontrado
                </p>
                <p className="text-gray-300">
                  Tente alterar os filtros para ver mais eventos.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Events;
=======
export default Events;
>>>>>>> amigo/minha-nova-feature
