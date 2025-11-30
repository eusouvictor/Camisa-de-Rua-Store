import prisma from "../libs/prisma.js";

export async function listarTodos(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } }, // Pega o nome do cliente
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}