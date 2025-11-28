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

const ProductCard = ({ produto, onAddToCart }) => {
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: produto.id,
      name: produto.nome,
      price: produto.preco,
      category: produto.categoria,
      imageUrl: produto.imageUrl, // Passa a imagem para o carrinho também
    });
  };

  return (
    <div className="group bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40 transition-all duration-500">
      {/* Área da Imagem */}
      <div className="h-48 sm:h-64 bg-white flex items-center justify-center relative overflow-hidden">
        {produto.imageUrl ? (
          <img
            src={produto.imageUrl}
            alt={produto.nome}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-verde-rua to-verde-escuro flex items-center justify-center">
            <span className="text-white text-sm sm:text-base font-semibold z-10">
              Sem Foto
            </span>
          </div>
        )}
        {/* Overlay escuro ao passar o mouse */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
      </div>

      <div className="p-6">
        <p className="font-bold mb-3 text-white text-sm sm:text-base line-clamp-2">
          {produto.nome}
        </p>
        
        {/* Descrição opcional se existir */}
        {produto.description && (
           <p className="text-xs text-gray-400 mb-3 line-clamp-2">
             {produto.description}
           </p>
        )}

        <span className="text-xl font-black text-verde-neon">
          {formatarPreco(produto.preco)}
        </span>
        <span className="block text-sm text-gray-300 capitalize mb-4 font-medium">
          {produto.categoria}
        </span>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

const Home = ({ addToCart, cart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allProdutos, setAllProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);

    // Lógica de buscar produtos do Backend
    const fetchProdutos = async () => {
      try {
        // Nota: Se estiver no Vercel, use "/api/produtos". Localmente use o link completo.
        const response = await fetch("http://localhost:4000/api/produtos");
        const data = await response.json();
        if (response.ok) {
          setAllProdutos(data.produtos || []);
          setProdutosFiltrados(data.produtos || []);
          // Aplica o filtro inicial "todos" com os dados carregados
          setFiltroAtivo("todos");
        } else {
          console.error("Erro ao buscar produtos:", data.error);
        }
      } catch (err) {
        console.error("Falha na rede ao buscar produtos:", err);
      }
    };

    fetchProdutos();
  }, [navigate]);

  const aplicarFiltro = (categoria) => {
    setFiltroAtivo(categoria);

    if (categoria === "todos") {
      setProdutosFiltrados(allProdutos);
    } else if (categoria === "preco") {
      const ordenados = [...allProdutos].sort((a, b) => a.preco - b.preco);
      setProdutosFiltrados(ordenados);
    } else {
      const filtrados = allProdutos.filter(
        (produto) => produto.categoria === categoria
      );
      setProdutosFiltrados(filtrados);
    }
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
                Olá, {user.nome || user.name}
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
                Olá, {user.nome || user.name}
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
            className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl mb-8 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <House className="text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/events"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Ticket className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
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
        <main className="flex-1 sm:ml-20 pb-20 sm:pb-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* TOPO COM FILTROS */}
            <div className="bg-gray-800/50 backdrop-blur-lg border-b border-verde-neon/20 p-4 sm:p-6 rounded-3xl mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                {/* Título e Ícone */}
                <div className="flex items-center space-x-3">
                  <Filter className="text-verde-neon w-5 h-5 sm:w-6 sm:h-6" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-bold tracking-tight">
                    Nossos Produtos
                  </h1>
                </div>

                {/* Filtros - Versão Responsiva */}
                <div className="w-full lg:w-auto">
                  <div className="flex flex-wrap justify-start lg:justify-end gap-2 sm:gap-3">
                    {[
                      { key: "todos", label: "TODOS" },
                      { key: "preco", label: "PREÇO" },
                      { key: "camisas", label: "CAMISAS" },
                      { key: "camisetas", label: "CAMISETAS" },
                      { key: "jaquetas", label: "JAQUETAS" },
                      { key: "acessorios", label: "ACESSÓRIOS" },
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

            {/* GRID DE PRODUTOS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados.map((produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  onAddToCart={addToCart} // Alterado para addToCart para bater com a prop do App.jsx
                />
              ))}
            </section>

            {/* Feedback Vazio */}
            {produtosFiltrados.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-auto border border-verde-neon/20">
                  <p className="text-xl font-bold text-verde-neon mb-2">
                    Nenhum produto encontrado
                  </p>
                  <p className="text-gray-300">
                    Tente alterar os filtros ou verificar sua conexão com o backend.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;