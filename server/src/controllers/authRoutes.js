import express from "express";
import { register, login, listUsers } from "./authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", listUsers);

export default router;
