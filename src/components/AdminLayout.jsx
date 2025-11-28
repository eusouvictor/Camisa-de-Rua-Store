import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/home", label: "Dashboard", icon: Home },
    { path: "/admin/products", label: "Produtos", icon: Package },
    { path: "/admin/users", label: "Usuários", icon: Users },
    { path: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800/50 backdrop-blur-lg border-r border-verde-neon/20 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-verde-neon/20">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-10 w-auto mx-auto"
            />
            <div className="text-center mt-2">
              <span className="text-verde-neon font-black text-sm">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-300"
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-verde-neon/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white rounded-xl transition-all duration-300 border border-red-500/30"
            >
              <LogOut size={20} />
              <span className="font-semibold">Sair</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-white">Olá, {user?.nome}</span>
              <div className="bg-verde-neon text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                ADMIN
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;