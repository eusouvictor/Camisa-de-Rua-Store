import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../libs/prisma.js";
import * as tokenStore from "../libs/tokenStore.js";

// Verifica se o prisma está disponível.
// Se o prisma não conectou, usamos o tokenStore em arquivo.
const usePrisma = !!prisma;

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "Usuário já existe" });

    const hashed = bcrypt.hashSync(password, 8);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || "Sem nome",
      },
    });

    // --- AUDITORIA: Regista que o utilizador foi criado ---
    // Mantivemos este bloco porque é a sua funcionalidade nova!
    await prisma.userAudit.create({
      data: {
        action: "USER_CREATED",
        details: `Registo inicial via app. Nome: ${name || "Sem nome"}`,
        userId: newUser.id, // Ligamos este evento ao ID do utilizador acabado de criar
      },
    });

    const { password: _p, ...safe } = newUser;
    return res.status(201).json({ user: safe });

  } catch (err) {
    console.error("Erro no register:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    // --- AUDITORIA: Login ---
    try {
      if (usePrisma) {
        await prisma.userAudit.create({
          data: {
            action: "USER_LOGIN",
            details: "Login realizado com sucesso",
            userId: user.id,
          },
        });
      }
    } catch (auditErr) {
      console.error("Erro ao registrar auditoria de login:", auditErr);
    }
    // -----------------------

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    if (usePrisma) {
      // O schema.prisma está correto para isso
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt
        }
      });
    } else {
      await tokenStore.create({ token: refreshToken, userId: user.id, expiresAt: expiresAt.toISOString(), revoked: false });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    });

    const { password: _p, ...safe } = user;
    return res.json({ user: safe, accessToken });
  } catch (err) {
    console.error("Erro no login:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "Refresh token ausente" });

    // 6. PROCURA O REFRESH TOKEN NO BANCO (PRISMA)
    const record = usePrisma
      ? await prisma.refreshToken.findUnique({ where: { token } })
      : await tokenStore.find(token);

    if (!record || record.revoked) return res.status(401).json({ error: "Refresh token inválido" });
    
    const expiresAt = usePrisma ? record.expiresAt : new Date(record.expiresAt);
    if (new Date(expiresAt) < new Date()) return res.status(401).json({ error: "Refresh token expirado" });

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });
    return res.json({ accessToken });
  } catch (err) {
    console.error("Erro no refresh:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      if (usePrisma) {
        await prisma.refreshToken.updateMany({ where: { token }, data: { revoked: true } });
      } else {
        await tokenStore.revoke(token);
      }
      res.clearCookie("refreshToken");
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Erro no logout:", err.message);
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}

export async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true
    }
  });
  res.json({ users });
}

// --- NOVA FUNÇÃO: Deletar Conta ---
export async function deleteAccount(req, res) {
  try {
    const userId = req.user.sub; // ID vem do token de autenticação

    if (usePrisma) {
      // 1. Auditar antes de excluir
      await prisma.userAudit.create({
        data: {
          action: "USER_DELETED",
          details: "Usuário solicitou exclusão permanente da conta",
          // Como vamos deletar o usuário, o ideal seria deixar o userId como NULL ou 
          // manter o log sem vínculo forte, mas o Prisma exige o vínculo se estiver configurado.
          // Truque: Vamos criar o log, mas sabendo que se deletarmos o User, 
          // o Prisma pode reclamar dependendo da configuração de "Cascata".
          // Para simplificar agora, vamos primeiro deletar os dados dependentes ou usar deleteCascade no schema.
          // Mas vamos tentar deletar direto.
          userId: userId, 
        },
      });

      // 2. Deletar dependências (Refresh Tokens, etc) para evitar erro de chave estrangeira
      await prisma.refreshToken.deleteMany({ where: { userId } });
      
      // Nota: Se tiver "Orders", elas podem impedir a deleção.
      // O ideal em produção é apenas "desativar" o usuário. 
      // Mas como pediu para excluir:
      
      // Deletar os logs de auditoria desse usuário antes de deletar o usuário
      // (Triste ironia: apagar o histórico para apagar a pessoa)
      await prisma.userAudit.deleteMany({ where: { userId } });

      // Finalmente deletar o usuário
      await prisma.user.delete({ where: { id: userId } });
    }

    // Limpar cookie
    res.clearCookie("refreshToken");
    
    return res.json({ message: "Conta excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir conta:", err.message);
    // Se der erro de constraint (ex: tem pedidos), avisamos
    if (err.code === 'P2003') {
       return res.status(400).json({ error: "Não é possível excluir conta com pedidos ativos." });
    }
    return res.status(500).json({ error: "Erro ao excluir conta" });
  }
}