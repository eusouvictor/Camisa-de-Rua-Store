import React, { useState } from "react";
import { X, Mail, Lock, User, Key } from "lucide-react";

const ModalAuth = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    codigoRecuperacao: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [codigoEnviado, setCodigoEnviado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isForgotPassword) {
        if (!codigoEnviado) {
          await handleSolicitarRecuperacao();
        } else {
          await handleRedefinirSenha();
        }
      } else if (isLogin) {
        await handleLogin();
      } else {
        await handleCadastro();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const { email, senha } = formData;

    if (!email || !senha) {
      throw new Error("Preencha todos os campos");
    }

    if (email === "teste@teste.com" && senha === "123456") {
      const user = { id: "1", nome: "Usuário Teste", email: "teste@teste.com" };
      localStorage.setItem("user", JSON.stringify(user));
      onLoginSuccess(user);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.senha === senha);

    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        nome: user.nome,
        email: user.email,
      })
    );

    onLoginSuccess(user);
  };

  const handleCadastro = async () => {
    const { nome, email, senha, confirmarSenha } = formData;

    if (!nome || !email || !senha || !confirmarSenha) {
      throw new Error("Preencha todos os campos");
    }

    if (senha.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    if (senha !== confirmarSenha) {
      throw new Error("As senhas não coincidem");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((u) => u.email === email);

    if (userExists) {
      throw new Error("Este email já está cadastrado");
    }

    const newUser = {
      id: Date.now().toString(),
      nome,
      email,
      senha,
      dataCadastro: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      })
    );

    onLoginSuccess(newUser);
  };

  const handleSolicitarRecuperacao = async () => {
    const { email } = formData;

    if (!email) {
      throw new Error("Digite seu email para recuperar a senha");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      throw new Error("Email não encontrado");
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const recuperacoes = JSON.parse(
      localStorage.getItem("recuperacoes") || "{}"
    );
    recuperacoes[email] = {
      codigo,
      expiracao: Date.now() + 15 * 60 * 1000,
    };
    localStorage.setItem("recuperacoes", JSON.stringify(recuperacoes));

    setCodigoEnviado(true);
    setSuccessMessage(
      `Código de recuperação enviado para ${email} (Código: ${codigo})`
    );
  };

  const handleRedefinirSenha = async () => {
    const { email, codigoRecuperacao, novaSenha, confirmarNovaSenha } =
      formData;

    if (!codigoRecuperacao || !novaSenha || !confirmarNovaSenha) {
      throw new Error("Preencha todos os campos");
    }

    if (novaSenha.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres");
    }

    if (novaSenha !== confirmarNovaSenha) {
      throw new Error("As senhas não coincidem");
    }

    const recuperacoes = JSON.parse(
      localStorage.getItem("recuperacoes") || "{}"
    );
    const recuperacao = recuperacoes[email];

    if (!recuperacao) {
      throw new Error("Solicitação de recuperação não encontrada");
    }

    if (Date.now() > recuperacao.expiracao) {
      throw new Error("Código expirado. Solicite um novo código.");
    }

    if (recuperacao.codigo !== codigoRecuperacao) {
      throw new Error("Código de recuperação inválido");
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    users[userIndex].senha = novaSenha;
    localStorage.setItem("users", JSON.stringify(users));

    delete recuperacoes[email];
    localStorage.setItem("recuperacoes", JSON.stringify(recuperacoes));

    setSuccessMessage(
      "Senha redefinida com sucesso! Faça login com sua nova senha."
    );

    setTimeout(() => {
      setIsForgotPassword(false);
      setCodigoEnviado(false);
      setFormData({
        ...formData,
        codigoRecuperacao: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const switchToCadastro = () => {
    setIsLogin(false);
    setIsForgotPassword(false);
    setCodigoEnviado(false);
    setFormData({
      nome: "",
      email: formData.email,
      senha: "",
      confirmarSenha: "",
      codigoRecuperacao: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setError("");
    setSuccessMessage("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsForgotPassword(false);
    setCodigoEnviado(false);
    setFormData({
      nome: "",
      email: formData.email,
      senha: "",
      confirmarSenha: "",
      codigoRecuperacao: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setError("");
    setSuccessMessage("");
  };

  const switchToForgotPassword = () => {
    setIsForgotPassword(true);
    setCodigoEnviado(false);
    setFormData({
      ...formData,
      senha: "",
      confirmarSenha: "",
      codigoRecuperacao: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setError("");
    setSuccessMessage("");
  };

  const voltarParaLogin = () => {
    setIsForgotPassword(false);
    setCodigoEnviado(false);
    setFormData({
      ...formData,
      codigoRecuperacao: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
    setError("");
    setSuccessMessage("");
  };

  const renderForgotPasswordForm = () => (
    <>
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl flex items-center justify-center mx-auto mb-3">
          <Key className="text-gray-900 w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-white mb-1">Recuperar Senha</h3>
        <p className="text-gray-300 text-sm">
          {!codigoEnviado
            ? "Digite seu email para receber um código de recuperação"
            : "Digite o código recebido e sua nova senha"}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading || codigoEnviado}
              className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        {codigoEnviado && (
          <>
            <div>
              <label className="block text-sm font-bold mb-2 text-verde-neon">
                Código de Recuperação
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="codigoRecuperacao"
                  value={formData.codigoRecuperacao}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
                  placeholder="Código de 6 dígitos"
                  maxLength="6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-verde-neon">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
                  placeholder="Nova senha"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-verde-neon">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="confirmarNovaSenha"
                  value={formData.confirmarNovaSenha}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
                  placeholder="Confirmar nova senha"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderAuthForm = () => (
    <>
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-verde-neon to-verde-rua rounded-xl flex items-center justify-center mx-auto mb-3">
          {isLogin ? (
            <User className="text-gray-900 w-6 h-6" />
          ) : (
            <Mail className="text-gray-900 w-6 h-6" />
          )}
        </div>
        <h3 className="text-xl font-black text-white mb-1">
          {isLogin ? "Fazer Login" : "Criar Conta"}
        </h3>
        <p className="text-gray-300 text-sm">
          {isLogin ? "Entre na sua conta" : "Junte-se à nossa comunidade"}
        </p>
      </div>

      <div className="space-y-3">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold mb-2 text-verde-neon">
              Nome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
                placeholder="Seu nome completo"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
              placeholder="Sua senha"
            />
          </div>
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-bold mb-2 text-verde-neon">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
                className="w-full p-3 text-sm bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 pl-10 transition-all duration-300"
                placeholder="Confirmar senha"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-sm border border-verde-neon/20 shadow-2xl shadow-verde-neon/10 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-verde-rua to-verde-escuro text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-black">
            {isForgotPassword
              ? "Recuperar Senha"
              : isLogin
              ? "Fazer Login"
              : "Criar Conta"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-verde-neon transition-all duration-300 transform hover:scale-110"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-3 py-2 rounded-xl mb-3 backdrop-blur-lg text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-verde-neon/20 border border-verde-neon/50 text-verde-neon px-3 py-2 rounded-xl mb-3 backdrop-blur-lg text-sm">
              {successMessage}
            </div>
          )}

          {isForgotPassword ? renderForgotPasswordForm() : renderAuthForm()}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 disabled:opacity-50 disabled:hover:scale-100 mt-4 text-sm"
          >
            {loading
              ? "Carregando..."
              : isForgotPassword
              ? codigoEnviado
                ? "Redefinir Senha"
                : "Enviar Código"
              : isLogin
              ? "Entrar"
              : "Criar Conta"}
          </button>

          <div className="text-center pt-4 border-t border-gray-700/50 space-y-2">
            {isLogin && !isForgotPassword && (
              <div>
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="text-verde-neon font-bold hover:text-verde-rua text-xs transition-all duration-300"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {isForgotPassword ? (
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">
                  Lembrou sua senha?{" "}
                  <button
                    type="button"
                    onClick={voltarParaLogin}
                    className="text-verde-neon font-bold hover:text-verde-rua transition-all duration-300"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            ) : isLogin ? (
              <p className="text-gray-400 text-xs">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToCadastro}
                  className="text-verde-neon font-bold hover:text-verde-rua transition-all duration-300"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p className="text-gray-400 text-xs">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-verde-neon font-bold hover:text-verde-rua transition-all duration-300"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAuth;