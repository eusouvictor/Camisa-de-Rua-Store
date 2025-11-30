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
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
} from "lucide-react";

// 1. URL da API definida para funcionar em qualquer lugar
const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const AdminPanel = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estados
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("products");

  useEffect(() => {
    // Gerencia a navegação entre abas pela URL (ex: /admin?section=users)
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get("section") || "products";
    setActiveSection(section);

    // Proteção de rota
    if (!user || user.role !== "admin") {
      navigate("/home");
      return;
    }
    loadData();
  }, [user, navigate, location]);

  const loadData = async () => {
    try {
      // A) Carregar Produtos (do Banco de Dados)
      const resProd = await fetch(`${API_URL}/produtos`);
      const dataProd = await resProd.json();
      if (resProd.ok) {
        setProducts(dataProd.produtos || []);
      }

      // B) Carregar Usuários (do Banco de Dados - precisa de token)
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

      // C) Carregar Pedidos (Temporário: LocalStorage)
      // Resolveremos isso na integração do Mercado Pago para buscar da API
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // Função para excluir produto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Produto excluído!");
        loadData(); // Atualiza a tela
      } else {
        alert("Erro ao excluir.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pendente" },
      completed: { color: "bg-green-500", text: "Concluído" },
      shipped: { color: "bg-blue-500", text: "Enviado" },
      cancelled: { color: "bg-red-500", text: "Cancelado" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`${config.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
        {config.text}
      </span>
    );
  };

  const menuItems = [
    { id: "products", label: "Produtos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  // --- RENDERIZADORES (Mantendo o design novo) ---

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gerenciar Produtos</h2>
          <p className="text-gray-400">Gerencie todos os produtos da loja</p>
        </div>
        <button className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-verde-neon/25 transition-all flex items-center space-x-2">
          <Plus size={20} />
          <span>Adicionar Produto</span>
        </button>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all">
            <Filter size={20} />
            <span>Filtrar</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Produto</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Preço</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-all">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-semibold">{product.nome}</p>
                      <p className="text-gray-400 text-sm">{product.categoria}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-verde-neon font-bold">R$ {Number(product.preco).toFixed(2)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">Ativo</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"><Edit className="w-4 h-4 text-blue-400" /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Gerenciar Usuários</h2>
        <p className="text-gray-400">Gerencie usuários e permissões</p>
      </div>
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
              <div>
                <h4 className="font-bold text-white">{user.nome || "Sem Nome"}</h4>
                <p className="text-gray-300">{user.email}</p>
              </div>
              <span className="bg-verde-neon text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                {user.role || "Usuário"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Gerenciar Pedidos</h2>
          <p className="text-gray-400">Visualize e gerencie todos os pedidos</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white transition-all">
          <Download size={20} />
          <span>Exportar</span>
        </button>
      </div>
      {/* Grid de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-verde-neon/20">
          <p className="text-gray-400 text-sm">Total Pedidos</p>
          <p className="text-2xl font-black text-white">{orders.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20">
          <p className="text-gray-400 text-sm">Receita Total</p>
          <p className="text-2xl font-black text-verde-neon">
            R$ {orders.reduce((total, order) => total + (order.total || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>
      {/* Lista de Pedidos */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="space-y-4">
          {orders.length === 0 ? <p className="text-gray-400">Nenhum pedido encontrado.</p> : orders.map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700/30 rounded-xl gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-white font-semibold">{order.orderNumber || `#${order.id}`}</span>
                  {getStatusBadge(order.status || "pending")}
                </div>
                <p className="text-gray-300">{order.customer || "Cliente Anônimo"}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-verde-neon font-bold text-lg">R$ {(order.total || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="text-white p-6">Analytics: Em breve com gráficos reais!</div>
  );

  const renderSettings = () => (
    <div className="text-white p-6">Configurações: Em breve!</div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "products": return renderProducts();
      case "users": return renderUsers();
      case "orders": return renderOrders();
      case "analytics": return renderAnalytics();
      case "settings": return renderSettings();
      default: return renderProducts();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded-lg transition-all">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <img src="/images/cdrlogo.svg" alt="Logo" className="h-10 w-auto" />
            <span className="text-xl font-black">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-verde-neon font-semibold">{user?.nome}</span>
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all">
              <LogOut size={18} /> <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 min-h-screen p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/admin?section=${item.id}`)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id ? "bg-verde-neon text-gray-900 font-bold" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        )}
        {/* Main Content */}
        <main className={`flex-1 p-6 ${sidebarOpen ? "" : "ml-0"}`}>
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;