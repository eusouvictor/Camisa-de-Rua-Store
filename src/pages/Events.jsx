import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { House, ShoppingCart, Ticket, Bolt, Menu, Calendar, MapPin, Music } from "lucide-react";

// DADOS COM IMAGENS REAIS E CORRIGIDAS
const eventosDados = [
  {
    id: 101,
    nome: "CARNAVAL DA RUA 2025",
    preco: 89.90,
    data: "25/02/2025",
    local: "Centro Histórico",
    descricao: "O maior bloco de carnaval de rua da região! Prepare sua fantasia.",
    categoria: "carnaval",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 102,
    nome: "RODA DE SAMBA RAIZ",
    preco: 45.00,
    data: "15/03/2025",
    local: "Praça Central",
    descricao: "Samba de verdade, feijoada e gente bonita.",
    categoria: "musica",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 103,
    nome: "FESTIVAL DE MÚSICA URBANA", // Nome atualizado
    preco: 120.00,
    data: "20/04/2025",
    local: "Arena Parque",
    descricao: "O melhor do Rap, Trap e Funk em 12 horas de música.",
    categoria: "festival",
    // NOVA FOTO DE SHOW/MULTIDÃO QUE FUNCIONA:
    imageUrl: "https://images.unsplash.com/photo-1533174072545-e8d4aa97d848?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 104,
    nome: "BATALHA DE RIMA",
    preco: 20.00,
    data: "10/05/2025",
    local: "Pista de Skate",
    descricao: "Os melhores MCs da região disputando o título.",
    categoria: "batalha",
    imageUrl: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  }
];

const EventCard = ({ evento, onAddToCart }) => {
  return (
    <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 transition-all duration-500">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={evento.imageUrl} 
          alt={evento.nome} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-verde-neon px-3 py-1 rounded-full text-xs font-bold uppercase">
          {evento.categoria}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-black text-white text-lg mb-2 leading-tight">{evento.nome}</h3>
        
        <div className="space-y-2 mb-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-verde-neon" />
            <span>{evento.data}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-verde-neon" />
            <span>{evento.local}</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{evento.descricao}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">A partir de</span>
            <span className="text-xl font-black text-white">R$ {evento.preco.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(evento)}
            className="bg-verde-neon hover:bg-verde-rua text-gray-900 font-bold py-2 px-6 rounded-xl transition-all shadow-lg shadow-verde-neon/20 hover:scale-105 active:scale-95"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

const Events = ({ addToCart, cart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const totalItemsNoCarrinho = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans pb-24 sm:pb-0">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6 w-full z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
             <button onClick={() => setMenuMobileAberto(!menuMobileAberto)}><Menu className="text-white" /></button>
          </div>
          <img src="/images/cdrlogo.svg" alt="Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-verde-neon font-bold">Olá, {user.nome}</span>
          <button onClick={handleLogout} className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all">SAIR</button>
        </div>
      </header>

      <div className="pt-20 flex">
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden sm:flex w-20 fixed left-4 top-24 bottom-4 bg-gray-800/50 backdrop-blur-md border border-verde-neon/20 rounded-2xl flex-col items-center py-8 gap-8 z-40">
          <Link to="/home" className="p-3 text-gray-400 hover:text-verde-neon hover:bg-gray-700/50 rounded-xl transition-all"><House /></Link>
          <Link to="/events" className="p-3 bg-verde-neon text-gray-900 rounded-xl shadow-lg shadow-verde-neon/20"><Ticket /></Link>
          <Link to="/cart" className="p-3 text-gray-400 hover:text-verde-neon hover:bg-gray-700/50 rounded-xl transition-all relative">
            <ShoppingCart />
            {totalItemsNoCarrinho > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{totalItemsNoCarrinho}</span>}
          </Link>
          <Link to="/settings" className="p-3 text-gray-400 hover:text-verde-neon hover:bg-gray-700/50 rounded-xl transition-all mt-auto"><Bolt /></Link>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 sm:ml-28 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-verde-neon/20 rounded-xl flex items-center justify-center text-verde-neon">
                <Music size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Eventos & Rolês</h1>
                <p className="text-gray-400">Garanta seu ingresso para os melhores eventos da cultura de rua</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventosDados.map(evento => (
                <EventCard key={evento.id} evento={evento} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* MENU MOBILE */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-verde-neon/20 p-4 flex justify-around z-50">
        <Link to="/home" className="text-gray-400"><House /></Link>
        <Link to="/events" className="text-verde-neon"><Ticket /></Link>
        <Link to="/cart" className="text-gray-400 relative">
           <ShoppingCart />
           {totalItemsNoCarrinho > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{totalItemsNoCarrinho}</span>}
        </Link>
        <Link to="/settings" className="text-gray-400"><Bolt /></Link>
      </nav>
    </div>
  );
};

export default Events;