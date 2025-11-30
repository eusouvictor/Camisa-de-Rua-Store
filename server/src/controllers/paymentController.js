import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração com Token de Teste (Sandbox)
// Em produção, isso viria de process.env.MP_ACCESS_TOKEN
const client = new MercadoPagoConfig({ accessToken: 'TEST-8260823872260237-112916-29e2f6966624e73f4439c2f623635706-253366373' });

export async function criarPreferencia(req, res) {
  try {
    const { items } = req.body;

    // Transforma seus itens no formato do Mercado Pago
    const mpItems = items.map(item => ({
      title: item.name,
      quantity: item.quantity || 1,
      unit_price: Number(item.price),
      currency_id: 'BRL',
    }));

    const preference = new Preference(client);

    const body = {
      items: mpItems,
      back_urls: {
        success: "http://localhost:5173/home", // Volta pra home se der bom
        failure: "http://localhost:5173/cart", // Volta pro carrinho se der ruim
        pending: "http://localhost:5173/cart",
      },
      auto_return: "approved",
    };

    const response = await preference.create({ body });

    // Retorna o link de pagamento (init_point)
    res.json({ init_point: response.init_point, id: response.id });

  } catch (error) {
    console.error("Erro MP:", error);
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}