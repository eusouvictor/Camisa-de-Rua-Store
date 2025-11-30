import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Settings, Users, Package, BarChart3, LogOut, Menu, X, ShoppingCart, DollarSign, TrendingUp,
  Plus, Search, Filter, Edit, Trash2, Eye, Download, Save, XCircle
} from "lucide-react";

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const AdminPanel = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Estado para controlar o formulário de adicionar/editar
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState({ id: null, nome: "", preco: "", categoria: "camisas", imageUrl: "" });

  const [activeSection, setActiveSection] = useState("products");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get("section") || "products";
    setActiveSection(section);

    if (!user || user.role !== "admin") {
      navigate("/home");
      return;
    }
    loadData();
  }, [user, navigate, location]);

  const loadData = async () => {
    try {
      const resProd = await fetch(`${API_URL}/produtos`);
      const dataProd = await resProd.json();
      if (resProd.ok) setProducts(dataProd.produtos || []);

      const token = localStorage.getItem("accessToken");
      if (token) {
        const resUser = await fetch(`${API_URL}/auth/`, { headers: { Authorization: `Bearer ${token}` } });
        const dataUser = await resUser.json();
        if (resUser.ok) setUsers(dataUser.users || []);
      }
      
// C) Carregar Pedidos do Banco
if (token) {
  const resOrders = await fetch(`${API_URL}/pedidos`, {
      headers: { Authorization: `Bearer ${token}` }
  });
  const dataOrders = await resOrders.json();
  if (resOrders.ok) {
    // Formata os dados para o Admin Panel entender
    const formattedOrders = dataOrders.orders.map(o => ({
      id: o.id,
      orderNumber: `#${o.id}`,
      customer: o.user?.name || "Desconhecido",
      email: o.user?.email,
      total: o.total,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString(),
      items: o.items.length
    }));
    setOrders(formattedOrders);
  }
}
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // --- FUNÇÕES DO PRODUTO (CRUD) ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const method = productForm.id ? "PUT" : "POST";
    const url = productForm.id ? `${API_URL}/produtos/${productForm.id}` : `${API_URL}/produtos`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        alert(productForm.id ? "Produto atualizado!" : "Produto criado!");
        setIsEditing(false);
        setProductForm({ id: null, nome: "", preco: "", categoria: "camisas", imageUrl: "" }); // Limpa form
        loadData(); // Recarrega lista
      } else {
        const data = await response.json();
        alert(`Erro: ${data.error || "Falha ao salvar"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    }
  };

  const handleEditClick = (product) => {
    setProductForm(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela para ver o form
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        loadData();
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

  // --- RENDERIZAÇÃO DO FORMULÁRIO ---
  const renderProductForm = () => (
    <div className="bg-gray-800 p-6 rounded-2xl border border-verde-neon/50 mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">{productForm.id ? "Editar Produto" : "Novo Produto"}</h3>
        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><XCircle /></button>
      </div>
      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">Nome</label>
          <input 
            required
            type="text" 
            className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-verde-neon outline-none"
            value={productForm.nome}
            onChange={e => setProductForm({...productForm, nome: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Preço (R$)</label>
          <input 
            required
            type="number" step="0.01"
            className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-verde-neon outline-none"
            value={productForm.preco}
            onChange={e => setProductForm({...productForm, preco: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">Categoria</label>
          <select 
            className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-verde-neon outline-none"
            value={productForm.categoria}
            onChange={e => setProductForm({...productForm, categoria: e.target.value})}
          >
            <option value="camisas">Camisas</option>
            <option value="camisetas">Camisetas</option>
            <option value="acessorios">Acessórios</option>
            <option value="jaquetas">Jaquetas</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-1">URL da Imagem</label>
          <input 
            type="text" 
            placeholder="https://exemplo.com/foto.jpg"
            className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600 focus:border-verde-neon outline-none"
            value={productForm.imageUrl || ""}
            onChange={e => setProductForm({...productForm, imageUrl: e.target.value})}
          />
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
          <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
          <button type="submit" className="bg-verde-neon text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-verde-rua transition-colors flex items-center gap-2">
            <Save size={18}/> Salvar
          </button>
        </div>
      </form>
    </div>
  );

  // --- RENDERIZADORES DE LISTAS ---

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Botão de Adicionar abre o formulário */}
      {!isEditing && (
        <div className="flex justify-end">
          <button 
            onClick={() => {
              setProductForm({ id: null, nome: "", preco: "", categoria: "camisas", imageUrl: "" });
              setIsEditing(true);
            }}
            className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} /> Adicionar Produto
          </button>
        </div>
      )}

      {/* Se estiver editando, mostra o formulário */}
      {isEditing && renderProductForm()}

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="space-y-4">
          {products.length === 0 ? <p className="text-gray-400 text-center py-4">Nenhum produto cadastrado.</p> : 
           products.map((product) => (
            <div key={product.id} className="bg-gray-700/50 rounded-xl p-4 flex justify-between items-center border border-gray-600 hover:border-verde-neon/50 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    {product.imageUrl ? 
                      <img src={product.imageUrl} alt={product.nome} className="w-full h-full object-cover" /> : 
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Foto</div>
                    }
                 </div>
                 <div>
                   <h4 className="text-white font-bold">{product.nome}</h4>
                   <p className="text-verde-neon font-bold">R$ {Number(product.preco).toFixed(2)}</p>
                   <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">{product.categoria}</span>
                 </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEditClick(product)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"><Edit size={18} /></button>
                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // (Mantive os outros renders iguais, só simplifiquei o retorno principal)
  const menuItems = [
    { id: "products", label: "Produtos", icon: Package },
    { id: "users", label: "Usuários", icon: Users },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
  ];

  // --- RENDERIZAÇÃO DE USUÁRIOS ---
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-verde-neon w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Usuários Cadastrados</h2>
          <span className="ml-auto bg-verde-neon/20 text-verde-neon px-3 py-1 rounded-full text-sm font-bold">{users.length}</span>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum usuário cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-verde-neon/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-verde-neon/20 rounded-full flex items-center justify-center">
                      <Users className="text-verde-neon w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{u.name || "Sem nome"}</h4>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    u.role === "admin" 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                </div>
                {u.createdAt && (
                  <p className="text-gray-500 text-xs mt-2">
                    Cadastrado em: {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO DE PEDIDOS ---
  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-verde-neon/20">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className="text-verde-neon w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Pedidos</h2>
          <span className="ml-auto bg-verde-neon/20 text-verde-neon px-3 py-1 rounded-full text-sm font-bold">{orders.length}</span>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto text-gray-500 w-12 h-12 mb-3" />
            <p className="text-gray-400">Nenhum pedido registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-verde-neon/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold text-lg">{order.orderNumber}</h4>
                    <p className="text-gray-400 text-sm">{order.customer}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : order.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-semibold text-xs truncate">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Itens</p>
                    <p className="text-verde-neon font-bold">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total</p>
                    <p className="text-verde-neon font-bold">R$ {Number(order.total).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Data</p>
                    <p className="text-white font-semibold">{order.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex text-white font-sans">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700 fixed h-full z-20">
           <div className="mb-8 flex items-center gap-2 px-2">
             <img src="/images/cdrlogo.svg" className="h-8 w-auto" alt="Logo"/>
             <span className="font-bold text-verde-neon">ADMIN</span>
           </div>
           <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === item.id ? "bg-verde-neon text-gray-900 font-bold" : "text-gray-300 hover:bg-gray-700"}`}>
                    <item.icon size={20} /> {item.label}
                </button>
            ))}
           </nav>
           <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 mt-auto p-4 hover:bg-red-500/10 rounded-xl">
             <LogOut size={20}/> Sair
           </button>
        </aside>
      )}
      <main className={`flex-1 p-6 overflow-auto transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mb-6 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"><Menu size={24} /></button>
         
         {activeSection === "products" && renderProducts()}
         {activeSection === "users" && renderUsers()}
         {activeSection === "orders" && renderOrders()}
      </main>
    </div>
  );
};

export default AdminPanel;