// src/pages/AdminHome.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Home
} from "lucide-react";

const AdminHome = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const stats = [
    {
      title: "Total de Produtos",
      value: "24",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      change: "+12%"
    },
    {
      title: "Usuários Cadastrados",
      value: "1.2k",
      icon: Users,
      color: "from-green-500 to-green-600",
      change: "+8%"
    },
    {
      title: "Pedidos Hoje",
      value: "42",
      icon: ShoppingCart,
      color: "from-purple-500 to-purple-600",
      change: "+23%"
    },
    {
      title: "Receita Mensal",
      value: "R$ 12.4k",
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      change: "+15%"
    }
  ];

  const quickActions = [
    {
      title: "Gerenciar Produtos",
      description: "Adicionar, editar ou excluir produtos",
      icon: Package,
      path: "/admin",
      section: "products"
    },
    {
      title: "Ver Pedidos",
      description: "Gerenciar pedidos dos clientes",
      icon: ShoppingCart,
      path: "/admin",
      section: "orders"
    },
    {
      title: "Relatórios",
      description: "Analisar vendas e métricas",
      icon: BarChart3,
      path: "/admin", 
      section: "analytics"
    },
    {
      title: "Configurações",
      description: "Configurar loja e sistema",
      icon: Settings,
      path: "/admin",
      section: "settings"
    }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Produtos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const navigateToSection = (section) => {
    setActiveSection(section);
    // Se quiser navegar para o AdminPanel com section específica
    if (section !== "dashboard") {
      navigate("/admin", { state: { section } });
    }
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
        {/* Sidebar Simples */}
        <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 min-h-screen p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-verde-neon text-gray-900 font-bold"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
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
                      <p className="text-white/60 text-sm mt-1">{stat.change}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigateToSection(action.section)}
                  className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-2xl p-6 text-white text-left transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-verde-neon/20 hover:border-verde-neon/40"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black mb-2">{action.title}</h3>
                      <p className="text-gray-300">{action.description}</p>
                    </div>
                    <div className="bg-verde-neon/20 p-3 rounded-xl">
                      <Icon className="w-8 h-8 text-verde-neon" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-verde-neon/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">Atividade Recente</h2>
              <TrendingUp className="text-verde-neon w-6 h-6" />
            </div>
            
            <div className="space-y-4">
              {[
                { action: "Novo pedido #0012", time: "2 min atrás", user: "João Silva" },
                { action: "Produto cadastrado", time: "5 min atrás", user: "Administrador" },
                { action: "Usuário registrado", time: "10 min atrás", user: "Maria Santos" },
                { action: "Estoque atualizado", time: "15 min atrás", user: "Sistema" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                  <div>
                    <p className="text-white font-semibold">{activity.action}</p>
                    <p className="text-gray-400 text-sm">por {activity.user}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;