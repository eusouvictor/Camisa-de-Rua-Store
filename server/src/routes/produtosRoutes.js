import express from "express";
import { listar, obter, criar, atualizar, deletar } from "../controllers/produtosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Públicas
router.get("/", listar);
router.get("/:id", obter);

// Protegidas (Só Admin/Logado)
router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);   // <-- Novo
router.delete("/:id", authMiddleware, deletar);  // <-- Novo

export default router;