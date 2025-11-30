import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  DollarSign,
  LogOut,
  Home,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const AdminHome = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- BUSCAR DADOS REAIS DO BACKEND ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Buscar Produtos
        const resProducts = await fetch("http://localhost:4000/api/produtos");
        const dataProducts = await resProducts.json();
        if (resProducts.ok) setProducts(dataProducts.produtos || []);

        // 2. Buscar Usuários (Assumindo que sua rota é /api/auth para listar)
        const resUsers = await fetch("http://localhost:4000/api/auth");
        const dataUsers = await resUsers.json();
        if (resUsers.ok) setUsers(dataUsers.users || []);

        // 3. Buscar Pedidos
        const resOrders = await fetch("http://localhost:4000/api/pedidos");
        const dataOrders = await resOrders.json();
        if (resOrders.ok) setOrders(dataOrders.orders || []);

      } catch (error) {
        console.error("Erro ao carregar dados do admin:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

  // --- CÁLCULOS ESTATÍSTICOS ---
  // Calcula o total vendido somando o 'total' de todos os pedidos
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total || 0), 0);
  
  // Conta quantos pedidos foram feitos hoje
  const ordersToday = orders.filter(order => {
      const today = new Date().toISOString().split('T')[0];
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return today === orderDate;
  }).length;

  const stats = [
    {
      title: "Total de Produtos",
      value: products.length.toString(),
      icon: Package,
      color: "from-blue-500 to-blue-600",
      change: "Real",
      trend: "up",
    },
    {
      title: "Usuários Cadastrados",
      value: users.length.toString(),
      icon: Users,
      color: "from-green-500 to-green-600",
      change: "Real",
      trend: "up",
    },
    {
      title: "Pedidos Hoje",
      value: ordersToday.toString(),
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
      change: "Real",
      trend: "up",
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      change: "Real",
      trend: "up",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-500", text: "Pendente" },
      COMPLETED: { color: "bg-green-500", text: "Concluído" },
      SHIPPED: { color: "bg-blue-500", text: "Enviado" },
      CANCELLED: { color: "bg-red-500", text: "Cancelado" },
    };
    const config = statusConfig[status] || { color: "bg-gray-500", text: status };
    return (
      <span className={`${config.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
        {config.text}
      </span>
    );
  };

  const quickActions = [
    {
        title: "Adicionar Produto",
        description: "Cadastrar novo produto na loja",
        icon: Plus,
        action: () => navigate("/admin?section=products"),
        color: "from-verde-neon to-verde-rua",
      },
      {
        title: "Ver Pedidos",
        description: "Gerenciar pedidos dos clientes",
        icon: ShoppingCart,
        action: () => navigate("/admin?section=orders"),
        color: "from-purple-500 to-purple-600",
      },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/cdrlogo.svg" alt="Camisa de Rua Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-black">Painel Administrativo</h1>
              <p className="text-gray-400 text-sm">Bem-vindo, {user?.name || user?.nome || "Admin"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-verde-neon text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              ADMIN
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all">
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 min-h-screen p-4">
          <nav className="space-y-2">
            <button onClick={() => setActiveSection("dashboard")} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeSection === "dashboard" ? "bg-verde-neon text-gray-900 font-bold" : "text-gray-300 hover:bg-gray-700/50 hover:text-white"}`}>
              <Home size={20} />
              <span>Dashboard</span>
            </button>
            <button onClick={() => navigate("/admin?section=products")} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white">
              <Package size={20} />
              <span>Produtos</span>
            </button>
            <button onClick={() => navigate("/admin?section=orders")} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white">
              <ShoppingCart size={20} />
              <span>Pedidos</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/80 text-sm">{stat.title}</p>
                      <p className="text-3xl font-black mt-2">{stat.value}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             {/* Quick Actions (Mantidos) */}
             <div className="xl:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button key={index} onClick={action.action} className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                        <div className="flex items-center justify-between">
                            <div>
                            <h3 className="text-xl font-black mb-2">{action.title}</h3>
                            <p className="text-white/80">{action.description}</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                            <Icon className="w-8 h-8" />
                            </div>
                        </div>
                        </button>
                    );
                    })}
                </div>

                {/* Tabela de Pedidos Recentes (AGORA REAL) */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-verde-neon/20">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-white">Pedidos Recentes</h2>
                    <ShoppingCart className="text-verde-neon w-6 h-6" />
                    </div>

                    <div className="space-y-4">
                    {loading ? (
                        <p className="text-gray-400">Carregando pedidos...</p>
                    ) : orders.length === 0 ? (
                        <p className="text-gray-400">Nenhum pedido encontrado.</p>
                    ) : (
                        orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                            <div className="flex-1">
                            <div className="flex items-center space-x-3">
                                <span className="text-white font-semibold">#{order.id}</span>
                                {getStatusBadge(order.status)}
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                                Cliente ID: {order.userId} | Data: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            </div>
                            <div className="text-right">
                            <p className="text-verde-neon font-bold">R$ {Number(order.total).toFixed(2)}</p>
                            </div>
                            <button className="ml-4 p-2 hover:bg-gray-600 rounded-lg transition-all">
                                <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        ))
                    )}
                    </div>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;