import express from "express";
import { listar, obter, criar, atualizar, deletar } from "../controllers/produtosController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", obter);

// Rotas protegidas (precisa estar logado)
router.post("/", authMiddleware, criar);
router.put("/:id", authMiddleware, atualizar);   // Rota de Edição
router.delete("/:id", authMiddleware, deletar);  // Rota de Deleção

export default router;