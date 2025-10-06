import express from "express";
import { listar, obter, criar } from "./produtosController.js";

const router = express.Router();

router.get("/", listar);
router.get("/:id", obter);
router.post("/", criar);

export default router;
