import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
      type: "evento", // Tipo para diferenciar no carrinho
      data: evento.data,
      local: evento.local,
      descricao: evento.descricao,
    });
  };

  return (
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
        </main>
      </div>
    </div>
  );
};

export default Events;
