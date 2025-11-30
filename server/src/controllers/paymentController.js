import { MercadoPagoConfig, Preference } from 'mercadopago';

// TOKEN DE TESTE PÚBLICO (SANDBOX) - Pode usar este mesmo para a apresentação
const client = new MercadoPagoConfig({ accessToken: 'TEST-8260823872260237-112916-29e2f6966624e73f4439c2f623635706-253366373' });

export async function criarPreferencia(req, res) {
  try {
    const { items } = req.body;

    // Converte os itens do carrinho para o formato do MP
    const mpItems = items.map(item => ({
      title: item.nome || item.name || "Produto Camisa de Rua",
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.preco || item.price),
      currency_id: 'BRL',
    }));

    const preference = new Preference(client);

    const body = {
      items: mpItems,
      back_urls: {
        success: "http://localhost:5173/home", // Sucesso volta pra Home
        failure: "http://localhost:5173/cart", // Falha volta pro Carrinho
        pending: "http://localhost:5173/cart",
      },
      auto_return: "approved",
    };

    const response = await preference.create({ body });
    
    // Retorna o link direto de pagamento
    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error("Erro MP:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}