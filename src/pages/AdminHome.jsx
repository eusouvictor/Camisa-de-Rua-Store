// src/pages/AdminHome.jsx
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
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const AdminHome = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Carregar produtos do localStorage
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);

    // Carregar usuários
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);

    // Carregar pedidos (simulação)
    const mockOrders = [
      {
        id: "#0012",
        customer: "João Silva",
        total: 149.9,
        status: "pending",
        date: "2024-01-15",
      },
      {
        id: "#0011",
        customer: "Maria Santos",
        total: 89.9,
        status: "completed",
        date: "2024-01-14",
      },
      {
        id: "#0010",
        customer: "Pedro Oliveira",
        total: 199.9,
        status: "shipped",
        date: "2024-01-14",
      },
      {
        id: "#0009",
        customer: "Ana Costa",
        total: 59.9,
        status: "completed",
        date: "2024-01-13",
      },
    ];
    setOrders(mockOrders);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const stats = [
    {
      title: "Total de Produtos",
      value: products.length.toString(),
      icon: Package,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Usuários Cadastrados",
      value: (users.length + 1).toString(), // +1 para incluir o admin
      icon: Users,
      color: "from-green-500 to-green-600",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Pedidos Hoje",
      value: orders
        .filter((order) => order.date === "2024-01-15")
        .length.toString(),
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
      change: "+23%",
      trend: "up",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${orders
        .reduce((total, order) => total + order.total, 0)
        .toFixed(2)}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      change: "+15%",
      trend: "up",
    },
  ];

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
    {
      title: "Relatórios",
      description: "Analisar vendas e métricas",
      icon: BarChart3,
      action: () => navigate("/admin?section=analytics"),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Configurações",
      description: "Configurar loja e sistema",
      icon: Settings,
      action: () => navigate("/admin?section=settings"),
      color: "from-gray-600 to-gray-700",
    },
  ];

  const recentActivities = [
    {
      action: "Novo pedido #0012",
      time: "2 min atrás",
      user: "João Silva",
      type: "order",
    },
    {
      action: "Produto cadastrado",
      time: "5 min atrás",
      user: "Administrador",
      type: "product",
    },
    {
      action: "Usuário registrado",
      time: "10 min atrás",
      user: "Maria Santos",
      type: "user",
    },
    {
      action: "Estoque atualizado",
      time: "15 min atrás",
      user: "Sistema",
      type: "system",
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pendente" },
      completed: { color: "bg-green-500", text: "Concluído" },
      shipped: { color: "bg-blue-500", text: "Enviado" },
      cancelled: { color: "bg-red-500", text: "Cancelado" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`${config.color} text-white px-2 py-1 rounded-full text-xs font-bold`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-black">Painel Administrativo</h1>
              <p className="text-gray-400 text-sm">Bem-vindo, {user?.nome}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-verde-neon text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
              ADMIN
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all"
            >
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
            <button
              onClick={() => setActiveSection("dashboard")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === "dashboard"
                  ? "bg-verde-neon text-gray-900 font-bold"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => navigate("/admin?section=products")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Package size={20} />
              <span>Produtos</span>
            </button>

            <button
              onClick={() => navigate("/admin?section=users")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Users size={20} />
              <span>Usuários</span>
            </button>

            <button
              onClick={() => navigate("/admin?section=orders")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <ShoppingCart size={20} />
              <span>Pedidos</span>
            </button>

            <button
              onClick={() => navigate("/admin?section=analytics")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/80 text-sm">{stat.title}</p>
                      <p className="text-3xl font-black mt-2">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendIcon
                          className={`w-4 h-4 ${
                            stat.trend === "up"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        />
                        <span
                          className={`text-sm ml-1 ${
                            stat.trend === "up"
                              ? "text-green-300"
                              : "text-red-300"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
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
            {/* Quick Actions */}
            <div className="xl:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black mb-2">
                            {action.title}
                          </h3>
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

              {/* Recent Orders */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-verde-neon/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white">
                    Pedidos Recentes
                  </h2>
                  <ShoppingCart className="text-verde-neon w-6 h-6" />
                </div>

                <div className="space-y-4">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-semibold">
                            {order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-verde-neon font-bold">
                          R$ {order.total.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">{order.date}</p>
                      </div>
                      <button className="ml-4 p-2 hover:bg-gray-600 rounded-lg transition-all">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-verde-neon/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-white">
                    Atividade Recente
                  </h2>
                  <TrendingUp className="text-verde-neon w-6 h-6" />
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-xl"
                    >
                      <div
                        className={`w-2 h-2 mt-2 rounded-full ${
                          activity.type === "order"
                            ? "bg-blue-500"
                            : activity.type === "product"
                            ? "bg-green-500"
                            : activity.type === "user"
                            ? "bg-purple-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">
                          {activity.action}
                        </p>
                        <p className="text-gray-400 text-xs">
                          por {activity.user}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-verde-neon/20">
                <h3 className="text-lg font-black text-white mb-4">
                  Visão Geral
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Produtos Ativos</span>
                    <span className="text-verde-neon font-bold">
                      {products.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Usuários Online</span>
                    <span className="text-verde-neon font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Taxa de Conversão</span>
                    <span className="text-verde-neon font-bold">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tempo Médio</span>
                    <span className="text-verde-neon font-bold">2m 34s</span>
                  </div>
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
