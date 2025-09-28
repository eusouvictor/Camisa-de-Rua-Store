import React, { useState } from "react";

const ModalAuth = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const switchToCadastro = () => {
    setIsLogin(false);
    setFormData({ ...formData, confirmarSenha: "" });
    setError("");
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setFormData({ ...formData, confirmarSenha: "" });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-green-900 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Fazer Login" : "Criar Conta"}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-green-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>

          <div className="text-center pt-4 border-t border-gray-300">
            {isLogin ? (
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
