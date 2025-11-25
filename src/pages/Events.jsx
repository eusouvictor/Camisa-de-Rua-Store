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
import { House, ShoppingCart, Ticket, Bolt } from "lucide-react";

// Dados dos eventos
const eventos = [
  {
    id: 1,
    nome: "CARNAVAL DA RUA 2025",
    preco: 89.9,
    data: "25/02/2025",
    local: "Centro da Cidade",
    descricao: "O maior bloco de carnaval de rua da região!",
    categoria: "carnaval",
  },
  {
    id: 2,
    nome: "SAMBA NA PRAÇA",
    preco: 45.0,
    data: "15/03/2025",
    local: "Praça Central",
    descricao: "Noite de samba com as melhores bandas locais",
    categoria: "musica",
  },
  {
    id: 3,
    nome: "FESTA DO BLOCO DA LATINHA",
    preco: 65.0,
    data: "28/02/2025",
    local: "Rua da Festa, 123",
    descricao: "Traga sua latinha e venha curtir o melhor do carnaval",
    categoria: "carnaval",
  },
  {
    id: 4,
    nome: "SHOW DE SAMBA TRADICIONAL",
    preco: 75.0,
    data: "10/03/2025",
    local: "Teatro Municipal",
    descricao: "As raízes do samba com artistas consagrados",
    categoria: "musica",
  },
  {
    id: 5,
    nome: "BAILE DE CARNAVAL FAMÍLIA",
    preco: 35.0,
    data: "01/03/2025",
    local: "Clube da Cidade",
    descricao: "Carnaval para toda a família, das 14h às 20h",
    categoria: "carnaval",
  },
  {
    id: 6,
    nome: "FESTIVAL DE MÚSICA URBANA",
    preco: 120.0,
    data: "20/04/2025",
    local: "Parque Central",
    descricao: "12 horas de música com diversos artistas urbanos",
    categoria: "musica",
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
      type: "evento",
      type: "evento", // Tipo para diferenciar no carrinho
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao,
    });
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40 transition-all duration-500">
      <div className="h-48 sm:h-64 bg-gradient-to-br from-verde-rua to-verde-escuro flex items-center justify-center relative overflow-hidden">
        <span className="text-white text-sm sm:text-base font-semibold z-10">
          Imagem do Evento
        </span>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
      </div>
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
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-verde-rua flex items-center justify-center">
        <span className="text-white">Imagem do Evento</span>
      </div>
      <div className="p-4">
        <p className="font-bold text-lg mb-2">{evento.nome}</p>
        <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
        <div className="text-sm text-gray-700 space-y-1 mb-3">
          <p>📅 {evento.data}</p>
          <p>📍 {evento.local}</p>
        </div>
        <span className="text-lg font-bold text-verde-rua">
          {formatarPreco(evento.preco)}
        </span>
        <span className="block text-sm text-gray-500 capitalize mb-3">
          {evento.categoria}
        </span>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
          className="w-full bg-verde-rua text-white py-2 rounded-lg hover:bg-verde-escuro transition-colors font-semibold"
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
    alert(`Ingresso para ${evento.name} adicionado ao carrinho!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Contador de itens no carrinho
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
                Olá, {user.nome}
              </span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
    <div className="min-h-screen bg-white font-advent">
      {/* HEADER */}
      <header className="bg-verde-rua text-white py-4 px-4 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/Vector.png"
              alt="Camisa de Rua Logo"
              className="h-12 w-19 object-cover ml-40"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-verde-neon">Olá, {user.nome}</span>
              <button
                onClick={handleLogout}
                className="border-2 border-verde-neon text-verde-neon font-bold py-2 px-6 rounded-full hover:bg-verde-neon hover:text-verde-rua transition-colors"
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
                Olá, {user.nome}
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
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-white flex">
        {/* MENU LATERAL */}
        <aside className="ml-2 w-12 bg-azul-gelo flex flex-col items-center py-3 fixed top-32 h-80 bottom-8 rounded-xl z-40 mt-4">
          <Link to="/home" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <House />
            </div>
          </Link>
          <Link to="/events" className="p-3 bg-verde-neon rounded">
            <div className="w-6 h-6 rounded">
              <Ticket className="text-verde-rua" />
            </div>
          </Link>
          <Link to="/cart" className="p-3 relative">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <ShoppingCart />
            </div>
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-1 -right-1 bg-verde-neon text-verde-rua text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
                  px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg font-semibold 
                  transition-all duration-300 whitespace-nowrap border text-sm sm:text-base
                  transform hover:scale-105 active:scale-95
                  ${
                    filtroAtivo === filtro.key
                      ? "bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 border-transparent shadow-lg shadow-verde-neon/30 scale-105"
                      : "bg-gray-700/50 text-gray-300 border-verde-neon/20 hover:border-verde-neon/40 hover:text-verde-neon hover:bg-gray-600/50"
                  }
                `}
              >
                {filtro.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>

          {/* GRID DE EVENTOS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
          <Link to="/settings" className="p-3 mt-32">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Bolt />
            </div>
          </Link>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 ml-16">
          {/* TOPO COM FILTROS */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold mb-4">Eventos e Festas</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => aplicarFiltro("todos")}
                className={`px-4 py-2 border rounded hover:bg-ouro-claro ${
                  filtroAtivo === "todos"
                    ? "bg-black text-white border-black"
                    : "border-ouro-escuro"
                }`}
              >
                TODOS
              </button>
              <button
                onClick={() => aplicarFiltro("preco")}
                className={`px-4 py-2 border rounded hover:bg-ouro-claro ${
                  filtroAtivo === "preco"
                    ? "bg-black text-white border-black"
                    : "border-ouro-escuro"
                }`}
              >
                PREÇO
              </button>
              <button
                onClick={() => aplicarFiltro("carnaval")}
                className={`px-4 py-2 border rounded hover:bg-ouro-claro ${
                  filtroAtivo === "carnaval"
                    ? "bg-black text-white border-black"
                    : "border-ouro-escuro"
                }`}
              >
                CARNAVAL
              </button>
              <button
                onClick={() => aplicarFiltro("musica")}
                className={`px-4 py-2 border rounded hover:bg-ouro-claro ${
                  filtroAtivo === "musica"
                    ? "bg-black text-white border-black"
                    : "border-ouro-escuro"
                }`}
              >
                MÚSICA
              </button>
            </div>
          </div>

          {/* GRID DE EVENTOS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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

export default Events;
