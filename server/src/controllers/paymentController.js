import { MercadoPagoConfig, Preference } from 'mercadopago';

// Token de Teste Público (Sandbox)
const client = new MercadoPagoConfig({ accessToken: 'TEST-8260823872260237-112916-29e2f6966624e73f4439c2f623635706-253366373' });

export async function criarPreferencia(req, res) {
  try {
    const { items } = req.body;

    // Garante que os dados numéricos sejam enviados corretamente
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
        success: "http://localhost:5173/home", // Sucesso
        failure: "http://localhost:5173/cart", // Falha
        pending: "http://localhost:5173/cart", // Pendente
      },
      auto_return: "approved",
      // Isso libera todas as opções de pagamento na tela do MP
      payment_methods: {
        excluded_payment_types: [],
        installments: 6
      }
    };

    const response = await preference.create({ body });
    
    // Retorna o link para o frontend redirecionar
    res.json({ init_point: response.init_point });

  } catch (error) {
    console.error("Erro MP:", error); // Log apenas no terminal
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}