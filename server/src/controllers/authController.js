// Controlador simples de autenticação (apenas para desenvolvimento)

const users = [
  { id: 1, email: "teste@teste.com", password: "123456", name: "Usuário Teste" },
];

export function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email e password são obrigatórios" });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ error: "Usuário já existe" });
  const newUser = { id: users.length + 1, email, password, name: name || "Sem nome" };
  users.push(newUser);
  // Nunca retorne senhas em produção
  const { password: _p, ...safe } = newUser;
  return res.status(201).json({ user: safe });
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });
  const { password: _p, ...safe } = user;
  // Em produção, retorne um JWT. Aqui retornamos o usuário para integração front-end simples.
  return res.json({ user: safe });
}

export function listUsers(req, res) {
  const safeList = users.map(({ password, ...rest }) => rest);
  res.json({ users: safeList });
}
