import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  Barcode,
  CheckCircle2,
} from "lucide-react";

const Checkout = ({ updateCart, cart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Entrega, 2: Pagamento
  const [paymentMethod, setPaymentMethod] = useState("pix");
  
  // Tenta pegar os itens do state da navegação ou da prop cart
  const cartItems = location.state?.cartItems || cart || [];
  const total = location.state?.total || cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const [formData, setFormData] = useState({
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    nomeCartao: "",
    numeroCartao: "",
    validadeCartao: "",
    cvvCartao: "",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/home");
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.endereco || !formData.numero || !formData.cidade) {
        alert("Por favor, preencha o endereço completo.");
        return;
      }
      setStep(2);
    } else {
      handleFinalizePurchase();
    }
  };

  const handleFinalizePurchase = async () => {
    setLoading(true);
    // Simulação de processamento
    setTimeout(() => {
      setLoading(false);
      alert("Compra realizada com sucesso! (Simulação)");
      updateCart([]); // Limpa o carrinho
      navigate("/home");
    }, 2000);

    // AQUI ENTRARÁ A LÓGICA DO BACKEND + MERCADO PAGO FUTURAMENTE
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-advent p-4 sm:p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Botão Voltar */}
        <button 
          onClick={() => step === 1 ? navigate("/cart") : setStep(1)}
          className="flex items-center text-gray-400 hover:text-verde-neon mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Coluna Principal (Formulários) */}
           <div className="lg:col-span-2 space-y-6">
              {/* Progresso */}
              <div className="flex items-center justify-between mb-8 px-4">
                  <div className={`flex flex-col items-center ${step >= 1 ? "text-verde-neon" : "text-gray-500"}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 1 ? "border-verde-neon bg-verde-neon/20" : "border-gray-600 bg-gray-800"}`}>
                        <MapPin size={20} />
                     </div>
                     <span className="text-sm font-bold">Entrega</span>
                  </div>
                  <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? "bg-verde-neon" : "bg-gray-700"}`}></div>
                  <div className={`flex flex-col items-center ${step >= 2 ? "text-verde-neon" : "text-gray-500"}`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 2 ? "border-verde-neon bg-verde-neon/20" : "border-gray-600 bg-gray-800"}`}>
                        <CreditCard size={20} />
                     </div>
                     <span className="text-sm font-bold">Pagamento</span>
                  </div>
              </div>

              {step === 1 ? (
                <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6 sm:p-8">
                   <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                      <MapPin className="mr-3 text-verde-neon" />
                      Endereço de Entrega
                   </h2>
                   <form id="address-form" onSubmit={handleNextStep} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold mb-2 text-verde-neon">CEP</label>
                         <input name="cep" value={formData.cep} onChange={handleChange} placeholder="00000-000" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" required />
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-bold mb-2 text-verde-neon">Endereço</label>
                         <input name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, Avenida..." className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" required />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-2 text-verde-neon">Número</label>
                         <input name="numero" value={formData.numero} onChange={handleChange} placeholder="123" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" required />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-2 text-verde-neon">Complemento</label>
                         <input name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto 101" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-2 text-verde-neon">Cidade</label>
                         <input name="cidade" value={formData.cidade} onChange={handleChange} placeholder="São Paulo" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" required />
                      </div>
                      <div>
                         <label className="block text-sm font-bold mb-2 text-verde-neon">Estado</label>
                         <input name="estado" value={formData.estado} onChange={handleChange} placeholder="SP" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" required />
                      </div>
                   </form>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6 sm:p-8">
                   <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                      <CreditCard className="mr-3 text-verde-neon" />
                      Método de Pagamento
                   </h2>
                   
                   <div className="grid grid-cols-3 gap-4 mb-8">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "pix" ? "bg-verde-neon/20 border-verde-neon text-verde-neon" : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-400"}`}
                      >
                        <QrCode size={24} />
                        <span className="font-bold text-sm">PIX</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("credit")}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "credit" ? "bg-verde-neon/20 border-verde-neon text-verde-neon" : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-400"}`}
                      >
                        <CreditCard size={24} />
                        <span className="font-bold text-sm">Cartão</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("boleto")}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === "boleto" ? "bg-verde-neon/20 border-verde-neon text-verde-neon" : "bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-400"}`}
                      >
                        <Barcode size={24} />
                        <span className="font-bold text-sm">Boleto</span>
                      </button>
                   </div>

                   {paymentMethod === "credit" && (
                      <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-bold mb-2 text-verde-neon">Nome no Cartão</label>
                            <input name="nomeCartao" value={formData.nomeCartao} onChange={handleChange} placeholder="COMO NO CARTAO" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" />
                         </div>
                         <div>
                            <label className="block text-sm font-bold mb-2 text-verde-neon">Número do Cartão</label>
                            <input name="numeroCartao" value={formData.numeroCartao} onChange={handleChange} placeholder="0000 0000 0000 0000" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-sm font-bold mb-2 text-verde-neon">Validade</label>
                               <input name="validadeCartao" value={formData.validadeCartao} onChange={handleChange} placeholder="MM/AA" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" />
                            </div>
                            <div>
                               <label className="block text-sm font-bold mb-2 text-verde-neon">CVV</label>
                               <input name="cvvCartao" value={formData.cvvCartao} onChange={handleChange} placeholder="123" className="w-full p-3 bg-gray-700/50 border border-verde-neon/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-verde-neon" />
                            </div>
                         </div>
                      </div>
                   )}
                   
                   {paymentMethod === "pix" && (
                      <div className="text-center p-8 bg-gray-700/30 rounded-2xl border border-gray-600 border-dashed">
                         <QrCode size={48} className="mx-auto text-verde-neon mb-4" />
                         <p className="text-gray-300">O código PIX será gerado na próxima etapa.</p>
                         <p className="text-verde-neon text-sm mt-2 font-bold">Aprovação imediata</p>
                      </div>
                   )}

                   {paymentMethod === "boleto" && (
                      <div className="text-center p-8 bg-gray-700/30 rounded-2xl border border-gray-600 border-dashed">
                         <Barcode size={48} className="mx-auto text-verde-neon mb-4" />
                         <p className="text-gray-300">O boleto será gerado para impressão.</p>
                         <p className="text-gray-400 text-sm mt-2">Aprovação em até 3 dias úteis</p>
                      </div>
                   )}

                </div>
              )}
           </div>

           {/* Coluna Resumo */}
           <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-lg border border-verde-neon/20 rounded-3xl p-6 sticky top-24">
                 <h3 className="text-xl font-black text-white mb-6">Resumo da Compra</h3>
                 
                 <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                       <div key={`${item.type}-${item.id}`} className="flex justify-between items-start text-sm">
                          <div className="text-gray-300">
                             <span className="font-bold text-white">{item.quantity}x</span> {item.name}
                          </div>
                          <div className="text-white font-semibold whitespace-nowrap">
                             {formatarPreco(item.price * (item.quantity || 1))}
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="border-t border-gray-700/50 pt-4 space-y-2 mb-6">
                    <div className="flex justify-between text-gray-300">
                       <span>Subtotal</span>
                       <span>{formatarPreco(total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                       <span>Frete</span>
                       <span className="text-verde-neon">Grátis</span>
                    </div>
                    <div className="flex justify-between text-white font-black text-xl pt-2 border-t border-gray-700/50">
                       <span>Total</span>
                       <span className="text-verde-neon">{formatarPreco(total)}</span>
                    </div>
                 </div>

                 <button 
                    onClick={step === 1 ? handleNextStep : handleFinalizePurchase}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-verde-neon to-verde-rua hover:from-verde-rua hover:to-verde-neon text-gray-900 font-bold py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-verde-neon/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                 >
                    {loading ? "Processando..." : step === 1 ? "Ir para Pagamento" : "Finalizar Pedido"}
                 </button>

                 <div className="flex items-center justify-center space-x-2 text-gray-500 mt-4 text-xs">
                    <ShieldCheck size={14} />
                    <span>Ambiente seguro e criptografado</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;