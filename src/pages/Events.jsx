import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { House, ShoppingCart, Ticket, Bolt, Menu, Calendar, MapPin, Music, X, Filter } from "lucide-react";
import { useToast } from "../components/Toast";

// DADOS DOS EVENTOS (FOTOS REAIS)
const eventosDados = [
  {
    id: 101,
    nome: "CARNAVAL DA RUA 2025",
    preco: 89.90,
    data: "25/02/2025",
    local: "Centro Histórico",
    descricao: "O maior bloco de carnaval de rua da região!",
    categoria: "carnaval",
    imageUrl: "https://images.unsplash.com/photo-1567855636905-85b527d35188?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 102,
    nome: "RODA DE SAMBA RAIZ",
    preco: 45.00,
    data: "15/03/2025",
    local: "Praça Central",
    descricao: "Samba de verdade e feijoada.",
    categoria: "musica",
    imageUrl: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 103,
    nome: "FESTIVAL URBAN BEATS",
    preco: 120.00,
    data: "20/04/2025",
    local: "Arena Parque",
    descricao: "Rap, Trap e Funk em 12h de música.",
    categoria: "festival",
    imageUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  },
  {
    id: 104,
    nome: "BATALHA DE RIMA",
    preco: 20.00,
    data: "10/05/2025",
    local: "Pista de Skate",
    descricao: "Disputa dos melhores MCs da região.",
    categoria: "batalha",
    imageUrl: "https://images.unsplash.com/photo-1504609773096-104ff1034fad?auto=format&fit=crop&w=800&q=80",
    type: "evento"
  }
];

const EventCard = ({ evento, onAddToCart }) => {
  const handleBuy = () => {
    onAddToCart({
      id: evento.id,
      name: evento.nome, 
      price: evento.preco,
      imageUrl: evento.imageUrl,
      category: evento.categoria,
      type: "evento",
      quantity: 1
    });
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl overflow-hidden hover:scale-105 transition-all">
      <div className="h-48 relative">
        <img src={evento.imageUrl} alt={evento.nome} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-black/70 text-verde-neon px-3 py-1 rounded-full text-xs font-bold uppercase">
          {evento.categoria}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-black text-white text-lg mb-2">{evento.nome}</h3>
        <div className="space-y-1 mb-4 text-sm text-gray-300">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-verde-neon" /> {evento.data}</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-verde-neon" /> {evento.local}</div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-white">R$ {evento.preco.toFixed(2)}</span>
          <button onClick={handleBuy} className="bg-verde-neon text-gray-900 font-bold py-2 px-6 rounded-xl hover:bg-white transition-all">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

const Events = ({ addToCart, cart }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) { navigate("/"); return; }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleAddToCart = (item) => {
    addToCart(item);
    addToast(`${item.name} adicionado!`, "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const totalItemsNoCarrinho = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans pb-24 sm:pb-0">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6 w-full z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="sm:hidden"><button onClick={() => setMenuMobileAberto(!menuMobileAberto)}><Menu className="text-white" /></button></div>
          <img src="/images/cdrlogo.svg" alt="Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-verde-neon font-bold">Olá, {user.nome}</span>
          <button onClick={handleLogout} className="text-red-400 font-bold text-sm hover:text-white transition-all">SAIR</button>
        </div>
      </header>

      {menuMobileAberto && (
        <div className="fixed inset-0 z-40 bg-gray-900/95 pt-20 px-6 sm:hidden">
            <button onClick={() => setMenuMobileAberto(false)} className="absolute top-4 right-4 text-white"><X /></button>
            <nav className="flex flex-col gap-6 text-white text-xl font-bold text-center">
                <Link to="/home" onClick={()=>setMenuMobileAberto(false)}>Home</Link>
                <Link to="/events" className="text-verde-neon" onClick={()=>setMenuMobileAberto(false)}>Eventos</Link>
                <Link to="/cart" onClick={()=>setMenuMobileAberto(false)}>Carrinho</Link>
            </nav>
        </div>
      )}

      <div className="pt-20 flex">
        <aside className="hidden sm:flex w-20 fixed left-4 top-24 bottom-4 bg-gray-800/50 border border-verde-neon/20 rounded-2xl flex-col items-center py-8 gap-8 z-40">
          <Link to="/home" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl"><House /></Link>
          <Link to="/events" className="p-3 bg-verde-neon text-gray-900 rounded-xl shadow-lg"><Ticket /></Link>
          <Link to="/cart" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl relative">
            <ShoppingCart />
            {totalItemsNoCarrinho > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{totalItemsNoCarrinho}</span>}
          </Link>
          <Link to="/settings" className="p-3 text-gray-400 hover:text-verde-neon rounded-xl mt-auto"><Bolt /></Link>
        </aside>

        <main className="flex-1 sm:ml-28 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-8">Eventos & Rolês</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {eventosDados.map(evento => (
                <EventCard key={evento.id} evento={evento} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Events;