import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useState, useEffect } from "react";
import {
=======
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  House,
  ShoppingCart,
  Ticket,
  Bolt,
>>>>>>> amigo/minha-nova-feature
  User,
  Mail,
  Lock,
  Save,
<<<<<<< HEAD
=======
  Menu,
  X,
>>>>>>> amigo/minha-nova-feature
  MapPin,
  Phone,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle2,
<<<<<<< HEAD
  LogOut,
} from "lucide-react";

const API_URL = "/api";

=======
  Shield,
} from "lucide-react";

>>>>>>> amigo/minha-nova-feature
const Settings = ({ user, setUser, cart }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("perfil");
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
=======
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
>>>>>>> amigo/minha-nova-feature

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setCurrentUser(userData);
    setFormData((prev) => ({
      ...prev,
<<<<<<< HEAD
      nome: userData.name || userData.nome || "", // Ajuste para aceitar 'name' ou 'nome'
=======
      nome: userData.nome || "",
>>>>>>> amigo/minha-nova-feature
      email: userData.email || "",
      telefone: userData.telefone || "",
      endereco: userData.endereco || "",
      cidade: userData.cidade || "",
      estado: userData.estado || "",
      cep: userData.cep || "",
    }));
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (message.text) setMessage({ type: "", text: "" });
  };

<<<<<<< HEAD
  // Nota: Atualização de perfil ainda está local.
  // Futuramente criaremos a rota PUT /api/users/profile
=======
>>>>>>> amigo/minha-nova-feature
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (!formData.nome || !formData.email) {
        throw new Error("Nome e email são obrigatórios");
      }

