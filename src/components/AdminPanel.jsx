// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useLocation } from "react-router-dom";

const AdminPanel = ({ user, setUser }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(
    location.state?.section || "products"
  );
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Verificar se o usuário é admin
    if (!user || user.role !== "admin") {
      navigate("/home");
      return;
    }

    // Carregar dados do localStorage
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    // Carregar produtos
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);

    // Carregar usuários
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);

    // Carregar pedidos (você precisará implementar isso)
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
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
            <p className="text-green-100">Total de Usuários</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <Users className="w-8 h-8" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Pedidos Hoje</p>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <ShoppingCart className="w-8 h-8" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100">Receita Total</p>
            <p className="text-3xl font-bold">
              R${" "}
              {orders
                .reduce((total, order) => total + order.total, 0)
                .toFixed(2)}
            </p>
          </div>
          <DollarSign className="w-8 h-8" />
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Gerenciar Produtos</h3>
        <button className="bg-verde-neon text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-verde-rua transition-all">
          Adicionar Produto
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-white">{product.name}</h4>
              <p className="text-gray-300">R$ {product.price}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                Editar
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Gerenciar Usuários</h3>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-white">{user.nome}</h4>
              <p className="text-gray-300">{user.email}</p>
            </div>
            <span className="bg-verde-neon text-gray-900 px-2 py-1 rounded text-sm font-bold">
              Usuário
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Gerenciar Pedidos</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-white">Pedido #{order.id}</h4>
              <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm font-bold">
                Pendente
              </span>
            </div>
            <p className="text-gray-300">Cliente: {order.customerName}</p>
            <p className="text-verde-neon font-bold">Total: R$ {order.total}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "users":
        return renderUsers();
      case "orders":
        return renderOrders();
      case "analytics":
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white">Analytics</h3>
            <p className="text-gray-300 mt-2">
              Relatórios e análises em desenvolvimento...
            </p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-black">Admin Panel</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-verde-neon font-semibold">{user?.nome}</span>
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
        {sidebarOpen && (
          <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 min-h-screen p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
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
        )}

        {/* Main Content */}
        <main className={`flex-1 p-6 ${sidebarOpen ? "" : "ml-0"}`}>
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-8">
              {menuItems.find((item) => item.id === activeSection)?.label ||
                "Dashboard"}
            </h1>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
