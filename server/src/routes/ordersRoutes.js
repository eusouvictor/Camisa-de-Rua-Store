import express from "express";
import { listarTodos } from "../controllers/ordersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listarTodos);

export default router;