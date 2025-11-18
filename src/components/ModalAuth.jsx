import React, { useState } from "react";

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

    // Usuário de teste
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

    // Simular envio de email (em produção, você faria uma chamada API)
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Salvar código temporariamente no localStorage (em produção, use um backend)
    const recuperacoes = JSON.parse(
      localStorage.getItem("recuperacoes") || "{}"
    );
    recuperacoes[email] = {
      codigo,
      expiracao: Date.now() + 15 * 60 * 1000, // 15 minutos
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

    // Verificar código de recuperação
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

    // Atualizar senha do usuário
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      throw new Error("Usuário não encontrado");
    }

    users[userIndex].senha = novaSenha;
    localStorage.setItem("users", JSON.stringify(users));

    // Limpar código de recuperação
    delete recuperacoes[email];
    localStorage.setItem("recuperacoes", JSON.stringify(recuperacoes));

    setSuccessMessage(
      "Senha redefinida com sucesso! Faça login com sua nova senha."
    );

    // Voltar para o login após 2 segundos
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
        <h3 className="text-lg font-bold text-green-900">Recuperar Senha</h3>
        <p className="text-gray-600 text-sm mt-2">
          {!codigoEnviado
            ? "Digite seu email para receber um código de recuperação"
            : "Digite o código recebido e sua nova senha"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-green-900">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading || codigoEnviado}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="seu@email.com"
        />
      </div>

      {codigoEnviado && (
        <>
          <div>
            <label className="block text-sm font-bold mb-2 text-green-900">
              Código de Recuperação
            </label>
            <input
              type="text"
              name="codigoRecuperacao"
              value={formData.codigoRecuperacao}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Digite o código de 6 dígitos"
              maxLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-green-900">
              Nova Senha
            </label>
            <input
              type="password"
              name="novaSenha"
              value={formData.novaSenha}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Sua nova senha"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-green-900">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              name="confirmarNovaSenha"
              value={formData.confirmarNovaSenha}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Confirme sua nova senha"
            />
          </div>
        </>
      )}
    </>
  );

  const renderAuthForm = () => (
    <>
      {!isLogin && (
        <div>
          <label className="block text-sm font-bold mb-2 text-green-900">
            Nome
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required={!isLogin}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Seu nome completo"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-bold mb-2 text-green-900">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-2 text-green-900">
          Senha
        </label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Sua senha"
        />
      </div>

      {!isLogin && (
        <div>
          <label className="block text-sm font-bold mb-2 text-green-900">
            Confirmar Senha
          </label>
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required={!isLogin}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Confirme sua senha"
          />
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-green-900 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isForgotPassword
              ? "Recuperar Senha"
              : isLogin
              ? "Fazer Login"
              : "Criar Conta"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {isForgotPassword ? renderForgotPasswordForm() : renderAuthForm()}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-green-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
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

          <div className="text-center pt-4 border-t border-gray-300 space-y-2">
            {isLogin && !isForgotPassword && (
              <div>
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="text-green-900 font-bold hover:text-green-700 text-sm"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {isForgotPassword ? (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Lembrou sua senha?{" "}
                  <button
                    type="button"
                    onClick={voltarParaLogin}
                    className="text-green-900 font-bold hover:text-green-700"
                  >
                    Fazer login
                  </button>
                </p>
              </div>
            ) : isLogin ? (
              <p className="text-gray-600">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToCadastro}
                  className="text-green-900 font-bold hover:text-green-700"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-green-900 font-bold hover:text-green-700"
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
