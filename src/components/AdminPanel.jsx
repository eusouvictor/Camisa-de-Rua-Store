import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Settings, Users, Package, BarChart3, LogOut, Menu, X, ShoppingCart, DollarSign, TrendingUp, Plus
} from "lucide-react";

// URL da API (Local ou Produção)
const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const AdminPanel = ({ user, setUser }) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(location.state?.section || "dashboard");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Proteção de rota: Se não for admin, manda embora
    if (user && user.role !== "admin") {
       alert("Acesso negado. Área restrita para administradores.");
       navigate("/home");
       return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      // 1. Buscar Produtos do Banco
      const resProd = await fetch(`${API_URL}/produtos`);
      const dataProd = await resProd.json();
      if (resProd.ok) setProducts(dataProd.produtos || []);

      // 2. Buscar Usuários (precisa de token)
      const token = localStorage.getItem("accessToken");
      if (token) {
        const resUser = await fetch(`${API_URL}/auth`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        const dataUser = await resUser.json();
        if (resUser.ok) setUsers(dataUser.users || []);
      }
      
      // 3. Pedidos (Do localStorage por enquanto, até a Missão 2)
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

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
        loadData(); // Atualiza a lista
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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Produtos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
  ];

  // --- Renderizações ---
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-blue-600 rounded-2xl p-6 text-white">
        <p className="text-blue-100">Total Produtos</p>
        <p className="text-3xl font-bold">{products.length}</p>
      </div>
      <div className="bg-green-600 rounded-2xl p-6 text-white">
        <p className="text-green-100">Usuários</p>
        <p className="text-3xl font-bold">{users.length}</p>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Gerenciar Produtos</h3>
        <button className="bg-verde-neon text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-verde-rua transition-all flex items-center gap-2">
          <Plus size={18}/> Novo Produto
        </button>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600">
            <div className="flex items-center gap-4">
                {product.imageUrl && <img src={product.imageUrl} alt={product.nome} className="w-12 h-12 rounded object-cover" />}
                <div>
                  <h4 className="font-bold text-white">{product.nome}</h4>
                  <p className="text-verde-neon text-sm">R$ {Number(product.preco).toFixed(2)}</p>
                </div>
            </div>
            <button 
              onClick={() => handleDeleteProduct(product.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-gray-800/50 rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Usuários</h3>
      {users.map(u => (
        <div key={u.id} className="p-4 border-b border-gray-700 text-gray-300">
          {u.email} <span className="text-xs bg-gray-600 px-2 py-1 rounded ml-2">{u.role || "CUSTOMER"}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex text-white">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
          <div className="mb-8 text-center font-bold text-verde-neon">ADMIN PAINEL</div>
          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeSection === item.id ? "bg-verde-neon text-gray-900" : "hover:bg-gray-700"}`}>
                <item.icon size={20} /> {item.label}
              </button>
            ))}
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-auto px-4 py-3"><LogOut size={20}/> Sair</button>
        </aside>
      )}
      <main className="flex-1 p-6 overflow-auto">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-6"><Menu /></button>
        {activeSection === "dashboard" && renderDashboard()}
        {activeSection === "products" && renderProducts()}
        {activeSection === "users" && renderUsers()}
        {activeSection === "orders" && <div>Em breve: Pedidos</div>}
      </main>
    </div>
  );
};

export default AdminPanel;