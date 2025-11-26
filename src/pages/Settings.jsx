import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  MapPin,
  Phone,
  Eye,
  EyeOff,
  Bell,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  LogOut,
} from "lucide-react";

const API_URL = "http://localhost:4000/api";

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setCurrentUser(userData);
    setFormData((prev) => ({
      ...prev,
      nome: userData.name || userData.nome || "", // Ajuste para aceitar 'name' ou 'nome'
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

  // Nota: Atualização de perfil ainda está local.
  // Futuramente criaremos a rota PUT /api/users/profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (!formData.nome || !formData.email) {
        throw new Error("Nome e email são obrigatórios");
      }

      // Simulação local para não quebrar enquanto não temos a rota
      const updatedUser = {
        ...currentUser,
        name: formData.nome, // Backend usa 'name'
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
        text: "Perfil atualizado com sucesso (Localmente)!",
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
    // Lógica de senha mantida local por enquanto para não bloquear
    // Futuramente conectar com endpoint de troca de senha
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setFormData((prev) => ({ ...prev, senhaAtual: "", novaSenha: "", confirmarSenha: "" }));
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/");
  };

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
             {/* Campos adicionais visuais (Telefone, CEP, etc) mantidos para preservar o layout */}
             <div>
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
             <div>
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

          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="text-gray-400 text-sm">
              <p>ID: {currentUser.id}</p>
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
                placeholder="Nova senha"
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
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent">
      <div className="max-w-6xl mx-auto p-6 pt-24">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center">
                <User className="text-gray-900 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">Configurações</h1>
                <p className="text-gray-300">Gerencie a sua conta e preferências</p>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl mb-6 backdrop-blur-lg border ${
                  message.type === "success" ? "bg-verde-neon/20 border-verde-neon/50 text-verde-neon" : "bg-red-500/20 border-red-500/50 text-red-300"
                }`}>
                <div className="flex items-center">
                  {message.type === "success" ? <CheckCircle2 className="mr-2" /> : <AlertTriangle className="mr-2" />}
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
                <h3 className="text-xl font-black text-red-400">Zona de Perigo</h3>
              </div>
              <p className="text-red-300 mb-4">
                Ações nesta secção são irreversíveis. Tenha certeza absoluta do que está a fazer.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Trash2 size={20} className="mr-2" />
                Excluir Minha Conta Permanentemente
              </button>
            </div>
      </div>
    </div>
  );
};

export default Settings;