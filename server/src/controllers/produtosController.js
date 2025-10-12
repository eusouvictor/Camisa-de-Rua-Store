const produtos = [
  { id: 1, nome: "Camiseta Classic", preco: 79.9, categoria: "camiseta" },
  { id: 2, nome: "Camiseta Street", preco: 99.9, categoria: "camiseta" },
];

export function listar(req, res) {
  res.json({ produtos });
}

export function obter(req, res) {
  const id = Number(req.params.id);
  const p = produtos.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Produto não encontrado" });
  return res.json({ produto: p });
}

export function criar(req, res) {
  const { nome, preco, categoria } = req.body;
  if (!nome || preco == null) return res.status(400).json({ error: "nome e preco são obrigatórios" });
  const novo = { id: produtos.length + 1, nome, preco: Number(preco), categoria: categoria || "" };
  produtos.push(novo);
  return res.status(201).json({ produto: novo });
}
