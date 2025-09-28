import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Mock de produtos (substitua pela sua API)
  const produtos = Array(8).fill({
    nome: "CAMISA BLOCO DA LATINHA",
    preco: "R$ 49,10",
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Se não estiver logado, não renderiza nada (já que o useEffect redireciona)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
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
        <aside className="ml-2 w-14 bg-gray-900 flex flex-col items-center py-3 fixed top-0 h-full rounded-md z-40 mt-1">
          {" "}
          <a href="#" className="p-3 hover:bg-gray-800 rounded-lg mb-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </a>
          <a href="#" className="p-3 hover:bg-gray-800 rounded-lg mb-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </a>
          <a href="#" className="p-3 hover:bg-gray-800 rounded-lg mb-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </a>
          <a href="#" className="p-3 hover:bg-gray-800 rounded-lg mb-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </a>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 ml-16">
          {/* TOPO */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                FILTROS
              </button>
              <button className="px-4 py-2 bg-black text-white rounded">
                PREÇO
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                ESTILO
              </button>
            </div>
          </div>

          {/* GRID DE PRODUTOS */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {produtos.map((produto, index) => (
              <div
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                key={index}
              >
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <p className="font-medium mb-2">{produto.nome}</p>
                  <span className="text-lg font-bold">{produto.preco}</span>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

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
    </div>
  );
};

export default Home;
