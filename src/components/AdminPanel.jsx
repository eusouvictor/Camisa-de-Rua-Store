import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Settings,
  Users,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from "lucide-react";

// 1. DEFINE A URL DA API (Local ou Produção)
const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const AdminPanel = ({ user, setUser }) => {
  const location = useLocation();
  // Pega a seção atual ou define 'dashboard' como padrão
  const [activeSection, setActiveSection] = useState(
    location.state?.section || "dashboard"
  );
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estados para armazenar os dados do banco
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Se não for admin, manda pra casa
    if (!user || user.role !== "admin") {
      // navigate("/home"); // Comentei para facilitar seus testes, mas o ideal é descomentar depois
    }

    // Carrega os dados assim que a tela abre
    loadData();
  }, [user, navigate]);

  // 2. FUNÇÃO QUE BUSCA DADOS NO BANCO DE VERDADE
  const loadData = async () => {
    try {
      // A) Buscar Produtos
      const resProd = await fetch(`${API_URL}/produtos`);
      const dataProd = await resProd.json();
      if (resProd.ok) {
        setProducts(dataProd.produtos || []);
      }

      // B) Buscar Usuários (precisa do token de quem está logado)
      const token = localStorage.getItem("accessToken");
      if (token) {
        const resUser = await fetch(`${API_URL}/auth`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const dataUser = await resUser.json();
        if (resUser.ok) {
          setUsers(dataUser.users || []);
        }
      }
      
      // C) Pedidos (Ainda vamos implementar na Missão 2, por enquanto deixamos vazio ou do localStorage)
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // 3. FUNÇÃO PARA DELETAR PRODUTO
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token para provar que é admin
        },
      });

      if (response.ok) {
        alert("Produto excluído com sucesso!");
        loadData(); // Recarrega a lista para sumir com o produto deletado
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro ao tentar excluir.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Produtos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  // --- RENDERIZAÇÃO DAS SEÇÕES ---

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total de Produtos</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <Package className="w-8 h-8" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Usuários</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <Users className="w-8 h-8" />
        </div>
      </div>
      {/* Cards de Pedidos e Receita (estáticos por enquanto) */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
         <div className="flex items-center justify-between">
            <div><p className="text-purple-100">Pedidos</p><p className="text-3xl font-bold">{orders.length}</p></div>
            <ShoppingCart className="w-8 h-8" />
         </div>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
         <div className="flex items-center justify-between">
            <div><p className="text-orange-100">Receita</p><p className="text-3xl font-bold">R$ 0,00</p></div>
            <DollarSign className="w-8 h-8" />
         </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Gerenciar Produtos</h3>
        <button className="bg-verde-neon text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-verde-rua transition-all flex items-center gap-2">
          <Plus size={18}/> Adicionar Produto
        </button>
      </div>

      <div className="space-y-4">
        {products.length === 0 && <p className="text-gray-400">Nenhum produto encontrado no banco.</p>}
        
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600"
          >
            <div className="flex items-center gap-4">
                {/* Exibe imagem pequena se tiver */}
                <div className="w-12 h-12 bg-gray-600 rounded-lg overflow-hidden">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.nome} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Foto</div>
                    )}
                </div>
                <div>
                  <h4 className="font-bold text-white">{product.nome}</h4>
                  <p className="text-verde-neon text-sm font-bold">R$ {product.preco?.toFixed(2)}</p>
                  <p className="text-gray-400 text-xs">{product.categoria}</p>
                </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Editar
              </button>
              {/* BOTÃO DELETAR CONECTADO */}
              <button 
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
      <h3 className="text-xl font-bold text-white mb-6">Gerenciar Usuários</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600">
            <div>
              <h4 className="font-bold text-white">{user.name || "Sem nome"}</h4>
              <p className="text-gray-300 text-sm">{user.email}</p>
            </div>
            <span className="bg-verde-neon text-gray-900 px-2 py-1 rounded text-xs font-bold">
              {user.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboard();
      case "products": return renderProducts();
      case "users": return renderUsers();
      case "orders": return <div className="text-white">Em breve: Pedidos</div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 flex flex-col">
          <div className="p-6 border-b border-verde-neon/20">
            <img src="/images/cdrlogo.svg" alt="Logo" className="h-10 w-auto mx-auto" />
            <div className="text-center mt-2"><span className="text-verde-neon font-black text-sm">ADMIN PANEL</span></div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id ? "bg-verde-neon text-gray-900 font-bold" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-verde-neon/20">
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/30">
              <LogOut size={20} /> <span>Sair</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 p-4 flex justify-between items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white p-2 hover:bg-gray-700 rounded-lg">
                {sidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="text-white">Olá, {user?.nome || "Admin"}</div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Ícone Plus que faltava no import original
import { Plus } from "lucide-react";

export default AdminPanel;