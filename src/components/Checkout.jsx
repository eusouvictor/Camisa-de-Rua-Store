import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  House,
  ShoppingCart,
  Ticket,
  Bolt,
  Menu,
  X,
  ArrowLeft,
  CreditCard,
  Barcode,
  QrCode,
  ShieldCheck,
  Copy,
  CheckCircle2,
  MapPin,
  Truck,
} from "lucide-react";
import { useToast, ToastContainer } from "./Toast";

const Checkout = ({ updateCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();

  // Estados do componente
  const [user, setUser] = useState(null);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [etapa, setEtapa] = useState("selecionar");

  // Estados para frete e endereço
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const [freteCalculado, setFreteCalculado] = useState(false);
  const [valorFrete, setValorFrete] = useState(0);
  const [carregandoFrete, setCarregandoFrete] = useState(false);

  // Dados do carrinho vindos da navegação
  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  // Effect para carregar usuário e endereço salvo
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);

    // Carregar endereço salvo do usuário
    if (userData.endereco && userData.cidade && userData.estado) {
      setEnderecoEntrega({
        endereco: userData.endereco,
        cidade: userData.cidade,
        estado: userData.estado,
        cep: userData.cep || "",
      });
    }
  }, [navigate]);

  // Função para calcular frete
  const calcularFrete = async () => {
    if (!enderecoEntrega) return;

    setCarregandoFrete(true);

    // Simulação de cálculo de frete (substituir por API real)
    setTimeout(() => {
      // Frete gratuito para compras acima de R$ 100
      const freteGratis = total > 100;
      const valor = freteGratis ? 0 : 15.9;

      setValorFrete(valor);
      setFreteCalculado(true);
      setCarregandoFrete(false);
    }, 1500);
  };

  // Função para salvar endereço no perfil
  const salvarEnderecoNoPerfil = () => {
    if (!enderecoEntrega || !user) return;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          endereco: enderecoEntrega.endereco,
          cidade: enderecoEntrega.cidade,
          estado: enderecoEntrega.estado,
          cep: enderecoEntrega.cep,
          dataAtualizacao: new Date().toISOString(),
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedUser = {
      ...user,
      endereco: enderecoEntrega.endereco,
      cidade: enderecoEntrega.cidade,
      estado: enderecoEntrega.estado,
      cep: enderecoEntrega.cep,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    addToast("Endereço salvo com sucesso no seu perfil!", "success");
  };

  // Função para formatar preços em Real
  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);
  };

  // Calcular total de itens no carrinho
  const totalItemsNoCarrinho = cartItems.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  // Calcular total com frete
  const totalComFrete = total + valorFrete;

  // Dados de pagamento
  const dadosPagamento = {
    boleto: {
      codigo: "34191.79001 01043.510047 91020.150008 5 84410000015000",
      vencimento: "10/12/2024",
      valor: formatarPreco(totalComFrete),
    },
    pix: {
      qrCode:
        "00020101021226890014br.gov.bcb.pix2555example.com/qr/v2/1234567895204000053039865406150.005802BR5913MERCADO PAGO6008SAO PAULO62290525mpqr123456789012345678901230704A123",
      chave: "123e4567-e89b-12d3-a456-426614174000",
      valor: formatarPreco(totalComFrete),
      expiracao: "30 minutos",
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Função para selecionar método de pagamento
  const handleSelecionarMetodo = (metodo) => {
    if (!freteCalculado) {
      addToast("Por favor, calcule o frete primeiro!", "info");
      return;
    }
    setMetodoPagamento(metodo);
    setEtapa("processando");
  };

// Adicione isso no topo se não tiver
const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const handleFinalizarPagamento = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        addToast("Você precisa estar logado!", "error");
        return;
      }

      if (!cartItems || cartItems.length === 0) {
        addToast("Seu carrinho está vazio!", "error");
        return;
      }

      console.log("Iniciando pagamento com itens:", cartItems);

      const response = await fetch(`${API_URL}/pagamento/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro da API:", data);
        addToast(`Erro ao gerar pagamento: ${data.error || "Erro desconhecido"}`, "error");
        return;
      }

      if (data.init_point) {
        console.log("Redirecionando para Mercado Pago:", data.init_point);
        addToast("Redirecionando para pagamento...", "success");
        // Redireciona o usuário para o Mercado Pago
        setTimeout(() => {
          window.location.href = data.init_point;
        }, 1000);
      } else {
        addToast("Erro ao gerar pagamento. Por favor, tente novamente.", "error");
      }

    } catch (error) {
      console.error("Erro ao finalizar pagamento:", error);
      addToast("Erro ao conectar com o serviço de pagamento. Por favor, tente novamente.", "error");
    }
  };

  // Função para copiar texto
  const copiarParaAreaTransferencia = (texto) => {
    navigator.clipboard.writeText(texto);
    addToast("Copiado para a área de transferência!", "success");
  };

  // Componente de cálculo de frete
  const renderCalculoFrete = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-black text-white mb-4 flex items-center">
        <Truck className="mr-2 text-verde-neon" size={20} />
        Entrega
      </h2>

      {!enderecoEntrega ? (
        <div className="text-center py-6">
          <MapPin className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-gray-300 mb-4">Nenhum endereço cadastrado</p>
          <button
            onClick={() => navigate("/settings")}
            className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-xl transition-all duration-300"
          >
            Cadastrar Endereço
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-700/30 rounded-xl p-4">
            <h3 className="text-verde-neon font-bold text-sm mb-2">
              Endereço de Entrega
            </h3>
            <p className="text-white text-sm">{enderecoEntrega.endereco}</p>
            <p className="text-gray-300 text-sm">
              {enderecoEntrega.cidade} - {enderecoEntrega.estado}
              {enderecoEntrega.cep && ` • ${enderecoEntrega.cep}`}
            </p>
          </div>

          {!freteCalculado ? (
            <div className="flex space-x-3">
              <button
                onClick={calcularFrete}
                disabled={carregandoFrete}
                className="flex-1 bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {carregandoFrete ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    Calculando...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2" size={16} />
                    Calcular Frete
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="px-4 border border-verde-neon text-verde-neon rounded-xl hover:bg-verde-neon hover:text-gray-900 transition-all duration-300"
              >
                Alterar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-verde-neon/10 rounded-xl">
                <span className="text-white font-bold">Frete</span>
                <span
                  className={`font-black ${
                    valorFrete === 0 ? "text-verde-neon" : "text-white"
                  }`}
                >
                  {valorFrete === 0 ? "GRÁTIS" : formatarPreco(valorFrete)}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setFreteCalculado(false);
                    setValorFrete(0);
                  }}
                  className="flex-1 border border-verde-neon text-verde-neon py-2 rounded-xl hover:bg-verde-neon hover:text-gray-900 transition-all duration-300 text-sm"
                >
                  Recalcular
                </button>
                <button
                  onClick={salvarEnderecoNoPerfil}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-xl hover:bg-gray-600 transition-all duration-300 text-sm"
                >
                  Salvar Endereço
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Componente de resumo do pedido atualizado
  const renderResumoPedido = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-black text-white mb-3">Resumo do Pedido</h2>
      <div className="space-y-2">
        {cartItems.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0"
          >
            <div>
              <p className="text-white font-semibold text-sm">{item.name}</p>
              <p className="text-gray-300 text-xs">
                {item.quantity || 1}x {formatarPreco(item.price)}
              </p>
            </div>
            <p className="text-verde-neon font-bold text-sm">
              {formatarPreco(item.price * (item.quantity || 1))}
            </p>
          </div>
        ))}

        {/* Linha do frete adicionada */}
        {freteCalculado && (
          <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
            <div>
              <p className="text-white font-semibold text-sm">Frete</p>
              <p className="text-gray-300 text-xs">Entrega padrão</p>
            </div>
            <p
              className={`font-bold text-sm ${
                valorFrete === 0 ? "text-verde-neon" : "text-white"
              }`}
            >
              {valorFrete === 0 ? "GRÁTIS" : formatarPreco(valorFrete)}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-verde-neon/30">
          <p className="text-lg font-black text-white">Total</p>
          <p className="text-xl font-black text-verde-neon">
            {formatarPreco(freteCalculado ? totalComFrete : total)}
          </p>
        </div>
      </div>
    </div>
  );

  // Componente para seleção de método de pagamento
  const renderSelecionarMetodo = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white mb-6">
        Escolha a forma de pagamento
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleSelecionarMetodo("pix")}
          disabled={!freteCalculado}
          className="bg-gray-800/50 backdrop-blur-lg border-2 border-verde-neon/30 rounded-2xl p-6 text-center hover:scale-105 hover:border-verde-neon hover:shadow-2xl hover:shadow-verde-neon/20 transition-all duration-500 group disabled:opacity-50 disabled:hover:scale-100 disabled:hover:border-verde-neon/30"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <QrCode className="text-gray-900 w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">PIX</h3>
          <p className="text-gray-300 text-sm">Pagamento instantâneo</p>
          <div className="mt-3">
            <span className="text-verde-neon font-bold">
              {formatarPreco(totalComFrete)}
            </span>
          </div>
        </button>

        <button
          onClick={() => handleSelecionarMetodo("cartao")}
          disabled={!freteCalculado}
          className="bg-gray-800/50 backdrop-blur-lg border-2 border-verde-neon/30 rounded-2xl p-6 text-center hover:scale-105 hover:border-verde-neon hover:shadow-2xl hover:shadow-verde-neon/20 transition-all duration-500 group disabled:opacity-50 disabled:hover:scale-100 disabled:hover:border-verde-neon/30"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <CreditCard className="text-gray-900 w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Cartão</h3>
          <p className="text-gray-300 text-sm">Crédito ou Débito</p>
          <div className="mt-3">
            <span className="text-verde-neon font-bold">
              {formatarPreco(totalComFrete)}
            </span>
          </div>
        </button>

        <button
          onClick={() => handleSelecionarMetodo("boleto")}
          disabled={!freteCalculado}
          className="bg-gray-800/50 backdrop-blur-lg border-2 border-verde-neon/30 rounded-2xl p-6 text-center hover:scale-105 hover:border-verde-neon hover:shadow-2xl hover:shadow-verde-neon/20 transition-all duration-500 group disabled:opacity-50 disabled:hover:scale-100 disabled:hover:border-verde-neon/30"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Barcode className="text-gray-900 w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Boleto</h3>
          <p className="text-gray-300 text-sm">Pagamento em até 3 dias</p>
          <div className="mt-3">
            <span className="text-verde-neon font-bold">
              {formatarPreco(totalComFrete)}
            </span>
          </div>
        </button>
      </div>

      {!freteCalculado && (
        <div className="text-center py-4">
          <p className="text-verde-neon font-bold">
            ⚠️ Calcule o frete antes de escolher o método de pagamento
          </p>
        </div>
      )}
    </div>
  );

  // Componente para pagamento com PIX
  const renderPix = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4">
          <QrCode className="text-gray-900 w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Pagamento via PIX
        </h3>
        <p className="text-gray-300 text-sm">Escaneie o QR Code abaixo</p>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 max-w-xs mx-auto">
        <div className="bg-gray-100 rounded-lg p-3 mb-3">
          <div
            className="grid grid-cols-8 gap-1 mx-auto"
            style={{ width: "160px", height: "160px" }}
          >
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`w-full h-full rounded-sm ${
                  Math.random() > 0.5 ? "bg-black" : "bg-white"
                }`}
              ></div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mb-1">
          Valor: {dadosPagamento.pix.valor}
        </p>
        <p className="text-center text-xs text-gray-500">
          Expira em: {dadosPagamento.pix.expiracao}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Chave PIX
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={dadosPagamento.pix.chave}
              readOnly
              className="flex-1 p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white text-sm"
            />
            <button
              onClick={() =>
                copiarParaAreaTransferencia(dadosPagamento.pix.chave)
              }
              className="bg-verde-neon text-gray-900 p-3 rounded-xl hover:bg-verde-rua transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={handleFinalizarPagamento}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
        >
          Confirmar Pagamento
        </button>
      </div>
    </div>
  );

  // Componente para pagamento com cartão
  const renderCartao = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="text-gray-900 w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">
          Cartão de Crédito
        </h3>
        <p className="text-gray-300 text-sm">Informe os dados do cartão</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Número do Cartão
          </label>
          <input
            type="text"
            placeholder="0000 0000 0000 0000"
            className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Nome no Cartão
          </label>
          <input
            type="text"
            placeholder="SEU NOME AQUI"
            className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-bold mb-2 text-verde-neon">
              Validade
            </label>
            <input
              type="text"
              placeholder="MM/AA"
              className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-verde-neon">
              CVV
            </label>
            <input
              type="text"
              placeholder="000"
              className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-verde-neon">
            Parcelas
          </label>
          <select className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-verde-neon focus:border-transparent text-white transition-all duration-300">
            <option value="1">
              1x {formatarPreco(totalComFrete)} sem juros
            </option>
            <option value="2">
              2x {formatarPreco(totalComFrete / 2)} sem juros
            </option>
            <option value="3">
              3x {formatarPreco(totalComFrete / 3)} sem juros
            </option>
          </select>
        </div>

        <button
          onClick={handleFinalizarPagamento}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 mt-3"
        >
          Finalizar Pagamento
        </button>
      </div>
    </div>
  );

  // Componente para pagamento com boleto
  const renderBoleto = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Barcode className="text-gray-900 w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Boleto Bancário</h3>
        <p className="text-gray-300 text-sm">
          Copie o código ou imprima o boleto
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4">
          <div className="text-center mb-3">
            <div className="h-10 bg-black rounded mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex space-x-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-6 ${
                        Math.random() > 0.3 ? "bg-white" : "bg-black"
                      } w-1`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 font-mono">
              {dadosPagamento.boleto.codigo}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Vencimento:</span>
              <p className="font-semibold">
                {dadosPagamento.boleto.vencimento}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Valor:</span>
              <p className="font-semibold text-verde-rua">
                {dadosPagamento.boleto.valor}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() =>
              copiarParaAreaTransferencia(dadosPagamento.boleto.codigo)
            }
            className="w-full bg-verde-neon text-gray-900 font-bold py-2 rounded-lg hover:bg-verde-rua transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <Copy size={16} />
            <span>Copiar Código</span>
          </button>

          <button className="w-full border border-verde-neon text-verde-neon font-bold py-2 rounded-lg hover:bg-verde-neon hover:text-gray-900 transition-colors text-sm">
            Imprimir Boleto
          </button>

          <button
            onClick={handleFinalizarPagamento}
            className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
          >
            Confirmar Pagamento
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para finalização
  const renderFinalizado = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-verde-neon to-verde-rua rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="text-gray-900 w-10 h-10" />
      </div>
      <h3 className="text-2xl font-black text-white mb-3">
        Pagamento Confirmado!
      </h3>
      <p className="text-gray-300 text-sm mb-2">
        Sua compra foi processada com sucesso
      </p>
      <p className="text-verde-neon font-bold text-lg mb-6">
        {formatarPreco(totalComFrete)}
      </p>
      <div className="space-y-3">
        <button
          onClick={() => navigate("/home")}
          className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-3 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
        >
          Continuar Comprando
        </button>
        <button
          onClick={() => navigate("/events")}
          className="w-full border border-verde-neon text-verde-neon font-bold py-3 rounded-xl hover:bg-verde-neon hover:text-gray-900 transition-all duration-300 text-sm"
        >
          Ver Eventos
        </button>
      </div>
    </div>
  );

  // Função principal para renderizar conteúdo baseado na etapa
  const renderConteudo = () => {
    if (etapa === "finalizado") {
      return renderFinalizado();
    }

    if (etapa === "processando") {
      switch (metodoPagamento) {
        case "pix":
          return renderPix();
        case "cartao":
          return renderCartao();
        case "boleto":
          return renderBoleto();
        default:
          return renderSelecionarMetodo();
      }
    }

    return renderSelecionarMetodo();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-verde-neon/20 text-white py-4 px-4 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center">
            <img
              src="/images/cdrlogo.svg"
              alt="Camisa de Rua Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-8">
              <span className="text-verde-neon font-semibold text-lg">
                Olá, {user.nome || user.name}
              </span>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-2 px-6 rounded-full transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25"
              >
                SAIR
              </button>
            </div>

            <div className="sm:hidden">
              <button
                onClick={() => setMenuMobileAberto(!menuMobileAberto)}
                className="p-2 bg-verde-neon/20 rounded-lg hover:bg-verde-neon/30 transition-all duration-300"
              >
                {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {menuMobileAberto && (
          <div className="sm:hidden bg-gray-800/95 backdrop-blur-lg border-t border-verde-neon/20 mt-4 py-4 rounded-b-2xl">
            <div className="flex flex-col space-y-4 px-4">
              <span className="text-verde-neon text-center font-semibold">
                Olá, {user.nome || user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-full transition-all duration-300"
              >
                SAIR
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col sm:flex-row pt-20">
        {/* Sidebar */}
        <aside className="hidden sm:flex ml-4 w-16 bg-gray-800/50 backdrop-blur-lg flex-col items-center py-6 fixed top-32 h-80 bottom-8 rounded-2xl z-40 border border-verde-neon/20">
          <Link
            to="/home"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <House className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/events"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Ticket className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
          <Link
            to="/cart"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mb-8 transition-all duration-300 hover:scale-110 relative group border border-gray-600"
          >
            <ShoppingCart className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
            {totalItemsNoCarrinho > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                {totalItemsNoCarrinho}
              </span>
            )}
          </Link>
          <Link
            to="/settings"
            className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl mt-auto transition-all duration-300 hover:scale-110 group border border-gray-600"
          >
            <Bolt className="text-gray-300 group-hover:text-gray-900 w-6 h-6" />
          </Link>
        </aside>

        {/* Mobile Navigation */}
        <nav className="sm:hidden fixed bottom-4 left-4 right-4 bg-gray-800/90 backdrop-blur-lg border border-verde-neon/20 rounded-2xl z-40 shadow-2xl">
          <div className="flex justify-around items-center py-3">
            <Link
              to="/home"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <House className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
            <Link
              to="/events"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <Ticket className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
            <Link
              to="/cart"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 relative group border border-gray-600"
            >
              <ShoppingCart className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
              {totalItemsNoCarrinho > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                  {totalItemsNoCarrinho}
                </span>
              )}
            </Link>
            <Link
              to="/settings"
              className="p-3 bg-gray-700/50 hover:bg-verde-neon rounded-xl transition-all duration-300 hover:scale-110 group border border-gray-600"
            >
              <Bolt className="text-gray-300 group-hover:text-gray-900 w-5 h-5" />
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 sm:ml-20 pb-20 sm:pb-0 p-4">
          <div className="max-w-2xl mx-auto">
            {etapa !== "selecionar" && etapa !== "finalizado" && (
              <button
                onClick={() => setEtapa("selecionar")}
                className="flex items-center space-x-2 text-verde-neon hover:text-verde-rua transition-colors mb-6"
              >
                <ArrowLeft size={20} />
                <span className="font-bold">Voltar</span>
              </button>
            )}

            {/* Seção de cálculo de frete adicionada */}
            {renderCalculoFrete()}

            {/* Resumo do pedido atualizado */}
            {renderResumoPedido()}

            {renderConteudo()}
          </div>
        </main>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Checkout;
