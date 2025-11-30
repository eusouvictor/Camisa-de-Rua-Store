import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../libs/prisma.js";
import * as tokenStore from "../libs/tokenStore.js";

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

    try {
      await prisma.userAudit.create({
        data: {
          action: "USER_CREATED",
          details: `Registo inicial via app. Nome: ${name || "Sem nome"}`,
          userId: newUser.id,
        },
      });
    } catch (auditErr) {
      console.error("Erro auditoria:", auditErr);
    }

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

    const payload = { sub: user.id, email: user.email, role: user.role }; // Incluído role no token
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    if (usePrisma) {
      await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id, expiresAt }
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

    const record = usePrisma
      ? await prisma.refreshToken.findUnique({ where: { token } })
      : await tokenStore.find(token);

    if (!record || record.revoked) return res.status(401).json({ error: "Refresh token inválido" });
    const expiresAt = usePrisma ? record.expiresAt : new Date(record.expiresAt);
    if (new Date(expiresAt) < new Date()) return res.status(401).json({ error: "Refresh token expirado" });

    const user = await prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const payload = { sub: user.id, email: user.email, role: user.role };
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

// --- FUNÇÃO QUE FALTAVA (ME) ---
export async function me(req, res) {
  try {
    // O ID vem do middleware de autenticação (req.user.sub)
    const userId = req.user.sub;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(user);
  } catch (err) {
    console.error("Erro no me:", err);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
}

// --- RENOMEADO DE listUsers PARA listarUsuarios ---
export async function listarUsuarios(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true, 
        createdAt: true 
      }
    });
    res.json({ users });
  } catch (error) {
    console.error("Erro listarUsuarios:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
}