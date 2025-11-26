import express from "express";
import { register, login, listUsers, refresh, logout, deleteAccount } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/", listUsers);

// Nova rota protegida para deletar conta
router.delete("/delete", authMiddleware, deleteAccount);

export default router;