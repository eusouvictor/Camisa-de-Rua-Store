import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  House,
  ShoppingCart,
  Ticket,
  Bolt,
  User,
  Mail,
  Lock,
  Save,
  LogOut,
} from "lucide-react";

const Settings = ({ user, setUser, cart }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("dados");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setCurrentUser(userData);
    setFormData((prev) => ({
      ...prev,
      nome: userData.nome || "",
      email: userData.email || "",
    }));
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Validar dados
      if (!formData.nome || !formData.email) {
        throw new Error("Nome e email são obrigatórios");
      }

      // Buscar usuários do localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Verificar se o email já existe (para outro usuário)
      const emailExists = users.find(
        (u) => u.email === formData.email && u.id !== currentUser.id
      );
      if (emailExists) {
        throw new Error("Este email já está em uso por outro usuário");
      }

      // Atualizar usuário no array de users
      const updatedUsers = users.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            nome: formData.nome,
            email: formData.email,
          };
        }
        return u;
      });

      // Atualizar localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Atualizar user no localStorage e estado
      const updatedUser = {
        ...currentUser,
        nome: formData.nome,
        email: formData.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setCurrentUser(updatedUser);

      setMessage({
        type: "success",
        text: "Dados atualizados com sucesso!",
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
    setMessage({ type: "", text: "" });

    try {
      // Validar senhas
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

      // Buscar usuário completo do localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const currentUserData = users.find((u) => u.id === currentUser.id);

      if (!currentUserData) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar senha atual
      if (currentUserData.senha !== formData.senhaAtual) {
        throw new Error("Senha atual incorreta");
      }

      // Atualizar senha
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

      // Limpar campos de senha
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
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
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

  // Contador de itens no carrinho
  const totalItemsNoCarrinho = cart.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white font-advent">
      {/* HEADER */}
      <header className="bg-verde-rua text-white py-4 px-4 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/Vector.png"
              alt="Camisa de Rua Logo"
              className="h-12 w-19 object-cover ml-40"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-verde-neon">Olá, {currentUser.nome}</span>
              <button
                onClick={handleLogout}
                className="border-2 border-verde-neon text-verde-neon font-bold py-2 px-6 rounded-full hover:bg-verde-neon hover:text-verde-rua transition-colors"
              >
                SAIR
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-white flex">
        {/* MENU LATERAL */}
        <aside className="ml-2 w-12 bg-azul-gelo flex flex-col items-center py-3 fixed top-32 h-80 bottom-8 rounded-xl z-40 mt-4">
          <Link to="/home" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <House />
            </div>
          </Link>
          <Link to="/events" className="p-3">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <Ticket />
            </div>
          </Link>
          <Link to="/cart" className="p-3 relative">
            <div className="w-6 h-6 bg-azul-gelo rounded">
              <ShoppingCart />
            </div>
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-1 -right-1 bg-verde-neon text-verde-rua text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link to="/settings" className="p-3 bg-verde-neon rounded mt-32">
            <div className="w-6 h-6 rounded">
              <Bolt className="text-verde-rua" />
            </div>
          </Link>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 ml-16 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Configurações</h1>
            <p className="text-gray-600 mb-8">
              Gerencie suas informações pessoais e preferências
            </p>

            {/* TABS */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => setActiveTab("dados")}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "dados"
                    ? "border-verde-rua text-verde-rua"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <User size={18} className="inline mr-2" />
                Dados Pessoais
              </button>
              <button
                onClick={() => setActiveTab("senha")}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === "senha"
                    ? "border-verde-rua text-verde-rua"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Lock size={18} className="inline mr-2" />
                Alterar Senha
              </button>
            </div>

            {/* MENSAGENS */}
            {message.text && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  message.type === "success"
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* FORMULÁRIO - DADOS PESSOAIS */}
            {activeTab === "dados" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <User className="mr-2" size={20} />
                  Informações Pessoais
                </h2>

                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-rua focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-rua focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        ID da conta: {currentUser.id}
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-verde-rua text-white font-bold py-3 px-6 rounded-lg hover:bg-verde-escuro transition-colors disabled:opacity-50 flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FORMULÁRIO - ALTERAR SENHA */}
            {activeTab === "senha" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Lock className="mr-2" size={20} />
                  Alterar Senha
                </h2>

                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        name="senhaAtual"
                        value={formData.senhaAtual}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-rua focus:border-transparent"
                        placeholder="Sua senha atual"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        name="novaSenha"
                        value={formData.novaSenha}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-rua focus:border-transparent"
                        placeholder="Nova senha (mín. 6 caracteres)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde-rua focus:border-transparent"
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-verde-rua text-white font-bold py-3 px-6 rounded-lg hover:bg-verde-escuro transition-colors disabled:opacity-50 flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      {loading ? "Alterando..." : "Alterar Senha"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SEÇÃO PERIGOSA */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Zona de Perigo
              </h3>
              <p className="text-red-700 mb-4">
                Ações nesta seção são irreversíveis. Tenha certeza do que está
                fazendo.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Excluir Minha Conta
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
