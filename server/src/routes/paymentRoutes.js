import express from "express";
import { criarPreferencia, webhookPagamento } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/criar", authMiddleware, criarPreferencia);
router.post("/webhook", webhookPagamento);

export default router;
