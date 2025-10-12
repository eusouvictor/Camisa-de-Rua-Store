import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "../libs/prisma.js";
import * as tokenStore from "../libs/tokenStore.js";

// Store de desenvolvimento (em memória)
const users = [
  { id: 1, email: "teste@teste.com", password: bcrypt.hashSync("123456", 8), name: "Usuário Teste" },
];

const usePrisma = !!process.env.DATABASE_URL;

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    const exists = users.find((u) => u.email === email);
    if (exists) return res.status(409).json({ error: "Usuário já existe" });

    const hashed = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, email, password: hashed, name: name || "Sem nome" };
    users.push(newUser);
    const { password: _p, ...safe } = newUser;
    return res.status(201).json({ user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios" });

    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    if (usePrisma) {
      await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });
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
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "Refresh token ausente" });

    const record = usePrisma ? await prisma.refreshToken.findUnique({ where: { token } }) : await tokenStore.find(token);

    if (!record || record.revoked) return res.status(401).json({ error: "Refresh token inválido" });
    const expiresAt = usePrisma ? record.expiresAt : new Date(record.expiresAt);
    if (new Date(expiresAt) < new Date()) return res.status(401).json({ error: "Refresh token expirado" });

    const user = users.find((u) => u.id === record.userId);
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || "change_me", { expiresIn: "15m" });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
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
    console.error(err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export function listUsers(req, res) {
  const safeList = users.map(({ password, ...rest }) => rest);
  res.json({ users: safeList });
}

