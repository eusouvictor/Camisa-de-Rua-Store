import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { House, ShoppingCart, Ticket, Bolt } from "lucide-react";

// Dados dos produtos diretamente no arquivo (temporariamente)
const produtos = [
  {
    id: 1,
    nome: "CAMISA BLOCO DA LATINHA",
    preco: 49.1,
    categoria: "camisas",
  },
  {
    id: 2,
    nome: "CAMISA SAMBA TRADICIONAL",
    preco: 59.9,
    categoria: "camisas",
  },
  {
    id: 3,
    nome: "BONÉ ESTILO RUA",
    preco: 35.0,
    categoria: "acessorios",
  },
  {
    id: 4,
    nome: "CAMISA NOITE CARIOCA",
    preco: 65.0,
    categoria: "camisas",
  },
  {
    id: 5,
    nome: "COPO CONFORTO",
    preco: 89.9,
    categoria: "acessorios",
  },
  {
    id: 6,
    nome: "CAMISA URBANA",
    preco: 120.0,
    categoria: "camisas",
  },
  {
    id: 7,
    nome: "CAMISETA BÁSICA",
    preco: 29.9,
    categoria: "camisetas",
  },
  {
    id: 8,
    nome: "JAQUETA COURO",
    preco: 199.9,
    categoria: "jaquetas",
  },
];

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
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-64 bg-verde-rua flex items-center justify-center">
        <span className="text-white">Imagem do produto</span>
      </div>
      <div className="p-4">
        <p className="font-medium mb-2">{produto.nome}</p>
        <span className="text-lg font-bold">
          {formatarPreco(produto.preco)}
        </span>
        <span className="block text-sm text-gray-500 capitalize mb-3">
          {produto.categoria}
        </span>
        <button
          onClick={handleAddToCart}
          className="w-full bg-verde-rua text-white py-2 rounded-lg hover:bg-verde-escuro transition-colors font-semibold"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

const Home = ({ addToCart }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos);
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
      setProdutosFiltrados(produtos);
    } else if (categoria === "preco") {
      const ordenados = [...produtos].sort((a, b) => a.preco - b.preco);
      setProdutosFiltrados(ordenados);
    } else {
      const filtrados = produtos.filter(
        (produto) => produto.categoria === categoria
      );
      setProdutosFiltrados(filtrados);
    }
  };

  const handleAddToCart = (produto) => {
    addToCart(produto);
    // Feedback visual opcional
    alert(`${produto.name} adicionado ao carrinho!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

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
          <Link to="Home/Cart" className="p-3">
            {" "}
            {/* MUDEI PARA "/cart" */}
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <ShoppingCart />
            </div>
          </Link>
          <a href="#" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Ticket />
            </div>
          </a>
          <a href="#" className="mt-32">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Bolt />
            </div>
          </a>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 ml-16">
          {/* TOPO COM FILTROS */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
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
                onClick={() => aplicarFiltro("camisas")}
                className={`px-4 py-2 border rounded hover:bg-ouro-claro ${
                  filtroAtivo === "camisas"
                    ? "bg-black text-white border-black"
                    : "border-ouro-escuro"
                }`}
              >
                CAMISAS
              </button>
            </div>
          </div>

          {/* GRID DE PRODUTOS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {produtosFiltrados.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