<<<<<<< HEAD
      // Simulação local para não quebrar enquanto não temos a rota
      const updatedUser = {
        ...currentUser,
        name: formData.nome, // Backend usa 'name'
=======
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const emailExists = users.find(
        (u) => u.email === formData.email && u.id !== currentUser.id
      );
      if (emailExists) {
        throw new Error("Este email já está em uso por outro usuário");
      }

      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            endereco: formData.endereco,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep,
            dataAtualizacao: new Date().toISOString(),
          };
        }
        return u;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      const updatedUser = {
        ...currentUser,
>>>>>>> amigo/minha-nova-feature
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setCurrentUser(updatedUser);

      setMessage({
        type: "success",
<<<<<<< HEAD
        text: "Perfil atualizado com sucesso (Localmente)!",
=======
        text: "Perfil atualizado com sucesso!",
>>>>>>> amigo/minha-nova-feature
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    // Lógica de senha mantida local por enquanto para não bloquear
    // Futuramente conectar com endpoint de troca de senha
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setFormData((prev) => ({ ...prev, senhaAtual: "", novaSenha: "", confirmarSenha: "" }));
    }, 1000);
=======
    setMessage({ type: "", text: "" });

    try {
      if (
        !formData.senhaAtual ||
        !formData.novaSenha ||
        !formData.confirmarSenha
      ) {
        throw new Error("Todos os campos de senha são obrigatórios");
      }

      if (formData.novaSenha.length < 6) {
        throw new Error("A nova senha deve ter pelo menos 6 caracteres");
      }

      if (formData.novaSenha !== formData.confirmarSenha) {
        throw new Error("As novas senhas não coincidem");
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUserData = users.find((u) => u.id === currentUser.id);

      if (!currentUserData) {
        throw new Error("Usuário não encontrado");
      }

      if (currentUserData.senha !== formData.senhaAtual) {
        throw new Error("Senha atual incorreta");
      }

      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            senha: formData.novaSenha,
          };
        }
        return u;
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setFormData((prev) => ({
        ...prev,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      }));

      setMessage({
        type: "success",
        text: "Senha alterada com sucesso!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
>>>>>>> amigo/minha-nova-feature
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
<<<<<<< HEAD
    localStorage.removeItem("accessToken");
=======
>>>>>>> amigo/minha-nova-feature
    setUser(null);
    navigate("/");
  };

<<<<<<< HEAD
  // --- INTEGRAÇÃO REAL COM O BACKEND ---
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Tem a certeza que deseja excluir a sua conta? Todos os seus dados serão permanentemente removidos."
      )
    ) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_URL}/auth/delete`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          alert("Conta excluída com sucesso.");
          handleLogout();
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao excluir conta.");
        }
      } catch (error) {
        console.error("Erro de rede:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

=======
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Todos os seus dados serão permanentemente removidos."
      )
    ) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.filter((u) => u.id !== currentUser.id);

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  };

  const totalItemsNoCarrinho = cart.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

>>>>>>> amigo/minha-nova-feature
  if (!currentUser) {
    return null;
  }

  const renderPerfilTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
        <h2 className="text-xl font-black text-white mb-6 flex items-center">
          <User className="mr-3 text-verde-neon" size={24} />
          Informações Pessoais
        </h2>

        <form onSubmit={handleUpdateProfile}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="seu@email.com"
              />
            </div>
<<<<<<< HEAD
             {/* Campos adicionais visuais (Telefone, CEP, etc) mantidos para preservar o layout */}
             <div>
=======

            <div>
>>>>>>> amigo/minha-nova-feature
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                <Phone className="inline w-4 h-4 mr-2" />
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="(11) 99999-9999"
              />
            </div>
<<<<<<< HEAD
             <div>
=======

            <div>
>>>>>>> amigo/minha-nova-feature
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                <MapPin className="inline w-4 h-4 mr-2" />
                CEP
              </label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="00000-000"
              />
            </div>
          </div>

<<<<<<< HEAD
          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="text-gray-400 text-sm">
              <p>ID: {currentUser.id}</p>
=======
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3 text-verde-neon">
              <MapPin className="inline w-4 h-4 mr-2" />
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Rua, número, complemento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Cidade
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Sua cidade"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Estado
              </label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Seu estado"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="text-gray-400 text-sm">
              <p>ID: {currentUser.id}</p>
              {currentUser.dataCadastro && (
                <p>
                  Membro desde:{" "}
                  {new Date(currentUser.dataCadastro).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              )}
>>>>>>> amigo/minha-nova-feature
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-8 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 disabled:opacity-50 flex items-center"
            >
              <Save size={20} className="mr-2" />
              {loading ? "Salvando..." : "Atualizar Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSegurancaTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
        <h2 className="text-xl font-black text-white mb-6 flex items-center">
          <Lock className="mr-3 text-verde-neon" size={24} />
          Alterar Senha
        </h2>

        <form onSubmit={handleChangePassword}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senhaAtual"
                  value={formData.senhaAtual}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 pr-12"
                  placeholder="Sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-verde-neon transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
<<<<<<< HEAD
=======

>>>>>>> amigo/minha-nova-feature
            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Nova Senha
              </label>
              <input
                type="password"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
<<<<<<< HEAD
                placeholder="Nova senha"
=======
                placeholder="Nova senha (mín. 6 caracteres)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-verde-neon">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Confirme a nova senha"
>>>>>>> amigo/minha-nova-feature
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 px-8 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 disabled:opacity-50 flex items-center"
            >
              <Lock size={20} className="mr-2" />
              {loading ? "Alterando..." : "Alterar Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPreferenciasTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
        <h2 className="text-xl font-black text-white mb-6 flex items-center">
          <Bell className="mr-3 text-verde-neon" size={24} />
          Notificações
        </h2>
        <div className="space-y-4">
<<<<<<< HEAD
           <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
              <div>
                <p className="font-bold text-white">Promoções</p>
                <p className="text-gray-400 text-sm">Receber ofertas por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verde-neon"></div>
              </label>
           </div>
=======
          {[
            {
              label: "Promoções e ofertas",
              description: "Receba novidades e descontos exclusivos",
            },
            {
              label: "Atualizações de pedidos",
              description: "Acompanhamento dos seus pedidos",
            },
            {
              label: "Eventos e festas",
              description: "Novos eventos na sua área",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl"
            >
              <div>
                <p className="font-bold text-white">{item.label}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-verde-neon"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
        <h2 className="text-xl font-black text-white mb-6 flex items-center">
          <Globe className="mr-3 text-verde-neon" size={24} />
          Preferências
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-3 text-verde-neon">
              Idioma
            </label>
            <select className="w-full p-4 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white transition-all duration-300">
              <option value="pt">Português (Brasil)</option>
              <option value="en">English</option>
            </select>
          </div>
>>>>>>> amigo/minha-nova-feature
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent">
<<<<<<< HEAD
      <div className="max-w-6xl mx-auto p-6 pt-24">
=======
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-4 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="hidden lg:flex items-center">
            <span className="text-verde-neon font-semibold text-lg">
              Olá, {currentUser.nome}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
              >
                SAIR
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                className="p-2 bg-verde-neon/20 rounded-lg hover:bg-verde-neon/30 transition-all duration-300"
              >
                {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="sm:hidden bg-gray-800/95 backdrop-blur-lg border-t border-verde-neon/20 mt-4 py-4 rounded-b-2xl">
            <div className="flex flex-col space-y-4 px-4">
              <span className="text-verde-neon text-center font-semibold">
                Olá, {currentUser.nome}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-full transition-all duration-300"
              >
                SAIR
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col sm:flex-row pt-20">
        <aside className="hidden sm:flex ml-4 w-16 bg-gray-800/50 backdrop-blur-lg flex-col items-center py-6 fixed top-32 h-80 bottom-8 rounded-2xl z-40 border border-verde-neon/20">
          <Link
            to="/home"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <House className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/events"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Ticket className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/cart"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 relative group border border-gray-600"
          >
            <ShoppingCart className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-verde-rua text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link
            to="/settings"
            className="p-3 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl mt-auto transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <Bolt className="text-gray-900 w-6 h-6" />
          </Link>
        </aside>

        <main className="flex-1 sm:ml-20 pb-20 sm:pb-0 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
>>>>>>> amigo/minha-nova-feature
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center">
                <User className="text-gray-900 w-8 h-8" />
              </div>
              <div>
<<<<<<< HEAD
                <h1 className="text-3xl font-black text-white">Configurações</h1>
                <p className="text-gray-300">Gerencie a sua conta e preferências</p>
=======
                <h1 className="text-3xl font-black text-white">
                  Configurações
                </h1>
                <p className="text-gray-300">
                  Gerencie sua conta e preferências
                </p>
>>>>>>> amigo/minha-nova-feature
              </div>
            </div>

            {message.text && (
<<<<<<< HEAD
              <div className={`p-4 rounded-2xl mb-6 backdrop-blur-lg border ${
                  message.type === "success" ? "bg-verde-neon/20 border-verde-neon/50 text-verde-neon" : "bg-red-500/20 border-red-500/50 text-red-300"
                }`}>
                <div className="flex items-center">
                  {message.type === "success" ? <CheckCircle2 className="mr-2" /> : <AlertTriangle className="mr-2" />}
=======
              <div
                className={`p-4 rounded-2xl mb-6 backdrop-blur-lg border ${
                  message.type === "success"
                    ? "bg-verde-neon/20 border-verde-neon/50 text-verde-neon"
                    : "bg-red-500/20 border-red-500/50 text-red-300"
                }`}
              >
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <CheckCircle2 className="mr-2" />
                  ) : (
                    <AlertTriangle className="mr-2" />
                  )}
>>>>>>> amigo/minha-nova-feature
                  {message.text}
                </div>
              </div>
            )}

            <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-2 mb-8 border border-verde-neon/20">
              {[
                { id: "perfil", label: "Perfil", icon: User },
                { id: "seguranca", label: "Segurança", icon: Lock },
                { id: "preferencias", label: "Preferências", icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex-1 text-center ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 shadow-lg shadow-verde-neon/25"
                      : "text-gray-300 hover:text-verde-neon hover:bg-gray-700/50"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === "perfil" && renderPerfilTab()}
            {activeTab === "seguranca" && renderSegurancaTab()}
            {activeTab === "preferencias" && renderPreferenciasTab()}

            <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-3xl p-6 mt-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-red-400 mr-3" size={24} />
<<<<<<< HEAD
                <h3 className="text-xl font-black text-red-400">Zona de Perigo</h3>
              </div>
              <p className="text-red-300 mb-4">
                Ações nesta secção são irreversíveis. Tenha certeza absoluta do que está a fazer.
=======
                <h3 className="text-xl font-black text-red-400">
                  Zona de Perigo
                </h3>
              </div>
              <p className="text-red-300 mb-4">
                Ações nesta seção são irreversíveis. Tenha certeza absoluta do
                que está fazendo.
>>>>>>> amigo/minha-nova-feature
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Trash2 size={20} className="mr-2" />
                Excluir Minha Conta Permanentemente
              </button>
            </div>
<<<<<<< HEAD
=======
          </div>
        </main>
>>>>>>> amigo/minha-nova-feature
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Settings;
=======
export default Settings;
>>>>>>> amigo/minha-nova-feature
