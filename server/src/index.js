import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import produtosRoutes from "./routes/produtosRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  // Aceita localhost E o seu site no Vercel
  origin: ['http://localhost:5173', 'https://rua-store.vercel.app'], 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);

// ... (seu código anterior continua igual)

const PORT = process.env.PORT || 4000;

// Se não estivermos no Vercel, rodamos o servidor normalmente
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Exportamos o app para o Vercel usar
export default app;