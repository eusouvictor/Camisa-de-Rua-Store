import prisma from "../libs/prisma.js";

// 1. Listar produtos
export async function listar(req, res) {
  try {
    const produtos = await prisma.product.findMany({
      orderBy: { id: 'desc' }
    });
    res.json({ produtos });
  } catch (err) {
    console.error("Erro ao listar:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

// 2. Obter um produto
export async function obter(req, res) {
  try {
    const id = Number(req.params.id);
    const p = await prisma.product.findUnique({ where: { id } });
    if (!p) return res.status(404).json({ error: "Produto não encontrado" });
    return res.json({ produto: p });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno" });
  }
}

// 3. Criar produto
export async function criar(req, res) {
  try {
    const { nome, preco, categoria, imageUrl, description } = req.body;
    if (!nome || !preco) {
      return res.status(400).json({ error: "Nome e preço são obrigatórios" });
    }

    const novo = await prisma.product.create({
      data: {
        nome,
        preco: Number(preco),
        categoria: categoria || "geral",
        imageUrl: imageUrl || "",
        description: description || ""
      }
    });

    return res.status(201).json({ produto: novo });
  } catch (err) {
    console.error("Erro ao criar:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

// 4. Atualizar produto (NOVO)
export async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, preco, categoria, imageUrl, description } = req.body;

    const atualizado = await prisma.product.update({
      where: { id },
      data: {
        nome,
        preco: Number(preco),
        categoria,
        imageUrl,
        description
      }
    });

    return res.json({ produto: atualizado });
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

// 5. Deletar produto (NOVO)
export async function deletar(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    return res.json({ message: "Produto deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar:", err);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}