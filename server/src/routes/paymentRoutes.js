import express from "express";
import { criarPreferencia } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota segura para criar pagamento
router.post("/criar", authMiddleware, criarPreferencia);

export default router;