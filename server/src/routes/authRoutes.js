import express from "express";
import { register, login, refresh, logout, me, listarUsuarios } from "../controllers/authController.js"; // <--- Importe listarUsuarios
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
router.get("/", authMiddleware, listarUsuarios); // <--- Adicione esta linha

export default router;