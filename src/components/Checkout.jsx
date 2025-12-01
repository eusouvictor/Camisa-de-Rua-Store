import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft, CreditCard, Barcode, QrCode, CheckCircle2, MapPin, Truck, Copy
} from "lucide-react";
import { useToast } from "../components/Toast";

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:4000/api";

const Checkout = ({ updateCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [user, setUser] = useState(null);
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [etapa, setEtapa] = useState("selecionar");
  const [loadingPagamento, setLoadingPagamento] = useState(false); // Estado do botão
  const [enderecoEntrega, setEnderecoEntrega] = useState(null);
  const [freteCalculado, setFreteCalculado] = useState(false);
  const [valorFrete, setValorFrete] = useState(0);
  const [carregandoFrete, setCarregandoFrete] = useState(false);

  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) { navigate("/"); return; }
    setUser(userData);

    if (userData.endereco) {
      setEnderecoEntrega({
        endereco: userData.endereco,
        cidade: userData.cidade || "",
        estado: userData.estado || "",
        cep: userData.cep || "",
      });
    }
  }, [navigate]);

  const calcularFrete = async () => {
    if (!enderecoEntrega) return;
    setCarregandoFrete(true);
    setTimeout(() => {
      const freteGratis = total > 100;
      setValorFrete(freteGratis ? 0 : 15.9);
      setFreteCalculado(true);
      setCarregandoFrete(false);
    }, 1500);
  };

  const formatarPreco = (p) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p);
  const totalComFrete = total + valorFrete;

  const dadosPagamento = {
    boleto: { codigo: "34191.79001 01043.510047 91020.150008 5 84410000015000", vencimento: "10/12/2025", valor: formatarPreco(totalComFrete) },
    pix: { chave: "123e4567-e89b-12d3-a456-426614174000", valor: formatarPreco(totalComFrete), expiracao: "30 minutos" },
  };

  // --- CORREÇÃO AQUI: O botão não vai mais travar ---
  const handleFinalizarPagamento = async () => {
    if (!freteCalculado) {
      addToast("Calcule o frete primeiro!", "info");
      document.getElementById("calculo-frete")?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      setLoadingPagamento(true); // Bloqueia o botão
      const token = localStorage.getItem("accessToken");

      if (!token) {
        addToast("Sessão expirada. Faça login novamente.", "error");
        setLoadingPagamento(false); // Libera o botão
        return;
      }

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
        // Se o servidor retornar erro (ex: 500), avisamos e liberamos o botão
        console.error("Erro API:", data);
        addToast(`Erro: ${data.error || "Falha no pagamento"}`, "error");
        setLoadingPagamento(false);
        return;
      }

      if (data.init_point) {
        addToast("Redirecionando para o Mercado Pago...", "success");
        // Redireciona (não precisa liberar o botão pois vai sair da página)
        window.location.href = data.init_point;
      } else {
        addToast("Erro ao iniciar pagamento.", "error");
        setLoadingPagamento(false); // Libera o botão
      }

    } catch (error) {
      console.error("Erro checkout:", error);
      addToast("Erro de conexão com o servidor.", "error");
      setLoadingPagamento(false); // Libera o botão
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate("/");
    window.location.reload();
  };

  const handleSelecionarMetodo = (metodo) => {
    if (!freteCalculado) { addToast("Calcule o frete primeiro!", "info"); return; }
    setMetodoPagamento(metodo);
    setEtapa("processando");
  };

  const copiar = (txt) => { navigator.clipboard.writeText(txt); addToast("Copiado!", "success"); };

  // Renders visuais
  const renderCalculoFrete = () => (
    <div id="calculo-frete" className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-verde-neon/20">
      <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2"><Truck size={20} className="text-verde-neon" /> Entrega</h2>
      {!enderecoEntrega ? (
        <div className="text-center py-4">
          <p className="text-gray-300 mb-2">Sem endereço</p>
          <button onClick={() => navigate("/settings")} className="text-verde-neon font-bold">Cadastrar</button>
        </div>
      ) : (
        <div>
          <p className="text-white text-sm mb-4">{enderecoEntrega.endereco}</p>
          {!freteCalculado ? (
            <button onClick={calcularFrete} disabled={carregandoFrete} className="w-full bg-gray-700 text-white font-bold py-3 rounded-xl">
              {carregandoFrete ? "Calculando..." : "Calcular Frete"}
            </button>
          ) : (
            <div className="flex justify-between p-3 bg-verde-neon/10 rounded-xl border border-verde-neon/30">
              <span className="text-white font-bold">Frete</span>
              <span className="text-verde-neon font-black">{valorFrete === 0 ? "GRÁTIS" : formatarPreco(valorFrete)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderResumo = () => (
    <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-verde-neon/20">
      <h2 className="text-lg font-black text-white mb-3">Resumo</h2>
      {cartItems.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="flex items-center gap-3 py-2 border-b border-gray-700/50">
          <img src={item.imageUrl || "https://placehold.co/50"} className="w-12 h-12 rounded bg-gray-700 object-cover" />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{item.name}</p>
            <p className="text-gray-400 text-xs">{item.quantity}x {formatarPreco(item.price)}</p>
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-3 pt-3 border-t border-verde-neon/30">
        <span className="text-white font-bold">Total</span>
        <span className="text-verde-neon font-black text-xl">{formatarPreco(freteCalculado ? totalComFrete : total)}</span>
      </div>
    </div>
  );

  const renderPix = () => (
    <div className="bg-gray-800/50 p-6 rounded-3xl border border-verde-neon/20 text-center">
      <QrCode className="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <h3 className="text-white font-bold mb-2">Pagamento via PIX</h3>
      <div className="bg-white p-2 rounded mb-4 w-32 h-32 mx-auto grid grid-cols-8 gap-0.5">
        {Array.from({ length: 64 }).map((_, i) => <div key={i} className={`w-full h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />)}
      </div>
      <div className="flex gap-2 mb-4">
        <input value={dadosPagamento.pix.chave} readOnly className="flex-1 bg-gray-700 text-white text-xs p-2 rounded" />
        <button onClick={() => copiar(dadosPagamento.pix.chave)} className="bg-verde-neon p-2 rounded"><Copy size={16} /></button>
      </div>
      <button onClick={handleFinalizarPagamento} disabled={loadingPagamento} className="w-full bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-xl disabled:opacity-50">
        {loadingPagamento ? "Processando..." : "Confirmar Pagamento"}
      </button>
    </div>
  );

  const renderGenericMethod = (icon, title) => (
    <div className="bg-gray-800/50 p-6 rounded-3xl border border-verde-neon/20 text-center">
      {icon}
      <h3 className="text-white font-bold mb-4">{title}</h3>
      <button onClick={handleFinalizarPagamento} disabled={loadingPagamento} className="w-full bg-gradient-to-r from-verde-neon to-verde-rua text-gray-900 font-bold py-3 rounded-xl disabled:opacity-50">
        {loadingPagamento ? "Processando..." : "Ir para Pagamento"}
      </button>
    </div>
  );

  const renderConteudo = () => {
    if (etapa === "processando") {
      if (metodoPagamento === "pix") return renderPix();
      if (metodoPagamento === "cartao") return renderGenericMethod(<CreditCard className="w-16 h-16 text-verde-neon mx-auto mb-4" />, "Cartão de Crédito");
      if (metodoPagamento === "boleto") return renderGenericMethod(<Barcode className="w-16 h-16 text-verde-neon mx-auto mb-4" />, "Boleto Bancário");
    }
    return (
      <div className="grid grid-cols-3 gap-2">
        {[{ id: 'pix', icon: QrCode, label: 'Pix' }, { id: 'cartao', icon: CreditCard, label: 'Cartão' }, { id: 'boleto', icon: Barcode, label: 'Boleto' }].map(m => (
          <button key={m.id} onClick={() => handleSelecionarMetodo(m.id)} disabled={!freteCalculado} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-verde-neon flex flex-col items-center gap-2 disabled:opacity-50">
            <m.icon className="text-verde-neon" /> <span className="text-white text-xs font-bold">{m.label}</span>
          </button>
        ))}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent pt-24 px-4 pb-20">
      <header className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur border-b border-verde-neon/20 p-4 flex justify-between z-50">
        <img src="/images/cdrlogo.svg" className="h-8" />
        <button onClick={handleLogout} className="text-red-400 font-bold text-sm">SAIR</button>
      </header>
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate("/cart")} className="text-verde-neon flex items-center gap-2 mb-4 font-bold"><ArrowLeft /> Voltar</button>
        {renderCalculoFrete()}
        {renderResumo()}
        {renderConteudo()}
      </div>
    </div>
  );
};

export default Checkout;