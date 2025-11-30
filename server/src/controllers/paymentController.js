import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração com Token de Teste (usar variável de ambiente em produção)
const accessToken = process.env.MERCADO_PAGO_TOKEN || 'TEST-8260823872260237-112916-29e2f6966624e73f4439c2f623635706-253366373';

if (!accessToken || accessToken.startsWith('TEST-')) {
  console.log('⚠️  Usando Mercado Pago em MODO DE TESTE');
}

const client = new MercadoPagoConfig({ accessToken });

export async function criarPreferencia(req, res) {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Itens inválidos ou ausentes" });
    }

    const mpItems = items.map(item => ({
      title: item.nome || item.name || "Produto",
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.preco || item.price),
      currency_id: 'BRL',
    }));

    const preference = new Preference(client);

    const body = {
      items: mpItems,
      back_urls: {
        success: "http://localhost:5173/home",
        failure: "http://localhost:5173/cart",
        pending: "http://localhost:5173/cart",
      },
      auto_return: "approved",
      notification_url: "http://localhost:4000/api/pagamento/webhook",
    };

    const response = await preference.create({ body });
    
    if (!response.init_point) {
      throw new Error("Mercado Pago não retornou URL de pagamento");
    }

    res.json({ init_point: response.init_point, id: response.id });

  } catch (error) {
    console.error("Erro Mercado Pago:", error.message);
    res.status(500).json({ 
      error: "Erro ao criar preferência de pagamento",
      details: error.message 
    });
  }
}

// Webhook para notificações de pagamento
export async function webhookPagamento(req, res) {
  try {
    const { action, data } = req.body;
    
    console.log("Webhook recebido:", { action, data });
    
    if (action === "payment.created" || action === "payment.updated") {
      // Processar notificação de pagamento
      console.log("Pagamento atualizado:", data.id);
      // Aqui você pode atualizar o status do pedido no banco de dados
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).json({ error: "Erro ao processar webhook" });
  }
}
